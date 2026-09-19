import React, { useState } from 'react';
import { SubmissionResult } from '../types';
import { CheckCircle2, MessageSquare, ArrowLeft, Copy, Check, ExternalLink } from 'lucide-react';

interface SuccessModalProps {
  submission: SubmissionResult;
  buttonLabel?: string;
  onClose: () => void;
  onNavigateHome: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  submission,
  buttonLabel = 'CONTINUE ON WHATSAPP',
  onClose,
  onNavigateHome,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submission.submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 via-emerald-500 to-orange-500" />

        <div className="text-center space-y-4">
          {/* Big Checkmark */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>REQUEST SUBMITTED</span>
            </div>
            <h3 className="font-display text-2xl font-extrabold text-[#0F172A] pt-1">
              Your request has been successfully received.
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Student: <strong className="text-slate-900">{submission.fullName}</strong> &bull; Service: <strong className="text-slate-900">{submission.serviceName}</strong>
            </p>
          </div>

          {/* Submission ID Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="uppercase tracking-wider">OFFICIAL SUBMISSION ID</span>
              <span>{submission.timestamp}</span>
            </div>
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-base text-slate-900 font-bold">
              <span>{submission.submissionId}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-sans font-semibold cursor-pointer"
                title="Copy submission ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {submission.detailsSummary && submission.detailsSummary.length > 0 && (
              <div className="pt-2 text-xs text-slate-600 space-y-1 border-t border-slate-200">
                {submission.detailsSummary.map((item, idx) => (
                  <div key={idx} className="truncate font-medium text-slate-700">&bull; {item}</div>
                ))}
              </div>
            )}
          </div>

          {/* Next action guidance */}
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Please continue on WhatsApp to complete the next step.
          </p>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <a
              id="success-continue-whatsapp-btn"
              href={submission.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>{buttonLabel}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              id="success-return-services-btn"
              onClick={onNavigateHome}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO SERVICES</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
