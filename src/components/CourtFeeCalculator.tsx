import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Scale,
  Printer,
  Copy,
  Check,
  Building,
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Users,
  Coins,
  ChevronDown,
  Info,
  BookOpen,
  Receipt,
  FileCheck,
  Share2,
  FileWarning,
  BadgeCheck,
  Building2,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CourtFeeBreakdown, CourtFeeBracket } from '../types/legal';

export interface CourtFeeCalculatorProps {
  initialClaimAmount?: number;
  onNavigateToDrafter?: (claimAmount: string, estimatedFee: number) => void;
  onNavigateToDefense?: (claimAmount: string, estimatedFee: number) => void;
  onNavigateToJurisdiction?: (claimAmount: string) => void;
}

interface NonPecuniaryOption {
  id: string;
  nameAm: string;
  nameOm: string;
  nameEn: string;
  courtLevel: 'first_instance' | 'high_court' | 'supreme_court' | 'special';
  fee: number;
  statute: string;
  descriptionAm: string;
  descriptionOm: string;
}

// Fixed Fees defined under Federal Courts Court Fee Regulation No. 1/2017 (Regulation 1/2024)
const NON_PECUNIARY_REG_1_2017: NonPecuniaryOption[] = [
  {
    id: 'first_instance_general',
    nameAm: 'በፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት የሚቀርብ ገንዘብ ነክ ያልሆነ ክስ',
    nameOm: 'Mana Murtii Sadarkaa Duraa Federaalaatti Himannaa Maallaqa Hin Taane',
    nameEn: 'Federal First Instance Court Non-Monetary Claim (e.g. Divorce, Custody, Status)',
    courtLevel: 'first_instance',
    fee: 1000,
    statute: 'ደንብ ቁጥር 1/2017 ሠንጠረዥ ክፍል 2',
    descriptionAm: 'የጋብቻ ፍቺ፣ የልጆች አስተዳደግና ቀለብ፣ የውርስ ማጣራትና የወራሽነት ማረጋገጫ ወዘተ።',
    descriptionOm: 'Wal-dhabdee gaa\'ilaa, qeleba daa\'immanii, dhaala mirkaneessuu fi kkf.',
  },
  {
    id: 'high_court_general',
    nameAm: 'በፌዴራል ከፍተኛ ፍርድ ቤት የሚቀርብ ገንዘብ ነክ ያልሆነ ክስ',
    nameOm: 'Mana Murtii Ol\'aanaa Federaalaatti Himannaa Maallaqa Hin Taane',
    nameEn: 'Federal High Court Non-Monetary Claim (e.g. Nationality, Maritime, IP Title)',
    courtLevel: 'high_court',
    fee: 1500,
    statute: 'ደንብ ቁጥር 1/2017 ሠንጠረዥ ክፍል 2',
    descriptionAm: 'የዜግነት መብት፣ የአእምሯዊ ንብረት መብት ማረጋገጥ እና በከፍተኛ ፍርድ ቤት የሚቀርቡ የፍትሐብሔር ክሶች።',
    descriptionOm: 'Mirga lammummaa, qabeenya sammuu fi falmiiwwan Mana Murtii Ol\'aanaatti dhihaatan.',
  },
  {
    id: 'supreme_court_general',
    nameAm: 'በፌዴራል ጠቅላይ ፍርድ ቤት የሚቀርብ ገንዘብ ነክ ያልሆነ ክስ',
    nameOm: 'Mana Murtii Waliigalaa (Supreme Court) Federaalaatti Himannaa',
    nameEn: 'Federal Supreme Court Non-Monetary Matter',
    courtLevel: 'supreme_court',
    fee: 2000,
    statute: 'ደንብ ቁጥር 1/2017 ሠንጠረዥ ክፍል 2',
    descriptionAm: 'በጠቅላይ ፍርድ ቤት የመጀመሪያ ደረጃ ስልጣን የሚቀርቡ ልዩ ገንዘብ ነክ ያልሆኑ አቤቱታዎች።',
    descriptionOm: 'Iyyannoowwan addaa aangoo jalqabaa Mana Murtii Waliigalaatiin ilaalaman.',
  },
  {
    id: 'injunction_app',
    nameAm: 'የጊዜያዊ ወይም የዘላቂ እግድ ትዕዛዝ ማመልከቻ (Injunction Application)',
    nameOm: 'Iyyannoo Ajaja Dhorkaa Yeroo (Injunction)',
    nameEn: 'Interlocutory / Permanent Injunction Application',
    courtLevel: 'special',
    fee: 2000,
    statute: 'ደንብ ቁጥር 1/2017 ተጨማሪ አገልግሎቶች',
    descriptionAm: 'ተከሳሹ ንብረት እንዳያሸሽ፣ ግንባታ እንዲያቆም ወይም የሂሳብ እግድ እንዲጣል የሚጠየቅ አቤቱታ።',
    descriptionOm: 'Qabeenyi akka hin sochoone ykn hin gurguramne ajaja ittisaa gaafatamu.',
  },
  {
    id: 'intervention_app',
    nameAm: 'በክርክር ውስጥ ጣልቃ የመግባት ማመልከቻ (Intervention under Art. 41)',
    nameOm: 'Iyyannoo Falmii Keessa Seenuu (Kw. 41)',
    nameEn: 'Third-Party Intervention Application',
    courtLevel: 'special',
    fee: 1000,
    statute: 'ደንብ ቁጥር 1/2017 ተጨማሪ አገልግሎቶች',
    descriptionAm: 'በሌሎች ሰዎች ክርክር ውስጥ የራሴ ጥቅም ይነካል በማለት በጣልቃ-ገብነት ለመሳተፍ የሚቀርብ ማመልከቻ።',
    descriptionOm: 'Falmii namoota biroo keessatti mirga qaba jedhee seenuuf kan dhihaatu.',
  },
  {
    id: 'marital_contract_approval',
    nameAm: 'የትዳር አጋሮች የንብረት ውል ስምምነት ማጽደቅ',
    nameOm: 'Waliigaltee Qabeenya Hiriyoota Gaa\'ilaa Mirkaneessuu',
    nameEn: 'Approval of Marital Property Agreement',
    courtLevel: 'special',
    fee: 500,
    statute: 'ደንብ ቁጥር 1/2017 ተጨማሪ አገልግሎቶች',
    descriptionAm: 'ተጋቢዎች የጋብቻ ንብረታቸውን ክፍፍል ወይም ስምምነት በፍርድ ቤት ለማስመዝገብ የሚቀርብ።',
    descriptionOm: 'Waliigaltee qabeenya gaa\'ilaa mana murtitti galmeessisuuf.',
  },
  {
    id: 'late_appeal_permission',
    nameAm: 'የይግባኝ ወይም የሰበር ጊዜ ገደብ ካለፈ በኋላ የማስፈቀጃ ማመልከቻ (Leave to Appeal)',
    nameOm: 'Iyyannoo Yeroon Ol-iyyannoo Erga Darbee Booda Dhihaatu',
    nameEn: 'Application for Leave to Appeal Out of Time',
    courtLevel: 'special',
    fee: 100,
    statute: 'ደንብ ቁጥር 1/2017 ተጨማሪ አገልግሎቶች',
    descriptionAm: 'በበቂ ምክንያት ይግባኝ በወቅቱ ማቅረብ ላልቻለ ወገን ተጨማሪ ጊዜ እንዲፈቀድለት የሚቀርብ አቤቱታ።',
    descriptionOm: 'Sababa gahaadhaan yeroon ol-iyyannoo yoo darbe eeyyama gaafachuuf.',
  },
  {
    id: 'human_rights_exempt',
    nameAm: 'የሰብአዊ መብቶች ጥሰት እና የአካባቢ ጥበቃ ክስ (ከክፍያ ነፃ)',
    nameOm: 'Himannaa Mirga Namoomaa fi Naannoo (Bilisa / 0 ETB)',
    nameEn: 'Human Rights & Environmental Protection (Exempt by Law)',
    courtLevel: 'special',
    fee: 0,
    statute: 'ደንብ ቁጥር 1/2017 አንቀጽ 21',
    descriptionAm: 'በሕገ-መንግሥቱ የተረጋገጡ ሰብአዊ መብቶችን ለማስከበር ወይም ለአካባቢ ጥበቃ የሚቀርቡ የህዝብ ጥቅም ክሶች በሕግ ከዳኝነት ክፍያ ነፃ ናቸው።',
    descriptionOm: 'Mirgoota namoomaa fi eegumsa naannoof kan dhihaatu kaffaltii irraa bilisa.',
  },
];

