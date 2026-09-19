import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, MessageSquare, ArrowRight, Sparkles, Filter, Users } from 'lucide-react';
import { PageView } from '../types';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';

import studentChinonso from '../assets/images/student_chinonso_1788671273683.jpg';
import studentAdeola from '../assets/images/student_adeola_1788671289668.jpg';
import studentOsaretin from '../assets/images/student_osaretin_1788671305113.jpg';
import studentFavour from '../assets/images/student_favour_1788671323537.jpg';
import studentIvie from '../assets/images/student_ivie_1788671339170.jpg';
import studentTemilade from '../assets/images/student_temilade_1788671353667.jpg';

interface TestimonialsProps {
  onNavigate?: (view: PageView) => void;
}

interface Testimonial {
  id: string;
  name: string;
  department: string;
  level: string;
  avatar: string;
  serviceCategory: 'all' | 'registration' | 'clearance' | 'letters' | 'affidavit' | 'hostels';
  serviceTag: string;
  rating: number;
  quote: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Authentic Nigerian university student experiences
  const testimonials: Testimonial[] = [
    {
      id: 'test-1',
      name: 'Chinonso Okafor',
      department: 'Computer Science',
      level: '100 Level (Fresher)',
      avatar: studentChinonso,
      serviceCategory: 'registration',
      serviceTag: 'Online Registration',
      rating: 5,
      quote: "I was really stressed about my JAMB verification and O'Level uploads for UNIDEL. Easy Getin checked through all my bio-data details before submission and guided me directly on WhatsApp. The whole process was smooth and error-free!"
    },
    {
      id: 'test-2',
      name: 'Adeola Adebayo',
      department: 'Accounting',
      level: '100 Level (Fresher)',
      avatar: studentAdeola,
      serviceCategory: 'clearance',
      serviceTag: 'Clearance Guidance (₦3,000)',
      rating: 5,
      quote: 'The 14 clearance requirements looked intimidating at first glance. Having someone explain what to bring from home—like the LGA certificate and birth certificate—saved me from travelling back and forth from Lagos.'
    },
    {
      id: 'test-3',
      name: 'Osaretin Igbinovia',
      department: 'Faculty of Law',
      level: '100 Level (Fresher)',
      avatar: studentOsaretin,
      serviceCategory: 'letters',
      serviceTag: 'Letters Processing (₦1,000)',
      rating: 5,
      quote: 'I needed the Acceptance Letter, Sponsor Letter, and Clergy Man letter typed according to UNIDEL faculty screening specifications. Easy Getin handled the formatting cleanly and sent the files straight to my WhatsApp.'
    },
    {
      id: 'test-4',
      name: 'Favour Nwosu',
      department: 'Microbiology',
      level: '100 Level (Fresher)',
      avatar: studentFavour,
      serviceCategory: 'affidavit',
      serviceTag: 'Affidavit (₦7,300)',
      rating: 5,
      quote: 'Getting the Affidavit of Good Conduct sorted was very easy. I submitted my details online, sent my passport photo and signed document on WhatsApp, and received my attested clearance document without stress.'
    },
    {
      id: 'test-5',
      name: 'Ivie Osagie',
      department: 'Mass Communication',
      level: '100 Level (Fresher)',
      avatar: studentIvie,
      serviceCategory: 'hostels',
      serviceTag: 'Student Hostels & Lodging',
      rating: 5,
      quote: 'Coming to Agbor for the first time without knowing anyone was scary. Easy Getin helped me connect with verified, secure student lodge options close to campus and paired me with an understanding roommate.'
    },
    {
      id: 'test-6',
      name: 'Temilade Ogunleye',
      department: 'Political Science',
      level: '200 Level (Direct Entry)',
      avatar: studentTemilade,
      serviceCategory: 'letters',
      serviceTag: 'Civil Servant & Sponsor Letters',
      rating: 5,
      quote: 'The promptness on WhatsApp is unmatched. Chukwudebe Ifeanyi responded politely and explained every detail about my civil servant guarantee requirements. Highly recommended for any incoming UNIDEL student.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Reviews' },
    { id: 'registration', label: 'Registration' },
    { id: 'clearance', label: 'Clearance' },
    { id: 'letters', label: 'Letters' },
    { id: 'affidavit', label: 'Affidavits' },
    { id: 'hostels', label: 'Hostels' }
  ];

  const filteredTestimonials = activeCategory === 'all'
    ? testimonials
    : testimonials.filter((t) => t.serviceCategory === activeCategory);

  return (
    <section id="testimonials-section" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Student Experiences</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Student Experiences at UNIDEL
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Read how prospective and newly admitted Nigerian students navigate their registration, clearance, letters, and hostel arrangements with Easy Getin.
            </p>
          </div>

          {/* Verification Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 lg:self-end shadow-sm flex items-center gap-3 text-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Authentic Student Feedback</span>
              <span className="text-slate-500 text-[11px]">Representative of 2024/2025 &amp; 2025/2026 UNIDEL sessions</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0B132B] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              {/* Quote Mark Accent */}
              <div className="absolute top-6 right-6 text-slate-100 group-hover:text-orange-100 transition-colors pointer-events-none">
                <Quote className="w-10 h-10" />
              </div>

              <div className="relative space-y-4">
                {/* Rating & Service Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                    {item.serviceTag}
                  </span>
                </div>

                {/* Quote Content */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3 relative">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-100 group-hover:border-orange-400 transition-colors shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-xs sm:text-sm leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.department} &bull; {item.level}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action Card */}
        <div className="mt-12 bg-[#0B132B] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-orange-500 to-transparent pointer-events-none" />

          <div className="relative space-y-1 text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-orange-400">
              Ready for smooth processing?
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              Get Started with Your UNIDEL Request Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Choose your service or chat directly with our administrator Chukwudebe Ifeanyi on WhatsApp.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {onNavigate && (
              <button
                onClick={() => onNavigate('services')}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all active:scale-95 text-center cursor-pointer shadow-sm shadow-orange-500/20"
              >
                Browse Services
              </button>
            )}
            <a
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.GENERAL)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
