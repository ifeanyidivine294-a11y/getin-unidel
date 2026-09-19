import React, { useState } from 'react';
import { PageView } from '../../types';
import { WHATSAPP_DISPLAY, WHATSAPP_PHONE, getWhatsAppUrl, WHATSAPP_MESSAGES, WHATSAPP_BASE_URL } from '../../utils/whatsapp';
import { recordSubmission } from '../../services/submissionService';
import { Breadcrumbs } from '../Breadcrumbs';
import { PaymentDetailsCard } from '../PaymentDetailsCard';
import {
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Send,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (view: PageView) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [studentName, setStudentName] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('General Enquiry');
  const [messageText, setMessageText] = useState('');

  const handleSendWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    recordSubmission({
      service: 'GENERAL_CONTACT_INQUIRY',
      fullName: studentName || 'UNIDEL Student',
      phoneNumber: '',
      email: '',
      allFields: {
        inquiryTopic,
        message: messageText
      },
      paymentStatus: 'Not Applicable',
      processingStatus: 'Inquiry Sent',
      notes: `Topic: ${inquiryTopic} | ${messageText.slice(0, 60)}`
    }).catch(err => console.log('Contact inquiry record note:', err));

    const formattedMessage = `Hello Easy Getin,\nMy Name: ${studentName || 'UNIDEL Student'}\nTopic: ${inquiryTopic}\nMessage: ${messageText}`;
    window.open(getWhatsAppUrl(formattedMessage), '_blank');
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <div className="space-y-3">
          <Breadcrumbs
            items={[{ label: 'Contact & Support' }]}
            onNavigate={onNavigate}
          />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200">
            <span>DIRECT STUDENT HELPDESK</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Contact Easy Getin — UNIDEL
          </h1>
          <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
            Have questions about online registration, clearance documents, letter formats, or student hostels? Reach out directly via our verified WhatsApp channel or fast-contact desk.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">
                Official WhatsApp
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct one-on-one administrator channel for document submissions, status checks, and clearance advice.
              </p>
              <div className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin: Chukwudebe Ifeanyi</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-base font-bold text-slate-900 mb-3">
                {WHATSAPP_DISPLAY}
              </div>
              <a
                href={WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Location & Coverage */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">
                Campus Coverage
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                University of Delta (UNIDEL), Agbor, Delta State, Nigeria. Covering Main Campus, College Road, and affiliated residential zones.
              </p>
            </div>
            <div className="text-xs font-medium text-slate-600 pt-2 border-t border-slate-100">
              Agbor, Delta State, Nigeria
            </div>
          </div>

          {/* Service Hours */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">
                Processing Hours
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monday to Saturday: 8:00 AM – 8:00 PM. Admission peak-period priority response for urgent clearance deadlines.
              </p>
            </div>
            <div className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Support Desk Active Today</span>
            </div>
          </div>
        </div>

        {/* Instant Message Composer */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-extrabold text-[#0F172A]">
                Send a Direct Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Type your message below and we will automatically open WhatsApp with your enquiry pre-composed.
              </p>
            </div>

            <form onSubmit={handleSendWhatsAppInquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sandra Eke"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Topic of Enquiry
                  </label>
                  <select
                    value={inquiryTopic}
                    onChange={(e) => setInquiryTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Online Registration">Online Registration</option>
                    <option value="Online Clearance (₦3,000)">Online Clearance (₦3,000)</option>
                    <option value="Letters Processing (₦1,000)">Letters Processing (₦1,000)</option>
                    <option value="Affidavit of Good Conduct">Affidavit of Good Conduct</option>
                    <option value="Student Hostel & Lodging">Student Hostel & Lodging</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask a question or explain what you need assistance with..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Continue on WhatsApp</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Payment Details Reference */}
        <PaymentDetailsCard />
      </div>
    </div>
  );
};
