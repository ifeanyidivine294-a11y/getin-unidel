import React from 'react';
import { Smartphone, CheckCircle, FolderKanban, MessageSquare, ArrowRight } from 'lucide-react';
import { PageView } from '../types';

interface WhyEasyGetinProps {
  onNavigate?: (view: PageView) => void;
}

export const WhyEasyGetin: React.FC<WhyEasyGetinProps> = ({ onNavigate }) => {
  const benefits = [
    {
      title: 'Simple',
      description: 'Easy-to-follow student processes without confusing bureaucracy.',
      icon: CheckCircle,
      accent: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Convenient',
      description: 'Access services and submit details directly from your phone.',
      icon: Smartphone,
      accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Organized',
      description: 'Different services are separated clearly so you know exactly what is required.',
      icon: FolderKanban,
      accent: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Responsive',
      description: 'Continue direct one-on-one communication through WhatsApp.',
      icon: MessageSquare,
      accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <section id="why-easy-getin" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
            Student Advantages
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Why Easy Getin
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A reliable student assistance workflow created to simplify your UNIDEL experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-amber-500 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.accent} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-600 transition-colors">
                  <span>UNIDEL Optimized</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
