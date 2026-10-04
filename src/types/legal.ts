export type LegalCategory =
  | 'civil'
  | 'criminal'
  | 'labor'
  | 'family'
  | 'commercial'
  | 'cassation'
  | 'general';

export type CaseStage =
  | 'pre_trial'         // ቅድመ-ክስ / ማስረጃ ማሰባሰብ
  | 'filed'             // ክስ ተመሰረተ
  | 'summons_served'    // መጥሪያ ተደረሰ / መልስ
  | 'framing_issues'    // የቃል ክርክር / ጭብጥ መያዝ
  | 'witness_hearing'   // የምስክሮች መስማት
  | 'judgment'          // ፍርድ / ውሳኔ
  | 'appeal'            // ይግባኝ / ሰበር
  | 'execution';        // ፍርድ አፈጻጸም

export type ClientRole = 'plaintiff' | 'defendant' | 'lawyer' | 'neutral';

export type HearingType =
  | 'first_appearance'   // የመጀመሪያ ቀጠሮ
  | 'summons_response'   // የክስ ምላሽ
  | 'oral_argument'     // የቃል ክርክርና ጭብጥ
  | 'witness'           // የምስክሮች መስማት
  | 'expert_testimony'   // የባለሙያ ማስረጃ
  | 'verdict'           // ብይን / ፍርድ ውሳኔ
  | 'appeal'            // ይግባኝ
  | 'execution';        // ፍርድ አፈጻጸም

export interface ExternalLegalSource {
  sourceName: 'Abyssinia Law' | 'Ethiopian Legal Brief' | string;
  siteUrl: string;
  title: string;
  directUrl: string;
  category?: string;
  description: string;
}

export interface ApplicableArticle {
  code: string;
  articleNumber: string;
  title: string;
  contentSummary: string;
  applicationToCase: string;
  subArticle?: string;
  legalEffectOrSanction?: string;
  confidenceScore?: number;
  sourceUrl?: string;
  sourceSiteName?: string;
}

export interface CaseFactsReview {
  establishedFacts: string[];
  occurredSituation: string;
  legalIssues: string[];
  disputedPoints?: string[];
}

export interface CassationPrecedent {
  benchDecision: string;
  legalPrinciple: string;
  volumeNumber?: string;
  sourceUrl?: string;
  sourceSiteName?: string;
}

export interface LegalAnalysisResult {
  title: string;
  category: string;
  summary: string;
  caseStrengthScore: number;
  caseStrengthExplanation: string;
  caseFactsReview?: CaseFactsReview;
  applicableArticles: ApplicableArticle[];
  cassationPrecedents: CassationPrecedent[];
  partiesAnalysis: {
    plaintiffRights: string[];
    defendantLiabilities: string[];
    burdenOfProof: string;
  };
  remedies: {
    option: string;
    feasibility: string;
    steps: string;
  }[];
  financialOrPenaltyEstimate: string;
  recommendedCourt: string;
  actionPlan: string[];
  evidenceChecklist: string[];
  counselAdviceAmharic: string;
  externalSources?: ExternalLegalSource[];
}

export interface LegalSearchResult {
  query: string;
  recognizedCategory: string;
  legalIssueSummary: string;
  civilCodeMatches: ApplicableArticle[];
  criminalCodeMatches: ApplicableArticle[];
  cassationMatches: CassationPrecedent[];
  customCounsel: string;
  actionSteps: string[];
  relevanceScore: number;
  externalSources?: ExternalLegalSource[];
}

export interface CaseEvidence {
  id: string;
  title: string;
  type: 'contract' | 'receipt' | 'police_report' | 'witness_statement' | 'court_order' | 'photo' | 'other';
  dateAdded: string;
  fileName?: string;
  description: string;
  verified: boolean;
}

export interface LegalMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface ManagedCase {
  id: string;
  caseNumber: string; // መዝገብ ቁጥር e.g., ፌ/መ/ደ/ፍ/ቤት 129482
  title: string;
  category: LegalCategory;
  court: string; // e.g. የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ
  bench: string; // ችሎት e.g. 4ኛ የፍትሐብሔር ችሎት
  presidingJudge?: string;
  clientRole: ClientRole;
  plaintiff: string;
  defendant: string;
  claimAmountETB?: number;
  stage: CaseStage;
  filingDate: string;
  summary: string;
  notes: string;
  evidences: CaseEvidence[];
  milestones: LegalMilestone[];
  analysisResult?: LegalAnalysisResult;
  status: 'active' | 'closed' | 'settled' | 'stayed';
}

export interface CourtHearing {
  id: string;
  caseId: string;
  caseTitle: string;
  caseNumber: string;
  date: string; // YYYY-MM-DD
  timeAmharic: string; // e.g., ጠዋት 3:30
  court: string;
  bench: string;
  roomNumber?: string;
  judgeName?: string;
  hearingType?: HearingType;
  hearingPurpose: string; // e.g., ምስክር መስማት፣ የክስ ምላሽ፣ ውሳኔ መስጠት
  preparationChecklist: {
    item: string;
    completed: boolean;
  }[];
  status: 'upcoming' | 'completed' | 'adjourned' | 'cancelled';
  adjournmentReason?: string;
  notes?: string;
  outcome?: string;
  reminderSettings?: {
    enabled: boolean;
    notifyDaysBefore: number[]; // e.g. [7, 3, 1, 0]
    soundAlert: boolean;
    notified?: boolean;
  };
  assignedAdvocate?: string;
}

