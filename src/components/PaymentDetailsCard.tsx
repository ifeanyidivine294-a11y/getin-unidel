import React, { useState } from 'react';
import { CreditCard, Copy, Check, ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_DISPLAY, WHATSAPP_MESSAGES } from '../utils/whatsapp';

interface PaymentDetailsCardProps {
  amountLabel?: string;
  noteText?: string;
  className?: string;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  amountLabel,
  noteText = 'After payment, send your payment screenshot to us on WhatsApp.',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const bankName = 'PalmPay';
  const accountNumber = '9069710687';
  const accountName = 'Chukwudebe Ifeanyi';

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`bg-[#0B132B] text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Background orange glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-4">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100 block">
                Official Payment Details
              </span>
              <span className="text-[11px] text-orange-400 font-medium">
                Verified PalmPay Account
              </span>
            </div>
          </div>

          {amountLabel && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500 text-slate-950 shadow-sm">
              {amountLabel}
            </span>
          )}
        </div>

        {/* Account Credentials Grid */}
        <div className="bg-slate-900/90 rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Bank Name
              </span>
              <span className="font-semibold text-white text-sm">
                {bankName}
              </span>
            </div>

            <div className="sm:col-span-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Account Name
              </span>
              <span className="font-semibold text-white text-sm">
                {accountName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Account Number
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-orange-400 text-base tracking-wider">
                  {accountNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy Account Number"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 transition-colors cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
            <p className="font-medium text-slate-200">
              <strong className="text-orange-400">Notice:</strong> {noteText}
            </p>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            WhatsApp: <strong className="text-emerald-400">{WHATSAPP_DISPLAY}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
