import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  FileText,
  Upload,
  Sparkles,
  Printer,
  Copy,
  Check,
  Download,
  Scale,
  Building,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  Trash2,
  BookmarkPlus,
  RotateCcw,
  ChevronRight,
  Eye,
  Edit3,
  FileCheck,
  UserCheck,
  Briefcase,
  AlertCircle,
  FileQuestion,
  Layers,
  ArrowRight,
  Calendar,
  Calculator,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DefenseGenerationRequest, DefenseGenerationResult, DefenseWitness, ManagedCase, LegalCategory, CourtHearing } from '../types/legal';

export interface DefenseDrafterInitialData {
  courtName?: string;
  benchName?: string;
  caseNumber?: string;
  plaintiffName?: string;
  plaintiffAddress?: string;
  defendantName?: string;
  defendantAddress?: string;
  defendantPhone?: string;
  disputeCategory?: string;
  claimText?: string;
  claimAmountETB?: string;
  factsDenied?: string;
  factsAdmitted?: string;
  affirmativeDefenses?: string;
  selectedObjections?: string[];
  counterClaimText?: string;
  counterClaimAmount?: string;
}

export interface DefenseDrafterProps {
  initialData?: DefenseDrafterInitialData | null;
  onSaveToManagedCases?: (newCase: ManagedCase) => void;
  onNavigateToJurisdiction?: (claimAmount: string) => void;
  onNavigateToFeeCalculator?: (amount: number) => void;
  onNavigateToHearings?: (hearingData?: Partial<CourtHearing>) => void;
  onNavigateToDrafter?: () => void;
}

