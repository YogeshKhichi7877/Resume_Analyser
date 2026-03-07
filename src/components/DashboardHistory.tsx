import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Trash2, 
  Eye, 
  FileText, 
  Star, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Briefcase,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

// API URL - same as in App.tsx
const ApiUrl = 'https://resumeanalyser-psi.vercel.app';

// Types
interface HistoryItem {
  id: string;
  targetDomain: string;
  score: number;
  atsCompatibility: number;
  grammarScore: number;
  readabilityScore: number;
  createdAt: string;
  summary: string;
}

interface AnalysisResults {
  id: string;
  targetDomain: string;
  resumeText: string;
  score: number;
  ats_compatibility: number;
  grammar_score: number;
  readability_score: number;
  experience_match: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  hard_skills: string[];
  soft_skills: string[];
  keywords: string[];
  missing_keywords: string[];
  sections_detected: string[];
  missing_sections: string[];
  formatting_issues: string[];
  grammar_issues: string[];
  scam_flags: string[];
  summary: string;
  bullet_improvements: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
  top_projects: Array<{
    name: string;
    score: number;
    reason: string;
  }>;
  interview_questions: Array<{
    question: string;
    importance: string;
    reason: string;
  }>;
  createdAt: string;
}

const DashboardHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResults | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        toast.error('Please login to view history');
        navigate('/');
        return;
      }

      const response = await fetch(`${ApiUrl}/api/resume/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setHistory(data.history || []);
      } else {
        toast.error(data.error || 'Failed to fetch history');
      }
    } catch (error) {
      console.error('Fetch history error:', error);
      toast.error('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const viewAnalysis = async (id: string) => {
    setIsLoadingDetails(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view analysis');
        return;
      }

      const response = await fetch(`${ApiUrl}/api/resume/analysis/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setSelectedAnalysis(data.analysis);
      } else {
        toast.error(data.error || 'Failed to fetch analysis');
      }
    } catch (error) {
      console.error('View analysis error:', error);
      toast.error('Failed to load analysis details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to delete analysis');
        return;
      }

      const response = await fetch(`${ApiUrl}/api/resume/analysis/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Analysis deleted successfully');
        // Remove from local state
        setHistory(history.filter(item => item.id !== id));
        // Close details if open
        if (selectedAnalysis?.id === id) {
          setSelectedAnalysis(null);
        }
      } else {
        toast.error(data.error || 'Failed to delete analysis');
      }
    } catch (error) {
      console.error('Delete analysis error:', error);
      toast.error('Failed to delete analysis');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDomainLabel = (domain: string) => {
    const labels: Record<string, string> = {
      'software-engineer': 'Software Engineer',
      'data-scientist': 'Data Scientist',
      'full-stack-developer': 'Full Stack Developer',
      'frontend-developer': 'Frontend Developer',
      'backend-developer': 'Backend Developer',
      'devops-engineer': 'DevOps Engineer',
      'ui-ux-designer': 'UI/UX Designer',
      'product-manager': 'Product Manager',
      'marketing': 'Marketing',
      'sales': 'Sales'
    };
    return labels[domain] || domain;
  };

  // Render details modal
  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-[#FDFD96] dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase text-black dark:text-white">
                  Analysis Details
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {getDomainLabel(selectedAnalysis.targetDomain)} • {formatDate(selectedAnalysis.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-white font-black uppercase text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                ← Back to History
              </button>
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-xs font-black uppercase text-gray-500">Overall Score</span>
              </div>
              <p className={`text-3xl font-black ${getScoreColor(selectedAnalysis.score)}`}>
                {selectedAnalysis.score}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-black uppercase text-gray-500">ATS Score</span>
              </div>
              <p className={`text-3xl font-black ${getScoreColor(selectedAnalysis.ats_compatibility)}`}>
                {selectedAnalysis.ats_compatibility}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-black uppercase text-gray-500">Grammar</span>
              </div>
              <p className="text-3xl font-black text-gray-800 dark:text-white">
                {selectedAnalysis.grammar_score}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-xs font-black uppercase text-gray-500">Readability</span>
              </div>
              <p className="text-3xl font-black text-gray-800 dark:text-white">
                {selectedAnalysis.readability_score}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Hard Skills */}
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Hard Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedAnalysis.hard_skills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-bold border-2 border-black dark:border-white">
                    {skill}
                  </span>
                ))}
                {(!selectedAnalysis.hard_skills || selectedAnalysis.hard_skills.length === 0) && (
                  <p className="text-gray-500">No hard skills detected</p>
                )}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedAnalysis.soft_skills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-bold border-2 border-black dark:border-white">
                    {skill}
                  </span>
                ))}
                {(!selectedAnalysis.soft_skills || selectedAnalysis.soft_skills.length === 0) && (
                  <p className="text-gray-500">No soft skills detected</p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              AI Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {selectedAnalysis.summary || 'No summary available'}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 text-green-600 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {selectedAnalysis.strengths?.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                  </li>
                ))}
                {(!selectedAnalysis.strengths || selectedAnalysis.strengths.length === 0) && (
                  <p className="text-gray-500">No strengths identified</p>
                )}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Weaknesses
              </h3>
              <ul className="space-y-2">
                {selectedAnalysis.weaknesses?.map((weakness, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
                  </li>
                ))}
                {(!selectedAnalysis.weaknesses || selectedAnalysis.weaknesses.length === 0) && (
                  <p className="text-gray-500">No weaknesses identified</p>
                )}
              </ul>
            </div>
          </div>

          {/* Keywords */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Keywords Found
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedAnalysis.keywords?.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-bold">
                    {keyword}
                  </span>
                ))}
                {(!selectedAnalysis.keywords || selectedAnalysis.keywords.length === 0) && (
                  <p className="text-gray-500">No keywords found</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedAnalysis.missing_keywords?.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-bold">
                    {keyword}
                  </span>
                ))}
                {(!selectedAnalysis.missing_keywords || selectedAnalysis.missing_keywords.length === 0) && (
                  <p className="text-gray-500">No missing keywords</p>
                )}
              </div>
            </div>
          </div>

          {/* Improvements */}
          {selectedAnalysis.improvements && selectedAnalysis.improvements.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Improvements
              </h3>
              <ul className="space-y-2">
                {selectedAnalysis.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Projects */}
          {selectedAnalysis.top_projects && selectedAnalysis.top_projects.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                Top Projects
              </h3>
              <div className="space-y-4">
                {selectedAnalysis.top_projects.map((project, idx) => (
                  <div key={idx} className="border-2 border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-lg">{project.name}</h4>
                      <span className={`px-2 py-1 text-sm font-bold ${getScoreColor(project.score)}`}>
                        Score: {project.score}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{project.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Questions */}
          {selectedAnalysis.interview_questions && selectedAnalysis.interview_questions.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Interview Questions
              </h3>
              <div className="space-y-4">
                {selectedAnalysis.interview_questions.map((q, idx) => (
                  <div key={idx} className="border-2 border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{q.question}</h4>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold uppercase">
                        {q.importance}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{q.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main history list view
  return (
    <div className="min-h-screen bg-[#FDFD96] dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-yellow-400 dark:bg-yellow-600 border-4 border-black dark:border-white p-8 mb-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-black dark:bg-white text-white dark:text-black p-3 border-2 border-transparent">
              <Clock className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">
              History
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-bold border-l-8 border-black dark:border-white pl-4 text-black dark:text-white">
            View and manage your previous resume analyses
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-12 h-12 animate-spin text-black dark:text-white" />
              <p className="text-xl font-black uppercase animate-pulse">Loading History...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && history.length === 0 && (
          <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-black uppercase mb-2 text-black dark:text-white">
              No History Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't analyzed any resumes yet. Upload your first resume to get started!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-blue-600 text-white font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Analyze Resume
            </button>
          </div>
        )}

        {/* History List */}
        {!isLoading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-bold border-2 border-black dark:border-white">
                        {getDomainLabel(item.targetDomain)}
                      </span>
                      <span className={`px-3 py-1 text-sm font-black border-2 border-black dark:border-white ${getScoreColor(item.score)}`}>
                        Score: {item.score}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-bold border-2 border-black dark:border-white">
                        ATS: {item.atsCompatibility}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Calendar className="w-4 h-4" />
                      {formatDate(item.createdAt)}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => viewAnalysis(item.id)}
                      disabled={isLoadingDetails}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-black uppercase text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => deleteAnalysis(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-black uppercase text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHistory;
