export interface ClearanceRequirement {
  id: number;
  title: string;
  category: 'payment' | 'identity' | 'letters' | 'academic';
  description: string;
}

export const CLEARANCE_REQUIREMENTS: ClearanceRequirement[] = [
  {
    id: 1,
    title: 'Payment of Acceptance Fee',
    category: 'payment',
    description: 'Official UNIDEL acceptance fee payment receipt / proof of payment.'
  },
  {
    id: 2,
    title: 'Birth Certificate',
    category: 'identity',
    description: 'National Population Commission (NPC) birth certificate or sworn age declaration.'
  },
  {
    id: 3,
    title: 'Acceptance Letter',
    category: 'letters',
    description: 'Completed and verified UNIDEL student admission acceptance letter.'
  },
  {
    id: 4,
    title: 'Grantor / Sponsor Letter',
    category: 'letters',
    description: 'Formal letter of sponsorship/commitment from parent, guardian, or financial sponsor.'
  },
  {
    id: 5,
    title: 'Reference Letter for Pastor / Civil Servant',
    category: 'letters',
    description: 'Character reference letter signed by an ordained clergyman or senior civil servant.'
  },
  {
    id: 6,
    title: 'LGA Identification',
    category: 'identity',
    description: 'Local Government Area Certificate of Origin or Identification.'
  },
  {
    id: 7,
    title: 'First Sitting Result',
    category: 'academic',
    description: 'Original or printout of WAEC / NECO / NABTEB examination result (1st sitting).'
  },
  {
    id: 8,
    title: 'Second Sitting Result',
    category: 'academic',
    description: 'Applicable if combining two sittings for qualifying O-level credits.'
  },
  {
    id: 9,
    title: 'Evidence of Name',
    category: 'identity',
    description: 'Newspaper publication, statutory declaration of age/name, or consistent official ID.'
  },
  {
    id: 10,
    title: 'Guarantor / Referee Letter',
    category: 'letters',
    description: 'Attestation from an approved guarantor certifying student conduct and responsibility.'
  },
  {
    id: 11,
    title: 'Affidavit of Good Conduct',
    category: 'identity',
    description: 'Sworn court affidavit from a High Court or Magistrate Court of Justice.'
  },
  {
    id: 12,
    title: 'UTME (JAMB) Result',
    category: 'academic',
    description: 'Official JAMB original result slip with your photograph showing test scores.'
  },
  {
    id: 13,
    title: 'UTME (JAMB) Admission Letter',
    category: 'academic',
    description: 'Official JAMB admission letter confirming admission offer into UNIDEL.'
  },
  {
    id: 14,
    title: 'WAEC Serial Number and PIN',
    category: 'academic',
    description: 'Online verification scratch card details for institutional O-level result verification.'
  }
];

export const CLEARANCE_FEE_NAIRA = 3000;
