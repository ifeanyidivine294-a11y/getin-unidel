import React, { useState } from 'react';
import { PageView } from '../types';
import { WHATSAPP_DISPLAY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { Menu, X, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: PageView, targetId?: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 transition-all shadow-sm">
      {/* Top micro-bar for quick contact & official distinction */}
      <div className="bg-[#0B132B] px-4 py-2 text-xs text-slate-300 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-100">UNIDEL Student Assistance Desk (Agbor)</span>
            <span className="hidden sm:inline text-slate-400">| Fast WhatsApp Processing</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.GENERAL)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Wordmark matching refined branding */}
          <button
            id="header-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-11 h-11 bg-[#0B132B] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 border border-slate-800 transition-transform">
              <span className="text-orange-500 font-bold text-2xl font-display">E</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#0F172A] font-extrabold text-xl sm:text-2xl tracking-tight font-display">
                  EASY GETIN
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200">
                  UNIDEL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
                Student Assistance Platform
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-orange-600 cursor-pointer ${
                currentView === 'home' ? 'text-orange-600 font-bold' : ''
              }`}
            >
              Home
            </button>
            <button
              id="nav-services"
              onClick={() => handleNavClick('services')}
              className={`transition-colors hover:text-orange-600 cursor-pointer ${
                currentView === 'services' ||
                ['registration', 'clearance', 'letters', 'affidavit', 'hostels'].includes(currentView)
                  ? 'text-orange-600 font-bold'
                  : ''
              }`}
            >
              Services
            </button>
            <button
              id="nav-letters"
              onClick={() => handleNavClick('letters')}
              className={`transition-colors hover:text-orange-600 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'letters' ? 'text-orange-600 font-bold' : ''
              }`}
            >
              <span>Letters</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                ₦1k
              </span>
            </button>
            <button
              id="nav-how-it-works"
              onClick={() => handleNavClick('how-it-works')}
              className={`transition-colors hover:text-orange-600 cursor-pointer ${
                currentView === 'how-it-works' ? 'text-orange-600 font-bold' : ''
              }`}
            >
              How It Works
            </button>
            <button
              id="nav-testimonials"
              onClick={() => handleNavClick('home', 'testimonials-section')}
              className="transition-colors hover:text-orange-600 cursor-pointer"
            >
              Reviews
            </button>
            <button
              id="nav-contact"
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-orange-600 cursor-pointer ${
                currentView === 'contact' ? 'text-orange-600 font-bold' : ''
              }`}
            >
              Contact
            </button>
            
            {/* Primary Orange Action Button */}
            <button
              id="header-get-started-btn"
              onClick={() => handleNavClick('services')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-sm shadow-orange-500/20 active:scale-95 cursor-pointer"
            >
              GET STARTED
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="header-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                currentView === 'home' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                currentView === 'services' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => handleNavClick('letters')}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                currentView === 'letters' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Letter Processing</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700">₦1,000</span>
            </button>
            <button
              onClick={() => handleNavClick('clearance')}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Online Clearance</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">₦3,000</span>
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                currentView === 'how-it-works' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                currentView === 'contact' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Contact & Support
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => handleNavClick('services')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.GENERAL)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-emerald-700 border border-slate-200 font-semibold text-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
