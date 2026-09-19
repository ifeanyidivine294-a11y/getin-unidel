import React from 'react';
import { PageView, ServiceId } from '../types';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { REFERENCE_IMAGES } from '../constants/imageUrls';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../utils/whatsapp';

interface QuickServicesProps {
  onSelectService?: (service: ServiceId) => void;
  onNavigate?: (view: PageView) => void;
}

interface ServiceCardItem {
  id: ServiceId;
  title: string;
  tag: string;
  description: string;
  price?: string;
  image: string;
  ctaText: string;
}

export const QuickServices: React.FC<QuickServicesProps> = ({ onSelectService, onNavigate }) => {
  const handleSelect = (service: ServiceId) => {
    if (onSelectService) {
      onSelectService(service);
    } else if (onNavigate) {
      onNavigate(service);
    }
  };

  const services: ServiceCardItem[] = [
    {
      id: 'registration',
      title: 'ONLINE REGISTRATION',
      tag: 'Service 01',
      description: 'Registration assistance for UNIDEL students, JAMB bio-data validation, and O-Level processing.',
      image: REFERENCE_IMAGES.REGISTRATION,
      ctaText: 'GET STARTED →'
    },
    {
      id: 'clearance',
      title: 'ONLINE CLEARANCE',
      tag: 'Service 02',
      description: 'Complete guidance on all 14 official UNIDEL clearance requirements, file preparation, and submission.',
      price: '₦3,000',
      image: REFERENCE_IMAGES.CLEARANCE,
      ctaText: 'START CLEARANCE →'
    },
    {
      id: 'letters',
      title: 'LETTERS',
      tag: 'Service 03',
      description: 'Faculty Acceptance, Sponsor, Clergy, or Civil Servant letters completed one at a time.',
      price: '₦1,000 per letter',
      image: REFERENCE_IMAGES.LETTERS,
      ctaText: 'REQUEST LETTER →'
    },
    {
      id: 'affidavit',
      title: 'AFFIDAVIT OF GOOD CONDUCT',
      tag: 'Service 04',
      description: 'High Court sworn Affidavit of Good Conduct prepared according to UNIDEL faculty guidelines.',
      price: '₦7,300',
      image: REFERENCE_IMAGES.AFFIDAVIT,
      ctaText: 'GET AFFIDAVIT →'
    },
    {
      id: 'hostels',
      title: 'STUDENT HOSTELS',
      tag: 'Service 05',
      description: 'Vetted student accommodation in Agbor, campus site lodges, budget rooms, and roommate pairing.',
      image: REFERENCE_IMAGES.HOSTEL,
      ctaText: 'FIND HOSTELS →'
    }
  ];

  return (
    <section id="services-section" className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full inline-block">
            UNIDEL Student Assistance
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] font-display tracking-tight">
            OUR SERVICES
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Choose any of our verified services designed specifically for UNIDEL students in Agbor.
          </p>
        </div>

        {/* 5 Service Cards Grid: 3 top, 2 centered bottom on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const isLastTwoOnLg = index >= 3;
            return (
              <div
                key={service.id}
                className={`bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-orange-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                  isLastTwoOnLg && index === 3 ? 'lg:col-start-1 lg:translate-x-1/2' : ''
                } ${
                  isLastTwoOnLg && index === 4 ? 'lg:col-start-2 lg:translate-x-1/2' : ''
                }`}
              >
                {/* Moderate Size Image Container */}
                <div className="p-4 pb-0">
                  <div className="w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {service.price && (
                      <div className="absolute top-3 right-3 bg-[#0B132B]/90 backdrop-blur-md text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30 shadow-md">
                        {service.price}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {service.tag}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-orange-600 transition-colors tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    id={`service-card-btn-${service.id}`}
                    onClick={() => handleSelect(service.id)}
                    className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{service.ctaText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Help Banner */}
        <div className="mt-12 bg-[#0B132B] rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base font-display">
                Need Direct Assistance from Easy Getin Admin?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Message Chukwudebe Ifeanyi on WhatsApp for direct guidance with UNIDEL admission and clearance.
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl(WHATSAPP_MESSAGES.GENERAL)}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm active:scale-95 cursor-pointer shrink-0"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
