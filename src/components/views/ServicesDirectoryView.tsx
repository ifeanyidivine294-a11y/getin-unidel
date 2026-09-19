import React from 'react';
import { PageView } from '../../types';
import { QuickServices } from '../QuickServices';
import { Breadcrumbs } from '../Breadcrumbs';
import { ArrowLeft, Layers } from 'lucide-react';

interface ServicesDirectoryViewProps {
  onNavigate: (view: PageView) => void;
}

export const ServicesDirectoryView: React.FC<ServicesDirectoryViewProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <div className="space-y-3">
          <Breadcrumbs
            items={[{ label: 'All Services' }]}
            onNavigate={onNavigate}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
              <Layers className="w-3.5 h-3.5 text-orange-600" />
              <span>UNIDEL STUDENT ASSISTANCE DIRECTORY</span>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Available Student Services
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Select the service you need below. Each service has a dedicated page and structured form designed to get your request processed smoothly with direct WhatsApp follow-up.
            </p>
          </div>
        </div>

        {/* Reuse QuickServices cards component for seamless consistency */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <QuickServices onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
