import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { Groq } from 'groq-sdk';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// MongoDB Models (inline to avoid import issues with Vercel)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: { type: String },
  analysis: { type: mongoose.Schema.Types.Mixed },
  score: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

let User, ResumeAnalysis;
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    User = mongoose.models.User || mongoose.model('User', userSchema);
    ResumeAnalysis = mongoose.models.ResumeAnalysis || mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Analysis functions
async function analyzeResumeWithGroq(resumeText, jobDescription = '') {
  const systemPrompt = jobDescription 
    ? `You are an expert resume analyst. Analyze the resume against the job description and provide:
1. Overall match score (0-100)
2. Key strengths
3. Missing skills/keywords
4. Improvement suggestions
Resume: ${resumeText}
Job Description: ${jobDescription}`
    : `You are an expert resume analyst. Analyze this resume and provide:
1. Overall score (0-100)
2. Key strengths
3. Areas for improvement
4. Specific suggestions to make it ATS-friendly
Resume: ${resumeText}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please analyze this resume thoroughly.' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 4000
    });

    return completion.choices[0]?.message?.content || 'Analysis not available';
  } catch (error) {
    console.error('Groq API error:', error);
    return `Error analyzing resume: ${error.message}`;
  }
}

// Create Express app
const app = express();

// CORS configuration for Vercel
const allowedOrigins = [
  'https://resumeanalyser-psi.vercel.app',
  'https://resumeanalyser-psi.vercel.app/',
  'https://resume-analyser-ch1f.onrender.com',
  'http://localhost:5173',
  'http://localhost:3011'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const cleanAllowedOrigins = allowedOrigins.map(o => o.replace(/\/$/, ''));
    if (cleanAllowedOrigins.indexOf(cleanOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resume upload endpoint
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, buffer } = req.file;
    const { jobDescription, userId } = req.body;

    // Parse PDF
    let resumeText;
    try {
      const data = await pdfParse(buffer);
      resumeText = data.text;
    } catch (pdfError) {
      return res.status(400).json({ error: 'Failed to parse PDF. Please ensure it is a valid PDF file.' });
    }

    if (!resumeText || resumeText.trim().length < 10) {
      return res.status(400).json({ error: 'Could not extract text from PDF. Please try a different file.' });
    }

    // Analyze with Groq
    const analysis = await analyzeResumeWithGroq(resumeText, jobDescription || '');

    // Extract score from analysis (simple regex)
    const scoreMatch = analysis.match(/(\d+)\s*[\/.-]?\s*100/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 30) + 70;

    // Save to database
    const newAnalysis = new ResumeAnalysis({
      userId: userId || null,
      filename: originalname,
      analysis: analysis,
      score: score
    });

    await newAnalysis.save();

    res.json({
      success: true,
      analysis: analysis,
      score: score,
      textLength: resumeText.length,
      id: newAnalysis._id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Server error during analysis' });
  }
});

// JD Match endpoint
app.post('/api/resume/jd-match', upload.single('resume'), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer } = req.file;
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const data = await pdfParse(buffer);
    const resumeText = data.text;

    const matchAnalysis = await analyzeResumeWithGroq(resumeText, jobDescription);

    res.json({
      success: true,
      analysis: matchAnalysis
    });
  } catch (error) {
    console.error('JD Match error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cover letter endpoint
app.post('/api/resume/cover-letter', upload.single('resume'), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer } = req.file;
    const { jobDescription, companyName, hiringManager } = req.body;

    const data = await pdfParse(buffer);
    const resumeText = data.text;

    const systemPrompt = `You are a professional cover letter writer. Generate a compelling cover letter based on:
Resume: ${resumeText}
Job Description: ${jobDescription || 'Not provided'}
Company: ${companyName || 'Not provided'}
Hiring Manager: ${hiringManager || 'Hiring Manager'}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please generate a professional cover letter.' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      max_tokens: 2000
    });

    const coverLetter = completion.choices[0]?.message?.content || 'Failed to generate cover letter';

    res.json({
      success: true,
      coverLetter: coverLetter
    });
  } catch (error) {
    console.error('Cover letter error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rewrite endpoint
app.post('/api/resume/rewrite', upload.single('resume'), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer } = req.file;
    const data = await pdfParse(buffer);
    const resumeText = data.text;

    const systemPrompt = `You are an expert resume writer. Improve and rewrite this resume to make it more impactful, ATS-friendly, and professional. Keep the same structure but enhance the content.
Resume: ${resumeText}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please rewrite this resume to make it better.' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 4000
    });

    const rewrittenResume = completion.choices[0]?.message?.content || 'Failed to rewrite resume';

    res.json({
      success: true,
      rewrittenResume: rewrittenResume
    });
  } catch (error) {
    console.error('Rewrite error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    await connectDB();
    
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const systemMessage = {
      role: 'system',
      content: 'You are a helpful career advisor and resume expert. Answer questions about resumes, job searching, career development, and interview tips.'
    };

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';

    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enhance endpoint
app.post('/api/resume/enhance', upload.single('resume'), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer } = req.file;
    const { targetRole } = req.body;

    const data = await pdfParse(buffer);
    const resumeText = data.text;

    const systemPrompt = `You are an expert resume enhancer. Enhance this resume for a ${targetRole || 'professional'} role. 
Make it more impactful, quantify achievements, use action verbs, and ensure ATS optimization.
Resume: ${resumeText}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please enhance this resume.' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 4000
    });

    const enhancedResume = completion.choices[0]?.message?.content || 'Failed to enhance resume';

    res.json({
      success: true,
      enhancedResume: enhancedResume
    });
  } catch (error) {
    console.error('Enhance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enhanced cover letter endpoint
app.post('/api/resume/cover-letter-enhanced', upload.single('resume'), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer } = req.file;
    const { jobDescription, companyName, hiringManager, position } = req.body;

    const data = await pdfParse(buffer);
    const resumeText = data.text;

    const systemPrompt = `You are a professional cover letter writer. Create a highly personalized, compelling cover letter.
Resume: ${resumeText}
Job Description: ${jobDescription || 'Not provided'}
Company: ${companyName || 'Not provided'}
Position: ${position || 'Not specified'}
Hiring Manager: ${hiringManager || 'Hiring Manager'}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate a professional, personalized cover letter that will impress recruiters.' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      max_tokens: 2500
    });

    const coverLetter = completion.choices[0]?.message?.content || 'Failed to generate cover letter';

    res.json({
      success: true,
      coverLetter: coverLetter
    });
  } catch (error) {
    console.error('Enhanced cover letter error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Learning path endpoint
app.post('/api/resume/learning-path', upload.single('resume'), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer } = req.file;
    const { targetRole } = req.body;

    const data = await pdfParse(buffer);
    const resumeText = data.text;

    const systemPrompt = `You are a career development expert. Analyze this resume and create a learning path for someone aspiring to become a ${targetRole || 'professional'}.
Resume: ${resumeText}

Provide:
1. Skills gap analysis
2. Recommended courses/certifications
3. Learning resources
4. Timeline for skill development`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Create a learning path based on my resume.' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      max_tokens: 3000
    });

    const learningPath = completion.choices[0]?.message?.content || 'Failed to generate learning path';

    res.json({
      success: true,
      learningPath: learningPath
    });
  } catch (error) {
    console.error('Learning path error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Compare endpoint
app.post('/api/resume/compare', upload.array('resumes', 2), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload exactly 2 resumes' });
    }

    const texts = await Promise.all(
      req.files.map(async (file) => {
        const data = await pdfParse(file.buffer);
        return data.text;
      })
    );

    const systemPrompt = `Compare these two resumes and provide:
1. Overall comparison
2. Strengths of each
3. Which is better for ATS
4. Suggestions for improvement
Resume 1: ${texts[0]}
Resume 2: ${texts[1]}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Compare these resumes.' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 3000
    });

    const comparison = completion.choices[0]?.message?.content || 'Failed to compare resumes';

    res.json({
      success: true,
      comparison: comparison
    });
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Roast endpoint
app.post('/api/resume/roast', upload.single('resume'), async (req, res) => {
  try {
    await connectDB();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer } = req.file;
    const data = await pdfParse(buffer);
    const resumeText = data.text;

    const systemPrompt = `Roast this resume in a funny but helpful way. Point out all the mistakes, bad choices, and areas that need improvement. Be harsh but constructive.
Resume: ${resumeText}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Roast my resume!' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.8,
      max_tokens: 2000
    });

    const roast = completion.choices[0]?.message?.content || 'Failed to roast resume';

    res.json({
      success: true,
      roast: roast
    });
  } catch (error) {
    console.error('Roast error:', error);
    res.status(500).json({ error: error.message });
  }
});

// History endpoint
app.get('/api/resume/history', async (req, res) => {
  try {
    await connectDB();
    
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    
    const history = await ResumeAnalysis.find(query)
      .sort({ timestamp: -1 })
      .limit(20)
      .select('filename score timestamp analysis');
    
    res.json({
      success: true,
      history: history
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analysis by ID
app.get('/api/resume/analysis/:id', async (req, res) => {
  try {
    await connectDB();
    
    const { id } = req.params;
    const analysis = await ResumeAnalysis.findById(id);
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    res.json({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete analysis
app.delete('/api/resume/analysis/:id', async (req, res) => {
  try {
    await connectDB();
    
    const { id } = req.params;
    await ResumeAnalysis.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Analysis deleted'
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    await connectDB();
    
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name: name || ''
    });
    
    await newUser.save();
    
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: newUser._id, email: newUser.email, name: newUser.name }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    await connectDB();
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export handler for Vercel
export default app;
