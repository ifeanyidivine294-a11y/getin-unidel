import React from 'react';
import { PageView } from '../types';
import { WHATSAPP_DISPLAY, WHATSAPP_MESSAGES, WHATSAPP_BASE_URL, getWhatsAppUrl } from '../utils/whatsapp';
import { ArrowRight, MessageSquare, ShieldCheck, Clock, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { REFERENCE_IMAGES } from '../constants/imageUrls';

interface HeroProps {
  onNavigate: (view: PageView) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-[#0B132B] text-white py-14 lg:py-20 border-b border-slate-800">
      {/* Radial ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Campus Tag Badge */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-bold rounded-full tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>UNIDEL STUDENT ASSISTANCE</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Your Easier Way to Get Things Done at UNIDEL.
            </h1>

            {/* Supporting Text */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Registration assistance, clearance guidance, letter processing, affidavit assistance and student accommodation — all in one convenient place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-explore-services-btn"
                onClick={() => onNavigate('services')}
                className="w-full sm:w-auto bg-orange-500 text-white hover:bg-orange-600 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="hero-whatsapp-btn"
                href={getWhatsAppUrl(WHATSAPP_MESSAGES.GENERAL)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-7 py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-emerald-300 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>CHAT ON WHATSAPP</span>
              </a>
            </div>

            {/* Quick value indicators */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-3 sm:gap-6 text-center lg:text-left">
              <div className="space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs sm:text-sm font-bold text-white">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Rapid Response</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400">{WHATSAPP_DISPLAY}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs sm:text-sm font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Formats</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400">UNIDEL Agbor Standards</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs sm:text-sm font-bold text-white">
                  <Award className="w-4 h-4 text-orange-400" />
                  <span>Clear Pricing</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400">₦1k Letters &bull; ₦3k Clearance</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual - Featuring user supplied admin image */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm bg-slate-900/95 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative group">
              {/* Administrator Supplied Photo Container (Moderate height, rounded, no distortion) */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={REFERENCE_IMAGES.ADMIN_PHOTO}
                  alt="Chukwudebe Ifeanyi - Administrator, Easy Getin"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-950/90 text-orange-400 text-[11px] font-bold border border-orange-500/30 flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Administrator On Duty</span>
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium bg-slate-950/80 px-2.5 py-0.5 rounded-full">
                    Agbor, Delta State
                  </span>
                </div>
              </div>

              {/* Profile Card Info & Quick Actions */}
              <div className="p-5 space-y-3.5">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400 block">
                    DIRECT STUDENT ASSISTANCE
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    Chukwudebe Ifeanyi
                  </h3>
                  <p className="text-xs text-slate-400">
                    Administrator — Easy Getin
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onNavigate('letters')}
                    className="p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 hover:text-white text-orange-300 text-left transition-all border border-orange-500/30 font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>Letters (₦1k)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('clearance')}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-left transition-all border border-slate-700 font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>Clearance (₦3k)</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => onNavigate('registration')}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-left transition-all border border-slate-700 font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>Registration</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => onNavigate('affidavit')}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-left transition-all border border-slate-700 font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>Affidavit (₦7.3k)</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>

                <button
                  onClick={() => onNavigate('hostels')}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-left transition-all border border-slate-700 font-semibold flex items-center justify-between text-xs cursor-pointer"
                >
                  <span>Student Hostels & Lodges</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
