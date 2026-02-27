
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, Zap, AlertTriangle, Clock, Mail } from 'lucide-react';

const Footer = () => {
  return (
   <footer className="w-full bg-white dark:bg-gray-800 border-t-4 border-black dark:border-gray-500 mt-20">
      <div className="max-w-8xl mx-auto">
        
        {/* Main Grid with thick dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black dark:divide-gray-500">
          
          {/* Column 1: Brand & tagline */}
          <div className="p-8 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/resume-logo.png" 
                alt="Resume Pro Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
              Analyse your resume with precision and land your dream job.
            </p>
            <div className="pt-4 flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white dark:bg-gray-700 border-2 border-black dark:border-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all">
                  <Icon className="w-5 h-5 text-black dark:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="p-8">
            <h4 className="font-black uppercase text-lg mb-6 bg-yellow-300 dark:bg-yellow-600 inline-block px-2 border-2 border-black dark:border-transparent text-black">
              Quick Links
            </h4>
            <ul className="space-y-3 font-bold text-sm">
              <li>
                <Link to="/" className="flex items-center group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  <span className="w-2 h-2 bg-black dark:bg-white mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </Link>
              </li>
              <li>
                <span className="flex items-center text-gray-700 dark:text-gray-300 cursor-not-allowed opacity-50">
                  <span className="w-2 h-2 bg-black dark:bg-white mr-2" />
                  Pricing <Clock className="w-3 h-3 ml-1" />
                </span>
                <p className="text-xs text-gray-400 ml-4 mt-1">Coming Soon</p>
              </li>
              <li>
                <Link to="/contact" className="flex items-center group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  <span className="w-2 h-2 bg-black dark:bg-white mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="p-8">
            <h4 className="font-black uppercase text-lg mb-6 bg-green-300 dark:bg-green-600 inline-block px-2 border-2 border-black dark:border-transparent text-black">
              Legal
            </h4>
            <ul className="space-y-3 font-bold text-sm">
              <li>
                <Link to="/privacy-policy" className="flex items-center group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  <span className="w-2 h-2 bg-black dark:bg-white mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="flex items-center group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  <span className="w-2 h-2 bg-black dark:bg-white mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center group text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  <span className="w-2 h-2 bg-black dark:bg-white mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Report Issue
                </Link>
              </li>
            </ul>
            
            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                <Mail className="w-4 h-4" />
                <span>support@resume-pro.com</span>
              </div>
            </div>
          </div>

        </div>
        
        {/* --- AI DISCLAIMER / WARNING STRIP --- */}
        <div className="bg-yellow-200 dark:bg-yellow-600 border-t-4 border-black dark:border-gray-500 p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="bg-black text-yellow-400 p-2 shrink-0 border-2 border-transparent">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
                <h5 className="font-black uppercase text-sm text-black dark:text-white">AI Usage & Accuracy Disclaimer</h5>
                <p className="text-xs font-bold text-black/80 dark:text-white/90 leading-relaxed max-w-5xl">
                    This platform leverages Artificial Intelligence to analyze and generate content. While we strive for precision, AI models can make mistakes, hallucinate facts, or lack specific context. 
                    All suggestions provided should be treated as <span className="underline decoration-2">assistive guidance</span> rather than absolute professional advice. 
                    Please review all outputs manually before submitting your resume to employers.
                </p>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-4 border-black dark:border-gray-500 p-6 flex flex-col md:flex-row justify-center items-center gap-4 bg-gray-100 dark:bg-gray-900">
  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
    © 2026 Resume Pro Inc.
  </p>
  
  {/* Removed 'pr-8' here to ensure perfect centering */}
  <div className="flex items-center gap-2 text-xs font-bold uppercase">
    <span>Made and Maintained by </span>
    <span>Yogesh Khinchi </span>
  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;
