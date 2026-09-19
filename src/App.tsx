/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { QuickServices } from './components/QuickServices';
import { WhyEasyGetin } from './components/WhyEasyGetin';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { TrustNotice } from './components/TrustNotice';
import { RegistrationView } from './components/views/RegistrationView';
import { ClearanceView } from './components/views/ClearanceView';
import { LettersView } from './components/views/LettersView';
import { AffidavitView } from './components/views/AffidavitView';
import { HostelsView } from './components/views/HostelsView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { PrivacyView } from './components/views/PrivacyView';
import { TermsView } from './components/views/TermsView';
import { ServicesDirectoryView } from './components/views/ServicesDirectoryView';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { getWhatsAppUrl, WHATSAPP_MESSAGES, WHATSAPP_DISPLAY } from './utils/whatsapp';
import { MessageSquare, ArrowUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Scroll to top whenever page view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Discreet admin access: URL param ?admin=sheets or hash #admin-sheets or secret shortcut Ctrl+Shift+S / Cmd+Shift+S
  useEffect(() => {
    const checkAdminParams = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'sheets' || window.location.hash === '#admin-sheets') {
        setIsSheetsModalOpen(true);
      }
    };
    checkAdminParams();
    window.addEventListener('hashchange', checkAdminParams);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsSheetsModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminParams);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-500/30 selection:text-amber-950 font-sans antialiased">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area Based on State */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-0">
            {/* 1. Hero Section with deep navy & gold aesthetic */}
            <Hero onNavigate={handleNavigate} />

            {/* 2. Main 5 Services Grid */}
            <QuickServices onNavigate={handleNavigate} />

            {/* 3. Why Easy Getin benefits */}
            <WhyEasyGetin onNavigate={handleNavigate} />

            {/* 4. How Easy Getin Works (4-Step process) */}
            <HowItWorks onNavigate={handleNavigate} />

            {/* 4. Student Experiences / Testimonials */}
            <Testimonials onNavigate={handleNavigate} />

            {/* 5. Privacy & Information Notice Banner */}
            <TrustNotice onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'services' && (
          <ServicesDirectoryView onNavigate={handleNavigate} />
        )}

        {currentView === 'how-it-works' && (
          <div className="py-12 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <button
                onClick={() => handleNavigate('home')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 cursor-pointer"
              >
                &larr; Back to Home
              </button>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">How Easy Getin Works</h1>
              <p className="text-slate-600 mt-2">A simple 4-step process for UNIDEL students.</p>
            </div>
            <HowItWorks onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'registration' && (
          <RegistrationView onNavigate={handleNavigate} />
        )}

        {currentView === 'clearance' && (
          <ClearanceView onNavigate={handleNavigate} />
        )}

        {currentView === 'letters' && (
          <LettersView onNavigate={handleNavigate} />
        )}

        {currentView === 'affidavit' && (
          <AffidavitView onNavigate={handleNavigate} />
        )}

        {currentView === 'hostels' && (
          <HostelsView onNavigate={handleNavigate} />
        )}

        {currentView === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <ContactView onNavigate={handleNavigate} />
        )}

        {currentView === 'privacy' && (
          <PrivacyView onNavigate={handleNavigate} />
        )}

        {currentView === 'terms' && (
          <TermsView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Floating WhatsApp Action Pill for fast student access */}
      <aside
        aria-label="Floating quick contact"
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5"
      >
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <a
          id="floating-whatsapp-btn"
          href={getWhatsAppUrl(WHATSAPP_MESSAGES.GENERAL)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="hidden sm:inline font-sans">Chat on WhatsApp</span>
          <span className="sm:hidden font-sans">WhatsApp</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        </a>
      </aside>

      {/* Footer with legal disclaimers & quick links */}
      <Footer
        onNavigate={handleNavigate}
      />

      {/* Google Sheets Live Sync & Management Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
      />
    </div>
  );
}