export const DefenseDrafter: React.FC<DefenseDrafterProps> = ({
  initialData,
  onSaveToManagedCases,
  onNavigateToJurisdiction,
  onNavigateToFeeCalculator,
  onNavigateToHearings,
  onNavigateToDrafter,
}) => {
  const { t, isOromo, isEnglish } = useLanguage();

  // Wizard Steps: 1 (Claim Document / Text) -> 2 (Defendant Position & Objections) -> 3 (Generated Statement of Defense)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileMimeType, setFileMimeType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');

  // Claim Details Input
  const [claimText, setClaimText] = useState<string>('');
  const [courtName, setCourtName] = useState<string>('የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት');
  const [benchName, setBenchName] = useState<string>('ፍትሐብሔር ችሎት');
  const [caseNumber, setCaseNumber] = useState<string>('መ/ቁ 24819/2017');
  const [plaintiffName, setPlaintiffName] = useState<string>('አቶ ተስፋዬ በቀለ ገብረመድህን');
  const [plaintiffAddress, setPlaintiffAddress] = useState<string>('አዲስ አበባ፣ ቂርቆስ ክ/ከተማ');
  const [defendantName, setDefendantName] = useState<string>('ወ/ሮ አስቴር ደሳለኝ ወርቁ');
  const [defendantAddress, setDefendantAddress] = useState<string>('አዲስ አበባ፣ ቦሌ ክፍለ ከተማ፣ ወረዳ 03');
  const [defendantPhone, setDefendantPhone] = useState<string>('+251 911 456789');
  const [disputeCategory, setDisputeCategory] = useState<string>('የገንዘብ ብድርና የውል ጥሰት');

  // Defense Positions & Preliminary Objections
  const [selectedObjections, setSelectedObjections] = useState<string[]>([
    'limitation_expired',
    'lack_of_notice',
  ]);
  const [customObjection, setCustomObjection] = useState<string>('');
  const [factsDenied, setFactsDenied] = useState<string>(
    'ከሳሽ በክሱ የገለጸውን 750,000 ብር ዕዳ ሙሉ ለሙሉ እክዳለሁ፤ የጠየቀው ገንዘብ በባንክ በኩል በደረሰኝ የተከፈለና የተጠናቀቀ ነው።'
  );
  const [factsAdmitted, setFactsAdmitted] = useState<string>('ከሳሽ ጋር በ2014 ዓ.ም ውል ተፈራርመን እንደነበር እውነት ነው።');
  const [affirmativeDefenses, setAffirmativeDefenses] = useState<string>(
    'ተከሳሽ ለከሳሽ ሊከፈል የሚገባውን ገንዘብ በንብረት ባንክ በኩል በሙሉ የከፈለ ሲሆን ደረሰኝ በእጄ ይገኛል።'
  );
  const [hasCounterClaim, setHasCounterClaim] = useState<boolean>(false);
  const [counterClaimText, setCounterClaimText] = useState<string>('');
  const [counterClaimAmount, setCounterClaimAmount] = useState<string>('');
  const [evidenceListText, setEvidenceListText] = useState<string>(
    '1. የባንክ ክፍያ ማረጋገጫ ደረሰኝ\n2. የውል ሰነድ\n3. የቴሌግራም እና የዋትስአፕ የጽሑፍ ልውውጦች'
  );
  const [witnesses, setWitnesses] = useState<DefenseWitness[]>([
    {
      name: 'አቶ ደረጀ ተሾመ',
      address: 'አዲስ አበባ፣ ቦሌ',
      testimonyTopic: 'ክፍያው በባንክ መፈጸሙንና ከሳሽ ገንዘቡን መቀበሉን',
    },
  ]);

  // Synchronize initial data from other modules (Consultation, Jurisdiction, Case Center)
  useEffect(() => {
    if (!initialData) return;
    if (initialData.courtName) setCourtName(initialData.courtName);
    if (initialData.benchName) setBenchName(initialData.benchName);
    if (initialData.caseNumber) setCaseNumber(initialData.caseNumber);
    if (initialData.plaintiffName) setPlaintiffName(initialData.plaintiffName);
    if (initialData.plaintiffAddress) setPlaintiffAddress(initialData.plaintiffAddress);
    if (initialData.defendantName) setDefendantName(initialData.defendantName);
    if (initialData.defendantAddress) setDefendantAddress(initialData.defendantAddress);
    if (initialData.defendantPhone) setDefendantPhone(initialData.defendantPhone);
    if (initialData.disputeCategory) setDisputeCategory(initialData.disputeCategory);
    if (initialData.claimText) setClaimText(initialData.claimText);
    if (initialData.factsDenied) setFactsDenied(initialData.factsDenied);
    if (initialData.factsAdmitted) setFactsAdmitted(initialData.factsAdmitted);
    if (initialData.affirmativeDefenses) setAffirmativeDefenses(initialData.affirmativeDefenses);
    if (initialData.selectedObjections && initialData.selectedObjections.length > 0) {
      setSelectedObjections(initialData.selectedObjections);
    }
    if (initialData.counterClaimText) {
      setHasCounterClaim(true);
      setCounterClaimText(initialData.counterClaimText);
      if (initialData.counterClaimAmount) setCounterClaimAmount(initialData.counterClaimAmount);
    }
  }, [initialData]);

  // Loading & Results
  const [loading, setLoading] = useState<boolean>(false);
  const [defenseResult, setDefenseResult] = useState<DefenseGenerationResult | null>(null);
  const [editablePleading, setEditablePleading] = useState<string>('');
  const [isEditingPleading, setIsEditingPleading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sample lawsuit presets for quick test
  const sampleLawsuitPresets = [
    {
      title: isOromo ? 'Himannaa Liqii Qarshii 750,000 (Waliigaltee)' : 'የ750,000 ብር የብድር ክስ (ገንዘቡ በባንክ የተከፈለ)',
      claimText: `ለፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት
መዝገብ ቁጥር 24819/2017
ከሳሽ፡ አቶ ተስፋዬ በቀለ ገብረመድህን
ተከሳሽ፡ ወ/ሮ አስቴር ደሳለኝ ወርቁ
ጉዳዩ፡ የ750,000 ብር የገንዘብ ብድርና ወለድ ይከፈለኝ ስለማለት የቀረበ ክስ።
1. ከሳሽና ተከሳሽ ጥር 12 ቀን 2013 ዓ.ም በጽሑፍ በተደረገ ውል ከሳሽ ለተከሳሽ 750,000 ብር አበድሬያለሁ።
2. ተከሳሽ ብድሩን በ6 ወር ጊዜ ውስጥ እንድትመልስ የተስማማች ቢሆንም እስካሁን አልመለሰችም።
3. በመሆኑም ተከሳሽ ዋናውን ገንዘብ 750,000 ብር ከነህጋዊ ወለዱ ጋር እንድትከፍል ይወሰንልኝ።`,
      courtName: 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት',
      caseNo: 'መ/ቁ 24819/2017',
      plaintiff: 'አቶ ተስፋዬ በቀለ ገብረመድህን',
      defendant: 'ወ/ሮ አስቴር ደሳለኝ ወርቁ',
      objections: ['limitation_expired', 'lack_of_notice'],
      factsDenied: 'ከሳሽ የጠቀሰውን 750,000 ብር አልመለሰችም የሚለውን ክስ በሙሉ እክዳለሁ፤ ገንዘቡ በባንክ በኩል በ2 ጊዜ ሙሉ ለሙሉ ተከፍሎ ደረሰኝ ተሰጥቶኛል።',
      affirmative: 'የይርጋ ጊዜው አልፏል (ከ3 ዓመት በላይ ሆኖታል) እንዲሁም ገንዘቡ በሙሉ በባንክ የተከፈለ ነው።',
    },
    {
      title: isOromo ? 'Himannaa Mana Jireenyaa Gad-dhiisiisuu (Kiraa)' : 'የቤት ኪራይ ማስለቀቅና የውዝፍ ኪራይ ክስ (ቤቱ የተረከበ)',
      claimText: `ለፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ቦሌ ምድብ ችሎት
መዝገብ ቁጥር 89102/2017
ከሳሽ፡ ሻለቃ ደምሴ ገብሬ
ተከሳሽ፡ አቶ ብሩክ ሰለሞን ተፈራ
ጉዳዩ፡ የቤት ኪራይ ማስለቀቅና ያልተከፈለ 400,000 ብር ኪራይ ክስ
1. ተከሳሽ በቦሌ ክ/ከተማ ወረዳ 03 የሚገኘውን መኖሪያ ቤቴን በወር 40,000 ብር ተከራይቶ ይኖር ነበር።
2. ተከሳሹ ላለፉት 10 ወራት ያልከፈለውን 400,000 ብር ኪራይ እንዲከፍልና ቤቱን እንዲያስረክብ ተደጋጋሚ ጥያቄ ቢቀርብለትም አልፈጸመም።
3. በመሆኑም ቤቱን እንዲያስረክብና 400,000 ብር ከነኪሳራው እንዲከፍል ይወሰንልኝ።`,
      courtName: 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ቦሌ ምድብ',
      caseNo: 'መ/ቁ 89102/2017',
      plaintiff: 'ሻለቃ ደምሴ ገብሬ',
      defendant: 'አቶ ብሩክ ሰለሞን ተፈራ',
      objections: ['no_cause_of_action', 'lack_of_notice'],
      factsDenied: 'ቤቱን አልለቀቀም የሚለው ሐሰት ነው፤ ቤቱን ከ3 ወር በፊት ቁልፉን አስረክቤ የወጣሁ ሲሆን የካሳ ጥያቄውም ተገቢነት የለውም።',
      affirmative: 'ከሳሽ የቅድመ-ክስ የጽሑፍ ማስጠንቀቂያ አልሰጠኝም፤ እንዲሁም የቤት ኪራዩ እስከወጣሁበት ቀን ድረስ ሙሉ ለሙሉ ተከፍሏል።',
    },
    {
      title: isOromo ? 'Falmii Hojii fi Beenyaa (Hojjetaa)' : 'ያላግባብ የስራ ስንብት ካሳ ክስ በድርጅቱ ላይ የቀረበ',
      claimText: `ለፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት የስራ ክርክር ችሎት
መዝገብ ቁጥር 55432/2017
ከሳሽ፡ ወ/ሪት ህይወት አለሙ
ተከሳሽ፡ ሰላም ጠቅላላ ንግድ ኃ/የተ/የግ/ማህበር
ጉዳዩ፡ ያላግባብ ከስራ በመሰናበቴ 350,000 ብር የካሳና የስንብት ክፍያ ይከፈለኝ።
1. በተከሳሹ ድርጅት ውስጥ ለ5 ዓመታት በሽያጭ ባለሙያነት በወር 15,000 ብር ደመወዝ ስሰራ ቆይቻለሁ።
2. ድርጅቱ ያለ ምንም ማስጠንቀቂያና ህጋዊ ምክንያት ከስራ አሰናብቶኛል።
3. በመሆኑም የስራ ስንብት ካሳ፣ የትርፍ ሰዓትና ያልተከፈለ የዓመት ፈቃድ በድምሩ 350,000 ብር እንዲከፍለኝ ይወሰንልኝ።`,
      courtName: 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት የስራ ክርክር ችሎት',
      caseNo: 'መ/ቁ 55432/2017',
      plaintiff: 'ወ/ሪት ህይወት አለሙ',
      defendant: 'ሰላም ጠቅላላ ንግድ ኃ/የተ/የግ/ማህበር',
      objections: ['lack_of_jurisdiction', 'no_cause_of_action'],
      factsDenied: 'ሰራተኛዋ ያለ በቂ ምክንያት ተሰናበተች የተባለው ከእውነት የራቀ ነው፤ በተደጋጋሚ የስራ ሰዓት ሳታከብር ቀርታ በዲስፕሊን ኮሚቴ ውሳኔ በደብዳቤ የተሰናበተች ናት።',
      affirmative: 'በአሰሪና ሰራተኛ አዋጅ ቁጥር 1156/2011 አንቀጽ 27 መሠረት በከባድ የስራ ጥሰት ምክንያት በህጉ አግባብ የተፈጸመ ስንብት ነው።',
    },
  ];

  // File Upload Handler (PDF, Image, Text)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);
    setFileMimeType(file.type);

    const reader = new FileReader();

    if (file.type.startsWith('image/')) {
      reader.onload = () => {
        const result = reader.result as string;
        setFilePreviewUrl(result);
        const base64Data = result.split(',')[1];
        setFileBase64(base64Data);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        setFileBase64(base64Data);
        setFilePreviewUrl('');
      };
      reader.readAsDataURL(file);
    } else {
      // Text file
      reader.onload = () => {
        const text = reader.result as string;
        setClaimText(text);
        setFileBase64('');
        setFilePreviewUrl('');
      };
      reader.readAsText(file);
    }
  };

  // Toggle Preliminary Objection
  const toggleObjection = (objId: string) => {
    setSelectedObjections((prev) =>
      prev.includes(objId) ? prev.filter((id) => id !== objId) : [...prev, objId]
    );
  };

  // Add witness
  const handleAddWitness = () => {
    setWitnesses((prev) => [
      ...prev,
      {
        name: '',
        address: '',
        testimonyTopic: '',
      },
    ]);
  };

  // Remove witness
  const handleRemoveWitness = (idx: number) => {
    setWitnesses((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update witness
  const handleUpdateWitness = (idx: number, field: keyof DefenseWitness, val: string) => {
    setWitnesses((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  // Load Preset
  const handleSelectPreset = (p: typeof sampleLawsuitPresets[0]) => {
    setClaimText(p.claimText);
    setCourtName(p.courtName);
    setCaseNumber(p.caseNo);
    setPlaintiffName(p.plaintiff);
    setDefendantName(p.defendant);
    setSelectedObjections(p.objections);
    setFactsDenied(p.factsDenied);
    setAffirmativeDefenses(p.affirmative);
    setSelectedFile(null);
    setFileBase64('');
    setFilePreviewUrl('');
  };

  // Call Server Endpoint to Generate Statement of Defense
  const handleGenerateDefense = async () => {
    setLoading(true);
    setSavedSuccess(false);

    try {
      const payload: DefenseGenerationRequest = {
        claimText,
        fileData: fileBase64 || undefined,
        fileMimeType: fileMimeType || undefined,
        fileName: fileName || undefined,
        courtName,
        benchName,
        caseNumber,
        plaintiffName,
        plaintiffAddress,
        defendantName,
        defendantAddress,
        defendantPhone,
        disputeCategory,
        preliminaryObjections: selectedObjections,
        customPreliminaryObjections: customObjection,
        factsDenied,
        factsAdmitted,
        affirmativeDefenses,
        counterClaimText: hasCounterClaim ? counterClaimText : undefined,
        counterClaimAmount: hasCounterClaim ? counterClaimAmount : undefined,
        evidenceListText,
        witnesses,
        language: isOromo ? 'om' : isEnglish ? 'en' : 'am',
      };

      const res = await fetch('/api/legal/generate-defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.defense) {
        setDefenseResult(data.defense);
        setEditablePleading(data.defense.fullDefensePleading);
        setCurrentStep(3);
      } else {
        alert(data.error || 'የመከላከያ መልስ ማመንጨት አልተቻለም።');
      }
    } catch (err: any) {
      alert('የግንኙነት ስህተት አጋጥሟል: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Copy Pleading
  const handleCopyPleading = () => {
    if (!editablePleading) return;
    navigator.clipboard.writeText(editablePleading);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print Pleading
  const handlePrintPleading = () => {
    if (!editablePleading) return;
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <html>
        <head>
          <title>${isOromo ? 'Waraqaa Deebii Himatamaa' : 'የተከሳሽ የመከላከያ መልስ'}</title>
          <style>
            body { font-family: 'Times New Roman', 'Noto Sans Ethiopic', serif; padding: 40px; color: #111; line-height: 1.8; font-size: 14pt; }
            h1, h2 { text-align: center; }
            .header-info { margin-bottom: 25px; line-height: 1.6; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 8px; text-decoration: underline; }
            .signature-block { margin-top: 40px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <pre style="font-family: inherit; white-space: pre-wrap; font-size: 13pt; line-height: 1.7;">${editablePleading}</pre>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
  };

  // Download Pleading as Text file
  const handleDownloadPleading = () => {
    if (!editablePleading) return;
    const blob = new Blob([editablePleading], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `የመከላከያ_መልስ_${caseNumber.replace(/[\/\\]/g, '_') || 'Defense'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save to Managed Cases
  const handleSaveToCases = () => {
    if (!defenseResult || !onSaveToManagedCases) return;

    let cat: LegalCategory = 'civil';
    if (disputeCategory.includes('ስራ') || disputeCategory.includes('Hojii') || disputeCategory.toLowerCase().includes('labor')) {
      cat = 'labor';
    } else if (disputeCategory.includes('ንግድ') || disputeCategory.includes('Daldala') || disputeCategory.toLowerCase().includes('commercial')) {
      cat = 'commercial';
    } else if (disputeCategory.includes('ቤተሰብ') || disputeCategory.includes('Maatii') || disputeCategory.toLowerCase().includes('family')) {
      cat = 'family';
    }

    const newManagedCase: ManagedCase = {
      id: `case-def-${Date.now()}`,
      caseNumber: defenseResult.courtHeading.caseNumber || caseNumber || `መ/ቁ ${Math.floor(10000 + Math.random() * 90000)}/17`,
      title: `${disputeCategory || 'የመከላከያ ክስ'} - (${defendantName} በ ${plaintiffName})`,
      category: cat,
      court: defenseResult.courtHeading.courtName || courtName,
      bench: defenseResult.courtHeading.benchName || benchName,
      clientRole: 'defendant',
      plaintiff: plaintiffName || 'ከሳሽ',
      defendant: defendantName || 'ተከሳሽ',
      stage: 'summons_served',
      filingDate: new Date().toISOString().split('T')[0],
      summary: defenseResult.caseSummary || 'የተከሳሽ የመከላከያ መልስ',
      notes: `${defenseResult.tacticalAdvice || ''}\n\n[የመከላከያ መልስ ቅንጭብ]:\n${editablePleading.slice(0, 1000)}...`,
      evidences: (defenseResult.evidenceList || []).map((evText, i) => ({
        id: `ev-${Date.now()}-${i}`,
        title: evText,
        type: 'receipt',
        dateAdded: new Date().toISOString().split('T')[0],
        description: evText,
        verified: true,
      })),
      milestones: [
        {
          id: `m-1`,
          date: new Date().toISOString().split('T')[0],
          title: isOromo ? 'Waraqaan himannaa gahe' : 'የክስ መጥሪያ ደረሰ',
          description: isOromo ? 'Waraqaan deebii qophaa\'eera' : 'የመከላከያ መልስ ተዘጋጅቷል',
          completed: true,
        },
        {
          id: `m-2`,
          date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          title: isOromo ? 'Deebii mana murtiitti galchuu' : 'የመከላከያ መልስ ለፍርድ ቤት ማስገባት',
          description: isOromo ? 'Koppii 3 waliin dhiheessuu' : 'በ3 ቅጂ ከማስረጃ ጋር ማቅረብ',
          completed: false,
        },
      ],
      status: 'active',
    };

    onSaveToManagedCases(newManagedCase);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-900/30 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{isOromo ? 'Qopheessaa Deebii Himatamaa' : 'የተከሳሽ የመከላከያ መልስ አዘጋጅ'}</span>
              <span className="text-rose-500/50">•</span>
              <span className="text-amber-300">የፍ/ሥ/ሥ/ሕ/ቁ 234-245 (Civil Procedure Code)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('defenseDrafterTitle')}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              {t('defenseDrafterSubtitle')}
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
            {[
              { num: 1, label: t('defenseStep1'), icon: Upload },
              { num: 2, label: t('defenseStep2'), icon: Scale },
              { num: 3, label: t('defenseStep3'), icon: FileCheck },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                      : isPast
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Preset Scenarios */}
      {currentStep === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ናሙና የክስ ወረቀቶች (Presets)፦</span>
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {sampleLawsuitPresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: INPUT CLAIM DOCUMENT OR PASTE TEXT */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload Document / Image / PDF (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-rose-400" />
                  <span>{t('uploadClaimDocLabel')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  ከፍርድ ቤት በፖሊስ ወይም በፖስተኛ የደረሰዎትን የክስ አቤቱታ ወረቀት፣ መጥሪያ ወይም የውል ሰነድ በፎቶ (JPEG/PNG) ወይም በPDF እዚህ ያስገቡ።
                </p>
              </div>

              {/* Upload Box */}
              <label className="border-2 border-dashed border-slate-700 hover:border-rose-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/60 group text-center">
                <input
                  type="file"
                  accept="image/*,application/pdf,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white block">
                  {fileName ? `የተመረጠ ሰነድ፡ ${fileName}` : 'የክስ ወረቀቱን እዚህ ይጎትቱ ወይም ይጫኑ'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  የሞባይል ፎቶ፣ PDF፣ ስካን የተደረገ ምስል ወይም የጽሑፍ ፋይል ይደግፋል
                </span>
              </label>

              {/* Image Preview if uploaded */}
              {filePreviewUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-60 bg-slate-950 flex items-center justify-center">
                  <img
                    src={filePreviewUrl}
                    alt="Claim preview"
                    className="max-h-60 object-contain w-auto mx-auto"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/90 text-[10px] px-2 py-1 rounded text-white border border-slate-700 font-mono">
                    {fileName}
                  </div>
                </div>
              )}

              {/* PDF Document Notice */}
              {selectedFile && selectedFile.type === 'application/pdf' && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
                  <FileText className="w-5 h-5 text-red-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-white block truncate">{fileName}</span>
                    <span className="text-[11px] text-slate-500">PDF የክስ ሰነድ ተያይዟል (Gemini AI በቀጥታ ያነበዋል)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Paste or Type Lawsuit Text (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-amber-400" />
                  <span>{t('pasteClaimTextLabel')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  የክስ ወረቀቱ በጽሑፍ ካለዎት ወይም ዋና ዋና ክሶችን እዚህ መገልበጥ/መለጠፍ ይችላሉ።
                </p>
              </div>

              <textarea
                rows={11}
                value={claimText}
                onChange={(e) => setClaimText(e.target.value)}
                placeholder={
                  isOromo
                    ? 'Qabiyyee himannaa himataan dhiyeesse asitti barreessaa ykn maxxansaa...'
                    : 'ከሳሽ በክስ አቤቱታው ላይ የገለጻቸውን ነጥቦችና የጠየቀውን የገንዘብ መጠን እዚህ ይለጥፉ...'
                }
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none resize-none leading-relaxed font-mono"
              />

              <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                <span className="text-[11px] text-slate-500">
                  {claimText ? `${claimText.length} ፊደላት ተጽፈዋል` : selectedFile ? `ሰነድ ተያይዟል (${fileName})` : 'ሰነድ ወይም ጽሑፍ ያስገቡ'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-slate-700 cursor-pointer"
                  >
                    <span>{isOromo ? 'Mormiiwwan Qindeessi' : 'መከራከሪያዎችን አብጅ'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateDefense}
                    disabled={loading || (!claimText && !selectedFile)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-600/20 cursor-pointer"
                  >
                    <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>
                      {loading
                        ? isOromo
                          ? 'Deebii Qopheessaa jira...'
                          : 'በማዘጋጀት ላይ...'
                        : isOromo
                        ? 'Battalatti Deebii Qopheessi'
                        : 'በቀጥታ የመከላከያ መልስ አዘጋጅ'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: DEFENDANT PLEADING DETAILS & PRELIMINARY OBJECTIONS */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-xl">
            {/* Court & Parties Grid */}
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Building className="w-4 h-4 text-amber-400" />
                <span>የፍርድ ቤቱና የተከራካሪዎች መረጃ (Court & Parties)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">የፍርድ ቤቱ ስም፡</label>
                  <input
                    type="text"
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">የተመደበው ችሎት፡</label>
                  <input
                    type="text"
                    value={benchName}
                    onChange={(e) => setBenchName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">የመዝገብ ቁጥር (File No.)፡</label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">የክርክሩ አይነት፡</label>
                  <input
                    type="text"
                    value={disputeCategory}
                    onChange={(e) => setDisputeCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">ከሳሽ (Plaintiff Name)፡</label>
                  <input
                    type="text"
                    value={plaintiffName}
                    onChange={(e) => setPlaintiffName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">የከሳሽ አድራሻ፡</label>
                  <input
                    type="text"
                    value={plaintiffAddress}
                    onChange={(e) => setPlaintiffAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-rose-300">ተከሳሽ (የእርስዎ ስም)፡ *</label>
                  <input
                    type="text"
                    value={defendantName}
                    onChange={(e) => setDefendantName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-500 text-white text-xs focus:border-rose-500 focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">የእርስዎ አድራሻና ስልክ፡</label>
                  <input
                    type="text"
                    value={defendantAddress}
                    onChange={(e) => setDefendantAddress(e.target.value)}
                    placeholder="አድራሻ እና ስልክ"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Preliminary Objections Selector (የፍ/ሥ/ሥ/ሕ/ቁ 244) */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>{t('preliminaryObjectionsSection')}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    በኢትዮጵያ ፍትሐብሔር ሥነ-ሥርዓት ሕግ መሠረት ፍርድ ቤቱ ወደ ፍሬ ነገሩ ሳይገባ ክሱን በመጀመሪያ ደረጃ ውድቅ የሚያደርግባቸውን መቃወሚያዎች ይምረጡ፦
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    id: 'limitation_expired',
                    title: 'የይርጋ ጊዜ ገደብ ማለፍ (Statute of Limitations)',
                    statute: 'የፍትሐብሔር ሕግ ቁጥር 1845 / የፍ/ሥ/ሥ/ሕ/ቁ 244(2)(ረ)',
                    desc: 'ክሱ የቀረበው በሕግ የተወሰነው የይርጋ ጊዜ (ለምሳሌ የውል 10 ዓመት፣ የካሳ 2 ዓመት) ካለፈ በኋላ ነው።',
                  },
                  {
                    id: 'lack_of_jurisdiction',
                    title: 'የፍርድ ቤት ስልጣን ማጣት (Lack of Jurisdiction)',
                    statute: 'የፍ/ሥ/ሥ/ሕ/ቁ 244(2)(ሀ) እና አዋጅ 1234/2013',
                    desc: 'ይህ ፍርድ ቤት ጉዳዩን ለማየት የገንዘብ (Pecuniary) ወይም የቦታ (Local Venue) ስልጣን የለውም።',
                  },
                  {
                    id: 'no_cause_of_action',
                    title: 'የክስ ምክንያት አለመኖር (No Cause of Action)',
                    statute: 'የፍ/ሥ/ሥ/ሕ/ቁ 231(1)(ሀ)',
                    desc: 'የከሳሽ አቤቱታ በሕግ ፊት ተከሳሽን ተጠያቂ የሚያደርግ ተጨባጭ የሕግ ምክንያት አያሳይም።',
                  },
                  {
                    id: 'lack_of_standing',
                    title: 'የከሳሽ ክስ የማቅረብ መብት ወይም ውክልና ጉድለት',
                    statute: 'የፍ/ሥ/ሥ/ሕ/ቁ 244(2)(ሐ) / Art 33',
                    desc: 'ከሳሽ በግል ክስ የመመስረት መብት የለውም ወይም የተሰጠው ውክልና ህጋዊ አይደለም።',
                  },
                  {
                    id: 'lack_of_notice',
                    title: 'የቅድመ-ክስ የጽሑፍ ማስጠንቀቂያ አለመሰጠቱ',
                    statute: 'የፍትሐብሔር ሕግ ቁጥር 1772',
                    desc: 'ክሱ ከመመሥረቱ በፊት ተከሳሹ ግዴታውን እንዲፈጽም አስቀድሞ የጽሑፍ ማስጠንቀቂያ አልደረሰውም።',
                  },
                  {
                    id: 'arbitration_clause',
                    title: 'የግልግል ዳኝነት (Arbitration) ስምምነት መኖር',
                    statute: 'የፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 244(2)(ሰ)',
                    desc: 'በውላችን ውስጥ ክርክሩ በግልግል ዳኝነት እንዲታይ የተስማማንበት አንቀጽ አለ።',
                  },
                ].map((obj) => {
                  const isChecked = selectedObjections.includes(obj.id);
                  return (
                    <div
                      key={obj.id}
                      onClick={() => toggleObjection(obj.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'bg-rose-500/10 border-rose-500 text-white ring-1 ring-rose-500'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{obj.title}</span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="accent-rose-500 h-4 w-4"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 block mb-1">
                          {obj.statute}
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{obj.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Substantive Denials & Affirmative Defense (የክሱን ፍሬ ነገር መካድ) */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>የተከሳሽ ዝርዝር ክህደትና እውነተኛ ፍሬ ነገር (Specific Denials & Facts)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  በፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 235 መሠረት የከሳሽን እያንዳንዱን ክስ ለምን እንደማይቀበሉት በዝርዝር ይግለጹ፦
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-rose-300">
                    የሚክዱት ፍሬ ነገር (እውነት ያልሆነው የከሳሽ ክስ)፡ *
                  </label>
                  <textarea
                    rows={4}
                    value={factsDenied}
                    onChange={(e) => setFactsDenied(e.target.value)}
                    placeholder="ለምሳሌ፡ ከሳሽ የጠቀሰውን የገንዘብ ዕዳ አልተቀበልኩም፤ ወይም የተጠቀሰው ገንዘብ በባንክ ተከፍሏል..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-300">
                    የተከሳሽ አዎንታዊ መከላከያ (Affirmative Defense)፡
                  </label>
                  <textarea
                    rows={4}
                    value={affirmativeDefenses}
                    onChange={(e) => setAffirmativeDefenses(e.target.value)}
                    placeholder="ለምሳሌ፡ ዕዳው በባንክ በደረሰኝ የተከፈለ መሆኑ፣ ወይም የከሳሽ በራሱ የውል ጥሰት ያለ መሆኑ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Counter-Claim Section (የመልሶ ክስ ወይም የይካካስልኝ ጥያቄ - Art 234/237) */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                  <input
                    type="checkbox"
                    checked={hasCounterClaim}
                    onChange={(e) => setHasCounterClaim(e.target.checked)}
                    className="accent-rose-500 h-4 w-4"
                  />
                  <span>ተከሳሹ በከሳሽ ላይ የመልሶ ክስ (Counter-Claim) ወይም የይካካስልኝ ጥያቄ አለው</span>
                </label>
                <span className="text-[10px] text-amber-400 font-mono">የፍ/ሥ/ሥ/ሕ/ቁ 234 እና 237</span>
              </div>

              {hasCounterClaim && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        የመልሶ ክሱ ፍሬ ነገርና ምክንያት፡
                      </label>
                      <input
                        type="text"
                        value={counterClaimText}
                        onChange={(e) => setCounterClaimText(e.target.value)}
                        placeholder="ለምሳሌ፡ ከሳሽ በውል ጥሰት ምክንያት ላደረሰብኝ ጉዳት ካሳ ይክፈለን"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        የሚጠየቀው የገንዘብ መጠን (በብር)፡
                      </label>
                      <input
                        type="text"
                        value={counterClaimAmount}
                        onChange={(e) => setCounterClaimAmount(e.target.value)}
                        placeholder="ለምሳሌ፡ 200,000 ETB"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Evidences & Witnesses */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-400" />
                <span>{t('evidenceSection')}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">የሰነድ ማስረጃዎች ዝርዝር፡</label>
                  <textarea
                    rows={3}
                    value={evidenceListText}
                    onChange={(e) => setEvidenceListText(e.target.value)}
                    placeholder="1. የባንክ ደረሰኝ&#10;2. የውል ሰነድ"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-rose-500 focus:outline-none resize-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">የተከሳሽ የሰው ምስክሮች፡</label>
                    <button
                      onClick={handleAddWitness}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ምስክር ጨምር</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {witnesses.map((w, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs"
                      >
                        <input
                          type="text"
                          value={w.name}
                          onChange={(e) => handleUpdateWitness(idx, 'name', e.target.value)}
                          placeholder="የምስክር ስም"
                          className="w-1/3 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={w.testimonyTopic}
                          onChange={(e) => handleUpdateWitness(idx, 'testimonyTopic', e.target.value)}
                          placeholder="የሚያስረዱት ጭብጥ"
                          className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                        <button
                          onClick={() => handleRemoveWitness(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                ወደ ኋላ (የክስ ሰነድ)
              </button>

              <button
                onClick={handleGenerateDefense}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? t('generatingDefenseBtn') : t('generateDefenseBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULTANT STATEMENT OF DEFENSE & COURT PLEADING */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white">{t('generatingDefenseBtn')}</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                በኢትዮጵያ ፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 234-245 መሠረት የመከላከያ መልስ፣ የመጀመሪያ ደረጃ መቃወሚያዎችንና የክህደት ነጥቦችን በማዘጋጀት ላይ...
              </p>
            </div>
          ) : defenseResult ? (
            <div className="space-y-6">
              {/* Top Banner Card of Generated Defense */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border-2 border-rose-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>የተዘጋጀ ይፋዊ የመከላከያ መልስ (Statement of Defense)</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {defenseResult.courtHeading.courtName} - {defenseResult.courtHeading.benchName}
                    </h2>
                    <span className="text-xs text-amber-300 font-mono mt-0.5 block">
                      {defenseResult.courtHeading.caseNumber}
                    </span>
                  </div>

                  {/* Actions Header Bar */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setIsEditingPleading(!isEditingPleading)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        isEditingPleading
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingPleading ? 'ማረም ጨርስ' : 'በቀጥታ አርም'}</span>
                    </button>

                    <button
                      onClick={handleCopyPleading}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'ተቀድቷል!' : 'ቅዳ'}</span>
                    </button>

                    <button
                      onClick={handlePrintPleading}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>አትም (Print)</span>
                    </button>

                    <button
                      onClick={handleDownloadPleading}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>አውርድ (.txt)</span>
                    </button>

                    {onSaveToManagedCases && (
                      <button
                        onClick={handleSaveToCases}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                          savedSuccess
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>{savedSuccess ? 'ወደ ክሶች ማህደር ተመዝግቧል!' : 'ወደ ክሶች መዝገብ አስቀምጥ'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Case Summary Strip */}
                <div className="pt-4 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-400 mr-2">የመከላከያ ስልት ማጠቃለያ፡</span>
                  <span>{defenseResult.caseSummary}</span>
                </div>
              </div>

              {/* 2-Column Split: The Pleading Text vs Strategic Advice & Objections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: The Complete Court Pleading (7 cols) */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rose-400" />
                      <span>ይፋዊ የመከላከያ መልስ ረቂቅ (Court Pleading Document)</span>
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">የፍ/ሥ/ሥ/ሕ/ቁ 234</span>
                  </div>

                  {isEditingPleading ? (
                    <textarea
                      rows={22}
                      value={editablePleading}
                      onChange={(e) => setEditablePleading(e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-950 border border-amber-500 text-white font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none shadow-inner"
                    />
                  ) : (
                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                      {editablePleading}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-500">
                    <span>ፍርድ ቤት ከመቅረቡ በፊት የተከሳሽ ፊርማ እና ቀን መፈረም አለበት።</span>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      ← መከራከሪያዎችን አሻሽል
                    </button>
                  </div>
                </div>

                {/* Right: Preliminary Objections Breakdown & Tactics (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  {/* Preliminary Objections Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>የተካተቱ የመጀመሪያ ደረጃ መቃወሚያዎች</span>
                    </h3>

                    <div className="space-y-2.5">
                      {defenseResult.preliminaryObjections.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950 border border-rose-900/30 space-y-1 text-xs"
                        >
                          <span className="font-bold text-white block">{p.type}</span>
                          <span className="font-mono text-[10px] text-amber-400 block">
                            {p.legalBasis}
                          </span>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                            {p.argument}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tactical Advice Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>የችሎት ቀን ስልታዊ ምክር (Tactical Advice)</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-950 border border-slate-800">
                      {defenseResult.tacticalAdvice}
                    </p>
                  </div>

                  {/* Statutes Cited */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      <span>የተጠቀሱ የሕግ ድንጋጌዎች</span>
                    </h3>
                    <div className="space-y-2 text-xs">
                      {defenseResult.statutesCited.map((s, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                          <strong className="text-emerald-400 block text-[11px] font-mono">{s.statute}</strong>
                          <span className="text-[11px] text-slate-400">{s.explanation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrated Cross-Module Actions for Defendant */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isOromo ? 'Tarkaanfiiwwan Itti Aanan (Next Interconnected Steps):' : 'የተቀናጁ ቀጣይ እርምጃዎች (Next Interconnected Steps)፦'}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isOromo ? 'Dhimma keessan kallattiin gara kutaalee birootti dabarsaa' : 'ጉዳይዎን በቀጥታ ወደ ሌሎች ክፍሎች ያስተላልፉ'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {onNavigateToHearings && (
                    <button
                      onClick={() => onNavigateToHearings({
                        court: defenseResult.courtHeading.courtName,
                        bench: defenseResult.courtHeading.benchName,
                        caseNumber: defenseResult.courtHeading.caseNumber,
                        caseTitle: `${disputeCategory} - (${defendantName} በ ${plaintiffName})`,
                        hearingPurpose: isOromo ? 'Deebii Himatamaa fi Mormii Sadarkaa Duraa Dhiyeessuu' : 'የመከላከያ መልስ መስጠትና የመጀመሪያ ደረጃ መቃወሚያ ማሰማት',
                      })}
                      className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
                    >
                      <Calendar className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <strong className="block text-xs text-white mb-0.5">
                        {isOromo ? '1. Beellama Galmeessi' : '1. ቀጠሮ መዝግብ'}
                      </strong>
                      <span className="text-[11px] text-slate-400 block leading-tight">
                        {isOromo ? 'Guyyaa deebii dhihaatu qabadhaa' : 'የመከላከያ መልስ የሚሰጥበትን ቀን አስመዝግቡ'}
                      </span>
                    </button>
                  )}

                  {onNavigateToJurisdiction && (
                    <button
                      onClick={() => onNavigateToJurisdiction('450000')}
                      className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
                    >
                      <Building className="w-4 h-4 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <strong className="block text-xs text-white mb-0.5">
                        {isOromo ? '2. Aangoo Mirkaneessi' : '2. ስልጣን ፈትሽ'}
                      </strong>
                      <span className="text-[11px] text-slate-400 block leading-tight">
                        {isOromo ? 'Mormii Kw. 244(2) mirkaneeffadhaa' : 'የፍርድ ቤቱን ስልጣን መቃወሚያ ያረጋግጡ'}
                      </span>
                    </button>
                  )}

                  {onNavigateToFeeCalculator && (
                    <button
                      onClick={() => onNavigateToFeeCalculator(450000)}
                      className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
                    >
                      <Calculator className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <strong className="block text-xs text-white mb-0.5">
                        {isOromo ? '3. Baasii & Kasaaraa Shallagi' : '3. ወጪና ኪሳራ አስላ'}
                      </strong>
                      <span className="text-[11px] text-slate-400 block leading-tight">
                        {isOromo ? 'Akkaataa Kw. 462 tiin kasaaraa gaafadhaa' : 'በአንቀጽ 462 ወጪና የመልሶ ክስ አስላ'}
                      </span>
                    </button>
                  )}

                  {onNavigateToDrafter && (
                    <button
                      onClick={onNavigateToDrafter}
                      className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-left transition-all cursor-pointer group"
                    >
                      <FileText className="w-4 h-4 text-rose-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <strong className="block text-xs text-white mb-0.5">
                        {isOromo ? '4. Himannaa Qopheessi' : '4. ክስ መመስረቻ'}
                      </strong>
                      <span className="text-[11px] text-slate-400 block leading-tight">
                        {isOromo ? 'Iyyannoo himataa banuuf' : 'የራስዎን አዲስ ክስ ለመመስረት'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
