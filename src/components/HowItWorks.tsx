import React from 'react';
import { Layers, FileEdit, Send, MessageSquare, ArrowRight } from 'lucide-react';
import { PageView } from '../types';

interface HowItWorksProps {
  onNavigate?: (view: PageView) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Service',
      description: 'Select exactly what you need from our available student services.',
      icon: Layers,
      highlight: 'Registration, Clearance, Letters, Affidavit, or Hostels'
    },
    {
      number: '02',
      title: 'Provide Your Information',
      description: 'Complete the relevant form with accurate information.',
      icon: FileEdit,
      highlight: 'Clear optional fields, accurate bio-data'
    },
    {
      number: '03',
      title: 'Submit Your Request',
      description: 'Review your details and submit your request.',
      icon: Send,
      highlight: 'Instant confirmation receipt generated'
    },
    {
      number: '04',
      title: 'Continue on WhatsApp',
      description: 'Contact Easy Getin on WhatsApp for confirmation, payment, documents and further assistance.',
      icon: MessageSquare,
      highlight: 'Direct one-on-one administrator processing'
    }
  ];

  return (
    <section id="how-it-works-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full inline-block">
            Streamlined Workflow
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            How Easy Getin Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A transparent four-step process built to eliminate long campus queues and deliver verified UNIDEL documents directly to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:border-orange-500 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="font-display text-2xl font-black text-slate-300 group-hover:text-orange-500 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold text-[#0F172A]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
                  {step.highlight}
                </div>
              </div>
            );
          })}
        </div>

        {onNavigate && (
          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
            >
              <span>Get Started with Step 01</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
