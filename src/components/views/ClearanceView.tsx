import React, { useState } from 'react';
import { PageView } from '../../types';
import { Breadcrumbs } from '../Breadcrumbs';
import { PaymentDetailsCard } from '../PaymentDetailsCard';
import { REFERENCE_IMAGES } from '../../constants/imageUrls';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../utils/whatsapp';
import { recordSubmission } from '../../services/submissionService';
import {
  FileCheck,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';

interface ClearanceViewProps {
  onNavigate: (view: PageView) => void;
}

export const ClearanceView: React.FC<ClearanceViewProps> = ({ onNavigate }) => {
  // 14 official UNIDEL clearance requirements
  const clearanceRequirements = [
    { id: 1, title: 'Payment of Acceptance Fee', desc: 'Official university acceptance fee payment receipt or evidence of portal confirmation.' },
    { id: 2, title: 'Birth Certificate', desc: 'National Population Commission (NPC) birth certificate or valid declaration of age.' },
    { id: 3, title: 'Acceptance Letter', desc: 'Formatted formal acceptance letter adhering to UNIDEL faculty specifications.' },
    { id: 4, title: 'Grantor / Sponsor Letter', desc: 'Written letter of sponsorship or financial commitment from parent/guardian.' },
    { id: 5, title: 'Reference Letter for Pastor / Civil Servant', desc: 'Official character testimonial from a recognized clergy or Level 08+ civil servant.' },
    { id: 6, title: 'LGA Identification', desc: 'Local Government Area identification letter of origin stamped and attested.' },
    { id: 7, title: 'First Sitting Result', desc: 'WAEC, NECO, or NABTEB original or verified printout with valid scratch card.' },
    { id: 8, title: 'Second Sitting Result', desc: 'Applicable for combined sittings; if using single sitting, this is not required.' },
    { id: 9, title: 'Evidence of Name', desc: 'Required if there is a discrepancy across JAMB, O\'Level, or birth certificates.' },
    { id: 10, title: 'Guarantor / Referee Letter', desc: 'Formal guarantor letter guaranteeing applicant conduct during university study.' },
    { id: 11, title: 'Affidavit of Good Conduct', desc: 'High Court sworn affidavit of non-membership of secret cults and good moral conduct.' },
    { id: 12, title: 'UTME (JAMB) Result', desc: 'Original JAMB UTME score slip showing candidate photograph and scores.' },
    { id: 13, title: 'UTME (JAMB) Admission Letter', desc: 'Official JAMB admission letter downloadable from Central Admission Processing System (CAPS).' },
    { id: 14, title: 'WAEC Serial Number and PIN', desc: 'Valid O\'Level verification scratch card details for online screening verification.' }
  ];

  const [checkedList, setCheckedList] = useState<{ [id: number]: boolean }>({});

  const toggleCheck = (id: number) => {
    setCheckedList(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checkedCount = Object.values(checkedList).filter(Boolean).length;

  const urlUnderstand = getWhatsAppUrl(WHATSAPP_MESSAGES.CLEARANCE_UNDERSTAND);
  const urlNotUnderstand = getWhatsAppUrl(WHATSAPP_MESSAGES.CLEARANCE_NOT_UNDERSTAND);

  const handleUnderstandClick = () => {
    recordSubmission({
      service: 'ONLINE_CLEARANCE_INQUIRY',
      fullName: 'Clearance Candidate',
      phoneNumber: '',
      email: '',
      allFields: {
        choice: 'Understood Clearance Requirements',
        checkedReadyCount: checkedCount,
        totalRequirementsCount: clearanceRequirements.length,
        itemsChecked: Object.keys(checkedList).filter(k => checkedList[Number(k)])
      },
      paymentStatus: 'Pending (₦3,000)',
      processingStatus: 'Understood',
      notes: `Student confirmed understanding of clearance (${checkedCount}/${clearanceRequirements.length} ready)`
    }).catch(err => console.log('Clearance record note:', err));
  };

  const handleNotUnderstandClick = () => {
    recordSubmission({
      service: 'ONLINE_CLEARANCE_INQUIRY',
      fullName: 'Clearance Candidate',
      phoneNumber: '',
      email: '',
      allFields: {
        choice: 'Requires Assistance / Clarification',
        checkedReadyCount: checkedCount,
        totalRequirementsCount: clearanceRequirements.length,
        itemsChecked: Object.keys(checkedList).filter(k => checkedList[Number(k)])
      },
      paymentStatus: 'Pending (₦3,000)',
      processingStatus: 'Needs Help',
      notes: `Student requested clarification on clearance (${checkedCount}/${clearanceRequirements.length} ready)`
    }).catch(err => console.log('Clearance record note:', err));
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Navigation */}
        <div className="space-y-4 mb-8">
          <Breadcrumbs
            items={[
              { label: 'Services', view: 'services' },
              { label: 'Online Clearance' }
            ]}
            onNavigate={onNavigate}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SERVICE 02 &bull; CLEARANCE GUIDANCE</span>
            </div>

            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all services</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
                ONLINE CLEARANCE ASSISTANCE
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mt-1">
                Official guide and document requirements checklist for newly admitted UNIDEL students.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 shrink-0 text-right sm:text-left shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-700 block">
                Assistance Fee
              </span>
              <span className="font-mono text-2xl font-black text-orange-600">
                ₦3,000
              </span>
            </div>
          </div>
        </div>

        {/* Featured Showcase Section with Supplied Online Clearance Image */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Supplied Online Clearance Image */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm relative group">
                <img
                  src={REFERENCE_IMAGES.ONLINE_CLEARANCE}
                  alt="Online Clearance Guidance Reference"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-72 object-contain bg-slate-900/5 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-2 font-medium">
                Official Clearance Guidance Reference
              </span>
            </div>

            {/* Overview text */}
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Information & Verification Guide</span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">
                Prepare Your Official Clearance Documents
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review the 14 mandatory clearance requirements below. You can check off the items you currently possess to monitor your document readiness before proceeding to faculty screening.
              </p>
              <div className="p-3.5 bg-orange-50/50 rounded-2xl border border-orange-200/60 text-xs text-[#0F172A] flex items-center justify-between">
                <span className="font-semibold text-slate-700">Personal Readiness Check:</span>
                <span className="font-bold text-orange-600 font-mono text-sm">
                  {checkedCount} / {clearanceRequirements.length} Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 14 Clearance Requirements List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A] font-display">
              14 Official Clearance Requirements
            </h2>
            <span className="text-xs text-orange-600 font-bold">
              Tap items to check off
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {clearanceRequirements.map((item) => {
              const isChecked = !!checkedList[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-orange-50/60 border-orange-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isChecked ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[11px] font-bold">{item.id}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs sm:text-sm font-bold leading-snug ${
                        isChecked ? 'text-orange-950 line-through opacity-80' : 'text-slate-900'
                      }`}
                    >
                      {item.id}. {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Understanding Section with EXACT TWO OPTIONS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="space-y-4 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F172A]">
                Have you understood the clearance requirements?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Select your option below to continue direct communication with the administrator on WhatsApp with your exact status.
              </p>
            </div>

            {/* Exactly TWO Action Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {/* Option 1: I UNDERSTAND */}
              <a
                id="clearance-understand-btn"
                href={urlUnderstand}
                onClick={handleUnderstandClick}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 text-center group cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I UNDERSTAND</span>
              </a>

              {/* Option 2: I DO NOT UNDERSTAND */}
              <a
                id="clearance-not-understand-btn"
                href={urlNotUnderstand}
                onClick={handleNotUnderstandClick}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all active:scale-95 text-center group cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>I DO NOT UNDERSTAND</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 pt-2">
              Clicking either button opens WhatsApp with a pre-filled message matching your response.
            </p>
          </div>
        </div>

        {/* Optional Payment Details Card */}
        <PaymentDetailsCard amountLabel="₦3,000 Assistance Fee" />
      </div>
    </div>
  );
};
