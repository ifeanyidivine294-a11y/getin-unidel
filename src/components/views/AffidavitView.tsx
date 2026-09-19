import React, { useState } from 'react';
import { PageView, AffidavitFormData, SubmissionResult } from '../../types';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../utils/whatsapp';
import { SuccessModal } from '../SuccessModal';
import { Breadcrumbs } from '../Breadcrumbs';
import { PaymentDetailsCard } from '../PaymentDetailsCard';
import { REFERENCE_IMAGES } from '../../constants/imageUrls';
import { recordSubmission } from '../../services/submissionService';
import {
  ShieldCheck,
  ArrowLeft,
  Send,
  Camera,
  PenTool,
  CheckCircle2,
  FileCheck2,
  Receipt
} from 'lucide-react';

interface AffidavitViewProps {
  onNavigate: (view: PageView) => void;
}

export const AffidavitView: React.FC<AffidavitViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<AffidavitFormData>({
    fullName: '',
    department: '',
    faculty: '',
    nativeTown: '',
    homeAddress: '',
    phone: '',
    email: '',
    confirmedAccuracy: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!formData.department.trim()) newErrors.department = 'Please enter your department';
    if (!formData.faculty.trim()) newErrors.faculty = 'Please enter your faculty';
    if (!formData.nativeTown.trim()) newErrors.nativeTown = 'Please enter your native/home town';
    if (!formData.homeAddress.trim()) newErrors.homeAddress = 'Please enter your home address';
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.confirmedAccuracy) {
      newErrors.confirmedAccuracy = 'Please confirm that the information provided is accurate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT VALIDATION: Never save to Google Sheets before validation
    if (!validate()) {
      const firstError = Object.keys(errors)[0] || 'fullName';
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // ONLY IF EVERYTHING IS VALID: Save the final submission to Google Sheets
      const record = await recordSubmission({
        service: 'AFFIDAVIT_OF_GOOD_CONDUCT',
        fullName: formData.fullName,
        phoneNumber: formData.phone,
        email: formData.email || '',
        allFields: {
          fullName: formData.fullName,
          department: formData.department,
          faculty: formData.faculty,
          nativeTown: formData.nativeTown,
          homeAddress: formData.homeAddress,
          phoneNumber: formData.phone,
          email: formData.email || 'Optional - Not provided',
          fee: '₦7,300'
        },
        paymentStatus: 'Pending Verification',
        processingStatus: 'Submitted',
        notes: `Dept: ${formData.department} | Town: ${formData.nativeTown} | Fee: ₦7,300`
      });

      const whatsappMessage = WHATSAPP_MESSAGES.formatAffidavitMessage({
        fullName: formData.fullName,
        department: formData.department,
        faculty: formData.faculty,
        nativeTown: formData.nativeTown,
        homeAddress: formData.homeAddress,
        phone: formData.phone,
        email: formData.email
      });

      const submissionResult: SubmissionResult = {
        submissionId: record.submissionId,
        serviceType: 'AFFIDAVIT_OF_GOOD_CONDUCT',
        serviceName: 'Affidavit of Good Conduct',
        fullName: formData.fullName,
        timestamp: `${record.date} ${record.time}`,
        whatsappUrl: getWhatsAppUrl(whatsappMessage),
        detailsSummary: [
          `Department: ${formData.department} (${formData.faculty})`,
          `Native Town: ${formData.nativeTown}`,
          `Home Address: ${formData.homeAddress}`,
          ...(formData.email ? [`Email Address: ${formData.email}`] : []),
          `Fee: ₦7,300 (PalmPay - Chukwudebe Ifeanyi - 9069710687)`,
          `Next: Send your passport photograph, signature on white paper, and proof of payment on WhatsApp.`
        ]
      };

      setSubmission(submissionResult);
    } catch (err) {
      console.error('Affidavit submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs */}
        <div className="space-y-4 mb-8">
          <Breadcrumbs
            items={[
              { label: 'Services', view: 'services' },
              { label: 'Affidavit of Good Conduct' }
            ]}
            onNavigate={onNavigate}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>SERVICE 04 &bull; HIGH COURT AFFIDAVIT</span>
            </div>

            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Services</span>
            </button>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Header Banner */}
          <div className="bg-[#0B132B] text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative">
              <div className="md:col-span-8 space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block">
                  HIGH COURT ATTESTATION &bull; ₦7,300
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  Affidavit of Good Conduct
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Official High Court sworn affidavit of good moral conduct and non-membership of secret cults, strictly adhering to UNIDEL clearance standards.
                </p>
              </div>

              {/* Moderate Size Image (Around 40-50% scale, balanced proportions) */}
              <div className="md:col-span-4 flex justify-center md:justify-end">
                <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-slate-900">
                  <img
                    src={REFERENCE_IMAGES.AFFIDAVIT}
                    alt="Affidavit of Good Conduct Sample"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Critical Notice: Fee & Documents Required */}
          <div className="p-6 sm:p-8 bg-orange-50/60 border-b border-orange-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-800 block">
                  AFFIDAVIT PROCESSING FEE
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-[#0F172A] font-display">
                  ₦7,300
                </p>
              </div>
              <div className="text-xs text-orange-900 bg-orange-100/80 border border-orange-300/60 px-4 py-2 rounded-xl">
                The fee for the Affidavit of Good Conduct is <strong>₦7,300</strong>. Please make payment to the account details below and send your proof of payment on WhatsApp.
              </div>
            </div>

            {/* 3 Required Items After Form Submission */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-200 shadow-sm space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F172A] block font-display">
                You will need to send on WhatsApp after submitting this form:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Camera className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 block">1. Passport Photograph</strong>
                    <span className="text-slate-500">Clear red or white background</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <PenTool className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 block">2. Signature on White Paper</strong>
                    <span className="text-slate-500">Clear photo of signature</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Receipt className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 block">3. Proof of Payment</strong>
                    <span className="text-slate-500">Transfer receipt of ₦7,300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" noValidate>
            <div className="border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-[#0F172A] font-display">
                Affidavit Application Details
              </h2>
              <p className="text-xs text-slate-500">
                Provide your legal biodata and faculty details. (NIN is NOT required).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Chukwuma Daniel Okonjo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. 08012345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    errors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Political Science"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    errors.department ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Faculty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="faculty"
                  placeholder="e.g. Social Sciences"
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    errors.faculty ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.faculty && <p className="text-xs text-red-600 mt-1">{errors.faculty}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Native Town / LGA <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nativeTown"
                  placeholder="e.g. Agbor, Ika South LGA"
                  value={formData.nativeTown}
                  onChange={(e) => setFormData({ ...formData, nativeTown: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    errors.nativeTown ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.nativeTown && <p className="text-xs text-red-600 mt-1">{errors.nativeTown}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="student@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Home Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  name="homeAddress"
                  placeholder="Permanent residential address"
                  value={formData.homeAddress}
                  onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    errors.homeAddress ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.homeAddress && <p className="text-xs text-red-600 mt-1">{errors.homeAddress}</p>}
              </div>
            </div>

            {/* Centralized Payment Details Card */}
            <PaymentDetailsCard
              servicePrice="₦7,300"
              noteText="Affidavit fee is ₦7,300. Make transfer to PalmPay, Chukwudebe Ifeanyi (9069710687), and send receipt on WhatsApp."
            />

            {/* Mandatory Confirmation Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="confirmedAccuracy"
                  required
                  checked={formData.confirmedAccuracy}
                  onChange={(e) => setFormData({ ...formData, confirmedAccuracy: e.target.checked })}
                  className="mt-1 w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-400"
                />
                <span className="text-xs sm:text-sm text-slate-700 leading-normal">
                  I confirm that I have provided accurate biodata and understand that this information will be sworn at the High Court for my UNIDEL clearance file.
                </span>
              </label>
              {errors.confirmedAccuracy && (
                <p className="text-xs text-red-600 mt-1.5">{errors.confirmedAccuracy}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Validation is enforced before recording. You will continue to WhatsApp to send your photo, signature, and payment receipt.
              </p>

              <button
                id="submit-affidavit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>VALIDATING &amp; RECORDING...</span>
                ) : (
                  <>
                    <span>SUBMIT AFFIDAVIT REQUEST</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {submission && (
        <SuccessModal
          submission={submission}
          buttonLabel="SEND DOCUMENTS &amp; RECEIPT ON WHATSAPP"
          onClose={() => setSubmission(null)}
          onNavigateHome={() => onNavigate('services')}
        />
      )}
    </div>
  );
};
