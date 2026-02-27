import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, Lock, Eye, Database, User } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFD96] via-[#fffaaa] to-[#f0f0f0] py-12 px-4">
      {/* Animated Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-600 p-3 border-2 border-black">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
              Privacy Policy
            </h1>
          </div>
          <p className="font-bold text-gray-600">Last Updated: February 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <section>
            <h2 className="text-xl font-black uppercase mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              1. Information We Collect
            </h2>
            <p className="text-gray-700 font-medium leading-relaxed">
              We collect information you provide directly to us, including your name, email address (@iiitsurat.ac.in), 
              and resume documents when you use our service. We also collect usage data to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 font-medium leading-relaxed">
              Your information is used to provide resume analysis services, improve our AI models, communicate with you 
              about your account, and comply with legal obligations. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              3. Data Storage & Security
            </h2>
            <p className="text-gray-700 font-medium leading-relaxed">
              Your resume data is stored securely on our servers. We implement industry-standard security measures 
              including encryption, access controls, and regular security audits to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              4. Account Security
            </h2>
            <p className="text-gray-700 font-medium leading-relaxed">
              Since passwords cannot be changed once set, please choose your password carefully. You are responsible 
              for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase mb-3">
              5. Third-Party Services
            </h2>
            <p className="text-gray-700 font-medium leading-relaxed">
              We use third-party services for AI processing (Groq API) and hosting. These providers are bound by 
              confidentiality agreements and cannot use your data for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase mb-3">
              6. Contact Us
            </h2>
            <p className="text-gray-700 font-medium leading-relaxed">
              If you have questions about this Privacy Policy, please contact us through our 
              <Link to="/contact" className="text-blue-600 font-bold hover:underline mx-1">Contact Page</Link>
              or email us at support@resume-pro.com
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm font-bold text-gray-500">
            © 2026 Resume Pro Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
