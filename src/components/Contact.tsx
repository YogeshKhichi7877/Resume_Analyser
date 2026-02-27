import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, Send, ArrowLeft, Clock, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFD96] via-[#fffaaa] to-[#f0f0f0] py-12 px-4">
      {/* Animated Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
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
            <div className="bg-purple-600 p-3 border-2 border-black">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
              Contact Us
            </h1>
          </div>
          <p className="font-bold text-gray-600">We'd love to hear from you! Get in touch with our team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-600" />
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-black uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full p-4 border-4 border-gray-200 font-bold focus:outline-none focus:border-purple-500 rounded-xl transition-all"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@iiitsurat.ac.in"
                  className="w-full p-4 border-4 border-gray-200 font-bold focus:outline-none focus:border-purple-500 rounded-xl transition-all"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black uppercase">Subject</label>
                <select
                  required
                  className="w-full p-4 border-4 border-gray-200 font-bold focus:outline-none focus:border-purple-500 rounded-xl transition-all"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Report a Bug</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black uppercase">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full p-4 border-4 border-gray-200 font-bold focus:outline-none focus:border-purple-500 rounded-xl transition-all resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black text-xl uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 rounded-xl"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 border-2 border-black">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-sm text-gray-500">Email</p>
                    <p className="font-bold text-black">support@resume-pro.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 border-2 border-black">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-sm text-gray-500">Phone</p>
                    <p className="font-bold text-black">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 border-2 border-black">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-sm text-gray-500">Location</p>
                    <p className="font-bold text-black">IIIT Surat, Gujarat, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-3 border-2 border-black">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-sm text-gray-500">Response Time</p>
                    <p className="font-bold text-black">Within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Card */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-yellow-600" />
                Quick Help
              </h2>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="font-bold text-black">How do I reset my password?</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Passwords cannot be changed for security reasons. Please contact support if you need account assistance.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="font-bold text-black">Is this service free?</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Yes! Resume Pro is completely free for IIIT Surat students with valid @iiitsurat.ac.in email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-gray-500">
            © 2026 Resume Pro Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
