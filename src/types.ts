export type ServiceId = 'registration' | 'clearance' | 'letters' | 'affidavit' | 'hostels';

export type PageView = 
  | 'home'
  | 'services'
  | 'registration'
  | 'clearance'
  | 'letters'
  | 'affidavit'
  | 'hostels'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'how-it-works';

export interface ServiceItem {
  id: ServiceId;
  number: string;
  title: string;
  shortDesc: string;
  badge?: string;
  fee?: string;
  ctaText: string;
  iconName: string;
}

export interface OnlineRegistrationFormData {
  jambRegNumber?: string;
  email: string;
  surname: string;
  firstName: string;
  middleName: string;
  phoneNumber: string;
  dateOfBirth: string;
  permanentAddress: string;
  nextOfKin: string;
  nextOfKinAddress: string;
  nextOfKinPhone: string;
  firstChoice: string;
  secondChoice: string;
  // Examination result choices
  hasWaec: boolean;
  waecNumber?: string;
  waecName?: string;
  waecResultPhoto?: string;
  hasNeco: boolean;
  necoNumber?: string;
  necoName?: string;
  necoResultPhoto?: string;
  confirmedAccuracy: boolean;
}

export type LetterType = 'acceptance' | 'sponsor' | 'clergy' | 'civil_servant';

export interface AcceptanceLetterFields {
  fullName: string;
  personalHomeAddress: string;
  state: string;
  course: string;
  department: string;
  faculty: string;
  email: string;
  phoneNumber: string;
}

export interface SponsorLetterFields {
  studentName: string;
  sponsorName: string;
  sponsorHomeAddress: string;
  state: string;
  relationship: string;
  sponsorPhone: string;
  department: string;
  studentPhone: string;
}

export interface ClergyLetterFields {
  studentName: string;
  churchName: string;
  pastorName: string;
  churchAddress: string;
  clergyTitle: string;
  department: string;
  phoneNumber: string;
}

export interface CivilServantLetterFields {
  studentName: string;
  civilServantName: string;
  ministryWhereWorks: string;
  position: string;
  workplaceAddress: string;
  department: string;
  phoneNumber: string;
}

export interface AffidavitFormData {
  fullName: string;
  department: string;
  faculty: string;
  nativeTown: string;
  homeAddress: string;
  phone: string;
  email?: string;
  confirmedAccuracy: boolean;
}

export interface HostelFormData {
  fullName: string;
  phoneNumber: string;
  campusSite: 'Main Campus' | 'Owa-Alero' | 'Owa-Oyibu' | string;
  budget: string;
  needRoommate: 'Need roommate' | 'Do not need roommate' | string;
  notes?: string;
  confirmedAccuracy: boolean;
}

export interface SubmissionRecord {
  submissionId: string;
  date: string;
  time: string;
  service: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  allFields: Record<string, any>;
  paymentStatus: string;
  processingStatus: string;
  notes: string;
}

export interface SubmissionResult {
  submissionId: string;
  serviceType: string;
  serviceName: string;
  fullName: string;
  timestamp: string;
  whatsappUrl: string;
  detailsSummary: string[];
}
