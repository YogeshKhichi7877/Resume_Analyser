import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, Search, ArrowRight } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFD96] via-[#fffaaa] to-[#f0f0f0] flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-2xl w-full relative z-10">
        {/* 404 Card */}
        <div className="bg-white border-4 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-center">
          {/* Error Number */}
          <div className="mb-8">
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 leading-none">
              404
            </h1>
            <div className="flex justify-center mt-2">
              <div className="h-2 w-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
            </div>
          </div>

          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-4 border-4 border-black">
              <AlertTriangle className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black uppercase tracking-tight text-black mb-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-600 font-bold mb-8 max-w-md mx-auto">
            Oops! Even our AI couldn't find this page. It might have been moved, deleted, or never existed in the first place.
          </p>

          {/* Search Suggestion */}
          <div className="bg-gray-50 border-2 border-gray-200 p-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Search className="w-4 h-4" />
              <span className="text-sm font-bold uppercase">Try these instead:</span>
            </div>
            <ul className="text-sm font-medium text-gray-600 space-y-1">
              <li>• Check the URL for typos</li>
              <li>• Go back to the previous page</li>
              <li>• Use the navigation menu</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-black uppercase border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-black uppercase border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <span>Report Issue</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t-2 border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Resume Pro © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