export interface LegalCodeArticle {
  code: string;
  articleNumber: string;
  title: string;
  summary: string;
  keywords: string[];
  type: 'civil' | 'criminal' | 'labor' | 'family' | 'cassation';
}

export interface PlaintiffWitness {
  id: string;
  name: string;
  address: string;
  phone?: string;
  testimonySubject: string;
}

export interface LawsuitQuestionnaire {
  // 1. የከሳሽ መረጃ
  plaintiffFullName: string;
  plaintiffAddress: string;
  plaintiffPhone: string;
  plaintiffRole: string;
  plaintiffAdvocateOrAgent?: string;

  // 2. የተከሳሽ መረጃ
  defendantFullName: string;
  defendantAddress: string;
  defendantPhone: string;

  // 3. የፍርድ ቤትና የችሎት መረጣ
  courtName: string;
  benchName: string;
  jurisdictionBasis: string;

  // 4. የክሱ ዓይነትና የገንዘብ መጠን
  claimCategory: string;
  claimAmountETB: string;

  // 5. ከሳሽ የሚጠበቅበት የጽሁፍ መጠይቆች (Questionnaire)
  questionAgreementDetails: string; // ውሉ መቼ ተደረገ? ምን ስምምነት ተደረገ?
  questionBreachDetails: string; // ተከሳሹ ምን አደረገ? ምን ጥሰት ፈጸመ?
  questionDemandAndNotice: string; // ለተከሳሹ የተሰጠ የጽሁፍ ማስጠንቀቂያ ወይም የስልክ ጥያቄ
  questionDamagesCaused: string; // በከሳሽ ላይ የደረሰ ጉዳት ወይም ኪሳራ
  additionalFacts: string; // ተጨማሪ ዝርዝር ማብራሪያ ካለ

  // 6. የሕግ መሠረቶች
  legalArticles: string;

  // 7. የሚጠየቅ ዳኝነት
  specificDemands: string;

  // 8. ማስረጃዎች
  evidenceList: string;
  witnesses: PlaintiffWitness[];

  // 9. ማረጋገጫ
  verificationStatement: string;
}

export interface LegalGroundItem {
  statute: string;
  explanation: string;
}

export interface PreliminaryRequirementItem {
  title: string;
  description: string;
  mandatory: boolean;
  category?: 'notice' | 'evidence' | 'court_fee' | 'summons' | 'copies' | 'agency';
}

export interface JurisdictionAssessment {
  courtName: string;
  courtLevel: string;
  benchName: string;
  localVenue: string;
  jurisdictionType: 'federal' | 'regional' | 'special_tribunal' | 'social_court';
  estimatedCourtFee: number;
  claimAmount: number;
  legalGrounds: LegalGroundItem[];
  preliminaryRequirements: PreliminaryRequirementItem[];
  potentialObjections: string[];
  detailedReasoning: string;
  tacticalAdvice?: string;
  evaluatedAt: string;
}

export interface CourtFeeBracket {
  range: string;
  rate: string;
  bracketMin: number;
  bracketMax: number;
  applicableAmount: number;
  feeAmount: number;
  formula: string;
}

export interface CourtFeeBreakdown {
  regulation: 'reg_1_2017' | 'legacy_1952';
  claimAmount: number;
  claimType: 'pecuniary' | 'non_pecuniary';
  nonPecuniaryType?: string;
  appliedPercentage?: number;
  courtLevel?: 'first_instance' | 'high_court' | 'supreme_court';
  baseCourtFee: number;
  summonsFee: number;
  summonsCount: number;
  witnessCount: number;
  witnessSummonsFee: number;
  documentPages: number;
  documentCopyFee: number;
  registryCopyFee: number;
  appealFee: number;
  cassationFee: number;
  executionFee: number;
  totalFirstInstanceFee: number;
  settlementRefundAmount: number; // 50% refund on compromise / settlement
  brackets: CourtFeeBracket[];
  isInFormaPauperisEligible: boolean;
  isGovernmentExempt?: boolean;
}

export interface DefenseWitness {
  name: string;
  address: string;
  testimonyTopic: string;
}

export interface DefenseGenerationRequest {
  claimText?: string;
  fileData?: string; // base64
  fileMimeType?: string;
  fileName?: string;
  courtName?: string;
  benchName?: string;
  caseNumber?: string;
  plaintiffName?: string;
  plaintiffAddress?: string;
  defendantName?: string;
  defendantAddress?: string;
  defendantPhone?: string;
  disputeCategory?: string;
  preliminaryObjections?: string[];
  customPreliminaryObjections?: string;
  factsDenied?: string;
  factsAdmitted?: string;
  affirmativeDefenses?: string;
  counterClaimText?: string;
  counterClaimAmount?: string;
  evidenceListText?: string;
  witnesses?: DefenseWitness[];
  language?: 'am' | 'om' | 'en';
}

export interface DefensePreliminaryObjectionItem {
  type: string;
  legalBasis: string;
  argument: string;
}

export interface DefenseGenerationResult {
  courtHeading: {
    courtName: string;
    benchName: string;
    caseNumber: string;
    plaintiff: string;
    defendant: string;
  };
  caseSummary: string;
  preliminaryObjections: DefensePreliminaryObjectionItem[];
  substantiveDenials: string[];
  affirmativeDefenses: string[];
  counterClaim?: string;
  prayerRemedies: string[];
  evidenceList: string[];
  witnessList: DefenseWitness[];
  verificationText: string;
  fullDefensePleading: string;
  tacticalAdvice: string;
  statutesCited: { statute: string; explanation: string }[];
  generatedAt: string;
}

