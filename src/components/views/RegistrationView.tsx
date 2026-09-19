import React, { useState, useRef } from 'react';
import { PageView, OnlineRegistrationFormData, SubmissionResult } from '../../types';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../utils/whatsapp';
import { SuccessModal } from '../SuccessModal';
import { Breadcrumbs } from '../Breadcrumbs';
import { PaymentDetailsCard } from '../PaymentDetailsCard';
import { REFERENCE_IMAGES } from '../../constants/imageUrls';
import { recordSubmission } from '../../services/submissionService';
import {
  UserCheck,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Send,
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
  X,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface RegistrationViewProps {
  onNavigate: (view: PageView) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<OnlineRegistrationFormData>({
    email: '',
    surname: '',
    firstName: '',
    middleName: '',
    phoneNumber: '',
    dateOfBirth: '',
    permanentAddress: '',
    nextOfKin: '',
    nextOfKinAddress: '',
    nextOfKinPhone: '',
    firstChoice: '',
    secondChoice: '',
    hasWaec: false,
    waecNumber: '',
    waecName: '',
    waecResultPhoto: '',
    hasNeco: false,
    necoNumber: '',
    necoName: '',
    necoResultPhoto: '',
    confirmedAccuracy: false,
  });

  const [waecFileName, setWaecFileName] = useState('');
  const [necoFileName, setNecoFileName] = useState('');

  const waecFileInputRef = useRef<HTMLInputElement>(null);
  const necoFileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  const handleWaecFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setWaecFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, waecResultPhoto: result }));
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.waecResultPhoto;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNecoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNecoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData(prev => ({ ...prev, necoResultPhoto: result }));
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.necoResultPhoto;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.surname.trim()) {
      newErrors.surname = 'Please enter your surname';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Please enter your first name';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Please select your date of birth';
    }
    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'Please enter your permanent address';
    }
    if (!formData.nextOfKin.trim()) {
      newErrors.nextOfKin = 'Please enter next of kin name';
    }
    if (!formData.nextOfKinAddress.trim()) {
      newErrors.nextOfKinAddress = 'Please enter next of kin address';
    }
    if (!formData.nextOfKinPhone.trim()) {
      newErrors.nextOfKinPhone = 'Please enter next of kin phone number';
    }
    if (!formData.firstChoice.trim()) {
      newErrors.firstChoice = 'Please enter your first choice course';
    }
    if (!formData.secondChoice.trim()) {
      newErrors.secondChoice = 'Please enter your second choice course';
    }

    // WAEC / NECO Rule: MUST provide at least one
    if (!formData.hasWaec && !formData.hasNeco) {
      newErrors.examChoice = 'You must select at least one examination result (WAEC, NECO, or both)';
    }

    // If WAEC is selected, all 3 fields required
    if (formData.hasWaec) {
      if (!formData.waecNumber?.trim()) {
        newErrors.waecNumber = 'Please enter your WAEC examination number';
      }
      if (!formData.waecName?.trim()) {
        newErrors.waecName = 'Please enter the candidate name on your WAEC certificate';
      }
      if (!formData.waecResultPhoto) {
        newErrors.waecResultPhoto = 'Please upload or take a clear photo of your WAEC result';
      }
    }

    // If NECO is selected, all 3 fields required
    if (formData.hasNeco) {
      if (!formData.necoNumber?.trim()) {
        newErrors.necoNumber = 'Please enter your NECO examination number';
      }
      if (!formData.necoName?.trim()) {
        newErrors.necoName = 'Please enter the candidate name on your NECO certificate';
      }
      if (!formData.necoResultPhoto) {
        newErrors.necoResultPhoto = 'Please upload or take a clear photo of your NECO result';
      }
    }

    if (!formData.confirmedAccuracy) {
      newErrors.confirmedAccuracy = 'Please confirm that the information provided is accurate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT VALIDATION FLOW: Never save to Google Sheets before validation
    if (!validate()) {
      const firstError = Object.keys(errors)[0] || 'email';
      const element = document.getElementsByName(firstError)[0] || document.getElementById('exam-rule-anchor');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    const fullName = `${formData.surname} ${formData.firstName} ${formData.middleName || ''}`.trim();

    try {
      // ONLY IF EVERYTHING IS VALID: Save the final submission to Google Sheets
      const record = await recordSubmission({
        service: 'ONLINE_REGISTRATION',
        fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        allFields: {
          emailAddress: formData.email,
          surname: formData.surname,
          firstName: formData.firstName,
          middleName: formData.middleName || 'N/A',
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          permanentAddress: formData.permanentAddress,
          nextOfKin: formData.nextOfKin,
          nextOfKinAddress: formData.nextOfKinAddress,
          nextOfKinPhoneNumber: formData.nextOfKinPhone,
          firstChoice: formData.firstChoice,
          secondChoice: formData.secondChoice,
          hasWaec: formData.hasWaec ? 'Yes' : 'No',
          waecNumber: formData.hasWaec ? (formData.waecNumber || 'N/A') : 'Not Selected',
          waecName: formData.hasWaec ? (formData.waecName || 'N/A') : 'Not Selected',
          waecPhotoUploaded: formData.hasWaec && formData.waecResultPhoto ? 'Uploaded & Verified' : 'No',
          hasNeco: formData.hasNeco ? 'Yes' : 'No',
          necoNumber: formData.hasNeco ? (formData.necoNumber || 'N/A') : 'Not Selected',
          necoName: formData.hasNeco ? (formData.necoName || 'N/A') : 'Not Selected',
          necoPhotoUploaded: formData.hasNeco && formData.necoResultPhoto ? 'Uploaded & Verified' : 'No'
        },
        paymentStatus: 'Pending Verification',
        processingStatus: 'Submitted',
        notes: `Applicant: ${fullName} | First Choice: ${formData.firstChoice} | Exams: ${formData.hasWaec ? 'WAEC ' : ''}${formData.hasNeco ? 'NECO' : ''}`
      });

      // Format WhatsApp message with actual submitted information
      const whatsappMessage = WHATSAPP_MESSAGES.formatRegistrationMessage({
        email: formData.email,
        surname: formData.surname,
        firstName: formData.firstName,
        middleName: formData.middleName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        permanentAddress: formData.permanentAddress,
        nextOfKin: formData.nextOfKin,
        nextOfKinAddress: formData.nextOfKinAddress,
        nextOfKinPhone: formData.nextOfKinPhone,
        firstChoice: formData.firstChoice,
        secondChoice: formData.secondChoice,
        hasWaec: formData.hasWaec,
        waecNumber: formData.waecNumber,
        waecName: formData.waecName,
        hasWaecPhoto: !!formData.waecResultPhoto,
        hasNeco: formData.hasNeco,
        necoNumber: formData.necoNumber,
        necoName: formData.necoName,
        hasNecoPhoto: !!formData.necoResultPhoto
      });

      const submissionResult: SubmissionResult = {
        submissionId: record.submissionId,
        serviceType: 'ONLINE_REGISTRATION',
        serviceName: 'Online Registration Assistance',
        fullName,
        timestamp: `${record.date} ${record.time}`,
        whatsappUrl: getWhatsAppUrl(whatsappMessage),
        detailsSummary: [
          `Applicant: ${fullName}`,
          `First Choice: ${formData.firstChoice}`,
          `Email: ${formData.email}`,
          `Phone: ${formData.phoneNumber}`,
          `Results: ${formData.hasWaec ? 'WAEC (Uploaded)' : ''} ${formData.hasNeco ? 'NECO (Uploaded)' : ''}`.trim()
        ]
      };

      setSubmission(submissionResult);
    } catch (err) {
      console.error('Registration submission error:', err);
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
              { label: 'Online Registration' }
            ]}
            onNavigate={onNavigate}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
              <UserCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>SERVICE 01 &bull; UNIDEL ADMISSION REGISTRATION</span>
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

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Banner with Moderate Image */}
          <div className="bg-[#0B132B] text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative">
              <div className="md:col-span-8 space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block">
                  OFFICIAL SUBMISSION FORM
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  UNIDEL Online Registration Assistance
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Provide your bio-data, course choices, and at least one O-Level examination result (WAEC or NECO) for submission to our student processing desk.
                </p>
              </div>

              {/* Moderate Size Image (Roughly 40-50% scale, rounded, no distortion) */}
              <div className="md:col-span-4 flex justify-center md:justify-end">
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-slate-900">
                  <img
                    src={REFERENCE_IMAGES.REGISTRATION}
                    alt="UNIDEL Online Registration"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Section 1: Candidate Bio-Data */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2.5">
                <h2 className="text-base font-bold text-[#0F172A] font-display">
                  1. Candidate Bio-Data
                </h2>
                <p className="text-xs text-slate-500">
                  Ensure all information matches your official UNIDEL admission credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surname"
                    required
                    placeholder="e.g. Okafor"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.surname ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.surname && <p className="text-xs text-red-600 mt-1">{errors.surname}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="e.g. Chinonso"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.firstName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Middle Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    placeholder="e.g. Paul"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    placeholder="e.g. 08012345678"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.phoneNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.dateOfBirth ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Permanent Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="permanentAddress"
                    required
                    placeholder="Full residential home address"
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.permanentAddress ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.permanentAddress && (
                    <p className="text-xs text-red-600 mt-1">{errors.permanentAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Next of Kin */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="border-b border-slate-200 pb-2.5">
                <h2 className="text-base font-bold text-[#0F172A] font-display">
                  2. Next of Kin Information
                </h2>
                <p className="text-xs text-slate-500">
                  Required by UNIDEL for admission file indexing and emergency contacts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Next of Kin Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nextOfKin"
                    required
                    placeholder="e.g. Mr. Emmanuel Okafor"
                    value={formData.nextOfKin}
                    onChange={(e) => setFormData({ ...formData, nextOfKin: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.nextOfKin ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.nextOfKin && <p className="text-xs text-red-600 mt-1">{errors.nextOfKin}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Next of Kin Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="nextOfKinPhone"
                    required
                    placeholder="e.g. 08098765432"
                    value={formData.nextOfKinPhone}
                    onChange={(e) => setFormData({ ...formData, nextOfKinPhone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.nextOfKinPhone ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.nextOfKinPhone && (
                    <p className="text-xs text-red-600 mt-1">{errors.nextOfKinPhone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Next of Kin Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="nextOfKinAddress"
                    required
                    placeholder="Next of kin residential address"
                    value={formData.nextOfKinAddress}
                    onChange={(e) => setFormData({ ...formData, nextOfKinAddress: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.nextOfKinAddress ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.nextOfKinAddress && (
                    <p className="text-xs text-red-600 mt-1">{errors.nextOfKinAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Course Choices */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="border-b border-slate-200 pb-2.5">
                <h2 className="text-base font-bold text-[#0F172A] font-display">
                  3. Program & Course Choices
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your applied UNIDEL faculty courses.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    First Choice Course <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstChoice"
                    required
                    placeholder="e.g. Computer Science"
                    value={formData.firstChoice}
                    onChange={(e) => setFormData({ ...formData, firstChoice: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.firstChoice ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.firstChoice && (
                    <p className="text-xs text-red-600 mt-1">{errors.firstChoice}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Second Choice Course <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="secondChoice"
                    required
                    placeholder="e.g. Software Engineering"
                    value={formData.secondChoice}
                    onChange={(e) => setFormData({ ...formData, secondChoice: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      errors.secondChoice ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                    }`}
                  />
                  {errors.secondChoice && (
                    <p className="text-xs text-red-600 mt-1">{errors.secondChoice}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: WAEC / NECO Rule & Photo Upload (VERY IMPORTANT) */}
            <div id="exam-rule-anchor" className="space-y-6 pt-4 border-t border-slate-200">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600 block mb-1">
                  MANDATORY O&apos;LEVEL VERIFICATION
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] font-display">
                  4. Which Examination Result Do You Have?
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  You must provide at least one examination result. You can select <strong>WAEC only</strong>, <strong>NECO only</strong>, or <strong>both WAEC and NECO</strong>.
                </p>
              </div>

              {/* Selection Buttons for WAEC and NECO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, hasWaec: !prev.hasWaec }));
                    setErrors(prev => {
                      const copy = { ...prev };
                      delete copy.examChoice;
                      return copy;
                    });
                  }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    formData.hasWaec
                      ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                        formData.hasWaec
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {formData.hasWaec && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-base text-[#0F172A] block">
                        WAEC
                      </span>
                      <span className="text-xs text-slate-500">
                        West African Examinations Council
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      formData.hasWaec
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {formData.hasWaec ? 'Selected' : 'Select WAEC'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, hasNeco: !prev.hasNeco }));
                    setErrors(prev => {
                      const copy = { ...prev };
                      delete copy.examChoice;
                      return copy;
                    });
                  }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    formData.hasNeco
                      ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                        formData.hasNeco
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {formData.hasNeco && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-base text-[#0F172A] block">
                        NECO
                      </span>
                      <span className="text-xs text-slate-500">
                        National Examinations Council
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      formData.hasNeco
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {formData.hasNeco ? 'Selected' : 'Select NECO'}
                  </span>
                </button>
              </div>

              {errors.examChoice && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.examChoice}</span>
                </div>
              )}

              {/* WAEC Details & Result Photo Upload Section */}
              {formData.hasWaec && (
                <div className="p-5 sm:p-6 rounded-2xl bg-orange-50/40 border border-orange-200 space-y-4 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                    <h3 className="font-display font-extrabold text-sm sm:text-base text-[#0F172A]">
                      WAEC Examination Details & Result Photo
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 uppercase">
                      WAEC Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        WAEC Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="waecNumber"
                        required
                        placeholder="10-digit WAEC Examination No"
                        value={formData.waecNumber || ''}
                        onChange={(e) => setFormData({ ...formData, waecNumber: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.waecNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white'
                        }`}
                      />
                      {errors.waecNumber && (
                        <p className="text-xs text-red-600 mt-1">{errors.waecNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        WAEC Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="waecName"
                        required
                        placeholder="Candidate name exactly as on WAEC result"
                        value={formData.waecName || ''}
                        onChange={(e) => setFormData({ ...formData, waecName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.waecName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white'
                        }`}
                      />
                      {errors.waecName && (
                        <p className="text-xs text-red-600 mt-1">{errors.waecName}</p>
                      )}
                    </div>
                  </div>

                  {/* WAEC Result Photograph Upload */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      UPLOAD WAEC RESULT <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500">
                      Upload or take a clear photo of your WAEC result.
                    </p>

                    <input
                      ref={waecFileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleWaecFileUpload}
                      className="hidden"
                    />

                    {formData.waecResultPhoto ? (
                      <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                          <img
                            src={formData.waecResultPhoto}
                            alt="WAEC Result Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>WAEC Result Photo Uploaded</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-xs">
                            {waecFileName || 'WAEC_Result.jpg'}
                          </p>
                          <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                            <button
                              type="button"
                              onClick={() => waecFileInputRef.current?.click()}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Replace Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, waecResultPhoto: '' }));
                                setWaecFileName('');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => waecFileInputRef.current?.click()}
                        className={`w-full p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-white ${
                          errors.waecResultPhoto
                            ? 'border-red-400 bg-red-50/40'
                            : 'border-orange-300 hover:border-orange-500 hover:bg-orange-50/20'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A] block">
                            Tap to Upload or Take WAEC Result Photo
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Supports camera capture and gallery photo selection (JPG, PNG)
                          </span>
                        </div>
                      </button>
                    )}

                    {errors.waecResultPhoto && (
                      <p className="text-xs text-red-600 mt-1">{errors.waecResultPhoto}</p>
                    )}
                  </div>
                </div>
              )}

              {/* NECO Details & Result Photo Upload Section */}
              {formData.hasNeco && (
                <div className="p-5 sm:p-6 rounded-2xl bg-orange-50/40 border border-orange-200 space-y-4 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                    <h3 className="font-display font-extrabold text-sm sm:text-base text-[#0F172A]">
                      NECO Examination Details & Result Photo
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 uppercase">
                      NECO Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        NECO Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="necoNumber"
                        required
                        placeholder="NECO Registration / Examination No"
                        value={formData.necoNumber || ''}
                        onChange={(e) => setFormData({ ...formData, necoNumber: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.necoNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white'
                        }`}
                      />
                      {errors.necoNumber && (
                        <p className="text-xs text-red-600 mt-1">{errors.necoNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        NECO Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="necoName"
                        required
                        placeholder="Candidate name exactly as on NECO result"
                        value={formData.necoName || ''}
                        onChange={(e) => setFormData({ ...formData, necoName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.necoName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white'
                        }`}
                      />
                      {errors.necoName && (
                        <p className="text-xs text-red-600 mt-1">{errors.necoName}</p>
                      )}
                    </div>
                  </div>

                  {/* NECO Result Photograph Upload */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      UPLOAD NECO RESULT <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500">
                      Upload or take a clear photo of your NECO result.
                    </p>

                    <input
                      ref={necoFileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleNecoFileUpload}
                      className="hidden"
                    />

                    {formData.necoResultPhoto ? (
                      <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                          <img
                            src={formData.necoResultPhoto}
                            alt="NECO Result Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>NECO Result Photo Uploaded</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-xs">
                            {necoFileName || 'NECO_Result.jpg'}
                          </p>
                          <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                            <button
                              type="button"
                              onClick={() => necoFileInputRef.current?.click()}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Replace Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, necoResultPhoto: '' }));
                                setNecoFileName('');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => necoFileInputRef.current?.click()}
                        className={`w-full p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-white ${
                          errors.necoResultPhoto
                            ? 'border-red-400 bg-red-50/40'
                            : 'border-orange-300 hover:border-orange-500 hover:bg-orange-50/20'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A] block">
                            Tap to Upload or Take NECO Result Photo
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Supports camera capture and gallery photo selection (JPG, PNG)
                          </span>
                        </div>
                      </button>
                    )}

                    {errors.necoResultPhoto && (
                      <p className="text-xs text-red-600 mt-1">{errors.necoResultPhoto}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Verified Payment Details Card */}
            <PaymentDetailsCard noteText="Online registration fee verification is confirmed via WhatsApp after submission." />

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
                  I confirm that I have provided accurate information and understand that my submitted O&apos;Level results and bio-data will be used for UNIDEL admission processing.
                </span>
              </label>
              {errors.confirmedAccuracy && (
                <p className="text-xs text-red-600 mt-1.5">{errors.confirmedAccuracy}</p>
              )}
            </div>

            {/* Submit Action Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Validation is strictly enforced before saving. You will receive your official reference ID upon submission.
              </p>

              <button
                id="submit-registration-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>VALIDATING &amp; RECORDING...</span>
                ) : (
                  <>
                    <span>SUBMIT REGISTRATION DETAILS</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {submission && (
        <SuccessModal
          submission={submission}
          buttonLabel="CONTINUE ON WHATSAPP"
          onClose={() => setSubmission(null)}
          onNavigateHome={() => onNavigate('services')}
        />
      )}
    </div>
  );
};
