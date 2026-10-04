/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { LegalConsultation } from './components/LegalConsultation';
import { CaseControlCenter } from './components/CaseControlCenter';
import { HearingTracker } from './components/HearingTracker';
import { LawLibrary } from './components/LawLibrary';
import { DocumentDrafter } from './components/DocumentDrafter';
import { DefenseDrafter, DefenseDrafterInitialData } from './components/DefenseDrafter';
import { Translator } from './components/Translator';
import { CourtJurisdiction } from './components/CourtJurisdiction';
import { CourtFeeCalculator } from './components/CourtFeeCalculator';
import { LawyerDirectory } from './components/LawyerDirectory';
import { WorkflowBar } from './components/WorkflowBar';
import { JusticeLogo } from './components/JusticeLogo';
import { HelpModal } from './components/HelpModal';
import { AuthModal } from './components/AuthModal';
import { AboutCompanyModal } from './components/AboutCompanyModal';
import { COMPANY_INFO } from './data/companyInfo';
import { ManagedCase, CourtHearing, LegalAnalysisResult, LawsuitQuestionnaire } from './types/legal';
import { INITIAL_CASES, INITIAL_HEARINGS } from './data/sampleData';
import { Scale, Building2, Phone, Mail, Globe, ExternalLink, Code2, Users } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function LegalApp() {
  const { t, isOromo, isEnglish } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('consultation');
  const [drafterInitialData, setDrafterInitialData] = useState<Partial<LawsuitQuestionnaire> | null>(null);
  const [defenseInitialData, setDefenseInitialData] = useState<DefenseDrafterInitialData | null>(null);
  const [feeCalculatorInitialAmount, setFeeCalculatorInitialAmount] = useState<number>(450000);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'client' | 'lawyer'>('client');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  // About Company & Developers Modal State
  const [isAboutCompanyOpen, setIsAboutCompanyOpen] = useState(false);
  
  // Persistent local storage for cases
  const [cases, setCases] = useState<ManagedCase[]>(() => {
    try {
      const saved = localStorage.getItem('ytb_cases');
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  // Persistent local storage for hearings
  const [hearings, setHearings] = useState<CourtHearing[]>(() => {
    try {
      const saved = localStorage.getItem('ytb_hearings');
      return saved ? JSON.parse(saved) : INITIAL_HEARINGS;
    } catch {
      return INITIAL_HEARINGS;
    }
  });

  const [libraryInitialSearch, setLibraryInitialSearch] = useState<string>('');
  const [hearingsFilterCaseId, setHearingsFilterCaseId] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ytb_cases', JSON.stringify(cases));
    } catch (e) {
      console.error('Failed to save cases to local storage', e);
    }
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem('ytb_hearings', JSON.stringify(hearings));
    } catch (e) {
      console.error('Failed to save hearings to local storage', e);
    }
  }, [hearings]);

  // Handler to add a case from the Consultation view
  const handleAddCaseFromConsultation = (caseData: Partial<ManagedCase>, analysis: LegalAnalysisResult) => {
    const defaultCourt = isOromo 
      ? 'Mana Murtii Sadarkaa Duraa Federaalaa' 
      : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት';
    const defaultBench = isOromo ? 'Dhaaddacha Sivilii' : 'የፍትሐብሔር ችሎት';
    const defaultRole = isOromo ? 'Himataa' : 'ከሳሽ / አመልካች';

    const newCase: ManagedCase = {
      id: `case-${Date.now()}`,
      caseNumber: isOromo 
        ? `F/M/D ${Math.floor(10000 + Math.random() * 90000)}/16` 
        : `ፌ/መ/ደ ${Math.floor(10000 + Math.random() * 90000)}/16`,
      title: caseData.title || analysis.title,
      category: caseData.category || 'civil',
      court: caseData.court || analysis.recommendedCourt || defaultCourt,
      bench: caseData.bench || defaultBench,
      clientRole: caseData.clientRole || 'plaintiff',
      plaintiff: caseData.plaintiff || defaultRole,
      defendant: caseData.defendant || (isOromo ? 'Himatamaa' : 'ተከሳሽ'),
      stage: 'pre_trial',
      filingDate: new Date().toISOString().split('T')[0],
      summary: caseData.summary || analysis.summary,
      notes: caseData.notes || analysis.counselAdviceAmharic,
      evidences: caseData.evidences || [],
      milestones: caseData.milestones || [],
      analysisResult: analysis,
      status: 'active',
    };

    setCases(prev => [newCase, ...prev]);

    // Also auto-schedule a preparation hearing / milestone
    const initialHearing: CourtHearing = {
      id: `h-${Date.now()}`,
      caseId: newCase.id,
      caseTitle: newCase.title,
      caseNumber: newCase.caseNumber,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timeAmharic: isOromo ? 'Ganama 3:30' : 'ጠዋት 3:30',
      court: newCase.court,
      bench: newCase.bench,
      hearingPurpose: isOromo 
        ? 'Iyyannoo himannaa fi ragaalee dhaaddachaaf dhiheessuu'
        : 'የክስ ማመልከቻና ማስረጃዎችን ለችሎት ማቅረብ',
      preparationChecklist: [
        { item: isOromo ? 'Waliigaltee ykn ragaa jalqabaa qopheessuu' : 'የዋናውን ውል ወይም ማስረጃ ኦሪጅናል ማዘጋጀት', completed: false },
        { item: isOromo ? 'Kaffaltii askuutaa mana murtii kaffaluu' : 'የዳኝነት አገልግሎት ክፍያ ማህተም መክፈል', completed: false },
        { item: isOromo ? 'Teessoo fi wamicha himatamaa mirkaneeffachuu' : 'የተከሳሽ አድራሻና መጥሪያ ማረጋገጥ', completed: false },
      ],
      status: 'upcoming',
    };

    setHearings(prev => [initialHearing, ...prev]);
  };

  const handleUpdateCase = (updated: ManagedCase) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleCreateCase = (newCase: ManagedCase) => {
    setCases(prev => [newCase, ...prev]);
  };

  const handleDeleteCase = (caseId: string) => {
    setCases(prev => prev.filter(c => c.id !== caseId));
    setHearings(prev => prev.filter(h => h.caseId !== caseId));
  };

  const handleUpdateHearing = (updated: CourtHearing) => {
    setHearings(prev => prev.map(h => h.id === updated.id ? updated : h));
  };

  const handleCreateHearing = (newHearing: CourtHearing) => {
    setHearings(prev => [newHearing, ...prev]);
  };

  const handleDeleteHearing = (hearingId: string) => {
    setHearings(prev => prev.filter(h => h.id !== hearingId));
  };

  const handleNavigateToHearings = (caseId?: string) => {
    setHearingsFilterCaseId(caseId || null);
    setActiveTab('hearings');
  };

  const handleOpenLibraryWithSearch = (query: string) => {
    setLibraryInitialSearch(query);
    setActiveTab('library');
  };

  const handleTransferSearchToCase = (title: string, summary: string, articles: any[]) => {
    const newCase: ManagedCase = {
      id: `case-${Date.now()}`,
      caseNumber: isOromo 
        ? `F/M/D ${Math.floor(10000 + Math.random() * 90000)}/16` 
        : `ፌ/መ/ደ ${Math.floor(10000 + Math.random() * 90000)}/16`,
      title: title.slice(0, 60),
      category: 'civil',
      court: isOromo 
        ? 'Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Lidataa' 
        : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ',
      bench: isOromo ? 'Dhaaddacha Sivilii' : 'የፍትሐብሔር ችሎት',
      clientRole: 'plaintiff',
      plaintiff: isOromo ? 'Himataa' : 'ከሳሽ / ተበዳይ',
      defendant: isOromo ? 'Himatamaa' : 'ተከሳሽ / መልስ ሰጪ',
      stage: 'pre_trial',
      filingDate: new Date().toISOString().split('T')[0],
      summary: summary || title,
      notes: isOromo
        ? `Keewwattoota barbaada seeraa irraa dabalama: ${articles.map(a => a.articleNumber).join(', ')}`
        : `ከሕግ መረጃ ፍለጋ ሞተር የተካተቱ አንቀጾች፡ ${articles.map(a => a.articleNumber).join(', ')}`,
      evidences: [],
      milestones: [
        {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: isOromo ? 'Barbaada Seeraa Irraa Galmaa\'e' : 'በሕግ ፍለጋ ሞተር ተመርምሮ ተመዘገበ',
          description: isOromo ? 'Keewwattoonni seera sivilii fi yakkaa adda bahan.' : 'የፍትሐብሔርና የወንጀል ድንጋጌዎች ተለይተዋል።',
          completed: true,
        },
      ],
      status: 'active',
    };

    setCases(prev => [newCase, ...prev]);
    setActiveTab('cases');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Platform Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        caseCount={cases.length}
        hearingCount={hearings.filter(h => h.status === 'upcoming').length}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAboutCompany={() => setIsAboutCompanyOpen(true)}
        onOpenAuth={(role = 'client', mode = 'login') => {
          setAuthModalRole(role);
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24 xl:pb-8">
        {/* Unified Step-by-Step Workflow Pipeline & Role Guide */}
        <WorkflowBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          caseCount={cases.length}
          hearingCount={hearings.filter(h => h.status === 'upcoming').length}
        />

        {activeTab === 'consultation' && (
          <LegalConsultation
            onAddCaseToManagement={handleAddCaseFromConsultation}
            onOpenLibraryWithSearch={handleOpenLibraryWithSearch}
            onStartLawsuitFiling={(prefillData) => {
              setDrafterInitialData(prefillData);
              setActiveTab('drafter');
            }}
            onStartDefenseFiling={(defenseData) => {
              setDefenseInitialData({
                courtName: defenseData.recommendedCourt,
                benchName: defenseData.recommendedBench,
                disputeCategory: defenseData.category,
                claimText: defenseData.caseSummary || defenseData.summary,
                affirmativeDefenses: defenseData.tacticalAdvice || defenseData.advice,
              });
              setActiveTab('defense');
            }}
            onCheckJurisdiction={(_jurisdictionData) => {
              setActiveTab('jurisdiction');
            }}
            onCalculateFee={(amount) => {
              if (amount && amount > 0) {
                setFeeCalculatorInitialAmount(amount);
              }
              setActiveTab('courtFees');
            }}
          />
        )}

        {activeTab === 'cases' && (
          <CaseControlCenter
            cases={cases}
            onUpdateCase={handleUpdateCase}
            onCreateCase={handleCreateCase}
            onDeleteCase={handleDeleteCase}
            onNavigateToHearings={handleNavigateToHearings}
            onNavigateToDrafter={(prefill) => {
              setDrafterInitialData(prefill);
              setActiveTab('drafter');
            }}
            onNavigateToDefense={(prefill) => {
              setDefenseInitialData(prefill);
              setActiveTab('defense');
            }}
            onNavigateToFees={(amount) => {
              setFeeCalculatorInitialAmount(amount);
              setActiveTab('courtFees');
            }}
            onNavigateToJurisdiction={(_data) => {
              setActiveTab('jurisdiction');
            }}
          />
        )}

        {activeTab === 'hearings' && (
          <HearingTracker
            hearings={hearings}
            cases={cases}
            onUpdateHearing={handleUpdateHearing}
            onCreateHearing={handleCreateHearing}
            onDeleteHearing={handleDeleteHearing}
            filterByCaseId={hearingsFilterCaseId}
            onNavigateToCase={(caseId) => {
              setActiveTab('cases');
            }}
            onNavigateToDefense={(hearingData) => {
              setDefenseInitialData({
                courtName: hearingData.courtName,
                benchName: hearingData.benchName,
                caseNumber: hearingData.caseNumber,
                claimText: hearingData.claimText,
              });
              setActiveTab('defense');
            }}
            onNavigateToDrafter={(data) => {
              setDrafterInitialData({
                courtName: data.courtName,
                benchName: data.benchName,
                claimCategory: data.claimCategory,
              });
              setActiveTab('drafter');
            }}
          />
        )}

        {activeTab === 'library' && (
          <LawLibrary
            initialSearch={libraryInitialSearch}
            onTransferToCase={handleTransferSearchToCase}
            onNavigateToDrafter={(articleText) => {
              setDrafterInitialData((prev) => ({
                ...prev,
                additionalFacts: prev?.additionalFacts
                  ? `${prev.additionalFacts}\n• የተጠቀሰ የሕግ ድንጋጌ፡ ${articleText}`
                  : `የተጠቀሰ የሕግ ድንጋጌ፡ ${articleText}`,
              }));
              setActiveTab('drafter');
            }}
            onNavigateToDefense={(articleText) => {
              setDefenseInitialData((prev) => ({
                ...prev,
                affirmativeDefenses: prev?.affirmativeDefenses
                  ? `${prev.affirmativeDefenses}\n• የሕግ ድንጋጌ ማጣቀሻ፡ ${articleText}`
                  : `የሕግ ድንጋጌ ማጣቀሻ፡ ${articleText}`,
              }));
              setActiveTab('defense');
            }}
          />
        )}

        {activeTab === 'drafter' && (
          <DocumentDrafter
            initialData={drafterInitialData}
            onSaveToManagedCases={(newCase) => {
              handleCreateCase(newCase);
              setActiveTab('cases');
            }}
            onNavigateToDefense={() => {
              setActiveTab('defense');
            }}
          />
        )}

        {activeTab === 'defense' && (
          <DefenseDrafter
            initialData={defenseInitialData}
            onSaveToManagedCases={(newCase) => {
              setCases((prev) => [newCase, ...prev]);
              setActiveTab('cases');
            }}
            onNavigateToJurisdiction={(_claimAmount) => {
              setActiveTab('jurisdiction');
            }}
            onNavigateToFeeCalculator={(amount) => {
              setFeeCalculatorInitialAmount(amount);
              setActiveTab('courtFees');
            }}
            onNavigateToHearings={(hearingData) => {
              if (hearingData) {
                const newHearing: CourtHearing = {
                  id: `h-${Date.now()}`,
                  caseId: `case-def-${Date.now()}`,
                  caseTitle: hearingData.caseTitle || 'የመከላከያ መልስ ቀጠሮ',
                  caseNumber: hearingData.caseNumber || 'መ/ቁ 24819/2017',
                  date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                  timeAmharic: isOromo ? 'Ganama 3:00' : 'ጠዋት 3:00',
                  court: hearingData.court || 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት',
                  bench: hearingData.bench || 'ፍትሐብሔር ችሎት',
                  hearingPurpose: hearingData.hearingPurpose || (isOromo ? 'Deebii Himatamaa Dhiyeessuu' : 'የመከላከያ መልስ ማቅረቢያ ቀጠሮ'),
                  preparationChecklist: [
                    { item: isOromo ? 'Koppii deebii 3 qopheessuu' : 'የመከላከያ መልስ በ3 ቅጂ ማዘጋጀት', completed: false },
                    { item: isOromo ? 'Ragaalee barruu maxxansuu' : 'የሰነድ ማስረጃዎችን ማያያዝ', completed: false },
                    { item: isOromo ? 'Waraqaa eenyummaa qabachuu' : 'የመታወቂያ ካርድ መያዝ', completed: false },
                  ],
                  status: 'upcoming',
                };
                setHearings(prev => [newHearing, ...prev]);
              }
              setActiveTab('hearings');
            }}
            onNavigateToDrafter={() => {
              setActiveTab('drafter');
            }}
          />
        )}

        {activeTab === 'jurisdiction' && (
          <CourtJurisdiction
            onNavigateToDrafter={(prefill) => {
              setDrafterInitialData({
                courtName: prefill.courtName,
                benchName: prefill.benchName,
                jurisdictionBasis: prefill.jurisdictionBasis,
                claimAmountETB: prefill.claimAmountETB,
                claimCategory: prefill.claimCategory,
                defendantAddress: prefill.defendantAddress,
              });
              setActiveTab('drafter');
            }}
            onNavigateToDefense={(prefill) => {
              setDefenseInitialData({
                courtName: prefill.courtName,
                benchName: prefill.benchName,
                disputeCategory: prefill.claimCategory,
                claimAmountETB: prefill.claimAmountETB,
                defendantAddress: prefill.defendantAddress,
                affirmativeDefenses: `የፍርድ ቤት ስልጣን መቃወሚያ (የፍ/ሥ/ሥ/ሕ/ቁ 244(2))፦ ${prefill.jurisdictionBasis}`,
              });
              setActiveTab('defense');
            }}
            onNavigateToConsultation={(_text) => {
              setActiveTab('consultation');
            }}
            onNavigateToFeeCalculator={(amount) => {
              const num = parseFloat(amount.replace(/,/g, ''));
              if (!isNaN(num) && num > 0) {
                setFeeCalculatorInitialAmount(num);
              }
              setActiveTab('courtFees');
            }}
          />
        )}

        {activeTab === 'courtFees' && (
          <CourtFeeCalculator
            initialClaimAmount={feeCalculatorInitialAmount}
            onNavigateToDrafter={(claimAmount, estimatedFee) => {
              setDrafterInitialData((prev) => ({
                ...prev,
                claimAmountETB: claimAmount,
                specificDemands: prev?.specificDemands
                  ? `${prev.specificDemands}\n• የዳኝነት ክፍያ ብር ${estimatedFee.toLocaleString()} እና ተያያዥ የወጪና ኪሳራ ክፍያዎችን ተከሳሽ እንዲሸፍን።`
                  : `1. ዋና የይገባኛል ጥያቄ ብር ${claimAmount} ከነህጋዊ ወለዱ ጋር እንዲከፈል፤\n2. ለፍርድ ቤት የተከፈለው የዳኝነትና የመጥሪያ ወጪ ብር ${estimatedFee.toLocaleString()} እና ሌሎች የወጪና ኪሳራ ክፍያዎች በተከሳሹ ላይ እንዲወሰን።`,
              }));
              setActiveTab('drafter');
            }}
            onNavigateToDefense={(claimAmount, estimatedFee) => {
              setDefenseInitialData((prev) => ({
                ...prev,
                counterClaimAmount: claimAmount,
                counterClaimText: `ተከሳሽ ያለአግባብ ለቀረበበት ክስ የዳኝነትና የጠበቃ ወጪ በፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 462 መሠረት ብር ${estimatedFee.toLocaleString()} እንዲተካለት መልሶ ክስ አቅርቧል።`,
              }));
              setActiveTab('defense');
            }}
            onNavigateToJurisdiction={(_claimAmount) => {
              setActiveTab('jurisdiction');
            }}
          />
        )}

        {activeTab === 'translator' && (
          <Translator
            onNavigateToDrafter={(text) => {
              setDrafterInitialData({
                additionalFacts: text,
                questionAgreementDetails: text.slice(0, 300),
              });
              setActiveTab('drafter');
            }}
            onNavigateToDefense={(text) => {
              setDefenseInitialData({
                claimText: text,
                factsDenied: text.slice(0, 300),
              });
              setActiveTab('defense');
            }}
            onNavigateToConsultation={(_text) => {
              setActiveTab('consultation');
            }}
          />
        )}
        {activeTab === 'lawyers' && (
          <LawyerDirectory
            onOpenLawyerRegister={() => {
              setAuthModalRole('lawyer');
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer with Company & Developer Credits */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-8 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Main Footer Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* System Title & Identity */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <JusticeLogo size={28} showTextRings={false} />
                <span className="font-bold text-base text-slate-100 font-serif tracking-tight">
                  {t('appTitle')}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {isOromo
                  ? 'Wiirtuu Gorsa Seeraa, To\'annoo Himannaa fi Galmee Abukaatoota Itoophiyaa.'
                  : isEnglish
                  ? 'Ethiopian Legal Consultation, Case Workflow & Licensed Advocates Directory.'
                  : 'የኢትዮጵያ የሕግ ምክክር፣ የፍርድ ቤት ክስ ሂደት መቆጣጠሪያና የተመዘገቡ ሕጋዊ ጠበቆች ማውጫ።'}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">ፍትሐብሔር (1952)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">ወንጀል (1996)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">አዋጅ 1156/2011</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">ሰበር ውሳኔዎች</span>
              </div>
            </div>

            {/* Developed By: Weshye Software Solution */}
            <div className="lg:col-span-5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    የገነባው ድርጅት (Built By)
                  </span>
                </div>
                <button
                  onClick={() => setIsAboutCompanyOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
                >
                  ሙሉ መረጃን እይ ➔
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-amber-300 font-serif">
                  {COMPANY_INFO.nameAm}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {COMPANY_INFO.nameEn} — {COMPANY_INFO.country}
                </p>
              </div>

              {/* Developer Team Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block text-[10px]">ማናጀር፣ ዋና አልሚና ዲዛይነር፦</span>
                  <strong className="text-slate-200">ታምራት አሌ</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 block text-[10px]">ባክኢንድና ዳታቤዝ፦</span>
                  <strong className="text-slate-200">ውሽዬ ታምራት</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 block text-[10px]">ኔትወርክ ኢንስታሌሽን፦</span>
                  <strong className="text-slate-200">ቡሩክ ጎበና</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 block text-[10px]">UI/UX ዲዛይን፦</span>
                  <strong className="text-slate-200">ታምራት አሌ</strong>
                </div>
              </div>
            </div>

            {/* Direct Contacts & Website */}
            <div className="lg:col-span-3 space-y-2.5">
              <span className="text-xs font-bold text-slate-200 block uppercase tracking-wider">
                አድራሻና ግንኙነት
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <div className="font-mono flex flex-col font-bold">
                    <a href="tel:+251911029070" className="hover:underline">{COMPANY_INFO.phone1}</a>
                    <a href="tel:+251701370299" className="hover:underline">{COMPANY_INFO.phone2}</a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:underline truncate text-[11px]">
                    {COMPANY_INFO.email}
                  </a>
                </div>

                <div className="pt-1">
                  <a
                    href={COMPANY_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] border border-slate-700 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>ኦፊሴላዊ ዌብሳይት</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p className="font-mono text-center sm:text-left">
              {COMPANY_INFO.copyrightText}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAboutCompanyOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
              >
                ውሽዬ ሶፍትዌር ሶሉሽን
              </button>
              <span>•</span>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="hover:text-slate-200 cursor-pointer"
              >
                {t('userGuide')}
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Guide / Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Login & Registration Modal (Dual Role: Client & Lawyer) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={authModalRole}
        defaultMode={authModalMode}
      />

      {/* About Company & Developers Modal */}
      <AboutCompanyModal
        isOpen={isAboutCompanyOpen}
        onClose={() => setIsAboutCompanyOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LegalApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