// Calculation of official percentages under Federal Courts Court Fee Regulation No. 1/2017 (2024)
export function getRegulation1_2017Rate(amount: number): { rate: number; bracketText: string } {
  if (amount <= 20000) return { rate: 0.10, bracketText: '0 – 20,000 ETB (10.0%)' };
  if (amount <= 40000) return { rate: 0.09, bracketText: '20,001 – 40,000 ETB (9.0%)' };
  if (amount <= 60000) return { rate: 0.08, bracketText: '40,001 – 60,000 ETB (8.0%)' };
  if (amount <= 80000) return { rate: 0.07, bracketText: '60,001 – 80,000 ETB (7.0%)' };
  if (amount <= 100000) return { rate: 0.06, bracketText: '80,001 – 100,000 ETB (6.0%)' };
  if (amount <= 200000) return { rate: 0.05, bracketText: '100,001 – 200,000 ETB (5.0%)' };
  if (amount <= 300000) return { rate: 0.049, bracketText: '200,001 – 300,000 ETB (4.9%)' };
  if (amount <= 400000) return { rate: 0.048, bracketText: '300,001 – 400,000 ETB (4.8%)' };
  if (amount <= 500000) return { rate: 0.047, bracketText: '400,001 – 500,000 ETB (4.7%)' };
  if (amount <= 600000) return { rate: 0.046, bracketText: '500,001 – 600,000 ETB (4.6%)' };
  if (amount <= 700000) return { rate: 0.045, bracketText: '600,001 – 700,000 ETB (4.5%)' };
  if (amount <= 800000) return { rate: 0.044, bracketText: '700,001 – 800,000 ETB (4.4%)' };
  if (amount <= 900000) return { rate: 0.043, bracketText: '800,001 – 900,000 ETB (4.3%)' };
  if (amount <= 1000000) return { rate: 0.042, bracketText: '900,001 – 1,000,000 ETB (4.2%)' };
  if (amount <= 2000000) return { rate: 0.041, bracketText: '1,000,001 – 2,000,000 ETB (4.1%)' };
  if (amount <= 3000000) return { rate: 0.040, bracketText: '2,000,001 – 3,000,000 ETB (4.0%)' };
  if (amount <= 4000000) return { rate: 0.039, bracketText: '3,000,001 – 4,000,000 ETB (3.9%)' };
  if (amount <= 5000000) return { rate: 0.038, bracketText: '4,000,001 – 5,000,000 ETB (3.8%)' };
  if (amount <= 6000000) return { rate: 0.037, bracketText: '5,000,001 – 6,000,000 ETB (3.7%)' };
  if (amount <= 7000000) return { rate: 0.036, bracketText: '6,000,001 – 7,000,000 ETB (3.6%)' };
  if (amount <= 8000000) return { rate: 0.035, bracketText: '7,000,001 – 8,000,000 ETB (3.5%)' };
  if (amount <= 9000000) return { rate: 0.034, bracketText: '8,000,001 – 9,000,000 ETB (3.4%)' };
  if (amount <= 10000000) return { rate: 0.033, bracketText: '9,000,001 – 10,000,000 ETB (3.3%)' };
  if (amount <= 20000000) return { rate: 0.029, bracketText: '10,000,001 – 20,000,000 ETB (2.9%)' };
  if (amount <= 30000000) return { rate: 0.028, bracketText: '20,000,001 – 30,000,000 ETB (2.8%)' };
  if (amount <= 40000000) return { rate: 0.027, bracketText: '30,000,001 – 40,000,000 ETB (2.7%)' };
  if (amount <= 50000000) return { rate: 0.026, bracketText: '40,000,001 – 50,000,000 ETB (2.6%)' };
  if (amount <= 60000000) return { rate: 0.025, bracketText: '50,000,001 – 60,000,000 ETB (2.5%)' };
  if (amount <= 70000000) return { rate: 0.024, bracketText: '60,000,001 – 70,000,000 ETB (2.4%)' };
  if (amount <= 80000000) return { rate: 0.023, bracketText: '70,000,001 – 80,000,000 ETB (2.3%)' };
  if (amount <= 90000000) return { rate: 0.022, bracketText: '80,000,001 – 90,000,000 ETB (2.2%)' };
  if (amount <= 100000000) return { rate: 0.021, bracketText: '90,000,001 – 100,000,000 ETB (2.1%)' };
  return { rate: 0.020, bracketText: '> 100,000,000 ETB (2.0%)' };
}

// Execution fees schedule under Regulation No. 1/2017
export function getExecutionFeeReg1_2017(amount: number): number {
  if (amount <= 100000) return 300;
  if (amount <= 200000) return 500;
  if (amount <= 500000) return 1000;
  if (amount <= 1000000) return 1500;
  if (amount <= 10000000) return 2000;
  return 3000;
}

