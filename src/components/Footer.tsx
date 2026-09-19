import React from 'react';
import { PageView } from '../types';
import { WHATSAPP_DISPLAY, getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';
import { MessageSquare, ShieldCheck, MapPin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (view: PageView) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200">
      {/* Upper footer links and brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1 & 2: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#0B132B] rounded-xl flex items-center justify-center shadow-sm border border-slate-800">
                <span className="text-orange-500 font-bold text-2xl font-display">E</span>
              </div>
              <div>
                <span className="font-display text-xl font-extrabold tracking-tight text-[#0F172A]">
                  EASY GETIN
                </span>
                <span className="block text-xs font-bold uppercase tracking-wider text-orange-600">
                  UNIDEL Student Assistance
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              A centralized student support service platform dedicated to making UNIDEL registration, online clearance guidance (₦3,000), letter processing (₦1,000 each), affidavit assistance, and student hostel enquiries simpler, faster, and stress-free.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                id="footer-whatsapp-badge"
                href={getWhatsAppUrl(WHATSAPP_MESSAGES.GENERAL)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs font-bold"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
              </a>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Agbor, Delta State</span>
              </span>
            </div>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <button
                  id="footer-nav-letters"
                  onClick={() => handleNav('letters')}
                  className="hover:text-orange-600 transition-colors text-left flex items-center justify-between w-full pr-4 cursor-pointer"
                >
                  <span>Letter Processing</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">₦1,000</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-clearance"
                  onClick={() => handleNav('clearance')}
                  className="hover:text-orange-600 transition-colors text-left flex items-center justify-between w-full pr-4 cursor-pointer"
                >
                  <span>Online Clearance</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">₦3,000</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-registration"
                  onClick={() => handleNav('registration')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  Online Registration
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-affidavit"
                  onClick={() => handleNav('affidavit')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  Affidavit of Good Conduct
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-hostels"
                  onClick={() => handleNav('hostels')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  Student Hostels & Rooms
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => handleNav('home')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-services"
                  onClick={() => handleNav('services')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  All Services
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-how"
                  onClick={() => handleNav('how-it-works')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-reviews"
                  onClick={() => {
                    handleNav('home');
                    setTimeout(() => {
                      document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  Student Reviews
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-about"
                  onClick={() => handleNav('about')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  About Easy Getin
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => handleNav('contact')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Trust & Payment</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <button
                  id="footer-nav-privacy"
                  onClick={() => handleNav('privacy')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-terms"
                  onClick={() => handleNav('terms')}
                  className="hover:text-orange-600 transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl(WHATSAPP_MESSAGES.CLEARANCE_CLARIFICATION)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors inline-flex items-center gap-1 text-emerald-600 font-bold"
                >
                  <span>WhatsApp Help Desk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#0F172A] font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Desk Account</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-tight">
                  PalmPay: <strong>9069710687</strong> (Chukwudebe Ifeanyi). Send receipt to WhatsApp for immediate dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer row */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-500">
          <p className="leading-relaxed">
            <strong className="text-slate-700">Disclaimer:</strong> Easy Getin is an independent student assistance platform and is not an official UNIDEL university portal unless otherwise stated. All official admissions, examinations, and university policies remain under the sole jurisdiction of the University of Delta (UNIDEL), Agbor.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-4 sm:px-6 lg:px-10 py-4 bg-[#0B132B] text-slate-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400">
          <span>&copy; 2026 Easy Getin. Private Student Assistance Platform.</span>
          <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors cursor-pointer">
            Terms of Service
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Desk Active
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-orange-400 font-semibold">WhatsApp: {WHATSAPP_DISPLAY}</span>
        </div>
      </div>
    </footer>
  );
};
