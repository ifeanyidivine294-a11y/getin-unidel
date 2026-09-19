import React from 'react';
import { PageView } from '../../types';
import { Breadcrumbs } from '../Breadcrumbs';
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PrivacyViewProps {
  onNavigate: (view: PageView) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="space-y-3">
          <Breadcrumbs
            items={[{ label: 'Privacy Policy' }]}
            onNavigate={onNavigate}
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>DATA CONFIDENTIALITY & PRIVACY NOTICE</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Privacy & Information Notice
          </h1>
          <p className="text-sm text-slate-600">
            Easy Getin — UNIDEL Student Assistance &bull; Session 2025/2026
          </p>
        </div>

        {/* Core Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              1. Purpose of Data Collection
            </h2>
            <p>
              Information submitted through Easy Getin forms is used exclusively to process your requested student service, format required UNIDEL admission credentials, and communicate with you regarding your request. We ask students to provide accurate information and refrain from submitting information that is not required for their selected service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              2. Types of Information Collected
            </h2>
            <p>
              Depending on the service selected, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Academic & Identification:</strong> Student biodata, course choices, examination details, faculty and department.</li>
              <li><strong>Contact & Bio-data:</strong> Full name, phone number, email address, residential and permanent address.</li>
              <li><strong>Emergency & Sponsorship:</strong> Next of kin details, sponsor contact information.</li>
              <li><strong>Official Letter References:</strong> Church/clergy name and title, civil servant workplace and designation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              3. WhatsApp Transmission Security
            </h2>
            <p>
              Because Easy Getin utilizes WhatsApp as our direct communication and document delivery channel, end-to-end encryption protocols enforced by WhatsApp apply to all document exchanges between you and the administrator (+234 906 971 0687).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              4. Non-Disclosure & Third-Party Protection
            </h2>
            <p>
              We do not sell, rent, trade, or distribute student information to unauthorized commercial third parties. Data is used strictly for drafting your official documents, verifying admission records, or coordinating hostel arrangements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              5. Administrator Contact
            </h2>
            <p>
              For data privacy inquiries or requests to delete submitted staging records, contact Chukwudebe Ifeanyi (Administrator) via WhatsApp at +234 906 971 0687.
            </p>
          </section>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => onNavigate('terms')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
          >
            <span>View Terms of Service &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
