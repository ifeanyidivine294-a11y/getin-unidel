export const WHATSAPP_PHONE = '2349069710687';
export const WHATSAPP_DISPLAY = '+234 906 971 0687';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_PHONE}`;

/**
 * Builds standard WhatsApp web / mobile click-to-chat URL with encoded message
 */
export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}?text=${encoded}`;
}

export const WHATSAPP_MESSAGES = {
  GENERAL: 'Hello Easy Getin, I have an enquiry regarding UNIDEL student services.',

  // Clearance - exact user requested options
  CLEARANCE_UNDERSTAND: 'Hello Easy Getin, I have read through the Online Clearance requirements and I understand them.',
  CLEARANCE_NOT_UNDERSTAND: 'Hello Easy Getin, I have read through the Online Clearance requirements but I do not understand some parts and I need clarification.',
  CLEARANCE_CLARIFICATION: 'Hello Easy Getin, I have an enquiry regarding UNIDEL clearance and student services.',
  
  // Payment proof
  PAYMENT_PROOF: 'Hello Easy Getin, I am sending my payment screenshot for processing (PalmPay 9069710687 Chukwudebe Ifeanyi).',

  /**
   * Acceptance Letter Dedicated Message
   */
  formatAcceptanceLetterMessage: (data: {
    fullName: string;
    personalHomeAddress: string;
    state: string;
    course: string;
    department: string;
    faculty: string;
    email: string;
    phoneNumber: string;
    submissionId?: string;
  }) => {
    return [
      `*ACCEPTANCE LETTER REQUEST — UNIDEL*`,
      `---------------------------------------`,
      ...(data.submissionId ? [`*Submission ID:* ${data.submissionId}`] : []),
      `*Full Name:* ${data.fullName}`,
      `*Personal Home Address:* ${data.personalHomeAddress}`,
      `*State of Origin / Residence:* ${data.state}`,
      `*Course of Study:* ${data.course}`,
      `*Department:* ${data.department}`,
      `*Faculty:* ${data.faculty}`,
      `*Email Address:* ${data.email}`,
      `*Phone Number:* ${data.phoneNumber}`,
      `*Fee Payable:* ₦1,000`,
      `---------------------------------------`,
      `*PAYMENT DETAILS:*`,
      `Bank: PalmPay | Acct: 9069710687 | Name: Chukwudebe Ifeanyi`,
      `---------------------------------------`,
      `Hello Easy Getin, I have submitted my Acceptance Letter request above. I am ready to send my ₦1,000 payment receipt for processing.`
    ].join('\n');
  },

  /**
   * Sponsor Letter Dedicated Message
   */
  formatSponsorLetterMessage: (data: {
    studentName: string;
    sponsorName: string;
    sponsorHomeAddress: string;
    state: string;
    relationship: string;
    sponsorPhone: string;
    department: string;
    studentPhone: string;
    submissionId?: string;
  }) => {
    return [
      `*SPONSOR LETTER REQUEST — UNIDEL*`,
      `---------------------------------------`,
      ...(data.submissionId ? [`*Submission ID:* ${data.submissionId}`] : []),
      `*Student Name:* ${data.studentName}`,
      `*Name of Sponsor/Grantor:* ${data.sponsorName}`,
      `*Sponsor/Grantor Home Address:* ${data.sponsorHomeAddress}`,
      `*State:* ${data.state}`,
      `*Who is He/She to You (Relationship):* ${data.relationship}`,
      `*Sponsor Phone Number:* ${data.sponsorPhone}`,
      `*Department:* ${data.department}`,
      `*Student Phone Number:* ${data.studentPhone}`,
      `*Fee Payable:* ₦1,000`,
      `---------------------------------------`,
      `*PAYMENT DETAILS:*`,
      `Bank: PalmPay | Acct: 9069710687 | Name: Chukwudebe Ifeanyi`,
      `---------------------------------------`,
      `Hello Easy Getin, I have submitted my Sponsor Letter request above. I am ready to send my ₦1,000 payment receipt for processing.`
    ].join('\n');
  },

  /**
   * Clergy Letter Dedicated Message
   */
  formatClergyLetterMessage: (data: {
    studentName: string;
    churchName: string;
    pastorName: string;
    churchAddress: string;
    clergyTitle: string;
    department: string;
    phoneNumber: string;
    submissionId?: string;
  }) => {
    return [
      `*CLERGY LETTER REQUEST — UNIDEL*`,
      `---------------------------------------`,
      ...(data.submissionId ? [`*Submission ID:* ${data.submissionId}`] : []),
      `*Student Name:* ${data.studentName}`,
      `*Name of Church:* ${data.churchName}`,
      `*Name of Pastor:* ${data.pastorName}`,
      `*Church Address:* ${data.churchAddress}`,
      `*Title of Clergy Man:* ${data.clergyTitle}`,
      `*Department:* ${data.department}`,
      `*Phone Number:* ${data.phoneNumber}`,
      `*Fee Payable:* ₦1,000`,
      `---------------------------------------`,
      `*PAYMENT DETAILS:*`,
      `Bank: PalmPay | Acct: 9069710687 | Name: Chukwudebe Ifeanyi`,
      `---------------------------------------`,
      `Hello Easy Getin, I have submitted my Clergy Letter request above. I am ready to send my ₦1,000 payment receipt for processing.`
    ].join('\n');
  },

  /**
   * Civil Servant Letter Dedicated Message
   */
  formatCivilServantLetterMessage: (data: {
    studentName: string;
    civilServantName: string;
    ministryWhereWorks: string;
    position: string;
    workplaceAddress: string;
    department: string;
    phoneNumber: string;
    submissionId?: string;
  }) => {
    return [
      `*CIVIL SERVANT LETTER REQUEST — UNIDEL*`,
      `---------------------------------------`,
      ...(data.submissionId ? [`*Submission ID:* ${data.submissionId}`] : []),
      `*Student Name:* ${data.studentName}`,
      `*Civil Servant Full Name:* ${data.civilServantName}`,
      `*Ministry Where He/She Works:* ${data.ministryWhereWorks}`,
      `*Position / Grade Level:* ${data.position}`,
      `*Workplace Address:* ${data.workplaceAddress}`,
      `*Department:* ${data.department}`,
      `*Phone Number:* ${data.phoneNumber}`,
      `*Fee Payable:* ₦1,000`,
      `---------------------------------------`,
      `*PAYMENT DETAILS:*`,
      `Bank: PalmPay | Acct: 9069710687 | Name: Chukwudebe Ifeanyi`,
      `---------------------------------------`,
      `Hello Easy Getin, I have submitted my Civil Servant Letter request above. I am ready to send my ₦1,000 payment receipt for processing.`
    ].join('\n');
  },

  /**
   * Online Registration Complete Form Message
   */
  formatRegistrationMessage: (data: {
    jambRegNumber?: string;
    email: string;
    surname: string;
    firstName: string;
    middleName?: string;
    phoneNumber: string;
    dateOfBirth: string;
    permanentAddress: string;
    nextOfKin: string;
    nextOfKinAddress: string;
    nextOfKinPhone: string;
    firstChoice: string;
    secondChoice: string;
    hasWaec?: boolean;
    waecNumber?: string;
    waecName?: string;
    hasWaecPhoto?: boolean;
    hasNeco?: boolean;
    necoNumber?: string;
    necoName?: string;
    hasNecoPhoto?: boolean;
  }) => {
    const lines = [
      `*NEW ONLINE REGISTRATION SUBMISSION — UNIDEL*`,
      `---------------------------------------`,
      `*Full Name:* ${data.surname.toUpperCase()}, ${data.firstName} ${data.middleName || ''}`.trim(),
      `*Phone Number:* ${data.phoneNumber}`,
      `*Email Address:* ${data.email}`,
      `*Date of Birth:* ${data.dateOfBirth}`,
      `*Permanent Address:* ${data.permanentAddress}`,
      `---------------------------------------`,
      `*NEXT OF KIN INFORMATION:*`,
      `*Next of Kin:* ${data.nextOfKin}`,
      `*Next of Kin Address:* ${data.nextOfKinAddress}`,
      `*Next of Kin Phone:* ${data.nextOfKinPhone}`,
      `---------------------------------------`,
      `*COURSE CHOICES:*`,
      `*First Choice:* ${data.firstChoice}`,
      `*Second Choice:* ${data.secondChoice}`,
      `---------------------------------------`,
      `*EXAMINATION RESULTS:*`
    ];

    if (data.hasWaec) {
      lines.push(
        `*WAEC Details:*`,
        `- WAEC Number: ${data.waecNumber || 'Provided'}`,
        `- WAEC Name: ${data.waecName || 'Provided'}`,
        `- WAEC Result Photo: ${data.hasWaecPhoto ? 'Uploaded & Verified' : 'Photo Attached'}`
      );
    }

    if (data.hasNeco) {
      lines.push(
        `*NECO Details:*`,
        `- NECO Number: ${data.necoNumber || 'Provided'}`,
        `- NECO Name: ${data.necoName || 'Provided'}`,
        `- NECO Result Photo: ${data.hasNecoPhoto ? 'Uploaded & Verified' : 'Photo Attached'}`
      );
    }

    lines.push(
      `---------------------------------------`,
      `Hello Easy Getin, I have submitted my Online Registration details above. Please process my registration.`
    );

    return lines.join('\n');
  },

  /**
   * Affidavit of Good Conduct Complete Form Message
   */
  formatAffidavitMessage: (data: {
    fullName: string;
    department: string;
    faculty: string;
    nativeTown: string;
    homeAddress: string;
    phone: string;
    email?: string;
  }) => {
    return [
      `*NEW AFFIDAVIT OF GOOD CONDUCT REQUEST — UNIDEL*`,
      `---------------------------------------`,
      `*Full Name:* ${data.fullName}`,
      `*Phone Number:* ${data.phone}`,
      `*Department:* ${data.department}`,
      `*Faculty:* ${data.faculty}`,
      `*Native / Home Town:* ${data.nativeTown}`,
      `*Home Address:* ${data.homeAddress}`,
      `*Email Address:* ${data.email || 'Not Provided'}`,
      `*Fee Payable:* ₦7,300`,
      `---------------------------------------`,
      `*PAYMENT DETAILS:*`,
      `Bank: PalmPay | Acct: 9069710687 | Name: Chukwudebe Ifeanyi`,
      `---------------------------------------`,
      `*DOCUMENTS TO SEND ON WHATSAPP:*`,
      `1. Passport Photograph`,
      `2. Signature on White Paper`,
      `3. Proof of Payment (₦7,300)`,
      `---------------------------------------`,
      `Hello Easy Getin, I have submitted my Affidavit of Good Conduct request above. I am ready to send my ₦7,300 payment screenshot and required documents.`
    ].join('\n');
  },

  /**
   * Student Hostels Complete Form Message
   */
  formatHostelMessage: (data: {
    fullName: string;
    phone: string;
    campusSite: string;
    budget: string;
    needRoommate: string;
    notes?: string;
  }) => {
    return [
      `*NEW STUDENT HOSTEL ENQUIRY — UNIDEL*`,
      `---------------------------------------`,
      `*Full Name:* ${data.fullName}`,
      `*Phone Number (WhatsApp):* ${data.phone}`,
      `*Campus Site:* ${data.campusSite}`,
      `*Amount Budgeted:* ${data.budget}`,
      `*Roommate Preference:* ${data.needRoommate}`,
      `*Notes / Preferences:* ${data.notes?.trim() || 'None'}`,
      `---------------------------------------`,
      `Hello Easy Getin, I am looking for student accommodation in Agbor for UNIDEL. Please connect me with available verified lodges matching my budget.`
    ].join('\n');
  }
};
