import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, AlertTriangle, Shield, CheckCircle, Eye, EyeOff, MessageCircle } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    // Page load animation
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Logging in..." : "Registering...", formData);
    // Add your API call here
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br from-[#FDFD96] via-[#fffaaa] to-[#f0f0f0] flex items-center justify-center p-4 relative overflow-hidden transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className={`w-full max-w-[500px] relative z-10 transition-all duration-700 transform ${isLoading ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4 transform hover:scale-110 transition-transform duration-300">
            <img 
              src="/resume-logo.png" 
              alt="Resume Pro Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-gray-800">Resume Pro</h2>
          <p className="text-gray-600 font-medium mt-1">AI-Powered Career Analyzer</p>
        </div>

        {/* Header Toggle */}
        <div className="flex mb-[-4px] relative">
          <div className="absolute inset-0 bg-black/10 rounded-t-lg"></div>
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 px-8 py-4 font-black uppercase border-4 border-black border-b-0 transition-all duration-300 relative z-10 ${isLogin ? 'bg-white translate-y-0 z-20 rounded-t-lg' : 'bg-gray-100 translate-y-1 opacity-70 rounded-t-lg'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Login
            </span>
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 px-8 py-4 font-black uppercase border-4 border-l-0 border-black border-b-0 transition-all duration-300 relative z-10 ${!isLogin ? 'bg-white translate-y-0 z-20 rounded-t-lg' : 'bg-gray-100 translate-y-1 opacity-70 rounded-t-lg'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Register
            </span>
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-0 rounded-br-2xl rounded-bl-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="font-bold text-gray-500 uppercase text-sm mt-3">
              {isLogin ? 'Access your resume reports & analysis' : 'Start analyzing your career journey'}
            </p>
          </div>

          {/* Important Notices for Registration */}
          {!isLogin && (
            <div className="mb-6 space-y-3">
              {/* Domain Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-blue-800 text-sm">Institutional Access Only</p>
                    <p className="text-blue-700 text-xs mt-1">
                      Please use your <span className="font-bold">@iiitsurat.ac.in</span> email domain for registration. This ensures verified access for IIIT Surat students.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Warning */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-amber-800 text-sm">Important Password Policy</p>
                    <p className="text-amber-700 text-xs mt-1">
                      Choose your password <span className="font-bold">wisely</span> as it <span className="font-bold">cannot be changed</span> once set. Make sure to remember it or store it securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-black uppercase flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full p-4 pl-12 border-4 border-gray-200 font-bold focus:outline-none focus:border-blue-500 focus:bg-blue-50 rounded-xl transition-all"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-black uppercase flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
                {!isLogin && <span className="text-blue-600 text-xs font-normal">(@iiitsurat.ac.in)</span>}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder={isLogin ? "your.email@iiitsurat.ac.in" : "your.name@iiitsurat.ac.in"}
                  className="w-full p-4 pl-12 border-4 border-gray-200 font-bold focus:outline-none focus:border-blue-500 focus:bg-blue-50 rounded-xl transition-all"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black uppercase flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full p-4 pl-12 pr-12 border-4 border-gray-200 font-bold focus:outline-none focus:border-blue-500 focus:bg-blue-50 rounded-xl transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Password cannot be recovered if forgotten</span>
                </div>
              )}
            </div>

            {/* Password Strength Indicator for Registration */}
            {!isLogin && formData.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded ${formData.password.length >= 12 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-1 rounded ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
                <p className="text-xs text-gray-500">
                  Use 12+ characters with uppercase, numbers, and symbols
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl border-4 border-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 rounded-xl"
            >
              {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              {isLogin ? 'Enter App' : 'Create Account'}
            </button>
          </form>

          {/* Contact Us Link for Login Errors */}
          {isLogin && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-800 text-sm">Having trouble logging in?</p>
                  <p className="text-red-700 text-xs mt-1">
                    If you're experiencing login issues or forgot your password, please <Link to="/contact" className="font-bold underline hover:text-red-900">contact us</Link> for assistance.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-gray-600 hover:text-blue-600 text-sm flex items-center justify-center mx-auto gap-2 transition-colors"
            >
              {isLogin ? (
                <>
                  Don't have an account?
                  <span className="text-blue-600 font-black underline">Sign up now</span>
                </>
              ) : (
                <>
                  Already have an account?
                  <span className="text-blue-600 font-black underline">Login here</span>
                </>
              )}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
