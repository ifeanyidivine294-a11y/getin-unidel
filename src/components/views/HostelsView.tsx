import React, { useState } from 'react';
import { PageView, HostelFormData, SubmissionResult } from '../../types';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../utils/whatsapp';
import { SuccessModal } from '../SuccessModal';
import { Breadcrumbs } from '../Breadcrumbs';
import { REFERENCE_IMAGES } from '../../constants/imageUrls';
import { recordSubmission } from '../../services/submissionService';
import {
  Home,
  ArrowLeft,
  Send,
  Users,
  MapPin,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface HostelsViewProps {
  onNavigate: (view: PageView) => void;
}

export const HostelsView: React.FC<HostelsViewProps> = ({ onNavigate }) => {
  const campusSites = [
    'Main Campus',
    'Owa-Alero',
    'Owa-Oyibu'
  ];

  const [formData, setFormData] = useState<HostelFormData>({
    fullName: '',
    phoneNumber: '',
    campusSite: campusSites[0],
    budget: '',
    needRoommate: 'Do not need roommate',
    notes: '',
    confirmedAccuracy: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Please enter your phone number';
    if (!formData.campusSite) newErrors.campusSite = 'Please select a campus site';
    if (!formData.budget.trim()) newErrors.budget = 'Please enter your budget';
    if (!formData.needRoommate) newErrors.needRoommate = 'Please select your roommate preference';
    if (!formData.confirmedAccuracy) {
      newErrors.confirmedAccuracy = 'Please confirm that the information provided is accurate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT VALIDATION FLOW: Never save before validation
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
        service: 'STUDENT_HOSTEL_ENQUIRY',
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: '',
        allFields: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          campusSite: formData.campusSite,
          budget: formData.budget,
          roommatePreference: formData.needRoommate,
          additionalNotes: formData.notes || 'None'
        },
        paymentStatus: 'Not Applicable (Enquiry)',
        processingStatus: 'Submitted',
        notes: `Site: ${formData.campusSite} | Budget: ${formData.budget} | Roommate: ${formData.needRoommate}`
      });

      const whatsappMessage = WHATSAPP_MESSAGES.formatHostelMessage({
        fullName: formData.fullName,
        phone: formData.phoneNumber,
        campusSite: formData.campusSite,
        budget: formData.budget,
        needRoommate: formData.needRoommate,
        notes: formData.notes
      });

      const submissionResult: SubmissionResult = {
        submissionId: record.submissionId,
        serviceType: 'STUDENT_HOSTEL_ENQUIRY',
        serviceName: 'Student Hostel Assistance',
        fullName: formData.fullName,
        timestamp: `${record.date} ${record.time}`,
        whatsappUrl: getWhatsAppUrl(whatsappMessage),
        detailsSummary: [
          `Campus Site: ${formData.campusSite}`,
          `Budget: ${formData.budget}`,
          `Roommate Preference: ${formData.needRoommate}`,
          `Phone: ${formData.phoneNumber}`
        ]
      };

      setSubmission(submissionResult);
    } catch (err) {
      console.error('Hostel submission error:', err);
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
              { label: 'Student Hostels' }
            ]}
            onNavigate={onNavigate}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
              <Home className="w-3.5 h-3.5 text-orange-600" />
              <span>SERVICE 05 &bull; ACCOMMODATION &amp; HOUSING</span>
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
                  VETTED UNIDEL ACCOMMODATION
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  Student Hostels &amp; Lodges
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Verified off-campus hostels across UNIDEL sites (Main Campus, Owa-Alero, Owa-Oyibu) with reliable water, electricity, security, and roommate matching.
                </p>
              </div>

              {/* Moderate Size Image (Around 40-50% scale) */}
              <div className="md:col-span-4 flex justify-center md:justify-end">
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-slate-900">
                  <img
                    src={REFERENCE_IMAGES.HOSTEL}
                    alt="Student Hostels in Agbor"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" noValidate>
            <div className="border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-bold text-[#0F172A] font-display">
                Hostel Request Details
              </h2>
              <p className="text-xs text-slate-500">
                Specify your campus location, budget, and roommate preferences to discuss available hostels on WhatsApp.
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
                  placeholder="e.g. Victor Osaze"
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
                  Phone Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="e.g. 08012345678"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    errors.phoneNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Campus Site */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Campus Site <span className="text-red-500">*</span>
                </label>
                <select
                  name="campusSite"
                  value={formData.campusSite}
                  onChange={(e) => setFormData({ ...formData, campusSite: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                >
                  {campusSites.map((site) => (
                    <option key={site} value={site}>
                      {site}
                    </option>
                  ))}
                </select>
                {errors.campusSite && <p className="text-xs text-red-600 mt-1">{errors.campusSite}</p>}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="budget"
                  placeholder="e.g. ₦150,000 - ₦250,000 per session"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    errors.budget ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  }`}
                />
                {errors.budget && <p className="text-xs text-red-600 mt-1">{errors.budget}</p>}
              </div>

              {/* Roommate Preference */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Roommate Preference <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, needRoommate: 'Need roommate' })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer flex items-center gap-3 transition-all ${
                      formData.needRoommate === 'Need roommate'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.needRoommate === 'Need roommate'
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {formData.needRoommate === 'Need roommate' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">Need roommate</span>
                      <span className="text-[11px] text-slate-500 font-normal">Pair with another UNIDEL student to split rent</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, needRoommate: 'Do not need roommate' })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer flex items-center gap-3 transition-all ${
                      formData.needRoommate === 'Do not need roommate'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.needRoommate === 'Do not need roommate'
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {formData.needRoommate === 'Do not need roommate' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">Do not need roommate</span>
                      <span className="text-[11px] text-slate-500 font-normal">Self-contained / single occupant</span>
                    </div>
                  </button>
                </div>
                {errors.needRoommate && <p className="text-xs text-red-600 mt-1">{errors.needRoommate}</p>}
              </div>

              {/* Additional Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Additional Notes / Preferences <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  name="notes"
                  placeholder="e.g. Prefer fenced compound with running water and solar power"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

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
                  I confirm that I am looking for accommodation in the specified campus site and agree to be contacted on WhatsApp.
                </span>
              </label>
              {errors.confirmedAccuracy && (
                <p className="text-xs text-red-600 mt-1.5">{errors.confirmedAccuracy}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Submit your enquiry to discuss available verified lodges directly on WhatsApp.
              </p>

              <button
                id="submit-hostel-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>RECORDING ENQUIRY...</span>
                ) : (
                  <>
                    <span>SUBMIT &amp; DISCUSS ON WHATSAPP</span>
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
          buttonLabel="DISCUSS AVAILABLE HOSTELS ON WHATSAPP"
          onClose={() => setSubmission(null)}
          onNavigateHome={() => onNavigate('services')}
        />
      )}
    </div>
  );
};
