import React, { useState, useEffect } from 'react';
import {
  Scale,
  Building,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  FileText,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  ChevronRight,
  Info,
  DollarSign,
  AlertTriangle,
  FileCheck,
  RotateCcw,
  BookOpen,
  Briefcase,
  Users,
  Calculator,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { JurisdictionAssessment } from '../types/legal';

export interface CourtJurisdictionProps {
  onNavigateToDrafter?: (prefill: {
    courtName: string;
    benchName: string;
    jurisdictionBasis: string;
    claimAmountETB: string;
    claimCategory: string;
    defendantAddress?: string;
  }) => void;
  onNavigateToDefense?: (prefill: {
    courtName: string;
    benchName: string;
    jurisdictionBasis: string;
    claimAmountETB: string;
    claimCategory: string;
    defendantAddress?: string;
  }) => void;
  onNavigateToConsultation?: (caseSummary: string) => void;
  onNavigateToFeeCalculator?: (claimAmount: string) => void;
}

export const CourtJurisdiction: React.FC<CourtJurisdictionProps> = ({
  onNavigateToDrafter,
  onNavigateToDefense,
  onNavigateToConsultation,
  onNavigateToFeeCalculator,
}) => {
  const { t, isOromo, isEnglish } = useLanguage();

  // Mode: 'wizard' (Questionnaire) | 'presets' (Quick Cases) | 'matrix' (Guide)
  const [activeTab, setActiveTab] = useState<'wizard' | 'presets' | 'matrix'>('wizard');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Questionnaire Form State
  const [disputeType, setDisputeType] = useState<string>('debt_contract');
  const [claimAmount, setClaimAmount] = useState<string>('450000');
  const [partiesNature, setPartiesNature] = useState<string>('private_citizens');
  const [defendantLocation, setDefendantLocation] = useState<string>('አዲስ አበባ፣ ቦሌ ክፍለ ከተማ');
  const [disputeLocation, setDisputeLocation] = useState<string>('አዲስ አበባ');
  const [propertyLocation, setPropertyLocation] = useState<string>('');
  const [contractExecutionPlace, setContractExecutionPlace] = useState<string>('አዲስ አበባ');
  const [caseSummary, setCaseSummary] = useState<string>('');

  // Assessment Results
  const [assessment, setAssessment] = useState<JurisdictionAssessment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [checkedChecklist, setCheckedChecklist] = useState<Record<number, boolean>>({});

  // Sample Scenarios for quick test
  const samplePresets = [
    {
      title: isOromo ? 'Waliigaltee Daldalaa Qarshii 25,000,000 (Ol\'aanaa Federaalaa)' : 'የ25 ሚሊዮን ብር የንግድ ውል ጥሰት (ፌዴራል ከፍተኛ ፍርድ ቤት)',
      desc: isOromo ? 'Hangi maallaqaa Qarshii 15M ol waan ta\'eef Mana Murtii Ol\'aanaa Federaalaatti dhihaata.' : 'የገንዘብ መጠኑ ከ15 ሚሊዮን ብር በላይ ስለሆነ በፌዴራል ከፍተኛ ፍርድ ቤት የንግድ ችሎት ይታያል።',
      disputeType: 'debt_contract',
      claimAmount: '25000000',
      partiesNature: 'commercial_company',
      defendantLocation: 'አዲስ አበባ፣ ቂርቆስ ክፍለ ከተማ',
      disputeLocation: 'አዲስ አበባ',
      propertyLocation: '',
      contractExecutionPlace: 'አዲስ አበባ',
      caseSummary: 'የማሽነሪ አቅርቦት ውል ተፈርሞ የቅድመ ክፍያ 25 ሚሊዮን ብር ተወስዶ እቃው ሳያስረክብ የቀረበት ክስ።',
    },
    {
      title: isOromo ? 'Kireeffannaa Manaa Qarshii 350,000 (Sadarkaa Duraa Boolee)' : 'የ350,000 ብር የቤት ኪራይና ማስለቀቅ (የመጀመሪያ ደረጃ ቦሌ ምድብ)',
      desc: isOromo ? 'Qarshii 15M gadi fi teessoon himatamaa Boolee waan ta\'eef Ramaddii Booleetti dhihaata.' : 'ከ15 ሚሊዮን ብር በታች እና የተከሳሽ አድራሻ ቦሌ በመሆኑ በቦሌ ምድብ ችሎት ይታያል።',
      disputeType: 'rent_eviction',
      claimAmount: '350000',
      partiesNature: 'private_citizens',
      defendantLocation: 'አዲስ አበባ፣ ቦሌ ክፍለ ከተማ፣ ወረዳ 03',
      disputeLocation: 'አዲስ አበባ፣ ቦሌ',
      propertyLocation: 'አዲስ አበባ፣ ቦሌ ክ/ከተማ የቤት ቁጥር 456',
      contractExecutionPlace: 'አዲስ አበባ',
      caseSummary: 'ተከሳሹ ላለፉት 7 ወራት ያልከፈለውን የቤት ኪራይ ከነወለዱ እንዲከፍልና ቤቱን እንዲያስረክብ የቀረበ ክስ።',
    },
    {
      title: isOromo ? 'Falmii Hojjetaa fi Hojjechiisaa (Dhaddacha Hojjetaa)' : 'ያላግባብ ከስራ መሰናበትና ካሳ (የመጀመሪያ ደረጃ የስራ ክርክር ችሎት)',
      desc: isOromo ? 'Falmiiwwan dhuunfaa hojjetaa Mana Murtii Sadarkaa Duraa Dhaddacha Hojjetaatti ilaalama.' : 'የግል ሰራተኛ የስንብትና የካሳ ክስ በፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት የስራ ክርክር ችሎት ይታያል።',
      disputeType: 'labor',
      claimAmount: '180000',
      partiesNature: 'private_citizens',
      defendantLocation: 'አዲስ አበባ፣ ልደታ ክፍለ ከተማ',
      disputeLocation: 'አዲስ አበባ',
      propertyLocation: '',
      contractExecutionPlace: 'አዲስ አበባ',
      caseSummary: 'የ7 አመት ሰራተኛ ያለ ማስጠንቀቂያና ያለ በቂ ህጋዊ ምክንያት ከስራ የተሰናበተበትና የስንብት ካሳ የተጠየቀበት ጉዳይ።',
    },
    {
      title: isOromo ? 'Qabeenya Hin Sochoonee (Dhaddacha Lidataa)' : 'የአፓርትመንት ይዞታና ካርታ ክርክር (የመጀመሪያ ደረጃ ልደታ ምድብ)',
      desc: isOromo ? 'Akkaataa Kw. 20 tiin falmiin mana jireenyaa iddoo qabeenyichi argamutti dhihaata.' : 'በፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 20 መሠረት የማይንቀሳቀስ ንብረት ክርክር ንብረቱ ባለበት ይታያል።',
      disputeType: 'immovable_property',
      claimAmount: '8500000',
      partiesNature: 'private_citizens',
      defendantLocation: 'አዲስ አበባ፣ ልደታ ክፍለ ከተማ',
      disputeLocation: 'አዲስ አበባ',
      propertyLocation: 'አዲስ አበባ፣ ልደታ ክ/ከተማ',
      contractExecutionPlace: 'አዲስ አበባ',
      caseSummary: 'በውል የተገዛ የመኖሪያ አፓርትመንት ስም ማዛወሪያና የባለቤትነት ማረጋገጫ ካርታ እንዲሰጥ የተጠየቀበት ክስ።',
    },
    {
      title: isOromo ? 'Qabeenya Dhaalaa Islaamaa (Mana Murtii Shari\'aa)' : 'የሙስሊም ወራሾች የውርስ ክፍፍል (የፌዴራል የመጀመሪያ ደረጃ የሸሪዓ ፍርድ ቤት)',
      desc: isOromo ? 'Hordoftoota amantaa Islaamaa gidduutti fedhii barreeffamaatiin yemmuu dhihaatu aangoo Shari\'aa ta\'a.' : 'ሁለቱም ወገኖች ሙስሊም ሆነው በጽሑፍ ሲስማሙ በሸሪዓ ፍርድ ቤት የውርስ ችሎት ይታያል።',
      disputeType: 'sharia_personal',
      claimAmount: '4200000',
      partiesNature: 'muslim_family_consent',
      defendantLocation: 'አዲስ አበባ፣ ኮልፌ ቀራኒዮ ክፍለ ከተማ',
      disputeLocation: 'አዲስ አበባ',
      propertyLocation: '',
      contractExecutionPlace: '',
      caseSummary: 'የሟች አባት ንብረት በሸሪዓ ሕግ መሠረት በወራሾች መካከል እንዲጣራና እንዲከፋፈል የቀረበ አቤቱታ።',
    },
    {
      title: isOromo ? 'Miidhaa Balaa Tiraafikaa (Iddoo Balaan Qaqqabe)' : 'የትራፊክ አደጋ ጉዳት ካሳ ክስ (አደጋው በደረሰበት ፍርድ ቤት)',
      desc: isOromo ? 'Akkaataa Kw. 27 tiin himanni bakka gochi balaa itti raawwatametti dhihaachuu danda\'a.' : 'በፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 27 መሠረት ጥፋቱ በደረሰበት ስፍራ ፍርድ ቤት መመስረት ይችላል።',
      disputeType: 'tort_accident',
      claimAmount: '750000',
      partiesNature: 'private_citizens',
      defendantLocation: 'አዲስ አበባ፣ የካ ክፍለ ከተማ',
      disputeLocation: 'አዲስ አበባ፣ የካ',
      propertyLocation: '',
      contractExecutionPlace: '',
      caseSummary: 'ተከሳሹ በቸልተኝነት ባሽከረከረው ተሽከርካሪ በከሳሽ ንብረትና አካል ላይ ላደረሰው ከባድ ጉዳት የካሳ ጥያቄ።',
    },
  ];

  // Run assessment on mount or trigger
  const runAssessment = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/legal/jurisdiction-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disputeType,
          claimAmount: Number(claimAmount) || 0,
          partiesNature,
          defendantLocation,
          disputeLocation,
          propertyLocation,
          contractExecutionPlace,
          caseSummary,
          language: isOromo ? 'om' : isEnglish ? 'en' : 'am',
        }),
      });

      const data = await res.json();
      if (data.success && data.assessment) {
        setAssessment(data.assessment);
        setCurrentStep(4); // Move to results step
      } else {
        setErrorMessage(data.error || (isOromo ? 'Aangoo adda baasuun hin danda\'amne.' : 'የፍርድ ቤት ስልጣን ማረጋገጥ አልተቻለም።'));
      }
    } catch (err: any) {
      setErrorMessage(err.message || (isOromo ? 'Dogoggora qunnamtii sararaa.' : 'የግንኙነት ስህተት አጋጥሟል።'));
    } finally {
      setLoading(false);
    }
  };

  // Pre-load preset
  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setDisputeType(preset.disputeType);
    setClaimAmount(preset.claimAmount);
    setPartiesNature(preset.partiesNature);
    setDefendantLocation(preset.defendantLocation);
    setDisputeLocation(preset.disputeLocation);
    setPropertyLocation(preset.propertyLocation);
    setContractExecutionPlace(preset.contractExecutionPlace);
    setCaseSummary(preset.caseSummary);
    setActiveTab('wizard');
    setCurrentStep(1);
  };

  // Print Report
  const handlePrintReport = () => {
    if (!assessment) return;
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <html>
        <head>
          <title>${isOromo ? 'Waraqaa Mirkaneessa Aangoo Mana Murtii' : 'የፍርድ ቤት ክስ የማየት ስልጣን ውሳኔ ሪፖርት'}</title>
          <style>
            body { font-family: 'Times New Roman', 'Noto Sans Ethiopic', serif; padding: 40px; color: #111; line-height: 1.6; }
            h1, h2 { text-align: center; margin-bottom: 5px; }
            .header-line { border-bottom: 2px solid #222; margin-bottom: 25px; padding-bottom: 10px; }
            .badge { display: inline-block; padding: 4px 10px; background: #eee; font-weight: bold; font-size: 13px; }
            .section { margin-bottom: 25px; }
            .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; font-size: 16px; }
            .court-box { border: 2px solid #333; padding: 15px; margin: 15px 0; background: #fdfdfd; }
            ul { margin-top: 5px; padding-left: 20px; }
            li { margin-bottom: 6px; }
            .meta { font-size: 12px; color: #666; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header-line">
            <h1>${isOromo ? 'WARAQAA QORANNOO AANGOO MANA MURTII' : 'የፍርድ ቤት ክስ የማየት ስልጣን ውሳኔና የቅድመ-ክስ መመሪያ'}</h1>
            <p style="text-align: center; font-size: 14px; margin-top: 2px;">
              ${isOromo ? 'Akkaataa Seerota Falmii Sivilii fi Labsii Manneen Murtii Federaalaa Lakk. 1234/2013 tiin' : 'በኢ.ፌ.ዲ.ሪ የፌዴራል ፍርድ ቤቶች አዋጅ ቁጥር 1234/2013 እና የፍትሐብሔር ሥነ-ሥርዓት ሕግ መሠረት የተዘጋጀ'}
            </p>
            <div class="meta">${new Date().toLocaleDateString()}</div>
          </div>

          <div class="court-box">
            <h2>${assessment.courtName}</h2>
            <p><strong>${isOromo ? 'Dhaddacha Ramaddame:' : 'ተገቢው ችሎት፡'}</strong> ${assessment.benchName}</p>
            <p><strong>${isOromo ? 'Aangoo Iddoo / Ramaddii:' : 'የቦታ / የምድብ ስልጣን፡'}</strong> ${assessment.localVenue}</p>
            <p><strong>${isOromo ? 'Hanga Maallaqa Iyyatame:' : 'የይገባኛል ጥያቄው ዋጋ፡'}</strong> ETB ${Number(claimAmount).toLocaleString()} | <strong>${isOromo ? 'Tilmaama Kaffaltii Abbaa Seerummaa:' : 'የተገመተ የዳኝነት ክፍያ፡'}</strong> ETB ${assessment.estimatedCourtFee.toLocaleString()}</p>
          </div>

          <div class="section">
            <div class="section-title">${isOromo ? 'Bu\'uuraalee Seeraa (Statutory Legal Grounds)' : 'የሕግ መሠረቶችና ድንጋጌዎች'}</div>
            <ul>
              ${assessment.legalGrounds.map((g) => `<li><strong>${g.statute}</strong>: ${g.explanation}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-title">${isOromo ? 'Ulaagaalee Barbaachisan (Required Pre-Filing Checklist)' : 'ክሱን ለመመስረት በዝርዝር የሚያስፈልጉ ነገሮች'}</div>
            <ul>
              ${assessment.preliminaryRequirements.map((r) => `<li><strong>${r.title}</strong>: ${r.description}</li>`).join('')}
            </ul>
          </div>

          ${assessment.potentialObjections && assessment.potentialObjections.length > 0 ? `
          <div class="section">
            <div class="section-title">${isOromo ? 'Mormiiwwan Sadarkaa Duraa Eegaman' : 'ሊያጋጥሙ የሚችሉ የመጀመርያ ደረጃ መቃወሚያዎች'}</div>
            <ul>
              ${assessment.potentialObjections.map((o) => `<li>${o}</li>`).join('')}
            </ul>
          </div>` : ''}

          <div class="section">
            <div class="section-title">${isOromo ? 'Xiinxala Bal\'aa fi Gorsa' : 'ዝርዝር የሕግ ትንተና'}</div>
            <p>${assessment.detailedReasoning}</p>
            ${assessment.tacticalAdvice ? `<p><em>${assessment.tacticalAdvice}</em></p>` : ''}
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
  };

  // Copy Summary
  const handleCopyReport = () => {
    if (!assessment) return;
    const text = `
[የፍርድ ቤት ክስ የማየት ስልጣን ውሳኔ / Court Jurisdiction Report]
ፍርድ ቤት፡ ${assessment.courtName}
ችሎት፡ ${assessment.benchName}
ምድብ / ቦታ፡ ${assessment.localVenue}
የገንዘብ መጠን፡ ETB ${Number(claimAmount).toLocaleString()}
የተገመተ የዳኝነት ክፍያ፡ ETB ${assessment.estimatedCourtFee.toLocaleString()}

የሕግ መሠረት፡
${assessment.legalGrounds.map((g) => `• ${g.statute}: ${g.explanation}`).join('\n')}

የሚያስፈልጉ ነገሮች (Checklist)፡
${assessment.preliminaryRequirements.map((r) => `✓ ${r.title} - ${r.description}`).join('\n')}

የመጀመርያ ደረጃ መቃወሚያዎች፡
${assessment.potentialObjections.map((o) => `! ${o}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // One-click send to lawsuit drafter
  const handleSendToDrafter = () => {
    if (!assessment || !onNavigateToDrafter) return;
    onNavigateToDrafter({
      courtName: assessment.courtName,
      benchName: assessment.benchName,
      jurisdictionBasis: `${assessment.localVenue} - ${assessment.legalGrounds.map((g) => g.statute).join('፣ ')}`,
      claimAmountETB: claimAmount,
      claimCategory: disputeType,
      defendantAddress: defendantLocation,
    });
  };

  // One-click send to defense drafter (for defendants)
  const handleSendToDefense = () => {
    if (!assessment || !onNavigateToDefense) return;
    onNavigateToDefense({
      courtName: assessment.courtName,
      benchName: assessment.benchName,
      jurisdictionBasis: `${assessment.localVenue} - ${assessment.legalGrounds.map((g) => g.statute).join('፣ ')}`,
      claimAmountETB: claimAmount,
      claimCategory: disputeType,
      defendantAddress: defendantLocation,
    });
  };

  // Toggle checklist checkbox
  const toggleChecklist = (idx: number) => {
    setCheckedChecklist((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/30 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Building className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Qorannoo Aangoo Mana Murtii' : isEnglish ? 'Court Jurisdiction & Venue' : 'የፍርድ ቤት ክስ የማየት ስልጣን መለያ'}</span>
              <span className="text-indigo-500/50">•</span>
              <span className="text-amber-300">አዋጅ ቁጥር 1234/2013 & የፍ/ሥ/ሥ/ሕ/ቁ 1-31</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('jurisdictionTitle')}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              {t('jurisdictionSubtitle')}
            </p>
          </div>

          {/* Navigation Mode Picker */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'wizard'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Miseensa Gaaffii' : isEnglish ? 'Questionnaire' : 'የሁኔታዎች መጠይቅ'}</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'presets'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Dhimmoota Fakkeenyaa' : isEnglish ? 'Presets' : 'ናሙና አጋጣሚዎች'}</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Gabatee Aangoo' : isEnglish ? 'Legal Matrix' : 'የሕግ ስልጣን ሰንጠረዥ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE QUESTIONNAIRE WIZARD */}
      {activeTab === 'wizard' && (
        <div className="space-y-6">
          {/* Wizard Step Navigation Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { num: 1, label: t('jurisdictionWizardStep1'), icon: Scale },
              { num: 2, label: t('jurisdictionWizardStep2'), icon: Users },
              { num: 3, label: t('jurisdictionWizardStep3'), icon: MapPin },
              { num: 4, label: t('jurisdictionWizardStep4'), icon: CheckCircle2 },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/5'
                      : isPast
                      ? 'bg-slate-900 border-emerald-900/40 text-emerald-400'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-semibold">{step.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* STEP 1: NATURE OF DISPUTE */}
          {currentStep === 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" />
                  <span>{isOromo ? '1. Akaakuu fi Qabiyyee Falmii Filadhaa' : '1. የክርክሩን አይነትና ፍሬ ነገር ይምረጡ'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isOromo
                    ? 'Akaakuun falmii mana murtii fi dhaddacha dhimma kana ilaalu adda baasuuf bu\'uura jalqabaati.'
                    : 'የክርክሩ ይዘት ጉዳዩን የትኛው ፍርድ ቤትና የትኛው ልዩ ችሎት (ፍትሐብሔር፣ ንግድ፣ ሰራተኛ፣ ቤተሰብ ወዘተ) ማየት እንዳለበት ይወስናል።'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    id: 'debt_contract',
                    title: isOromo ? 'Liqii Maallaqaa / Cabsa Waliigaltee' : 'የገንዘብ ብድር / የውል ጥሰት',
                    desc: isOromo ? 'Liqii deebisuu dhabuu, waliigaltee bittaa fi gurgurtaa' : 'ብድር አለመመለስ፣ የሽያጭ፣ የግዥ ወይም የአገልግሎት ውል አለመፈጸም',
                    icon: DollarSign,
                  },
                  {
                    id: 'rent_eviction',
                    title: isOromo ? 'Kireeffannaa Manaa & Gadi-dhiisisiisuu' : 'የቤት ኪራይና ማስለቀቅ',
                    desc: isOromo ? 'Kiraa kaffaluu dhabuu fi manicha gadhiisiisuu' : 'ያልተከፈለ ኪራይ ማስከፈል፣ ውል ማቋረጥ እና ቤት ማስለቀቅ',
                    icon: Building,
                  },
                  {
                    id: 'immovable_property',
                    title: isOromo ? 'Qabeenya Hin Sochoonee / Lafa' : 'የማይንቀሳቀስ ንብረት / ይዞታ',
                    desc: isOromo ? 'Mana, lafa, waraqaa ragaa abbaa qabeenyummaa' : 'የመኖሪያ ወይም የንግድ ቤት ባለቤትነት፣ ካርታ፣ የግንባታ ይዞታ ክርክር',
                    icon: MapPin,
                  },
                  {
                    id: 'labor',
                    title: isOromo ? 'Falmii Hojjetaa fi Hojjechiisaa' : 'የአሰሪና ሠራተኛ ክርክር',
                    desc: isOromo ? 'Hojii irraa gaggeeffamuu seeraan alaa, beenyaa fi miindaa' : 'ያላግባብ ከስራ መሰናበት፣ የስንብት ካሳ፣ የትርፍ ሰዓትና ያልተከፈለ ደመወዝ',
                    icon: Briefcase,
                  },
                  {
                    id: 'family_divorce',
                    title: isOromo ? 'Gaa\'ila, Wal-hiikuu & Daa\'imman' : 'የቤተሰብ፣ ፍቺና ቀለብ',
                    desc: isOromo ? 'Gaa\'ila diiguu, qabeenya gaa\'ilaa qooddachuu, qeleba' : 'የጋብቻ ፍቺ፣ የጋራ ሀብት ክፍፍል፣ የልጆች አስተዳደግና ቀለብ',
                    icon: Users,
                  },
                  {
                    id: 'succession',
                    title: isOromo ? 'Dhaala fi Qabeenya Qooddachuu' : 'የውርስና የሀብት ክፍፍል',
                    desc: isOromo ? 'Dhaaltummaa mirkaneessuu, qabeenya dhaalaa qooduu' : 'የውርስ ማጣራት፣ የወራሽነት ማረጋገጫ፣ የሟች ሀብት በወራሾች ክፍፍል',
                    icon: Layers,
                  },
                  {
                    id: 'commercial_company',
                    title: isOromo ? 'Daldala, Aksiyoona & Kasaaraa' : 'የንግድ ድርጅት፣ አክሲዮንና ኪሳራ',
                    desc: isOromo ? 'Aksiyoona qooddachuu, waldaa daldalaa, kasaaraa' : 'የአክሲዮን ማህበር ክርክር፣ የንግድ ድርጅት መፍረስ፣ የኪሳራ ውሳኔ',
                    icon: Building,
                  },
                  {
                    id: 'tort_accident',
                    title: isOromo ? 'Balaa Tiraafikaa fi Miidhaa (Beenyaa)' : 'የትራፊክ አደጋና የካሳ ጥያቄ',
                    desc: isOromo ? 'Miidhaa qaamaa fi qabeenyaa balaatiin qaqqabeef beenyaa' : 'በተሽከርካሪ አደጋ የደረሰ የአካልና የንብረት ጉዳት ማካካሻ ካሳ',
                    icon: AlertTriangle,
                  },
                  {
                    id: 'intellectual_property',
                    title: isOromo ? 'Qabeenya Sammuu (Kopii fi Asxaa)' : 'የአእምሯዊ ንብረት (የፈጠራና የንግድ ምልክት)',
                    desc: isOromo ? 'Mirga barruu, asxaa daldalaa fi kalaqa sammuu' : 'የቅጂ መብት፣ የንግድ ምልክት (Trademark) እና የፓተንት መብት ጥሰት',
                    icon: Sparkles,
                  },
                  {
                    id: 'sharia_personal',
                    title: isOromo ? 'Dhimma Dhuunfaa Shari\'aa (Islaama)' : 'የሸሪዓ የግልና ቤተሰብ ጉዳዮች',
                    desc: isOromo ? 'Gaa\'ila, hiikkaa fi dhaala seera Shari\'aatiin' : 'በሙስሊሞች መካከል የሚደረግ የኒካህ ጋብቻ፣ ፍቺና የውርስ ክፍፍል',
                    icon: Scale,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = disputeType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDisputeType(item.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all"
                >
                  <span>{isOromo ? 'Itti Fufi' : 'ቀጣይ (የተከራካሪዎች ማንነትና ገንዘብ)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PARTIES & PECUNIARY VALUE */}
          {currentStep === 2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>{isOromo ? '2. Eenyummaa Wal-falmitootaa fi Hanga Maallaqaa' : '2. የተከራካሪዎች ማንነትና የይገባኛል የገንዘብ መጠን'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isOromo
                    ? 'Hangi maallaqaa (Qarshii 15M gadi ykn ol) fi qaamoleen falmitootaa mana murtii murteessuuf murteessaadha.'
                    : 'በፌዴራል ፍርድ ቤቶች አዋጅ 1234/2013 መሠረት ከ15 ሚሊዮን ብር በላይ የሆኑ ክሶች በከፍተኛ ፍርድ ቤት፤ ከ15 ሚሊዮን ብር በታች የሆኑት ደግሞ በመጀመሪያ ደረጃ ፍርድ ቤት ይታያሉ።'}
                </p>
              </div>

              {/* Claim Amount Input */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  {isOromo ? 'Hanga Maallaqa Iyyatame (Qarshii / ETB):' : 'የሚጠየቀው የገንዘብ ወይም የንብረት ዋጋ መጠን (በብር / ETB)፡'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-amber-400 font-bold text-sm">ETB</span>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-14 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Instant Pecuniary Hint Badge */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  {Number(claimAmount) > 15000000 ? (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2 w-full">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        {isOromo
                          ? 'Hangi maallaqaa Qarshii 15,000,000 ol waan ta\'eef Mana Murtii Ol\'aanaa Federaalaatiin ilaalama.'
                          : 'የገንዘብ መጠኑ ከ15,000,000 ብር በላይ በመሆኑ በቀጥታ በፌዴራል ከፍተኛ ፍርድ ቤት ይታያል (አዋጅ 1234/2013 አንቀጽ 12)።'}
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 w-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {isOromo
                          ? 'Hangi maallaqaa Qarshii 15,000,000 gadi waan ta\'eef Mana Murtii Sadarkaa Duraa Federaalaatiin ilaalama.'
                          : 'የገንዘብ መጠኑ ከ15,000,000 ብር በታች በመሆኑ በመጀመሪያ ደረጃ ፍርድ ቤት ስልጣን ስር ይወድቃል (አዋጅ 1234/2013 አንቀጽ 11)።'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Parties Nature Radios */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  {isOromo ? 'Eenyummaa fi Amala Qaamolee Wal-falmitootaa:' : 'የተከራካሪ ወገኖች ማንነትና ህጋዊ አቋም፡'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'private_citizens',
                      title: isOromo ? 'Namoota Dhuunfaa (Idilee)' : 'ተራ ዜጎች / ግለሰቦች',
                      sub: isOromo ? 'Namoota dhuunfaa gidduutti' : 'በግለሰብ ከሳሽ እና በግለሰብ ተከሳሽ መካከል',
                    },
                    {
                      id: 'commercial_company',
                      title: isOromo ? 'Dhaabbata Daldalaa / Aksiyoona' : 'የንግድ ድርጅት / ኃ/የተ/የግ/ማህበር / አክሲዮን',
                      sub: isOromo ? 'Dhaabbata daldala qabu' : 'የንግድ ህጉን መሰረት ያደረጉ ኩባንያዎች ወይም ነጋዴዎች',
                    },
                    {
                      id: 'federal_organ_or_employee',
                      title: isOromo ? 'Qaama Mootummaa Federaalaa' : 'የፌዴራል የመንግስት ተቋም ወይም ሰራተኛ በስራው ምክንያት',
                      sub: isOromo ? 'Biroo mootummaa federaalaa' : 'የፌዴራል ሚኒስቴር፣ ባለስልጣን ወይም ሰራተኛ በስራው ምክንያት የተከሰሰበት',
                    },
                    {
                      id: 'foreign_embassy_or_citizen',
                      title: isOromo ? 'Lammii Biyya Alaa ykn Embaasii' : 'የውጭ ሀገር ዜጋ፣ ኤምባሲ ወይም አለም አቀፍ ድርጅት',
                      sub: isOromo ? 'Biyya alaa / Dhaabbata idil-addunyaa' : 'የውጭ ዜግነት ያላቸው ወገኖች ወይም ኤምባሲዎች ያሉበት',
                    },
                    {
                      id: 'inter_regional_residents',
                      title: isOromo ? 'Jiraattota Naannoolee Adda Addaa' : 'በተለያዩ ክልሎች የሚኖሩ ተከራካሪዎች',
                      sub: isOromo ? 'Fkn: Finfinnee fi Oromiyaa' : 'ለምሳሌ አንደኛው አዲስ አበባ ሌላኛው ኦሮሚያ ወይም አማራ ክልል የሚኖር',
                    },
                    {
                      id: 'muslim_family_consent',
                      title: isOromo ? 'Hordoftoota Islaamaa (Waliigaltee Barreeffamaa)' : 'ሁለቱም ተከራካሪዎች ሙስሊም ሆነው በጽሑፍ የተስማሙ',
                      sub: isOromo ? 'Fedhii guutuudhaan Shari\'aa filatan' : 'የሸሪዓ ፍርድ ቤት እንዲያይላቸው የጽሑፍ ፈቃድ የሰጡ',
                    },
                  ].map((p) => {
                    const isSelected = partiesNature === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPartiesNature(p.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{p.title}</span>
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setPartiesNature(p.id)}
                            className="text-amber-500 focus:ring-amber-500 h-4 w-4 bg-slate-900 border-slate-700"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{p.sub}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {isOromo ? 'Duubatti' : 'ወደ ኋላ'}
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all"
                >
                  <span>{isOromo ? 'Itti Fufi' : 'ቀጣይ (የቦታና የግዛት ሁኔታ)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: VENUE & GEOGRAPHY */}
          {currentStep === 3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span>{isOromo ? '3. Iddoo fi Daangaa Teessoo (Local Venue)' : '3. የቦታ፣ የአድራሻና የምድብ ስልጣን (Venue)'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isOromo
                    ? 'Akkaataa Seera Adeemsa Falmii Sivilii Kw. 19-31 tiin himanni iddoo himatamaan jiraatutti ykn bakka dhimmi sun uumametti dhihaata.'
                    : 'በፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 19-31 መሠረት ክሱ ተከሳሹ በሚኖርበት፣ ውሉ በተደረገበት ወይም ንብረቱ ባለበት ምድብ ፍርድ ቤት መቅረብ አለበት።'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Defendant Residence */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isOromo ? 'Teessoo Himatamaa (Bakka Jireenyaa ykn Hojii):' : 'የተከሳሽ አድራሻ (የመኖሪያ ወይም የስራ ቦታ)፡'} *
                  </label>
                  <input
                    type="text"
                    value={defendantLocation}
                    onChange={(e) => setDefendantLocation(e.target.value)}
                    placeholder="ለምሳሌ፡ አዲስ አበባ፣ ቦሌ ክፍለ ከተማ፣ ወረዳ 03"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500">
                    {isOromo ? 'Kutaa magaalaa fi aanaa ibsaa (fkn: Lidataa, Boolee, Araadaa)' : 'ክፍለ ከተማና ወረዳ ይጠቅሱ (ቦሌ፣ ልደታ፣ አራዳ፣ ቂርቆስ ወዘተ)'}
                  </span>
                </div>

                {/* Contract / Dispute Place */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isOromo ? 'Iddoo Waliigalteen Itti Raawwatame / Balaan Qaqqabe:' : 'ውሉ የተደረገበት ወይም አደጋው የደረሰበት ስፍራ፡'}
                  </label>
                  <input
                    type="text"
                    value={contractExecutionPlace}
                    onChange={(e) => setContractExecutionPlace(e.target.value)}
                    placeholder="ለምሳሌ፡ አዲስ አበባ፣ ቂርቆስ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500">
                    {isOromo ? 'Akkaataa Kw. 24 ykn 27 tiin filannoo aangoo ta\'a' : 'በአንቀጽ 24 ወይም 27 መሠረት አማራጭ ስልጣን ይሰጣል'}
                  </span>
                </div>

                {/* Immovable Property Location */}
                {(disputeType === 'immovable_property' || disputeType === 'rent_eviction') && (
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-amber-300">
                      {isOromo ? 'Iddoo Manichi ykn Qabeenyi Hin Sochoone Itti Argamu:' : 'ቤቱ ወይም የማይንቀሳቀሰው ንብረት የሚገኝበት ትክክለኛ ቦታ፡'} *
                    </label>
                    <input
                      type="text"
                      value={propertyLocation}
                      onChange={(e) => setPropertyLocation(e.target.value)}
                      placeholder="ለምሳሌ፡ አዲስ አበባ፣ ልደታ ክ/ከተማ፣ ወረዳ 04፣ የቤት ቁጥር 123"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-600/50 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-amber-400/80">
                      {isOromo ? 'Akkaataa Seera Adeemsa Falmii Sivilii Kw. 20 tiin iddoo manichi argamutti ilaalama.' : 'በፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 20 መሠረት የማይንቀሳቀስ ንብረት ክርክር ንብረቱ ባለበት ስፍራ ይታያል።'}
                    </span>
                  </div>
                )}

                {/* Brief Summary */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isOromo ? 'Ibsa Dhimmaa Gabaabaa (Yoo Jiraate):' : 'አጭር የጉዳዩ መግለጫ (አስፈላጊ ከሆነ)፡'}
                  </label>
                  <textarea
                    rows={3}
                    value={caseSummary}
                    onChange={(e) => setCaseSummary(e.target.value)}
                    placeholder={
                      isOromo
                        ? 'Qabxii gabaabaa dhimma keessanii asitti barreessuu dandeessu...'
                        : 'የጉዳይዎን አጭር ጭብጥ እዚህ መጻፍ ይችላሉ...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {isOromo ? 'Duubatti' : 'ወደ ኋላ'}
                </button>

                <button
                  onClick={runAssessment}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? t('analyzingJurisdictionBtn') : t('analyzeJurisdictionBtn')}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ASSESSMENT RESULTS & CHECKLIST */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                  <div className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
                  <h3 className="text-base font-bold text-white">{t('analyzingJurisdictionBtn')}</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {isOromo
                      ? 'Labsii Manneen Murtii Federaalaa Lakk. 1234/2013 fi Seera Adeemsa Falmii Sivilii Kw. 1-31 irratti hundaa\'uun sakatta\'aa jira...'
                      : 'በፌዴራል ፍርድ ቤቶች አዋጅ ቁጥር 1234/2013 እና የፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 1-31 መሠረት ስልጣኑን በማረጋገጥ ላይ...'}
                  </p>
                </div>
              ) : assessment ? (
                <div className="space-y-6">
                  {/* Primary Decision Banner Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t('competentCourtLabel')}</span>
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          {assessment.courtName}
                        </h2>
                      </div>

                      {/* Top Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={handleCopyReport}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                        >
                          {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedReport ? t('copied') : t('copy')}</span>
                        </button>
                        <button
                          onClick={handlePrintReport}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{t('actionPrintReport')}</span>
                        </button>
                        {onNavigateToDrafter && (
                          <button
                            onClick={handleSendToDrafter}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{t('actionSendToDrafter')}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Key Attributes 3-Column Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                          {t('competentBenchLabel')}
                        </span>
                        <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{assessment.benchName}</span>
                        </span>
                      </div>

                      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                          {t('localVenueLabel')}
                        </span>
                        <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{assessment.localVenue}</span>
                        </span>
                      </div>

                      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                            {isOromo ? 'Tilmaama Kaffaltii (Dambii 1/2017)' : 'የዳኝነት ክፍያ (አዲሱ ደንብ 1/2017)'}
                          </span>
                          <span className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>ETB {assessment.estimatedCourtFee.toLocaleString()}</span>
                          </span>
                        </div>
                        {onNavigateToFeeCalculator && (
                          <button
                            onClick={() => onNavigateToFeeCalculator(claimAmount)}
                            className="mt-2 text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors self-start"
                          >
                            <Calculator className="w-3 h-3" />
                            <span>{isOromo ? 'Shallaggii Bal\'aa ➔' : 'ዝርዝር የክፍያ ስሌት ➔'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Split: Requirements Checklist vs Legal Grounds */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Comprehensive Requirements Checklist */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <span>{t('preliminaryRequirementsLabel')}</span>
                        </h3>
                        <span className="text-xs text-emerald-400 font-semibold">
                          {Object.values(checkedChecklist).filter(Boolean).length} / {assessment.preliminaryRequirements.length}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">
                        {isOromo
                          ? 'Waraqaa himannaa galchuun dura qabxiilee armaan gadii qopheeffachuu keessan mirkaneeffadhaa:'
                          : 'ክሱን ፍርድ ቤት ከማስመዝገብዎ በፊት የሚከተሉትን ቅድመ-ሁኔታዎችና ሰነዶች ማሟላትዎን ያረጋግጡ፦'}
                      </p>

                      <div className="space-y-3">
                        {assessment.preliminaryRequirements.map((req, idx) => {
                          const isChecked = !!checkedChecklist[idx];
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleChecklist(idx)}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                isChecked
                                  ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                                  : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:bg-slate-800'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                    : 'border-slate-600 bg-slate-900'
                                }`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 font-bold stroke-[3]" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                                    {req.title}
                                  </span>
                                  {req.mandatory && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                      {isOromo ? 'Dirqama' : 'ግዴታ'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{req.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Statutory Grounds & Anticipated Objections */}
                    <div className="space-y-6">
                      {/* Legal Grounds */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                          <BookOpen className="w-4 h-4 text-amber-400" />
                          <span>{t('legalGroundsLabel')}</span>
                        </h3>

                        <div className="space-y-3">
                          {assessment.legalGrounds.map((ground, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                              <span className="text-xs font-bold text-amber-400 block font-mono">{ground.statute}</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{ground.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Anticipated Objections */}
                      {assessment.potentialObjections && assessment.potentialObjections.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
                          <h3 className="text-sm sm:text-base font-bold text-red-300 flex items-center gap-2 pb-2 border-b border-slate-800">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            <span>{t('potentialObjectionsLabel')}</span>
                          </h3>
                          <div className="space-y-2">
                            {assessment.potentialObjections.map((obj, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-xs text-red-200 flex items-start gap-2">
                                <span className="text-red-400 font-bold">•</span>
                                <span>{obj}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detailed Reasoning & Advice */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
                        <h3 className="text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
                          <Info className="w-4 h-4 text-indigo-400" />
                          <span>{isOromo ? 'Xiinxala Bal\'aa fi Gorsa Seeraa' : 'የሕግ ትንተና እና ስልታዊ ምክር'}</span>
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{assessment.detailedReasoning}</p>
                        {assessment.tacticalAdvice && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                            <strong>💡 {isOromo ? 'Gorsa Qophii Himannaa:' : 'የክስ ዝግጅት ምክር፡'}</strong> {assessment.tacticalAdvice}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isOromo ? 'Deebisii Qoradhu' : 'እንደገና ጀምር / ለውጦችን አድርግ'}</span>
                    </button>

                    <div className="flex items-center gap-3 flex-wrap">
                      {onNavigateToDrafter && (
                        <button
                          onClick={handleSendToDrafter}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{t('actionSendToDrafter')}</span>
                        </button>
                      )}

                      {onNavigateToDefense && (
                        <button
                          onClick={handleSendToDefense}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-600/25 active:scale-95 transition-all cursor-pointer"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>{isOromo ? 'Deebii Himatamaa Qopheessi' : 'የመከላከያ መልስ አዘጋጅ (ለተከሳሽ)'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAMPLE PRESETS (የተለመዱ ናሙና አጋጣሚዎች) */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-1">
              {isOromo ? 'Dhimmoota Fakkeenyaa fi Qoodinsa Aangoo' : 'የተለመዱ ናሙና አጋጣሚዎችና የስልጣን ድልድል'}
            </h3>
            <p className="text-xs text-slate-400">
              {isOromo
                ? 'Dhimmoota armaan gadii filachuun sirni kun akkamitti mana murtii adda baasu ilaaluu dandeessu:'
                : 'ከዚህ በታች ከተዘረዘሩት የተለመዱ የክስ አጋጣሚዎች አንዱን በመምረጥ ፍርድ ቤቱንና የሚያስፈልጉ ነገሮችን ወዲያውኑ ይመልከቱ፦'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {samplePresets.map((preset, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      ETB {Number(preset.claimAmount).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Case #{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{preset.desc}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{preset.defendantLocation.split('፣')[0]}</span>
                  <button
                    onClick={() => handleSelectPreset(preset)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all active:scale-95"
                  >
                    <span>{isOromo ? 'Qoradhu' : 'ስልጣኑን መርምር'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEGAL MATRIX & HIERARCHY GUIDE (የሕግ ስልጣን ሰንጠረዥ) */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>
                {isOromo
                  ? 'Qajeelfama Qoodinsa Aangoo Manneen Murtii Itoophiyaa'
                  : 'የኢትዮጵያ ፍርድ ቤቶች የስልጣን ድልድል መመሪያ ማጣቀሻ (አዋጅ 1234/2013)'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isOromo
                ? 'Heera Mootummaa LFDI Kw. 78-80 fi Labsii Manneen Murtii Federaalaa Lakk. 1234/2013 bu\'uureffachuun aangoon manneen murtii akka armaan gadiitti qoodama:'
                : 'በኢ.ፌ.ዲ.ሪ ሕገ-መንግሥት አንቀጽ 78-80 እና በፌዴራል ፍርድ ቤቶች አዋጅ ቁጥር 1234/2013 መሠረት የፍርድ ቤቶች ስልጣን እንደሚከተለው ተደልድሏል፦'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-300">
                    <th className="p-3 font-bold">{isOromo ? 'Mana Murtii' : 'የፍርድ ቤቱ ደረጃ'}</th>
                    <th className="p-3 font-bold">{isOromo ? 'Aangoo Maallaqaa (Pecuniary)' : 'የገንዘብ መጠን ስልጣን'}</th>
                    <th className="p-3 font-bold">{isOromo ? 'Qabiyyee Dhimmaa (Subject Matter)' : 'የጉዳዩ አይነት (ቁሳቁስ)'}</th>
                    <th className="p-3 font-bold">{isOromo ? 'Bu\'uura Seeraa' : 'የሕግ ድንጋጌ'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-amber-300">
                      {isOromo ? 'Mana Murtii Sadarkaa Duraa Federaalaa' : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት'}
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">
                      {isOromo ? 'Hanga Qarshii 15,000,000' : 'እስከ 15,000,000 ብር'}
                    </td>
                    <td className="p-3">
                      {isOromo
                        ? 'Falmii sivilii, kireeffannaa, liqii, falmii hojjetaa (boordii irraa dhufu), maatii'
                        : 'የፍትሐብሔር ክሶች፣ የቤት ኪራይ፣ የብድር ውል፣ የግል የስራ ክርክር፣ የቤተሰብና ውርስ'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">አዋጅ 1234/2013 አንቀጽ 11</td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-amber-400">
                      {isOromo ? 'Mana Murtii Ol\'aanaa Federaalaa' : 'የፌዴራል ከፍተኛ ፍርድ ቤት'}
                    </td>
                    <td className="p-3 font-mono text-amber-400 font-bold">
                      {isOromo ? 'Qarshii 15,000,000 ol' : 'ከ15,000,000 ብር በላይ'}
                    </td>
                    <td className="p-3">
                      {isOromo
                        ? 'Falmii maallaqa ol\'aanaa, qabeenya sammuu (IP), kasaaraa, daldala galaanaa, murtii biyya alaa mirkaneessuu'
                        : 'ከፍተኛ የገንዘብ ክሶች፣ የአእምሯዊ ንብረት፣ የኪሳራ ውሳኔ፣ የባህር ንግድ፣ የውጭ ፍርድ አፈጻጸም'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">አዋጅ 1234/2013 አንቀጽ 12</td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-cyan-300">
                      {isOromo ? 'Dhaddacha Ijibbaata Federaalaa' : 'የፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ችሎት'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">{isOromo ? 'Daangaa hin qabu' : 'ወሰን የለውም'}</td>
                    <td className="p-3">
                      {isOromo
                        ? 'Dogoggora bu\'uura seeraa murtii dhumaa manneen murtii federaalaa fi naannoo irra jiru sirreessuu'
                        : 'መሰረታዊ የሕግ ስህተት ያለባቸውን የመጨረሻ ፍርዶች በማረም አስገዳጅ የሕግ ትርጉም መስጠት'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">አዋጅ 1234/2013 አንቀጽ 10</td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-emerald-300">
                      {isOromo ? 'Mana Murtii Shari\'aa Federaalaa' : 'የፌዴራል የሸሪዓ ፍርድ ቤቶች'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">{isOromo ? 'Daangaa hin qabu' : 'ወሰን የለውም'}</td>
                    <td className="p-3">
                      {isOromo
                        ? 'Gaa\'ila, hiikkaa, qeleba fi dhaala hordoftoota amantaa Islaamaa gidduutti fedhii barreeffamaatiin'
                        : 'የጋብቻ፣ ፍቺ፣ ቀለብ እና ውርስ ጉዳዮች በሙስሊም ወገኖች የጋራ የጽሑፍ ፈቃድ ሲቀርብ'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">አዋጅ 188/1992</td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-purple-300">
                      {isOromo ? 'Mana Murtii Hawaasummaa Qabalee' : 'የቀበሌ ማህበራዊ ፍርድ ቤት'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      {isOromo ? 'Hanga Qarshii 50,000' : 'እስከ 50,000 ብር'}
                    </td>
                    <td className="p-3">
                      {isOromo
                        ? 'Walitti bu\'iinsa ollaa xixiqqaa, miidhaa salphaa, liqii xixiqqaa'
                        : 'አነስተኛ የጎረቤት ክርክሮች፣ ቀላል የድንበርና የይዞታ ጥያቄዎች፣ አነስተኛ እዳ'}
                    </td>
                    <td className="p-3 font-mono text-slate-400">የአስተዳደሩ ደንብ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
