import React, { useState } from 'react';
import {
  PageView,
  LetterType,
  AcceptanceLetterFields,
  SponsorLetterFields,
  ClergyLetterFields,
  CivilServantLetterFields,
  SubmissionResult
} from '../../types';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../utils/whatsapp';
import { SuccessModal } from '../SuccessModal';
import { Breadcrumbs } from '../Breadcrumbs';
import { PaymentDetailsCard } from '../PaymentDetailsCard';
import { REFERENCE_IMAGES } from '../../constants/imageUrls';
import { recordSubmission } from '../../services/submissionService';
import {
  FileText,
  UserCheck,
  Church,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Home,
  Building
} from 'lucide-react';

interface LettersViewProps {
  onNavigate: (view: PageView) => void;
}

export const LettersView: React.FC<LettersViewProps> = ({ onNavigate }) => {
  // Step 1 vs Step 2: selectedLetter is null (Step 1: choose letter) or a LetterType (Step 2: fill form)
  const [selectedLetter, setSelectedLetter] = useState<LetterType | null>(null);

  // Forms state for each letter
  const [acceptanceForm, setAcceptanceForm] = useState<AcceptanceLetterFields>({
    fullName: '',
    personalHomeAddress: '',
    state: '',
    course: '',
    department: '',
    faculty: '',
    email: '',
    phoneNumber: ''
  });

  const [sponsorForm, setSponsorForm] = useState<SponsorLetterFields>({
    studentName: '',
    sponsorName: '',
    sponsorHomeAddress: '',
    state: '',
    relationship: '',
    sponsorPhone: '',
    department: '',
    studentPhone: ''
  });

  const [clergyForm, setClergyForm] = useState<ClergyLetterFields>({
    studentName: '',
    churchName: '',
    pastorName: '',
    churchAddress: '',
    clergyTitle: '',
    department: '',
    phoneNumber: ''
  });

  const [civilServantForm, setCivilServantForm] = useState<CivilServantLetterFields>({
    studentName: '',
    civilServantName: '',
    ministryWhereWorks: '',
    position: '',
    workplaceAddress: '',
    department: '',
    phoneNumber: ''
  });

  const [confirmedAccuracy, setConfirmedAccuracy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);

  // The 4 available letter definitions
  const letterCards = [
    {
      id: 'acceptance' as LetterType,
      title: 'Acceptance Letter',
      price: '₦1,000',
      description: 'Official admission acceptance letter format for your UNIDEL faculty and departmental file.',
      badge: 'Faculty Requirement',
      icon: FileText
    },
    {
      id: 'sponsor' as LetterType,
      title: 'Sponsor Letter',
      price: '₦1,000',
      description: 'Financial & moral undertaking issued by your parent, guardian or financial sponsor.',
      badge: 'Guarantor Undertaking',
      icon: UserCheck
    },
    {
      id: 'clergy' as LetterType,
      title: 'Clergy Letter',
      price: '₦1,000',
      description: 'Moral conduct and character testimonial issued by your church pastor, priest, or mosque imam.',
      badge: 'Moral Attestation',
      icon: Church
    },
    {
      id: 'civil_servant' as LetterType,
      title: 'Civil Servant Letter',
      price: '₦1,000',
      description: 'Official character testimonial issued by an active civil servant in a ministry or government body.',
      badge: 'Public Officer Attestation',
      icon: Briefcase
    }
  ];

  const handleSelectLetter = (id: LetterType) => {
    setSelectedLetter(id);
    setErrors({});
    setConfirmedAccuracy(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStep1 = () => {
    setSelectedLetter(null);
    setErrors({});
    setConfirmedAccuracy(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (selectedLetter === 'acceptance') {
      if (!acceptanceForm.fullName.trim()) errs.fullName = 'Full Name is required';
      if (!acceptanceForm.personalHomeAddress.trim()) errs.personalHomeAddress = 'Personal Home Address is required';
      if (!acceptanceForm.state.trim()) errs.state = 'State is required';
      if (!acceptanceForm.course.trim()) errs.course = 'Course is required';
      if (!acceptanceForm.department.trim()) errs.department = 'Department is required';
      if (!acceptanceForm.faculty.trim()) errs.faculty = 'Faculty is required';
      if (!acceptanceForm.email.trim()) {
        errs.email = 'Email Address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(acceptanceForm.email.trim())) {
        errs.email = 'Please enter a valid email address';
      }
      if (!acceptanceForm.phoneNumber.trim()) errs.phoneNumber = 'Phone Number is required';
    } else if (selectedLetter === 'sponsor') {
      if (!sponsorForm.studentName.trim()) errs.studentName = 'Student Name is required';
      if (!sponsorForm.sponsorName.trim()) errs.sponsorName = 'Name of Sponsor/Grantor is required';
      if (!sponsorForm.sponsorHomeAddress.trim()) errs.sponsorHomeAddress = 'Sponsor/Grantor Home Address is required';
      if (!sponsorForm.state.trim()) errs.state = 'State is required';
      if (!sponsorForm.relationship.trim()) errs.relationship = 'Who is he/she to you (Relationship) is required';
      if (!sponsorForm.sponsorPhone.trim()) errs.sponsorPhone = 'Sponsor Phone Number is required';
      if (!sponsorForm.department.trim()) errs.department = 'Department is required';
      if (!sponsorForm.studentPhone.trim()) errs.studentPhone = 'Student Phone Number is required';
    } else if (selectedLetter === 'clergy') {
      if (!clergyForm.studentName.trim()) errs.studentName = 'Student Name is required';
      if (!clergyForm.churchName.trim()) errs.churchName = 'Name of Church is required';
      if (!clergyForm.pastorName.trim()) errs.pastorName = 'Name of Pastor is required';
      if (!clergyForm.churchAddress.trim()) errs.churchAddress = 'Church Address is required';
      if (!clergyForm.clergyTitle.trim()) errs.clergyTitle = 'Title of Clergy Man is required';
      if (!clergyForm.department.trim()) errs.department = 'Department is required';
      if (!clergyForm.phoneNumber.trim()) errs.phoneNumber = 'Phone Number is required';
    } else if (selectedLetter === 'civil_servant') {
      if (!civilServantForm.studentName.trim()) errs.studentName = 'Student Name is required';
      if (!civilServantForm.civilServantName.trim()) errs.civilServantName = 'Full Name of Civil Servant is required';
      if (!civilServantForm.ministryWhereWorks.trim()) errs.ministryWhereWorks = 'Ministry Where He/She Works is required';
      if (!civilServantForm.position.trim()) errs.position = 'Position / Grade Level is required';
      if (!civilServantForm.workplaceAddress.trim()) errs.workplaceAddress = 'Workplace Address is required';
      if (!civilServantForm.department.trim()) errs.department = 'Department is required';
      if (!civilServantForm.phoneNumber.trim()) errs.phoneNumber = 'Phone Number is required';
    }

    if (!confirmedAccuracy) {
      errs.confirmedAccuracy = 'Please confirm that the information provided is accurate';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLetter) return;

    // STRICT VALIDATION FLOW: Never save before validation
    if (!validate()) {
      const firstKey = Object.keys(errors)[0];
      const element = document.getElementsByName(firstKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      let letterName = '';
      let applicantName = '';
      let applicantPhone = '';
      let fieldsCaptured: Record<string, any> = {};
      let whatsappMessage = '';
      let detailsSummary: string[] = [];

      if (selectedLetter === 'acceptance') {
        letterName = 'Acceptance Letter';
        applicantName = acceptanceForm.fullName.trim();
        applicantPhone = acceptanceForm.phoneNumber.trim();
        fieldsCaptured = {
          letterType: 'Acceptance Letter',
          fee: '₦1,000',
          fullName: acceptanceForm.fullName.trim(),
          personalHomeAddress: acceptanceForm.personalHomeAddress.trim(),
          state: acceptanceForm.state.trim(),
          course: acceptanceForm.course.trim(),
          department: acceptanceForm.department.trim(),
          faculty: acceptanceForm.faculty.trim(),
          email: acceptanceForm.email.trim(),
          phoneNumber: acceptanceForm.phoneNumber.trim()
        };
        whatsappMessage = WHATSAPP_MESSAGES.formatAcceptanceLetterMessage({
          fullName: acceptanceForm.fullName.trim(),
          personalHomeAddress: acceptanceForm.personalHomeAddress.trim(),
          state: acceptanceForm.state.trim(),
          course: acceptanceForm.course.trim(),
          department: acceptanceForm.department.trim(),
          faculty: acceptanceForm.faculty.trim(),
          email: acceptanceForm.email.trim(),
          phoneNumber: acceptanceForm.phoneNumber.trim()
        });
        detailsSummary = [
          `Letter: Acceptance Letter (₦1,000)`,
          `Student: ${acceptanceForm.fullName.trim()}`,
          `Personal Home Address: ${acceptanceForm.personalHomeAddress.trim()}`,
          `State: ${acceptanceForm.state.trim()}`,
          `Course: ${acceptanceForm.course.trim()}`,
          `Department: ${acceptanceForm.department.trim()} (${acceptanceForm.faculty.trim()})`,
          `Email: ${acceptanceForm.email.trim()}`
        ];
      } else if (selectedLetter === 'sponsor') {
        letterName = 'Sponsor Letter';
        applicantName = sponsorForm.studentName.trim();
        applicantPhone = sponsorForm.studentPhone.trim();
        fieldsCaptured = {
          letterType: 'Sponsor Letter',
          fee: '₦1,000',
          studentName: sponsorForm.studentName.trim(),
          sponsorName: sponsorForm.sponsorName.trim(),
          sponsorHomeAddress: sponsorForm.sponsorHomeAddress.trim(),
          state: sponsorForm.state.trim(),
          relationship: sponsorForm.relationship.trim(),
          sponsorPhone: sponsorForm.sponsorPhone.trim(),
          department: sponsorForm.department.trim(),
          studentPhone: sponsorForm.studentPhone.trim()
        };
        whatsappMessage = WHATSAPP_MESSAGES.formatSponsorLetterMessage({
          studentName: sponsorForm.studentName.trim(),
          sponsorName: sponsorForm.sponsorName.trim(),
          sponsorHomeAddress: sponsorForm.sponsorHomeAddress.trim(),
          state: sponsorForm.state.trim(),
          relationship: sponsorForm.relationship.trim(),
          sponsorPhone: sponsorForm.sponsorPhone.trim(),
          department: sponsorForm.department.trim(),
          studentPhone: sponsorForm.studentPhone.trim()
        });
        detailsSummary = [
          `Letter: Sponsor Letter (₦1,000)`,
          `Student: ${sponsorForm.studentName.trim()}`,
          `Sponsor/Grantor: ${sponsorForm.sponsorName.trim()} (${sponsorForm.relationship.trim()})`,
          `Sponsor Home Address: ${sponsorForm.sponsorHomeAddress.trim()}`,
          `State: ${sponsorForm.state.trim()}`,
          `Department: ${sponsorForm.department.trim()}`
        ];
      } else if (selectedLetter === 'clergy') {
        letterName = 'Clergy Letter';
        applicantName = clergyForm.studentName.trim();
        applicantPhone = clergyForm.phoneNumber.trim();
        fieldsCaptured = {
          letterType: 'Clergy Letter',
          fee: '₦1,000',
          studentName: clergyForm.studentName.trim(),
          churchName: clergyForm.churchName.trim(),
          pastorName: clergyForm.pastorName.trim(),
          churchAddress: clergyForm.churchAddress.trim(),
          clergyTitle: clergyForm.clergyTitle.trim(),
          department: clergyForm.department.trim(),
          phoneNumber: clergyForm.phoneNumber.trim()
        };
        whatsappMessage = WHATSAPP_MESSAGES.formatClergyLetterMessage({
          studentName: clergyForm.studentName.trim(),
          churchName: clergyForm.churchName.trim(),
          pastorName: clergyForm.pastorName.trim(),
          churchAddress: clergyForm.churchAddress.trim(),
          clergyTitle: clergyForm.clergyTitle.trim(),
          department: clergyForm.department.trim(),
          phoneNumber: clergyForm.phoneNumber.trim()
        });
        detailsSummary = [
          `Letter: Clergy Letter (₦1,000)`,
          `Student: ${clergyForm.studentName.trim()}`,
          `Church/Mosque: ${clergyForm.churchName.trim()}`,
          `Pastor/Clergy: ${clergyForm.pastorName.trim()} (${clergyForm.clergyTitle.trim()})`,
          `Church Address: ${clergyForm.churchAddress.trim()}`,
          `Department: ${clergyForm.department.trim()}`
        ];
      } else if (selectedLetter === 'civil_servant') {
        letterName = 'Civil Servant Letter';
        applicantName = civilServantForm.studentName.trim();
        applicantPhone = civilServantForm.phoneNumber.trim();
        fieldsCaptured = {
          letterType: 'Civil Servant Letter',
          fee: '₦1,000',
          studentName: civilServantForm.studentName.trim(),
          civilServantName: civilServantForm.civilServantName.trim(),
          ministryWhereWorks: civilServantForm.ministryWhereWorks.trim(),
          position: civilServantForm.position.trim(),
          workplaceAddress: civilServantForm.workplaceAddress.trim(),
          department: civilServantForm.department.trim(),
          phoneNumber: civilServantForm.phoneNumber.trim()
        };
        whatsappMessage = WHATSAPP_MESSAGES.formatCivilServantLetterMessage({
          studentName: civilServantForm.studentName.trim(),
          civilServantName: civilServantForm.civilServantName.trim(),
          ministryWhereWorks: civilServantForm.ministryWhereWorks.trim(),
          position: civilServantForm.position.trim(),
          workplaceAddress: civilServantForm.workplaceAddress.trim(),
          department: civilServantForm.department.trim(),
          phoneNumber: civilServantForm.phoneNumber.trim()
        });
        detailsSummary = [
          `Letter: Civil Servant Letter (₦1,000)`,
          `Student: ${civilServantForm.studentName.trim()}`,
          `Civil Servant: ${civilServantForm.civilServantName.trim()}`,
          `Ministry: ${civilServantForm.ministryWhereWorks.trim()} (${civilServantForm.position.trim()})`,
          `Workplace Address: ${civilServantForm.workplaceAddress.trim()}`,
          `Department: ${civilServantForm.department.trim()}`
        ];
      }

      // ONLY IF EVERYTHING IS VALID: Save the final submission to Google Sheets
      const record = await recordSubmission({
        service: 'LETTER_PROCESSING',
        fullName: applicantName,
        phoneNumber: applicantPhone,
        email: selectedLetter === 'acceptance' ? acceptanceForm.email.trim() : '',
        allFields: fieldsCaptured,
        paymentStatus: 'Pending (₦1,000)',
        processingStatus: 'Submitted',
        notes: `Letter: ${letterName} | Fee: ₦1,000 | Contact: ${applicantPhone}`
      });

      const submissionResult: SubmissionResult = {
        submissionId: record.submissionId,
        serviceType: 'LETTER_PROCESSING',
        serviceName: `${letterName} (₦1,000)`,
        fullName: applicantName,
        timestamp: `${record.date} ${record.time}`,
        whatsappUrl: getWhatsAppUrl(whatsappMessage),
        detailsSummary
      };

      setSubmission(submissionResult);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeLetterCard = letterCards.find((c) => c.id === selectedLetter);

  return (
    <div className="py-10 sm:py-16 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs */}
        <div className="space-y-4 mb-8">
          <Breadcrumbs
            items={[
              { label: 'Services', view: 'services' },
              { label: 'Letters Processing', view: selectedLetter ? 'letters' : undefined },
              ...(selectedLetter && activeLetterCard ? [{ label: activeLetterCard.title }] : [])
            ]}
            onNavigate={(view) => {
              if (selectedLetter && view === 'letters') {
                handleBackToStep1();
              } else {
                onNavigate(view);
              }
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
              <FileText className="w-3.5 h-3.5 text-orange-600" />
              <span>SERVICE 03 &bull; LETTERS PROCESSING &bull; ₦1,000 EACH</span>
            </div>

            <button
              onClick={() => {
                if (selectedLetter) {
                  handleBackToStep1();
                } else {
                  onNavigate('services');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{selectedLetter ? 'Back to Letter Selection' : 'Back to Services'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: SELECT LETTER TYPE (When selectedLetter === null)                  */}
        {/* ========================================================================= */}
        {!selectedLetter && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-[#0B132B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm border border-slate-200">
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative">
                <div className="md:col-span-8 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block">
                    STEP 1 OF 2 &bull; CHOOSE YOUR LETTER
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    UNIDEL Clearance Letters Processing
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                    Select the specific letter you need. Each letter has its own dedicated form and is processed separately at <strong>₦1,000</strong> each.
                  </p>
                </div>

                {/* Moderate Size Image (around 40-50% scale) */}
                <div className="md:col-span-4 flex justify-center md:justify-end">
                  <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-slate-900">
                    <img
                      src={REFERENCE_IMAGES.LETTERS}
                      alt="UNIDEL Letters Processing"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                i
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-950">
                  One-by-One Letter Processing (₦1,000 each)
                </h4>
                <p className="text-xs sm:text-sm text-orange-900 leading-relaxed">
                  Click on the letter you wish to request below. You will fill out only the fields required for that specific letter, validate your details, and proceed directly to WhatsApp.
                </p>
              </div>
            </div>

            {/* 4 Dedicated Letter Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {letterCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectLetter(card.id)}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="font-mono text-base font-extrabold text-orange-600 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                          {card.price}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          {card.badge}
                        </span>
                        <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-orange-600 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
                      <span>Fill {card.title} Form</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: DEDICATED FORM FOR SELECTED LETTER                                */}
        {/* ========================================================================= */}
        {selectedLetter && activeLetterCard && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            {/* Header for the selected form */}
            <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose a different letter</span>
                </button>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] font-display">
                    {activeLetterCard.title}
                  </h2>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                    ₦1,000
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {activeLetterCard.description}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6" noValidate>
              {/* ================================================================ */}
              {/* FORM 1: ACCEPTANCE LETTER FIELDS                                  */}
              {/* ================================================================ */}
              {selectedLetter === 'acceptance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="e.g. Chukwuma Daniel Okonjo"
                        value={acceptanceForm.fullName}
                        onChange={(e) => setAcceptanceForm({ ...acceptanceForm, fullName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* PERSONAL HOME ADDRESS (Multi-line Textarea, REQUIRED) */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          PERSONAL HOME ADDRESS <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-orange-600 font-semibold flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          Student's Residential Address
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        name="personalHomeAddress"
                        placeholder="e.g. No. 14 Old Lagos-Asaba Road, Agbor, Delta State"
                        value={acceptanceForm.personalHomeAddress}
                        onChange={(e) => setAcceptanceForm({ ...acceptanceForm, personalHomeAddress: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.personalHomeAddress ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Please provide your full residential / home address where you reside.
                      </p>
                      {errors.personalHomeAddress && <p className="text-xs text-red-600 mt-1">{errors.personalHomeAddress}</p>}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        State of Origin / Residence <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="e.g. Delta State"
                        value={acceptanceForm.state}
                        onChange={(e) => setAcceptanceForm({ ...acceptanceForm, state: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.state ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
                    </div>

                    {/* Course */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Course of Study <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="course"
                        placeholder="e.g. B.Sc. Computer Science"
                        value={acceptanceForm.course}
                        onChange={(e) => setAcceptanceForm({ ...acceptanceForm, course: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.course ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.course && <p className="text-xs text-red-600 mt-1">{errors.course}</p>}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="department"
                        placeholder="e.g. Computer Science"
                        value={acceptanceForm.department}
                        onChange={(e) => setAcceptanceForm({ ...acceptanceForm, department: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.department ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
                    </div>

                    {/* Faculty */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Faculty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="faculty"
                        placeholder="e.g. Faculty of Science"
                        value={acceptanceForm.faculty}
                        onChange={(e) => setAcceptanceForm({ ...acceptanceForm, faculty: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.faculty ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.faculty && <p className="text-xs text-red-600 mt-1">{errors.faculty}</p>}
                    </div>

                    {/* EMAIL ADDRESS */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        EMAIL ADDRESS <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="student@example.com"
                        value={acceptanceForm.email}
                        onChange={(e) => setAcceptanceForm({ ...acceptanceForm, email: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="e.g. 08012345678"
                        value={acceptanceForm.phoneNumber}
                        onChange={(e) => setAcceptanceForm({ ...acceptanceForm, phoneNumber: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.phoneNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================ */}
              {/* FORM 2: SPONSOR / GRANTOR LETTER FIELDS                           */}
              {/* ================================================================ */}
              {selectedLetter === 'sponsor' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        placeholder="e.g. Chinonso Okafor"
                        value={sponsorForm.studentName}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, studentName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.studentName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.studentName && <p className="text-xs text-red-600 mt-1">{errors.studentName}</p>}
                    </div>

                    {/* Name of Sponsor/Grantor */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Name of Sponsor / Grantor <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="sponsorName"
                        placeholder="e.g. Mr. Anthony Chukwuemeka Okafor"
                        value={sponsorForm.sponsorName}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, sponsorName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.sponsorName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.sponsorName && <p className="text-xs text-red-600 mt-1">{errors.sponsorName}</p>}
                    </div>

                    {/* Who is He/She to You (Relationship) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Who is He/She to You (Relationship) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="relationship"
                        placeholder="e.g. Father / Mother / Uncle / Elder Brother / Guardian"
                        value={sponsorForm.relationship}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, relationship: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.relationship ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.relationship && <p className="text-xs text-red-600 mt-1">{errors.relationship}</p>}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Sponsor State of Origin / Residence <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="e.g. Delta State / Edo State"
                        value={sponsorForm.state}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, state: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.state ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
                    </div>

                    {/* SPONSOR/GRANTOR HOME ADDRESS (Multi-line Textarea, REQUIRED) */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          SPONSOR/GRANTOR HOME ADDRESS <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-orange-600 font-semibold flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          Sponsor's Address (NOT Student's)
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        name="sponsorHomeAddress"
                        placeholder="e.g. Plot 8, GRA Phase 2, Asaba, Delta State"
                        value={sponsorForm.sponsorHomeAddress}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, sponsorHomeAddress: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.sponsorHomeAddress ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Must be the address of the person sponsoring the student, NOT the student's address.
                      </p>
                      {errors.sponsorHomeAddress && <p className="text-xs text-red-600 mt-1">{errors.sponsorHomeAddress}</p>}
                    </div>

                    {/* Sponsor Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Sponsor Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="sponsorPhone"
                        placeholder="e.g. 08031234567"
                        value={sponsorForm.sponsorPhone}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, sponsorPhone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.sponsorPhone ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.sponsorPhone && <p className="text-xs text-red-600 mt-1">{errors.sponsorPhone}</p>}
                    </div>

                    {/* Student Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="studentPhone"
                        placeholder="e.g. 08098765432"
                        value={sponsorForm.studentPhone}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, studentPhone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.studentPhone ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.studentPhone && <p className="text-xs text-red-600 mt-1">{errors.studentPhone}</p>}
                    </div>

                    {/* Department */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="department"
                        placeholder="e.g. Economics"
                        value={sponsorForm.department}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, department: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.department ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================ */}
              {/* FORM 3: CLERGY MAN LETTER FIELDS                                  */}
              {/* ================================================================ */}
              {selectedLetter === 'clergy' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        placeholder="e.g. Chinonso Okafor"
                        value={clergyForm.studentName}
                        onChange={(e) => setClergyForm({ ...clergyForm, studentName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.studentName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.studentName && <p className="text-xs text-red-600 mt-1">{errors.studentName}</p>}
                    </div>

                    {/* Title of Clergy Man */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Title of Clergy Man <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="clergyTitle"
                        placeholder="e.g. Pastor / Rev. Fr. / Imam / Venerable / Bishop"
                        value={clergyForm.clergyTitle}
                        onChange={(e) => setClergyForm({ ...clergyForm, clergyTitle: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.clergyTitle ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.clergyTitle && <p className="text-xs text-red-600 mt-1">{errors.clergyTitle}</p>}
                    </div>

                    {/* Name of Pastor / Clergy */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Name of Pastor / Clergy <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pastorName"
                        placeholder="e.g. Rev. Fr. Patrick Eze"
                        value={clergyForm.pastorName}
                        onChange={(e) => setClergyForm({ ...clergyForm, pastorName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.pastorName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.pastorName && <p className="text-xs text-red-600 mt-1">{errors.pastorName}</p>}
                    </div>

                    {/* Name of Church */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Name of Church <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="churchName"
                        placeholder="e.g. St. John Catholic Parish, Agbor"
                        value={clergyForm.churchName}
                        onChange={(e) => setClergyForm({ ...clergyForm, churchName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.churchName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.churchName && <p className="text-xs text-red-600 mt-1">{errors.churchName}</p>}
                    </div>

                    {/* CHURCH ADDRESS (Multi-line Textarea, REQUIRED) */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          CHURCH ADDRESS <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-orange-600 font-semibold flex items-center gap-1">
                          <Church className="w-3 h-3" />
                          Physical Location of Church
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        name="churchAddress"
                        placeholder="e.g. No. 25 Convent Road, Boji-Boji Owa, Agbor, Delta State"
                        value={clergyForm.churchAddress}
                        onChange={(e) => setClergyForm({ ...clergyForm, churchAddress: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.churchAddress ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Must be the physical street address / location of the church or religious institution.
                      </p>
                      {errors.churchAddress && <p className="text-xs text-red-600 mt-1">{errors.churchAddress}</p>}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="department"
                        placeholder="e.g. Accounting"
                        value={clergyForm.department}
                        onChange={(e) => setClergyForm({ ...clergyForm, department: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.department ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="e.g. 08012345678"
                        value={clergyForm.phoneNumber}
                        onChange={(e) => setClergyForm({ ...clergyForm, phoneNumber: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.phoneNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================ */}
              {/* FORM 4: CIVIL SERVANT LETTER FIELDS                               */}
              {/* ================================================================ */}
              {selectedLetter === 'civil_servant' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        placeholder="e.g. Chinonso Okafor"
                        value={civilServantForm.studentName}
                        onChange={(e) => setCivilServantForm({ ...civilServantForm, studentName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.studentName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.studentName && <p className="text-xs text-red-600 mt-1">{errors.studentName}</p>}
                    </div>

                    {/* Civil Servant Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Full Name of Civil Servant <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="civilServantName"
                        placeholder="e.g. Mrs. Grace Ngozi Okonkwo"
                        value={civilServantForm.civilServantName}
                        onChange={(e) => setCivilServantForm({ ...civilServantForm, civilServantName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.civilServantName ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.civilServantName && <p className="text-xs text-red-600 mt-1">{errors.civilServantName}</p>}
                    </div>

                    {/* Ministry Where He/She Works */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Ministry Where He/She Works <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ministryWhereWorks"
                        placeholder="e.g. Ministry of Basic & Secondary Education, Delta State"
                        value={civilServantForm.ministryWhereWorks}
                        onChange={(e) => setCivilServantForm({ ...civilServantForm, ministryWhereWorks: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.ministryWhereWorks ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.ministryWhereWorks && <p className="text-xs text-red-600 mt-1">{errors.ministryWhereWorks}</p>}
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Position / Grade Level <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        placeholder="e.g. GL 12 / Assistant Chief Admin Officer"
                        value={civilServantForm.position}
                        onChange={(e) => setCivilServantForm({ ...civilServantForm, position: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.position ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.position && <p className="text-xs text-red-600 mt-1">{errors.position}</p>}
                    </div>

                    {/* WORKPLACE ADDRESS (Multi-line Textarea, REQUIRED) */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          WORKPLACE ADDRESS <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-orange-600 font-semibold flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          Office Location of Civil Servant
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        name="workplaceAddress"
                        placeholder="e.g. State Secretariat Complex, Maryam Babangida Way, Asaba, Delta State"
                        value={civilServantForm.workplaceAddress}
                        onChange={(e) => setCivilServantForm({ ...civilServantForm, workplaceAddress: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.workplaceAddress ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Must be the address / office location of where the civil servant works.
                      </p>
                      {errors.workplaceAddress && <p className="text-xs text-red-600 mt-1">{errors.workplaceAddress}</p>}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="department"
                        placeholder="e.g. Political Science"
                        value={civilServantForm.department}
                        onChange={(e) => setCivilServantForm({ ...civilServantForm, department: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.department ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="e.g. 08012345678"
                        value={civilServantForm.phoneNumber}
                        onChange={(e) => setCivilServantForm({ ...civilServantForm, phoneNumber: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                          errors.phoneNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                        }`}
                      />
                      {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Payment Details Card with ₦1,000 fee */}
              <PaymentDetailsCard
                servicePrice="₦1,000"
                noteText={`The processing fee for ${activeLetterCard.title} is ₦1,000. Transfer to PalmPay, Chukwudebe Ifeanyi (9069710687), and send screenshot on WhatsApp.`}
              />

              {/* Mandatory Confirmation Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="confirmedAccuracy"
                    required
                    checked={confirmedAccuracy}
                    onChange={(e) => setConfirmedAccuracy(e.target.checked)}
                    className="mt-1 w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-400"
                  />
                  <span className="text-xs sm:text-sm text-slate-700 leading-normal">
                    I confirm that the information provided is accurate and understand that my submitted details will be used to generate my official {activeLetterCard.title}.
                  </span>
                </label>
                {errors.confirmedAccuracy && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.confirmedAccuracy}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 text-center sm:text-left">
                  Validation is enforced. You will receive your reference ID and continue to WhatsApp to finalize.
                </p>

                <button
                  id="submit-letter-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>VALIDATING &amp; SAVING...</span>
                  ) : (
                    <>
                      <span>SUBMIT {activeLetterCard.title.toUpperCase()} (₦1,000)</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {submission && (
        <SuccessModal
          submission={submission}
          buttonLabel="CONTINUE TO WHATSAPP"
          onClose={() => setSubmission(null)}
          onNavigateHome={() => onNavigate('services')}
        />
      )}
    </div>
  );
};
