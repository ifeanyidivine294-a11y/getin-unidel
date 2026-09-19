import { ServiceItem } from '../types';

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'registration',
    number: '01',
    title: 'Online Registration',
    shortDesc: 'Get assistance with providing the information required for your registration process.',
    badge: 'Form Assistance',
    ctaText: 'START REGISTRATION',
    iconName: 'UserCheck'
  },
  {
    id: 'clearance',
    number: '02',
    title: 'Online Clearance',
    shortDesc: 'See the documents and requirements needed for online clearance and get further assistance.',
    badge: 'Guidance & Checklist',
    fee: '₦3,000',
    ctaText: 'VIEW REQUIREMENTS',
    iconName: 'FileCheck'
  },
  {
    id: 'letters',
    number: '03',
    title: 'Letters',
    shortDesc: 'Request assistance with acceptance, sponsor, clergy or civil servant letters.',
    badge: 'Document Preparation',
    fee: '₦1,000 / letter',
    ctaText: 'REQUEST A LETTER',
    iconName: 'FileText'
  },
  {
    id: 'affidavit',
    number: '04',
    title: 'Affidavit of Good Conduct',
    shortDesc: 'Submit your information and get assistance with your affidavit of good conduct.',
    badge: 'Court Affidavit',
    ctaText: 'START AFFIDAVIT',
    iconName: 'ShieldCheck'
  },
  {
    id: 'hostels',
    number: '05',
    title: 'Student Hostels',
    shortDesc: 'Tell us your accommodation preferences and enquire about available hostel options.',
    badge: 'Off-Campus / Campus',
    ctaText: 'FIND A HOSTEL',
    iconName: 'Home'
  }
];

export const UNIDEL_CAMPUS_SITES = [
  'Site I — Main Campus (Abraka Road, Agbor)',
  'Site II — Emuhu Campus',
  'Site III — Old Technical College Road',
  'College of Health Sciences Campus'
];

export const PAYMENT_DETAILS = {
  accountName: 'Easy Getin Student Services',
  bankName: 'Moniepoint MFB / OPay (Verified)',
  accountNumber: 'Available on WhatsApp / Checkout Invoice',
  note: 'After making payment, please send your payment screenshot to our WhatsApp DM for instant confirmation.'
};
