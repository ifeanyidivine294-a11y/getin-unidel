import React from 'react';
import { PageView } from '../../types';
import { Breadcrumbs } from '../Breadcrumbs';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface TermsViewProps {
  onNavigate: (view: PageView) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="space-y-3">
          <Breadcrumbs
            items={[{ label: 'Terms of Service' }]}
            onNavigate={onNavigate}
          />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
            <span>TERMS & CONDITIONS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-600">
            General Terms for Easy Getin — UNIDEL Student Assistance Platform &bull; Session 2025/2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              1. Nature of the Service
            </h2>
            <p>
              Easy Getin is a centralized private assistance and online processing platform designed to assist University of Delta (UNIDEL) prospective and admitted students. Easy Getin provides administrative guidance, document preparation, affidavit formatting, and accommodation enquiry facilitation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              2. Independent Entity Status
            </h2>
            <p>
              Easy Getin operates as an independent student support service and is not an official branch of the University of Delta unless explicitly stated otherwise. Official school fees, acceptance fees, and statutory university dues must be settled directly through authorized UNIDEL portals and designated bank partners. Fees charged by Easy Getin are for secretarial, consultation, liaison, and processing services only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              3. Student Responsibility & Accuracy
            </h2>
            <p>
              Students are strictly responsible for providing truthful, current, and authentic credentials. Submitting falsified certificates, invalid examination pins, or fraudulent identity data is strictly forbidden and disclaims Easy Getin from any liability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              4. Payment & Refund Policy
            </h2>
            <p>
              Payments made to Easy Getin for administrative services (such as ₦1,000 for letter formatting or ₦3,000 for clearance assistance) cover clerical drafting time and consultation. Once work has commenced or documents have been transmitted, payments are non-refundable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              5. Dispute Resolution & Contact
            </h2>
            <p>
              For questions regarding these terms, students may reach administrator Chukwudebe Ifeanyi directly on WhatsApp at +234 906 971 0687.
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
            onClick={() => onNavigate('privacy')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
          >
            <span>View Privacy Policy &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