export const CourtFeeCalculator: React.FC<CourtFeeCalculatorProps> = ({
  initialClaimAmount = 450000,
  onNavigateToDrafter,
  onNavigateToDefense,
  onNavigateToJurisdiction,
}) => {
  const { t, isOromo, isEnglish } = useLanguage();

  // Regulation Mode: Default to the active new Regulation No. 1/2017 (2024)
  const [regulationVersion, setRegulationVersion] = useState<'reg_1_2017' | 'legacy_1952'>('reg_1_2017');

  // Claim Mode: Pecuniary (Money value) vs Non-Pecuniary
  const [claimType, setClaimType] = useState<'pecuniary' | 'non_pecuniary'>('pecuniary');
  const [claimAmount, setClaimAmount] = useState<number>(initialClaimAmount);
  const [claimAmountInput, setClaimAmountInput] = useState<string>(String(initialClaimAmount));
  const [selectedNonPecuniary, setSelectedNonPecuniary] = useState<string>('first_instance_general');
  const [isGovernmentOrg, setIsGovernmentOrg] = useState<boolean>(false);

  // Ancillary Fees counters
  const [defendantCount, setDefendantCount] = useState<number>(1);
  const [witnessCount, setWitnessCount] = useState<number>(2);
  const [documentPages, setDocumentPages] = useState<number>(10);
  const [includeSummons, setIncludeSummons] = useState<boolean>(true);
  const [includeWitnesses, setIncludeWitnesses] = useState<boolean>(true);
  const [includeCopies, setIncludeCopies] = useState<boolean>(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'calculator' | 'schedule' | 'exemptions' | 'refund' | 'comparison'>('calculator');
  const [copied, setCopied] = useState<boolean>(false);

  // Quick preset claim amounts
  const presets = [
    { label: '20,000 ETB (10%)', value: 20000 },
    { label: '100,000 ETB (6%)', value: 100000 },
    { label: '350,000 ETB (4.8%)', value: 350000 },
    { label: '1,000,000 ETB (4.2%)', value: 1000000 },
    { label: '5,000,000 ETB (3.8%)', value: 5000000 },
    { label: '15,000,000 ETB (2.9%)', value: 15000000 },
    { label: '35,000,000 ETB (2.7%)', value: 35000000 },
    { label: '100,000,000 ETB (2.1%)', value: 100000000 },
  ];

  // Calculation computation
  const breakdown = useMemo<CourtFeeBreakdown>(() => {
    // If party is government agency (exempt under Art 21 / Corrigendum / Proc. 1381/2017)
    if (isGovernmentOrg) {
      return {
        regulation: regulationVersion,
        claimAmount,
        claimType,
        baseCourtFee: 0,
        summonsFee: 0,
        summonsCount: defendantCount,
        witnessCount,
        witnessSummonsFee: 0,
        documentPages,
        documentCopyFee: 0,
        registryCopyFee: 0,
        appealFee: 0,
        cassationFee: 0,
        executionFee: 0,
        totalFirstInstanceFee: 0,
        settlementRefundAmount: 0,
        brackets: [],
        isInFormaPauperisEligible: false,
        isGovernmentExempt: true,
      };
    }

    // Non-Pecuniary Claims
    if (claimType === 'non_pecuniary') {
      const selectedItem = NON_PECUNIARY_REG_1_2017.find((item) => item.id === selectedNonPecuniary);
      const baseFee = selectedItem ? selectedItem.fee : 1000;
      const summonsFee = includeSummons ? defendantCount * 50 : 0;
      const witnessSummonsFee = includeWitnesses ? witnessCount * 50 : 0;
      const documentCopyFee = includeCopies ? documentPages * 5 : 0;
      const totalFirstInstance = baseFee + summonsFee + witnessSummonsFee + documentCopyFee;

      return {
        regulation: regulationVersion,
        claimAmount: 0,
        claimType: 'non_pecuniary',
        nonPecuniaryType: selectedItem ? (isOromo ? selectedItem.nameOm : isEnglish ? selectedItem.nameEn : selectedItem.nameAm) : 'ገንዘብ ነክ ያልሆነ ክስ',
        baseCourtFee: baseFee,
        summonsFee,
        summonsCount: defendantCount,
        witnessCount,
        witnessSummonsFee,
        documentPages,
        documentCopyFee,
        registryCopyFee: documentCopyFee,
        appealFee: Math.round(baseFee * 0.5), // 50% appeal under Reg 1/2017
        cassationFee: 500,
        executionFee: 500, // Non-monetary execution is 500 ETB
        totalFirstInstanceFee: totalFirstInstance,
        settlementRefundAmount: Math.round(baseFee * 0.5),
        brackets: [],
        isInFormaPauperisEligible: false,
        isGovernmentExempt: false,
      };
    }

    const amount = Math.max(0, claimAmount);

    // Calculate under NEW REGULATION NO. 1/2017 (2024)
    if (regulationVersion === 'reg_1_2017') {
      const { rate, bracketText } = getRegulation1_2017Rate(amount);
      const baseCourtFee = Math.round(amount * rate);
      const summonsFee = includeSummons ? defendantCount * 50 : 0;
      const witnessSummonsFee = includeWitnesses ? witnessCount * 50 : 0;
      const documentCopyFee = includeCopies ? documentPages * 5 : 0; // 5 ETB per page
      const totalFirstInstance = baseCourtFee + summonsFee + witnessSummonsFee + documentCopyFee;

      // In Regulation 1/2017:
      // Appeal is 50% of the lower court fee
      const appealFee = Math.round(baseCourtFee * 0.5);
      // Cassation fee is 25% of High Court fee or flat
      const cassationFee = Math.max(500, Math.round(baseCourtFee * 0.25));
      // Execution fee is graduated (300 to 3,000 ETB)
      const executionFee = getExecutionFeeReg1_2017(amount);
      // Settlement refund: 50% of base fee
      const settlementRefundAmount = Math.round(baseCourtFee * 0.5);

      const brackets: CourtFeeBracket[] = [
        {
          range: bracketText,
          rate: `${(rate * 100).toFixed(1)}%`,
          bracketMin: 0,
          bracketMax: amount,
          applicableAmount: amount,
          feeAmount: baseCourtFee,
          formula: `${amount.toLocaleString()} ETB × ${(rate * 100).toFixed(1)}% = ${baseCourtFee.toLocaleString()} ETB`,
        },
      ];

      return {
        regulation: 'reg_1_2017',
        claimAmount: amount,
        claimType: 'pecuniary',
        appliedPercentage: rate * 100,
        baseCourtFee,
        summonsFee,
        summonsCount: defendantCount,
        witnessCount,
        witnessSummonsFee,
        documentPages,
        documentCopyFee,
        registryCopyFee: documentCopyFee,
        appealFee,
        cassationFee,
        executionFee,
        totalFirstInstanceFee: totalFirstInstance,
        settlementRefundAmount,
        brackets,
        isInFormaPauperisEligible: amount <= 500,
        isGovernmentExempt: false,
      };
    }

    // LEGACY 1952 FORMULA (FOR COMPARISON)
    let legacyBaseFee = 0;
    const legacyBrackets: CourtFeeBracket[] = [];
    if (amount > 0) {
      const b1 = Math.min(amount, 1000);
      legacyBaseFee += 50;
      legacyBrackets.push({ range: '1 – 1,000 ETB', rate: 'Flat (50 ETB)', bracketMin: 1, bracketMax: 1000, applicableAmount: b1, feeAmount: 50, formula: 'መነሻ 50 ብር' });
    }
    if (amount > 1000) {
      const b2 = Math.min(amount - 1000, 4000);
      const fee2 = Math.round(b2 * 0.04);
      legacyBaseFee += fee2;
      legacyBrackets.push({ range: '1,001 – 5,000 ETB', rate: '4%', bracketMin: 1001, bracketMax: 5000, applicableAmount: b2, feeAmount: fee2, formula: `${b2.toLocaleString()} × 4%` });
    }
    if (amount > 5000) {
      const b3 = Math.min(amount - 5000, 15000);
      const fee3 = Math.round(b3 * 0.03);
      legacyBaseFee += fee3;
      legacyBrackets.push({ range: '5,001 – 20,000 ETB', rate: '3%', bracketMin: 5001, bracketMax: 20000, applicableAmount: b3, feeAmount: fee3, formula: `${b3.toLocaleString()} × 3%` });
    }
    if (amount > 20000) {
      const b4 = Math.min(amount - 20000, 80000);
      const fee4 = Math.round(b4 * 0.02);
      legacyBaseFee += fee4;
      legacyBrackets.push({ range: '20,001 – 100,000 ETB', rate: '2%', bracketMin: 20001, bracketMax: 100000, applicableAmount: b4, feeAmount: fee4, formula: `${b4.toLocaleString()} × 2%` });
    }
    if (amount > 100000) {
      const b5 = Math.min(amount - 100000, 400000);
      const fee5 = Math.round(b5 * 0.015);
      legacyBaseFee += fee5;
      legacyBrackets.push({ range: '100,001 – 500,000 ETB', rate: '1.5%', bracketMin: 100001, bracketMax: 500000, applicableAmount: b5, feeAmount: fee5, formula: `${b5.toLocaleString()} × 1.5%` });
    }
    if (amount > 500000) {
      const b6 = Math.min(amount - 500000, 500000);
      const fee6 = Math.round(b6 * 0.01);
      legacyBaseFee += fee6;
      legacyBrackets.push({ range: '500,001 – 1,000,000 ETB', rate: '1%', bracketMin: 500001, bracketMax: 1000000, applicableAmount: b6, feeAmount: fee6, formula: `${b6.toLocaleString()} × 1%` });
    }
    if (amount > 1000000) {
      const b7 = amount - 1000000;
      const fee7 = Math.round(b7 * 0.005);
      legacyBaseFee += fee7;
      legacyBrackets.push({ range: '> 1,000,000 ETB', rate: '0.5%', bracketMin: 1000001, bracketMax: Infinity, applicableAmount: b7, feeAmount: fee7, formula: `${b7.toLocaleString()} × 0.5%` });
    }

    const legacySummons = includeSummons ? defendantCount * 50 : 0;
    const legacyTotal = legacyBaseFee + legacySummons + 150;

    return {
      regulation: 'legacy_1952',
      claimAmount: amount,
      claimType: 'pecuniary',
      baseCourtFee: legacyBaseFee,
      summonsFee: legacySummons,
      summonsCount: defendantCount,
      witnessCount,
      witnessSummonsFee: includeWitnesses ? witnessCount * 25 : 0,
      documentPages,
      documentCopyFee: 50,
      registryCopyFee: 150,
      appealFee: legacyBaseFee,
      cassationFee: 300,
      executionFee: Math.max(250, Math.round(amount * 0.01)),
      totalFirstInstanceFee: legacyTotal,
      settlementRefundAmount: Math.round(legacyBaseFee * 0.5),
      brackets: legacyBrackets,
      isInFormaPauperisEligible: amount <= 500,
      isGovernmentExempt: false,
    };
  }, [
    claimAmount,
    claimType,
    selectedNonPecuniary,
    regulationVersion,
    isGovernmentOrg,
    defendantCount,
    witnessCount,
    documentPages,
    includeSummons,
    includeWitnesses,
    includeCopies,
    isOromo,
    isEnglish,
  ]);

  // Handle amount change
  const handleAmountInputChange = (val: string) => {
    setClaimAmountInput(val);
    const cleanNum = parseFloat(val.replace(/,/g, ''));
    if (!isNaN(cleanNum)) {
      setClaimAmount(cleanNum);
    } else if (val === '') {
      setClaimAmount(0);
    }
  };

  // Convert amount to readable text
  const getEthiopianAmountInWords = (num: number) => {
    if (num <= 0) return 'ዜሮ ብር';
    if (num >= 1000000) {
      const millions = (num / 1000000).toFixed(2);
      return `${millions} ሚሊዮን የኢትዮጵያ ብር (${millions} Miliyoona Qarshii)`;
    }
    if (num >= 1000) {
      const thousands = (num / 1000).toFixed(1);
      return `${thousands} ሺህ የኢትዮጵያ ብር (${thousands} Kuma Qarshii)`;
    }
    return `${num.toLocaleString()} የኢትዮጵያ ብር`;
  };

  // Print Assessment Slip
  const handlePrintSlip = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <html>
        <head>
          <title>${isOromo ? 'Nagahee Shallaggii Kaffaltii Mana Murtii' : 'የፌዴራል ፍርድ ቤቶች የዳኝነት ክፍያ ማጠቃለያ ደረሰኝ'}</title>
          <style>
            body { font-family: 'Times New Roman', 'Noto Sans Ethiopic', serif; padding: 40px; color: #111; line-height: 1.6; }
            h1, h2 { text-align: center; margin: 0; }
            .header-box { border-bottom: 2px solid #222; padding-bottom: 15px; margin-bottom: 25px; text-align: center; }
            .badge { display: inline-block; padding: 4px 10px; background: #eee; font-weight: bold; font-size: 13px; border-radius: 4px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
            .table th, .table td { border: 1px solid #444; padding: 8px 12px; text-align: left; }
            .table th { background: #f2f2f2; font-weight: bold; }
            .total-row { font-weight: bold; font-size: 16px; background: #fafafa; }
            .law-box { border: 1px dashed #666; padding: 12px; margin-top: 25px; font-size: 12px; background: #fdfdfd; }
            .meta { font-size: 12px; color: #666; text-align: right; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header-box">
            <h2>የኢ.ፌ.ዲ.ሪ የፌዴራል ፍርድ ቤቶች / FDRE Federal Courts</h2>
            <h1>የዳኝነት አገልግሎት ክፍያ ማጠቃለያና ማስከፈያ ደረሰኝ (Fee Assessment Slip)</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold; color: #b45309;">
              በፌዴራል ፍርድ ቤቶች የዳኝነት ክፍያ ደንብ ቁጥር ፩/፪ሺ፲፯ (Regulation No. 1/2024) መሠረት የተዘጋጀ
            </p>
            <div class="meta">${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}</div>
          </div>

          <div>
            <p><strong>የክሱ አይነት፡</strong> ${claimType === 'pecuniary' ? 'በገንዘብ የሚተመን ክስ (Monetary Claim)' : `ገንዘብ ነክ ያልሆነ ክስ (${breakdown.nonPecuniaryType})`}</p>
            ${claimType === 'pecuniary' ? `<p><strong>የይገባኛል የገንዘብ መጠን፡</strong> ETB ${breakdown.claimAmount.toLocaleString()} (${getEthiopianAmountInWords(breakdown.claimAmount)})</p>` : ''}
            ${breakdown.appliedPercentage ? `<p><strong>ተፈጻሚ የሆነው ምጣኔ (Rate):</strong> ${breakdown.appliedPercentage.toFixed(1)}%</p>` : ''}
            <p><strong>የተከሳሾች ብዛት፡</strong> ${defendantCount} | <strong>የምስክሮች ብዛት፡</strong> ${witnessCount} | <strong>የሰነድ ገጾች፡</strong> ${documentPages}</p>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>የክፍያው ዝርዝር (Service Description)</th>
                <th>ሕጋዊ መሠረት (Legal Basis)</th>
                <th>መጠን (ETB)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1. ዋና የዳኝነት አገልግሎት ክፍያ (Base Court Fee)</td>
                <td>ደንብ ቁጥር 1/2017 ሠንጠረዥ ክፍል 1/2</td>
                <td><strong>ETB ${breakdown.baseCourtFee.toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td>2. የተከሳሽ መጥሪያ ክፍያ (Summons Service)</td>
                <td>${defendantCount} ተከሳሾች × 50 ETB</td>
                <td>ETB ${breakdown.summonsFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td>3. የምስክር መጥሪያ ክፍያ (Witness Summons)</td>
                <td>${witnessCount} ምስክሮች × 50 ETB</td>
                <td>ETB ${breakdown.witnessSummonsFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td>4. የሰነዶች ቅጂ ክፍያ (Document Copies)</td>
                <td>${documentPages} ገጾች × 5 ETB</td>
                <td>ETB ${breakdown.documentCopyFee.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>አጠቃላይ የሚፈለግ የመጀመርያ ደረጃ የዳኝነት ክፍያ (Total Payable)</strong></td>
                <td><strong style="color: #b45309; font-size: 18px;">ETB ${breakdown.totalFirstInstanceFee.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>

          <h3>ተጓዳኝ የክርክር እርከኖች ክፍያ (Ancillary Proceedings Fees):</h3>
          <ul>
            <li><strong>የይግባኝ አቤቱታ ክፍያ (Appeal Fee):</strong> ETB ${breakdown.appealFee.toLocaleString()} (በስር ፍርድ ቤት ከተከፈለው 50%)</li>
            <li><strong>የሰበር አቤቱታ ክፍያ (Cassation Petition):</strong> ETB ${breakdown.cassationFee.toLocaleString()}</li>
            <li><strong>የፍርድ አፈጻጸም ክፍያ (Decree Execution):</strong> ETB ${breakdown.executionFee.toLocaleString()} (በደንብ 1/2017 ክፍል 3 መሠረት)</li>
          </ul>

          <div class="law-box">
            <p><strong>አስፈላጊ የሕግ ድንጋጌዎች (Regulation 1/2017 Statutory Notes):</strong></p>
            <p>1. <strong>በዕርቅ ሲጠናቀቅ ተመላሽ ክፍያ፦</strong> ክርክሩ በፍርድ ሳይዘጋ በዕርቅ ወይም በስምምነት ከተጠናቀቀ ከዋናው ክፍያ 50% (ETB ${breakdown.settlementRefundAmount.toLocaleString()}) ተመላሽ ይደረጋል።</p>
            <p>2. <strong>ከተሸናፊ ወገን ስለመመለሱ (Cost Recovery)፦</strong> ከሳሽ ክሱን ሲያሸንፍ የከፈለውን የዳኝነት፣ የመጥሪያና ሌሎች ወጪዎች ከተከሳሹ ላይ እንዲመለስለት ፍርድ ቤቱ ያዛል።</p>
            <p>3. <strong>ከክፍያ ነፃ መሆን (Exemption)፦</strong> የሰብአዊ መብቶች ጥሰት፣ የአካባቢ ጥበቃ እና የመንግስት ተቋማት (በአዋጅ 1381/2017 መሠረት) ከዳኝነት ክፍያ ነፃ ናቸው።</p>
          </div>
        </body>
      </html>
    `);

    printWin.document.close();
    printWin.focus();
    printWin.print();
  };

  // Copy Summary
  const handleCopy = () => {
    const text = `
[የፌዴራል ፍርድ ቤቶች አዲስ የዳኝነት ክፍያ ደንብ ቁጥር 1/2017 (Regulation 1/2024)]
የክስ አይነት: ${claimType === 'pecuniary' ? 'በገንዘብ የሚተመን ክስ' : `ገንዘብ ነክ ያልሆነ (${breakdown.nonPecuniaryType})`}
የይገባኛል የገንዘብ መጠን: ETB ${breakdown.claimAmount.toLocaleString()}
የተተገበረው ምጣኔ (Rate): ${breakdown.appliedPercentage ? `${breakdown.appliedPercentage.toFixed(1)}%` : 'የተወሰነ ቋሚ ታሪፍ'}
ዋና የዳኝነት ክፍያ (Base Court Fee): ETB ${breakdown.baseCourtFee.toLocaleString()}
የተከሳሽ መጥሪያ (Summons): ETB ${breakdown.summonsFee.toLocaleString()} (${defendantCount} × 50 ETB)
የምስክሮች መጥሪያ (Witness Summons): ETB ${breakdown.witnessSummonsFee.toLocaleString()} (${witnessCount} × 50 ETB)
የሰነዶች ቅጂ (Copies): ETB ${breakdown.documentCopyFee.toLocaleString()} (${documentPages} × 5 ETB)
------------------------------------------------
አጠቃላይ የሚከፈል ክፍያ (Total First Instance): ETB ${breakdown.totalFirstInstanceFee.toLocaleString()}
በዕርቅ ቢጠናቀቅ ተመላሽ የሚሆን (50% Refund): ETB ${breakdown.settlementRefundAmount.toLocaleString()}
የይግባኝ አቤቱታ ክፍያ (50% of Lower Court): ETB ${breakdown.appealFee.toLocaleString()}
የፍርድ አፈጻጸም ክፍያ (Execution Fee): ETB ${breakdown.executionFee.toLocaleString()}
ሕጋዊ መሠረት: የፌዴራል ፍርድ ቤቶች የዳኝነት ክፍያ ደንብ ቁጥር 1/2017 (Regulation 1/2024)
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/30 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isOromo ? 'Dambii Haaraa Lakk. 1/2017' : 'አዲሱ ይፋዊ ደንብ ቁጥር ፩/፪ሺ፲፯ (Regulation 1/2024)'}</span>
              <span className="text-amber-500/50">•</span>
              <span className="text-amber-300">የቀድሞውን የ1952 ደንብ የተካ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('feeCalculatorTitle')}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              {t('feeCalculatorSubtitle')}
            </p>
          </div>

          {/* Sub Navigation Strip */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0 flex-wrap">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Shallaggii' : 'የክፍያ ስሌት'}</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'schedule'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Gabatee Dambii 1/2017' : 'የደንብ 1/2017 ሠንጠረዥ'}</span>
            </button>

            <button
              onClick={() => setActiveTab('exemptions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'exemptions'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Bilisa Ta\'uu (Kw. 21)' : 'ከክፍያ ነፃ መሆን (አንቀጽ 21)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('refund')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'refund'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Kaffaltii Deebi\'u' : 'ተመላሽ ክፍያ'}</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Walgidduu (1/2017 vs 1952)' : 'አዲሱና የ1952 ደንብ ንፅፅር'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Regulation Switcher Banner (New 1/2017 vs Legacy 1952) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">{isOromo ? 'Dambii Ittiin Shallagamu:' : 'ስሌቱ የሚመራበት ደንብ፡'}</span>
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setRegulationVersion('reg_1_2017')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                regulationVersion === 'reg_1_2017'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ★ አዲሱ ደንብ ቁጥር 1/2017 (2024) [አሁን የሚሰራበት]
            </button>
            <button
              onClick={() => setRegulationVersion('legacy_1952')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                regulationVersion === 'legacy_1952'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              የቀድሞው የ1952 ደንብ (የተሻረ)
            </button>
          </div>
        </div>

        {/* Government Exemption Toggle (Per Proc 1381/2017 amendment to Art 21) */}
        <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={isGovernmentOrg}
            onChange={(e) => setIsGovernmentOrg(e.target.checked)}
            className="accent-amber-500"
          />
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-semibold">ከሳሽ የመንግስት ተቋም ነው (በአዋጅ 1381/2017 ነፃ)</span>
        </label>
      </div>

      {/* TAB 1: MAIN CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Input Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
              {/* Claim Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {isOromo ? 'Akaakuu Himannaa Filadhaa:' : 'የክሱን አይነት ይምረጡ፡'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setClaimType('pecuniary')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      claimType === 'pecuniary'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>{t('claimTypePecuniary')}</span>
                  </button>

                  <button
                    onClick={() => setClaimType('non_pecuniary')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      claimType === 'non_pecuniary'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{t('claimTypeNonPecuniary')}</span>
                  </button>
                </div>
              </div>

              {/* PECUNIARY INPUT */}
              {claimType === 'pecuniary' ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-amber-300">
                        {t('claimAmountInputLabel')}
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {getEthiopianAmountInWords(claimAmount)}
                      </span>
                    </div>

                    <div className="relative">
                      <span className="absolute left-4 top-3 text-amber-400 font-bold text-base">ETB</span>
                      <input
                        type="text"
                        value={claimAmountInput}
                        onChange={(e) => handleAmountInputChange(e.target.value)}
                        placeholder="0"
                        className="w-full pl-16 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xl font-bold focus:border-amber-500 focus:outline-none shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Range Slider for Exploring */}
                  <div>
                    <input
                      type="range"
                      min={5000}
                      max={25000000}
                      step={10000}
                      value={claimAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setClaimAmount(val);
                        setClaimAmountInput(String(val));
                      }}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>20,000 ETB (10%)</span>
                      <span>500,000 ETB (4.7%)</span>
                      <span>2,000,000 ETB (4.1%)</span>
                      <span>10,000,000 ETB (3.3%)</span>
                      <span>25,000,000+ ETB (2.8%)</span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                      {isOromo ? 'Qarshii beekkamaa kanaan yaalaa:' : 'የተለመዱ የገንዘብ መጠኖችና ተጓዳኝ ምጣኔዎች (Presets)፡'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {presets.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => {
                            setClaimAmount(p.value);
                            setClaimAmountInput(String(p.value));
                          }}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                            claimAmount === p.value
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* NON-PECUNIARY INPUT */
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300">
                    {isOromo ? 'Gosa Himannaa Gatii Maallaqaa Hin Qabne Filadhaa:' : 'በደንብ 1/2017 የተደነገገውን የክስ ወይም የማመልከቻ አይነት ይምረጡ፡'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {NON_PECUNIARY_REG_1_2017.map((item) => {
                      const isSelected = selectedNonPecuniary === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedNonPecuniary(item.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500 shadow-lg shadow-amber-500/5'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">
                              {isOromo ? item.nameOm : isEnglish ? item.nameEn : item.nameAm}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-400">
                              {item.fee === 0 ? 'ነፃ (0 ETB)' : `ETB ${item.fee.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {isOromo ? item.descriptionOm : item.descriptionAm}
                          </p>
                          <span className="text-[10px] text-amber-400/80 font-mono mt-1.5 block">
                            {item.statute}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ancillary Costs (Summons per Defendant, Witnesses, Copies per page) under Regulation 1/2017 */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>{isOromo ? 'Tajaajiloota Dabalataa Mana Murtii (Dambii 1/2017):' : 'ተጓዳኝ አገልግሎቶች (በደንብ ቁጥር 1/2017 ታሪፍ መሠረት)፡'}</span>
                  <span className="text-[11px] text-amber-400 font-normal">መጥሪያ 50 ETB • ቅጂ 5 ETB/ገጽ</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Defendants Count */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>የተከሳሽ መጥሪያ</span>
                        <span className="text-amber-400 font-mono">50 ETB/ሰው</span>
                      </div>
                      <p className="text-[11px] text-slate-500">በፖሊስ ወይም በፖስተኛ የሚደርስ</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setDefendantCount(Math.max(1, defendantCount - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-bold text-white">{defendantCount}</span>
                      <button
                        onClick={() => setDefendantCount(defendantCount + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Witnesses Count */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>የምስክር መጥሪያ</span>
                        <span className="text-amber-400 font-mono">50 ETB/ሰው</span>
                      </div>
                      <p className="text-[11px] text-slate-500">ለፍርድ ቤት ምስክሮች የሚላክ</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setWitnessCount(Math.max(0, witnessCount - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-bold text-white">{witnessCount}</span>
                      <button
                        onClick={() => setWitnessCount(witnessCount + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Document Copies Count */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                        <span>የሰነድ ቅጂዎች</span>
                        <span className="text-amber-400 font-mono">5 ETB/ገጽ</span>
                      </div>
                      <p className="text-[11px] text-slate-500">የክስና ማስረጃ ቅጂ ማህተም</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setDocumentPages(Math.max(0, documentPages - 5))}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-bold text-white">{documentPages} ገጽ</span>
                      <button
                        onClick={() => setDocumentPages(documentPages + 5)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Percentage Citation Card */}
            {claimType === 'pecuniary' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>
                      {regulationVersion === 'reg_1_2017'
                        ? 'በደንብ ቁጥር 1/2017 መሠረት የተተገበረው የክፍያ ምጣኔ (Applicable Rate)'
                        : 'የቀድሞው የ1952 ደንብ እርከኖች (Legacy 1952 Schedule)'}
                    </span>
                  </h3>
                  {breakdown.appliedPercentage && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                      {breakdown.appliedPercentage.toFixed(1)}% ምጣኔ
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2 pr-3 font-semibold">የገንዘብ እርከን</th>
                        <th className="py-2 px-3 font-semibold">ምጣኔ (Percentage)</th>
                        <th className="py-2 px-3 font-semibold">የተሰላበት ገንዘብ</th>
                        <th className="py-2 pl-3 text-right font-semibold">ክፍያ (ETB)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {breakdown.brackets.map((b, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 pr-3 text-white font-bold">{b.range}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[11px] font-bold">
                              {b.rate}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            {b.applicableAmount.toLocaleString()} ETB
                          </td>
                          <td className="py-2.5 pl-3 text-right text-emerald-400 font-bold">
                            ETB {b.feeAmount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-950 font-bold border-t-2 border-slate-700">
                        <td colSpan={3} className="py-3 px-3 text-white font-sans">
                          {t('baseFeeLabel')}
                        </td>
                        <td className="py-3 pl-3 text-right text-amber-400 text-sm">
                          ETB {breakdown.baseCourtFee.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Computed Fee Summary & Slip (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Total Fee Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>{isOromo ? 'Waraqaa Shallaggii' : 'የክፍያ ማጠቃለያ (Assessment Slip)'}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title={t('copy')}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handlePrintSlip}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
                    title={t('print')}
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total Prominent Display */}
              <div className="py-6 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  {t('calculatedTotalCourtFee')}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight font-mono">
                  {isGovernmentOrg ? '0 ETB (ነፃ)' : `ETB ${breakdown.totalFirstInstanceFee.toLocaleString()}`}
                </div>
                <div className="text-xs text-slate-400 mt-2 font-medium">
                  {isGovernmentOrg ? (
                    <span className="text-blue-300 font-semibold">
                      የመንግስት ተቋማት በአዋጅ ቁጥር 1381/2017 ማሻሻያ መሠረት ከዳኝነት ክፍያ ሙሉ ለሙሉ ነፃ ናቸው
                    </span>
                  ) : claimType === 'pecuniary' ? (
                    <span>
                      የይገባኛል ጥያቄ፡ ETB {breakdown.claimAmount.toLocaleString()}{' '}
                      {breakdown.appliedPercentage && (
                        <strong className="text-amber-300 font-mono">
                          ({breakdown.appliedPercentage.toFixed(1)}%)
                        </strong>
                      )}
                    </span>
                  ) : (
                    <span>በደንብ ቁጥር 1/2017 የተወሰነ ቋሚ ክፍያ</span>
                  )}
                </div>
              </div>

              {/* Detailed Breakdown List */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('baseFeeLabel')}</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    ETB {breakdown.baseCourtFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>የተከሳሽ መጥሪያ ({defendantCount} × 50 ETB)</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    ETB {breakdown.summonsFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>የምስክሮች መጥሪያ ({witnessCount} × 50 ETB)</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    ETB {breakdown.witnessSummonsFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>የሰነድ ቅጂዎች ({documentPages} ገጽ × 5 ETB)</span>
                  </span>
                  <span className="font-mono font-bold text-white">
                    ETB {breakdown.documentCopyFee.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 50% Settlement Refund Notice (Regulation 1/2017) */}
              <div className="mt-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-300 block">
                    በዕርቅ ሲጠናቀቅ ተመላሽ የሚሆን (50% Refund)፡
                  </span>
                  <p className="text-emerald-200/80 mt-0.5">
                    ክርክሩ በፍርድ ሳይዘጋ በዕርቅ ወይም በሽምግልና ከተጠናቀቀ{' '}
                    <strong className="text-white font-mono">ETB {breakdown.settlementRefundAmount.toLocaleString()}</strong> (50%)
                    ተመላሽ ይደረጋል።
                  </p>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                {onNavigateToDrafter && (
                  <button
                    onClick={() => onNavigateToDrafter(String(claimAmount), breakdown.totalFirstInstanceFee)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{isOromo ? 'Kaffaltii Kanaan Himannaa Qopheessi' : 'በዚህ የክፍያ ስሌት ክስ አዘጋጅ (ለከሳሽ)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {onNavigateToDefense && (
                  <button
                    onClick={() => onNavigateToDefense(String(claimAmount), breakdown.totalFirstInstanceFee)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{isOromo ? 'Deebii Himatamaa fi Kasaaraa Qopheessi' : 'በዚህ ስሌት የመከላከያ መልስ አዘጋጅ (ለተከሳሽ - Art. 462)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {onNavigateToJurisdiction && (
                  <button
                    onClick={() => onNavigateToJurisdiction(String(claimAmount))}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isOromo ? 'Mana Murtii Aangoo Qabu Sakatta\'i' : 'ይህንን ክስ የትኛው ፍርድ ቤት እንደሚያየው እይ'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Other Procedural Stages under Regulation 1/2017 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>በደንብ 1/2017 መሠረት በሌሎች እርከኖች የሚፈለጉ ክፍያዎች፡</span>
              </h4>

              <div className="space-y-2 text-xs">
                {/* Appeal */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">የይግባኝ አቤቱታ ክፍያ (Appeal Fee)</span>
                    <span className="text-[11px] text-slate-400">በስር ፍርድ ቤት ከተከፈለው 50 በመቶ</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    ETB {breakdown.appealFee.toLocaleString()}
                  </span>
                </div>

                {/* Cassation */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">የሰበር አቤቱታ ክፍያ (Cassation Fee)</span>
                    <span className="text-[11px] text-slate-400">የጠቅላይ ፍርድ ቤት ሰበር ችሎት አቤቱታ</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    ETB {breakdown.cassationFee.toLocaleString()}
                  </span>
                </div>

                {/* Execution of Decree */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">የፍርድ አፈጻጸም ክፍያ (Execution Fee)</span>
                    <span className="text-[11px] text-slate-400">በደንብ 1/2017 ክፍል 3 ሰንጠረዥ መሠረት</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    ETB {breakdown.executionFee.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE OF REGULATION NO. 1/2017 */}
      {activeTab === 'schedule' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>የፌዴራል ፍርድ ቤቶች የዳኝነት ክፍያ ደንብ ቁጥር ፩/፪ሺ፲፯ (Regulation 1/2024)</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              የገንዘብ ነክ ጉዳዮች ይፋዊ የዳኝነት ክፍያ መቶኛ ሰንጠረዥ (Schedule of Fees)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              በአዲሱ ደንብ መሠረት የክሱ የገንዘብ መጠን እየጨመረ ሲሄድ የሚከፈለው መቶኛ ምጣኔ ተመጣጣኝ እንዲሆን ደረጃ በደረጃ ይቀንሳል፦
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { range: '0 – 20,000 ብር', rate: '10.0%', example: 'ለ20,000 ብር = 2,000 ብር' },
              { range: '20,001 – 40,000 ብር', rate: '9.0%', example: 'ለ40,000 ብር = 3,600 ብር' },
              { range: '40,001 – 60,000 ብር', rate: '8.0%', example: 'ለ60,000 ብር = 4,800 ብር' },
              { range: '60,001 – 80,000 ብር', rate: '7.0%', example: 'ለ80,000 ብር = 5,600 ብር' },
              { range: '80,001 – 100,000 ብር', rate: '6.0%', example: 'ለ100,000 ብር = 6,000 ብር' },
              { range: '100,001 – 200,000 ብር', rate: '5.0%', example: 'ለ200,000 ብር = 10,000 ብር' },
              { range: '200,001 – 300,000 ብር', rate: '4.9%', example: 'ለ300,000 ብር = 14,700 ብር' },
              { range: '300,001 – 400,000 ብር', rate: '4.8%', example: 'ለ400,000 ብር = 19,200 ብር' },
              { range: '400,001 – 500,000 ብር', rate: '4.7%', example: 'ለ500,000 ብር = 23,500 ብር' },
              { range: '500,001 – 600,000 ብር', rate: '4.6%', example: 'ለ600,000 ብር = 27,600 ብር' },
              { range: '600,001 – 700,000 ብር', rate: '4.5%', example: 'ለ700,000 ብር = 31,500 ብር' },
              { range: '700,001 – 800,000 ብር', rate: '4.4%', example: 'ለ800,000 ብር = 35,200 ብር' },
              { range: '800,001 – 900,000 ብር', rate: '4.3%', example: 'ለ900,000 ብር = 38,700 ብር' },
              { range: '900,001 – 1,000,000 ብር', rate: '4.2%', example: 'ለ1 ሚሊዮን = 42,000 ብር' },
              { range: '1,000,001 – 2,000,000 ብር', rate: '4.1%', example: 'ለ2 ሚሊዮን = 82,000 ብር' },
              { range: '2,000,001 – 3,000,000 ብር', rate: '4.0%', example: 'ለ3 ሚሊዮን = 120,000 ብር' },
              { range: '3,000,001 – 4,000,000 ብር', rate: '3.9%', example: 'ለ4 ሚሊዮን = 156,000 ብር' },
              { range: '4,000,001 – 5,000,000 ብር', rate: '3.8%', example: 'ለ5 ሚሊዮን = 190,000 ብር' },
              { range: '5,000,001 – 6,000,000 ብር', rate: '3.7%', example: 'ለ6 ሚሊዮን = 222,000 ብር' },
              { range: '6,000,001 – 7,000,000 ብር', rate: '3.6%', example: 'ለ7 ሚሊዮን = 252,000 ብር' },
              { range: '7,000,001 – 8,000,000 ብር', rate: '3.5%', example: 'ለ8 ሚሊዮን = 280,000 ብር' },
              { range: '8,000,001 – 9,000,000 ብር', rate: '3.4%', example: 'ለ9 ሚሊዮን = 306,000 ብር' },
              { range: '9,000,001 – 10,000,000 ብር', rate: '3.3%', example: 'ለ10 ሚሊዮን = 330,000 ብር' },
              { range: '10,000,001 – 20,000,000 ብር', rate: '2.9%', example: 'ለ20 ሚሊዮን = 580,000 ብር' },
              { range: '20,000,001 – 30,000,000 ብር', rate: '2.8%', example: 'ለ30 ሚሊዮን = 840,000 ብር' },
              { range: '30,000,001 – 40,000,000 ብር', rate: '2.7%', example: 'ለ40 ሚሊዮን = 1,080,000 ብር' },
              { range: '40,000,001 – 50,000,000 ብር', rate: '2.6%', example: 'ለ50 ሚሊዮን = 1,300,000 ብር' },
              { range: 'ከ100,000,000 ብር በላይ', rate: '2.0%', example: 'በጣሪያ ገደብ (Cap) መሰረት' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-300 font-semibold block">{item.range}</span>
                <div className="font-mono text-sm font-bold text-amber-400">{item.rate}</div>
                <p className="text-[10px] text-slate-500">{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXEMPTIONS (ከዳኝነት ክፍያ ነፃ የሚሆኑ ጉዳዮች - አንቀጽ 21) */}
      {activeTab === 'exemptions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>በደንብ ቁጥር 1/2017 አንቀጽ 21 መሠረት ከዳኝነት ክፍያ ሙሉ ለሙሉ ነፃ የሆኑ ጉዳዮች</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              የፍትህ ተደራሽነትን እና ህገ-መንግስታዊ መብቶችን ለማስጠበቅ የሚከተሉት ወገኖችና ጉዳዮች ምንም አይነት የፍርድ ቤት ክፍያ አይከፍሉም፦
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-white">የሰብአዊ መብቶች ጥሰት ክሶች (Human Rights)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                በኢ.ፌ.ዲ.ሪ ሕገ-መንግሥት ምዕራፍ ሦስት የተዘረዘሩትን መሠረታዊ መብቶችና ነፃነቶች መጣስ አስመልክቶ የሚቀርቡ ክሶች ከዳኝነት ክፍያ ነፃ ናቸው።
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-white">የአካባቢ ጥበቃ እና የህዝብ ጥቅም ክሶች (Environmental)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                የአካባቢ ብክለትን ለመከላከል ወይም የህዝብን የጋራ የተፈጥሮ ሀብት ለማስጠበቅ የሚቀርቡ ክሶች ክፍያ አይጠየቅባቸውም።
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-white">የመንግስት ተቋማት (በአዋጅ ቁጥር 1381/2017 ማሻሻያ)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                በአዋጅ ቁጥር 1381/2017 ማሻሻያ መሠረት በደንብ 1/2017 አንቀጽ 21 ንዑስ አንቀጽ (7) ተጨምሮ ማንኛውም የመንግስት ተቋም ለሚያቀርበው ክስ የዳኝነት ክፍያ አይከፍልም።
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h4 className="text-sm font-bold text-white">በደሃ ደንብ ክስ የሚመሰርቱ ዜጎች (In Forma Pauperis)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                የዳኝነት ክፍያ ለመክፈል አቅም የሌላቸው ድሃ ዜጎች የድህነት ማረጋገጫ በማቅረብ ያለምንም ክፍያ ክሳቸውን ማስመዝገብ ይችላሉ።
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REFUND RULES */}
      {activeTab === 'refund' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
              <span>የዳኝነት ክፍያ ተመላሽ የሚደረግበት ሁኔታ (Court Fee Refund Rules)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              በደንብ ቁጥር 1/2017 እና በፍትሐብሔር ሥነ-ሥርዓት ሕግ መሠረት የተከፈለ የዳኝነት ክፍያ በሚከተሉት ሁኔታዎች ተመላሽ ይደረጋል፦
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 block">1. በዕርቅ ሲጠናቀቅ (50% ተመላሽ)</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                ክርክሩ በፍርድ ሳይዘጋ በዕርቅ ወይም በሽምግልና ከተጠናቀቀ ከሳሽ ከከፈለው ዋና የዳኝነት ክፍያ ግማሹ (50%) በፍርድ ቤቱ ሂሳብ ክፍል ተመላሽ ይደረግለታል።
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-blue-400 block">2. ስልጣን ባለመኖሩ ሲዘጋ</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                ፍርድ ቤቱ ጉዳዩን የማየት የቁሳቁስ ወይም የግዛት ስልጣን የለኝም ብሎ ክሱን ሳይመለከተው መዝገቡን ሲዘጋው የተከፈለው ክፍያ ሙሉ ለሙሉ ተመላሽ ይሆናል።
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 block">3. ከመጠን በላይ በስህተት ሲከፈል</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                በስሌት ስህተት ምክንያት ከትክክለኛው የደንቡ መቶኛ በላይ የተከፈለ ትርፍ ገንዘብ በማመልከቻ ሲረጋገጥ ወዲያውኑ ተመላሽ ይደረጋል።
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMPARISON (NEW 1/2017 VS LEGACY 1952) */}
      {activeTab === 'comparison' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>የአዲሱ ደንብ ቁጥር 1/2017 እና የቀድሞው የ1952 ደንብ ቁልፍ ልዩነቶች</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              በኢትዮጵያ ፍርድ ቤቶች ታሪክ ውስጥ ከ70 ዓመታት በኋላ የተደረገው የዳኝነት ክፍያ ማሻሻያ ዋና ዋና ልዩነቶች፦
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-bold">የጉዳዩ አይነት</th>
                  <th className="py-3 px-3 font-bold text-amber-400">አዲሱ ደንብ ቁጥር ፩/፪ሺ፲፯ (2024)</th>
                  <th className="py-3 px-3 font-bold text-slate-400">የቀድሞው የ1952 ደንብ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-bold text-white">የገንዘብ ክሶች ስሌት መዋቅር</td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">ከተጠየቀው ገንዘብ በግልጽ በሚታወቅ መቶኛ (10% እስከ 2%) ተመጣጣኝ ስሌት</td>
                  <td className="py-3 px-3 text-slate-400">የተቆራረጡ 7 እርከኖች እና ድምር ስሌት (የተወሳሰበ)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">ገንዘብ ነክ ያልሆኑ ክሶች</td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">በፍርድ ቤት ደረጃ፦ መጀመሪያ ደረጃ (1,000 ETB)፣ ከፍተኛ (1,500 ETB)፣ ጠቅላይ (2,000 ETB)</td>
                  <td className="py-3 px-3 text-slate-400">አነስተኛና የዋጋ ግሽበትን ያላገናዘበ (50 - 250 ETB)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">የይግባኝ አቤቱታ ክፍያ</td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">በስር ፍርድ ቤት ከተከፈለው 50 በመቶ (ግማሽ)</td>
                  <td className="py-3 px-3 text-slate-400">ሙሉ ወይም ያልተስተካከለ ክፍያ</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">የፍርድ አፈጻጸም ክፍያ</td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">የተወሰነ የገንዘብ እርከን (ከ300 እስከ 3,000 ETB ብቻ)</td>
                  <td className="py-3 px-3 text-slate-400">1% ወይም አጠቃላይ ግምት</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">የመጥሪያና ሰነዶች ክፍያ</td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">መጥሪያ 50 ETB በሰው • ሰነድ ቅጂ 5 ETB በገጽ</td>
                  <td className="py-3 px-3 text-slate-400">የማይታወቅና የተለያየ አሰራር</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">ከክፍያ ነፃ የመሆን ጥበቃ</td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">ሰብአዊ መብት፣ አካባቢ ጥበቃና የመንግስት ተቋማት በግልጽ ነፃ ናቸው</td>
                  <td className="py-3 px-3 text-slate-400">በደሃ ደንብ ብቻ የተወሰነ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
