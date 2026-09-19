import React, { useState } from 'react';
import { PageView } from '../../types';
import { Breadcrumbs } from '../Breadcrumbs';
import { REFERENCE_IMAGES } from '../../constants/imageUrls';
import { WHATSAPP_DISPLAY, WHATSAPP_BASE_URL } from '../../utils/whatsapp';
import {
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Users,
  Award,
  Clock,
  Target,
  FileCheck2,
  HeartHandshake
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: PageView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumbs & Header */}
        <div className="space-y-3">
          <Breadcrumbs
            items={[{ label: 'About Easy Getin' }]}
            onNavigate={onNavigate}
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
            <span>STUDENT ASSISTANCE PLATFORM</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A]">
            About Easy Getin — UNIDEL
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            A dedicated student assistance and online documentation service supporting prospective and newly admitted students of University of Delta (UNIDEL), Agbor.
          </p>
        </div>

        {/* Administrator Profile Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Administrator Image Container */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-xs sm:max-w-sm rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-200 bg-slate-100 group">
                <img
                  src={REFERENCE_IMAGES.ADMIN_PHOTO}
                  alt="Chukwudebe Ifeanyi - Administrator, Easy Getin"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-90'
                  }`}
                />
              </div>

              {/* Exact user-requested text directly under photo */}
              <div className="mt-4 text-center space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-orange-600 block">
                  ADMINISTRATOR
                </span>
                <h3 className="font-display text-xl font-bold text-[#0F172A]">
                  Chukwudebe Ifeanyi
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Administrator — Easy Getin
                </p>
              </div>
            </div>

            {/* Profile narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
                  Leadership & Mission
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  Serving UNIDEL Students with Integrity
                </h2>
                <p className="text-sm font-semibold text-slate-700">
                  Administrator: Chukwudebe Ifeanyi
                </p>
              </div>

              <div className="space-y-3.5 text-sm text-slate-600 leading-relaxed">
                <p>
                  As administrator of Easy Getin, Chukwudebe Ifeanyi coordinates direct student documentation, screening clearance reviews, and off-campus accommodation for the University of Delta (UNIDEL), Agbor.
                </p>
                <p>
                  Transitioning into university life is often stressful, especially when dealing with complex admission portals, faculty requirements, and court affidavits. Easy Getin bridges this gap by providing structured, verified, and personalized guidance every step of the way.
                </p>
                <p>
                  Every document processed through Easy Getin is carefully checked against the latest UNIDEL academic regulations to ensure complete compliance.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Administrator on WhatsApp</span>
                </a>

                <button
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Explore Services</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-[#0F172A]">Authentic & Verified</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every document template, affidavit format, and clearance checklist conforms with authentic UNIDEL administrative requirements.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-[#0F172A]">Fast Turnaround</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Time is critical during screening deadlines. We review, generate, and deliver your files quickly to avoid late-clearance penalties.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-[#0F172A]">Student First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent, affordable pricing tailored for Nigerian students and families, backed by direct personal support on WhatsApp ({WHATSAPP_DISPLAY}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
