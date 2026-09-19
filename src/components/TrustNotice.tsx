import React from 'react';
import { ShieldCheck, FileCheck, Users, MessageSquare, ArrowRight, Lock } from 'lucide-react';
import { PageView } from '../types';

interface TrustNoticeProps {
  onNavigate?: (view: PageView) => void;
}

export const TrustNotice: React.FC<TrustNoticeProps> = ({ onNavigate }) => {
  const trustPoints = [
    {
      title: 'Clear Information',
      description: 'Know what you need before starting. Comprehensive requirements without hidden surprises.',
      icon: FileCheck,
      color: 'text-amber-500 bg-amber-500/10'
    },
    {
      title: 'Straightforward Process',
      description: 'Choose a service and follow the steps. Logical forms, instant verification receipts, and guided flows.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      title: 'Student-Focused',
      description: 'Designed around the genuine academic and living needs of University of Delta students in Agbor.',
      icon: Users,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      title: 'Convenient Communication',
      description: 'Continue your request through WhatsApp. Real-time updates with prompt response from the administrator.',
      icon: MessageSquare,
      color: 'text-green-500 bg-green-500/10'
    }
  ];

  return (
    <section id="trust-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
            Trust & Transparency
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Why Choose Easy Getin
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Built to provide authentic, transparent, and direct support to UNIDEL applicants and students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-amber-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy reassurance callout */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Data Privacy & Student Confidentiality</h4>
              <p className="text-xs text-slate-500">
                Your submitted details are strictly used to process your service request and guide your documentation.
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('privacy')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Read Privacy Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
