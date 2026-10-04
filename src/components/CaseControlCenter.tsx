import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Scale,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  Shield,
  Layers,
  Calculator,
  User,
  Building,
  Upload,
  Trash2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { ManagedCase, CaseStage, LegalCategory, CaseEvidence, LegalMilestone } from '../types/legal';
import { useLanguage } from '../context/LanguageContext';

interface CaseControlCenterProps {
  cases: ManagedCase[];
  onUpdateCase: (updatedCase: ManagedCase) => void;
  onCreateCase: (newCase: ManagedCase) => void;
  onDeleteCase: (caseId: string) => void;
  onNavigateToHearings: (caseId?: string) => void;
  onNavigateToDrafter?: (initialData: any) => void;
  onNavigateToDefense?: (initialData: any) => void;
  onNavigateToFees?: (amount: number) => void;
  onNavigateToJurisdiction?: (data: any) => void;
}

export const CaseControlCenter: React.FC<CaseControlCenterProps> = ({
  cases,
  onUpdateCase,
  onCreateCase,
  onDeleteCase,
  onNavigateToHearings,
  onNavigateToDrafter,
  onNavigateToDefense,
  onNavigateToFees,
  onNavigateToJurisdiction,
}) => {
  const { t, isOromo, isEnglish } = useLanguage();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(cases[0]?.id || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showFeeCalculator, setShowFeeCalculator] = useState(false);

  // New Case Modal State
  const [newTitle, setNewTitle] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCategory, setNewCategory] = useState<LegalCategory>('civil');
  const [newCourt, setNewCourt] = useState(
    isOromo ? 'Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Lidataa' : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ'
  );
  const [newBench, setNewBench] = useState(isOromo ? 'Dhaaddacha Sivilii 3ffaa' : '3ኛ የፍትሐብሔር ችሎት');
  const [newJudge, setNewJudge] = useState('');
  const [newPlaintiff, setNewPlaintiff] = useState('');
  const [newDefendant, setNewDefendant] = useState('');
  const [newClaimAmount, setNewClaimAmount] = useState('');
  const [newSummary, setNewSummary] = useState('');

  // Fee Calculator State
  const [calcAmount, setCalcAmount] = useState('500000');
  const [calcType, setCalcType] = useState('civil_money');
  const [calcResult, setCalcResult] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0] || null;

  const STAGES_MAP: { id: CaseStage; label: string; order: number }[] = [
    { id: 'pre_trial', label: isOromo ? 'Qophii Duraa/Ragaa' : 'ቅድመ-ክስ/ማስረጃ', order: 1 },
    { id: 'filed', label: isOromo ? 'Himannaan Baname' : 'ክስ ተመሠረተ', order: 2 },
    { id: 'summons_served', label: isOromo ? 'Wamicha fi Deebii' : 'መጥሪያና መልስ', order: 3 },
    { id: 'framing_issues', label: isOromo ? 'Qabxii Qabachuu' : 'ጭብጥ መያዝ', order: 4 },
    { id: 'witness_hearing', label: isOromo ? 'Ragaa Dhagahuu' : 'የምስክር ሂደት', order: 5 },
    { id: 'judgment', label: isOromo ? 'Murtii Mana Murtii' : 'ውሳኔ/ፍርድ', order: 6 },
    { id: 'appeal', label: isOromo ? 'Ol-iyyannoo/Ijibbaata' : 'ይግባኝ/ሰበር', order: 7 },
    { id: 'execution', label: isOromo ? 'Raawwii Murtii' : 'አፈጻጸም', order: 8 },
  ];

  // Filtering cases
  const filteredCases = cases.filter(c => {
    const matchesCat = filterCategory === 'all' || c.category === filterCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plaintiff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.defendant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStageChange = (newStage: CaseStage) => {
    if (!selectedCase) return;
    const updated: ManagedCase = {
      ...selectedCase,
      stage: newStage,
    };
    onUpdateCase(updated);
  };

  const handleAddEvidence = () => {
    if (!selectedCase) return;
    const titlePrompt = prompt(isOromo ? 'Mata-duree sanada ragaa galchaa:' : 'የማስረጃ ሰነዱን ርዕስ ያስገቡ:');
    if (!titlePrompt) return;

    const descPrompt = prompt(isOromo ? 'Ibsa gabaabaa sanadichaa:' : 'የሰነዱን አጭር ማብራሪያ ያስገቡ:') || '';

    const newEvidence: CaseEvidence = {
      id: `ev-${Date.now()}`,
      title: titlePrompt,
      type: 'contract',
      dateAdded: new Date().toISOString().split('T')[0],
      description: descPrompt,
      verified: true,
    };

    const updated: ManagedCase = {
      ...selectedCase,
      evidences: [...(selectedCase.evidences || []), newEvidence],
    };

    onUpdateCase(updated);
  };

  const handleAddMilestone = () => {
    if (!selectedCase) return;
    const titlePrompt = prompt(isOromo ? 'Mata-duree sadarkaa / gochaa haaraa galchaa:' : 'የአዲሱን ሂደት ወይም ተግባር ርዕስ ያስገቡ:');
    if (!titlePrompt) return;

    const newMilestone: LegalMilestone = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: titlePrompt,
      description: isOromo ? 'Sadarkaa to\'annoo himannaa irratti dabalame' : 'በክስ መቆጣጠሪያ ማዕከል የተጨመረ የሂደት ማስታወሻ',
      completed: true,
    };

    const updated: ManagedCase = {
      ...selectedCase,
      milestones: [...(selectedCase.milestones || []), newMilestone],
    };

    onUpdateCase(updated);
  };

  const handleCalculateFee = async () => {
    setCalcLoading(true);
    try {
      const res = await fetch('/api/legal/calculate-court-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimAmountETB: parseFloat(calcAmount) || 0,
          claimType: calcType,
          courtLevel: 'first_instance',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCalcResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCalcLoading(false);
    }
  };

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: ManagedCase = {
      id: `case-${Date.now()}`,
      caseNumber: newCaseNumber || (isOromo ? `F/M/D ${Math.floor(10000 + Math.random() * 90000)}/16` : `ፌ/መ/ደ ${Math.floor(10000 + Math.random() * 90000)}/16`),
      title: newTitle,
      category: newCategory,
      court: newCourt || (isOromo ? 'Mana Murtii Sadarkaa Duraa Federaalaa' : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት'),
      bench: newBench || (isOromo ? 'Dhaaddacha Sivilii' : 'የፍትሐብሔር ችሎት'),
      presidingJudge: newJudge,
      clientRole: 'plaintiff',
      plaintiff: newPlaintiff || (isOromo ? 'Himataa' : 'ከሳሽ'),
      defendant: newDefendant || (isOromo ? 'Himatamaa' : 'ተከሳሽ'),
      claimAmountETB: parseFloat(newClaimAmount) || 0,
      stage: 'pre_trial',
      filingDate: new Date().toISOString().split('T')[0],
      summary: newSummary || newTitle,
      notes: isOromo ? 'Galmee haaraa to\'annoo himannaa irratti dabalame.' : 'በክስ መቆጣጠሪያ ማዕከል አዲስ የተመዘገበ መዝገብ።',
      evidences: [],
      milestones: [
        {
          id: `m-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: isOromo ? 'Galmeen Banameera' : 'መዝገብ ተከፈተ',
          description: isOromo ? 'Galmeen haaraan bu\'uura kanaan qophaa\'e.' : 'የመጀመሪያ መዝገብ ምዝገባ ተጠናቋል።',
          completed: true,
        },
      ],
      status: 'active',
    };

    onCreateCase(created);
    setSelectedCaseId(created.id);
    setShowNewCaseModal(false);

    // Reset fields
    setNewTitle('');
    setNewCaseNumber('');
    setNewJudge('');
    setNewPlaintiff('');
    setNewDefendant('');
    setNewClaimAmount('');
    setNewSummary('');
  };

  const currentStageOrder = STAGES_MAP.find(s => s.id === selectedCase?.stage)?.order || 1;

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-amber-400" />
            <span>{t('caseCenterTitle')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('caseCenterSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowFeeCalculator(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold cursor-pointer transition-all"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>{t('courtFeeCalculator')}</span>
          </button>

          <button
            onClick={() => setShowNewCaseModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newCaseBtn')}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Case Dockets List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900/95 p-4 rounded-2xl border border-slate-800 shadow-lg space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchCasesPlaceholder')}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: t('all') },
                { id: 'civil', label: t('catCivil') },
                { id: 'criminal', label: t('catCriminal') },
                { id: 'labor', label: t('catLabor') },
                { id: 'family', label: t('catFamily') },
                { id: 'commercial', label: t('catCommercial') },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    filterCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dockets List */}
          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-slate-400 text-xs p-4">
                {isOromo ? 'Galmeen barbaaddan hin argamne.' : 'ምንም ዓይነት የተገኘ መዝገብ የለም።'}
              </div>
            ) : (
              filteredCases.map(c => {
                const isSelected = c.id === selectedCase?.id;
                const stageObj = STAGES_MAP.find(s => s.id === c.stage);

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-500/80 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {c.caseNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 font-semibold border border-slate-600/50">
                        {stageObj?.label || c.stage}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white line-clamp-1 mb-2 font-serif">
                      {c.title}
                    </h4>

                    <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="truncate max-w-[140px] text-slate-300">
                        {c.defendant}
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                        {c.claimAmountETB ? `${c.claimAmountETB.toLocaleString()} ETB` : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Details & Workflow Pipeline */}
        <div className="lg:col-span-8">
          {selectedCase ? (
            <div className="space-y-5">
              {/* Case Header Card */}
              <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                        {selectedCase.caseNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        {isOromo ? 'Guyyaa Galmee:' : 'የተመዘገበበት ቀን፡'} {selectedCase.filingDate}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
                      {selectedCase.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => onNavigateToHearings(selectedCase.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isOromo ? 'Beellama Qabi' : 'ቀጠሮ ይመልከቱ'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteCase(selectedCase.id)}
                      className="p-2 rounded-xl bg-slate-700/60 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                      title={isOromo ? "Galmee Haqi" : "መዝገብ ሰርዝ"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Case Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60">
                    <span className="text-slate-400 block mb-0.5">{isOromo ? 'Mana Murtii fi Dhaaddacha' : 'ፍርድ ቤትና ችሎት'}</span>
                    <strong className="text-slate-200 block truncate">{selectedCase.court}</strong>
                    <span className="text-amber-400/90 text-[11px] block">{selectedCase.bench}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60">
                    <span className="text-slate-400 block mb-0.5">{isOromo ? 'Qaamolee Falmii' : 'ተከራካሪ ወገኖች'}</span>
                    <div className="text-slate-200 truncate"><strong>{isOromo ? 'Himataa:' : 'ከሳሽ፡'}</strong> {selectedCase.plaintiff}</div>
                    <div className="text-slate-300 truncate"><strong>{isOromo ? 'Himatamaa:' : 'ተከሳሽ፡'}</strong> {selectedCase.defendant}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60">
                    <span className="text-slate-400 block mb-0.5">{isOromo ? 'Hanga Maallaqaa' : 'የተጠየቀው የዳኝነት መጠን'}</span>
                    <strong className="text-emerald-400 text-sm block">
                      {selectedCase.claimAmountETB
                        ? `${selectedCase.claimAmountETB.toLocaleString()} ETB`
                        : (isOromo ? 'Maallaqaan Alatti' : 'የገንዘብ ያልሆነ ዳኝነት')}
                    </strong>
                    {selectedCase.presidingJudge && (
                      <span className="text-slate-400 text-[11px] block">
                        {isOromo ? 'Abbaa Seeraa:' : 'ዳኛ፡'} {selectedCase.presidingJudge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Case Stage Pipeline Stepper */}
                <div className="pt-3 border-t border-slate-700/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      {isOromo ? 'Sadarkaalee Adeemsa Falmii (Stage Pipeline)' : 'የክሱ ሂደት ደረጃ (Litigation Stage Pipeline)'}
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      {isOromo ? `Sadarkaa ${currentStageOrder} / ${STAGES_MAP.length}` : `ደረጃ ${currentStageOrder} ከ ${STAGES_MAP.length}`}
                    </span>
                  </div>

                  {/* Horizontal Stage Stepper */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
                    {STAGES_MAP.map(stage => {
                      const isPast = stage.order < currentStageOrder;
                      const isCurrent = stage.order === currentStageOrder;

                      return (
                        <button
                          key={stage.id}
                          onClick={() => handleStageChange(stage.id)}
                          className={`p-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                              : isPast
                              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                              : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <div className="text-[10px] font-mono opacity-80">{stage.order}</div>
                          <div className="text-[10px] sm:text-[11px] truncate">{stage.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cross-Module Quick Actions for this Case */}
                <div className="pt-3 border-t border-slate-700/70 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isOromo ? 'Tarkaanfiiwwan:' : 'ፈጣን እርምጃዎች፦'}</span>
                  </span>

                  {onNavigateToDrafter && (
                    <button
                      onClick={() => onNavigateToDrafter({
                        courtName: selectedCase.court,
                        benchName: selectedCase.bench,
                        plaintiffName: selectedCase.plaintiff,
                        defendantName: selectedCase.defendant,
                        claimCategory: selectedCase.title,
                        claimAmountETB: selectedCase.claimAmountETB ? String(selectedCase.claimAmountETB) : '',
                        additionalFacts: selectedCase.summary,
                      })}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isOromo ? 'Waraqaa Himannaa Ilaali' : 'የክስ ማመልከቻን ክፈት / አዘጋጅ'}</span>
                    </button>
                  )}

                  {onNavigateToDefense && (
                    <button
                      onClick={() => onNavigateToDefense({
                        courtName: selectedCase.court,
                        benchName: selectedCase.bench,
                        caseNumber: selectedCase.caseNumber,
                        plaintiffName: selectedCase.plaintiff,
                        defendantName: selectedCase.defendant,
                        disputeCategory: selectedCase.category,
                        claimText: selectedCase.summary,
                        factsDenied: selectedCase.notes || '',
                      })}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-750 border border-slate-700 hover:border-rose-500/50 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{isOromo ? 'Deebii Himatamaa Qopheessi' : 'የመከላከያ መልስ አዘጋጅ (ለተከሳሽ)'}</span>
                    </button>
                  )}

                  {onNavigateToFees && (
                    <button
                      onClick={() => onNavigateToFees(selectedCase.claimAmountETB || 450000)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/50 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>{isOromo ? 'Kaffaltii Shallagi' : 'የዳኝነት ክፍያ አስላ'}</span>
                    </button>
                  )}

                  {onNavigateToJurisdiction && (
                    <button
                      onClick={() => onNavigateToJurisdiction({
                        disputeType: selectedCase.category,
                        amount: selectedCase.claimAmountETB || 450000,
                        caseSummary: selectedCase.summary,
                      })}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/50 text-xs font-semibold text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>{isOromo ? 'Aangoo Sakatta\'i' : 'ስልጣን ፈትሽ'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Case Summary & Notes */}
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                  <FileText className="w-4 h-4 text-amber-400" />
                  {isOromo ? 'Qabxii Dhimmaa fi Ibsa Seeraa (Legal Strategy)' : 'የክሱ ፍሬ ነገርና የሕግ ማስታወሻ (Factual Summary & Legal Strategy)'}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                  {selectedCase.summary}
                </p>

                {selectedCase.notes && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                    <strong className="text-amber-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      {isOromo ? 'Tarsiimoo Falmii fi Yaada Abukaatoo' : 'የሙግት ስልትና የጠበቃው ማስታወሻ'}
                    </strong>
                    <p className="leading-relaxed">{selectedCase.notes}</p>
                  </div>
                )}
              </div>

              {/* Evidences & Case Milestones Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Evidence Repository */}
                <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      {isOromo ? 'Ragaalee Barreeffamaa' : 'የማስረጃ ሰነዶች'} ({selectedCase.evidences?.length || 0})
                    </h4>
                    <button
                      onClick={handleAddEvidence}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isOromo ? 'Ragaa Dabali' : 'ሰነድ አክል'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {selectedCase.evidences?.map(ev => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                            {ev.title}
                          </span>
                          {ev.verified && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> {isOromo ? 'Mirkanaa\'e' : 'የተረጋገጠ'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {ev.description}
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          {isOromo ? 'Guyyaa Galmeessaa:' : 'የገባበት ቀን፡'} {ev.dateAdded}
                        </span>
                      </div>
                    ))}

                    {(!selectedCase.evidences || selectedCase.evidences.length === 0) && (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        {isOromo ? 'Ragaan barreeffamaa hin jiru.' : 'ምንም የተመዘገበ ማስረጃ የለም።'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Case Milestones */}
                <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      {isOromo ? 'Sadarkaalee fi Hojiiwwan' : 'የክርክር ሂደቶችና ምዕራፎች'} ({selectedCase.milestones?.length || 0})
                    </h4>
                    <button
                      onClick={handleAddMilestone}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isOromo ? 'Sadarkaa Dabali' : 'ሂደት አክል'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {selectedCase.milestones?.map(m => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">
                            {m.title}
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {m.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {m.description}
                        </p>
                      </div>
                    ))}

                    {(!selectedCase.milestones || selectedCase.milestones.length === 0) && (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        {isOromo ? 'Sadarkaan galmaa\'e hin jiru.' : 'ምንም የሂደት ማስታወሻ የለም።'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 text-slate-400">
              {isOromo ? 'Ilaaluuf galmee tokko filadhaa.' : 'ዝርዝሩን ለማየት መዝገብ ይምረጡ።'}
            </div>
          )}
        </div>
      </div>

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>{isOromo ? 'Galmee Falmii Haaraa Galmeessi' : 'አዲስ የክስ መዝገብ መመዝገቢያ'}</span>
              </h3>
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Mata-duree Himannaa (Case Title) *' : 'የክሱ ርዕስ (Case Title) *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isOromo ? "fkn: Himannaa Diiggaa Waliigaltee Ijaarsaa" : "ለምሳሌ፡ የአፓርትመንት ሽያጭ ውል ማፍረስ ክስ"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Lakk. Galmee (Docket No)' : 'የመዝገብ ቁጥር (Docket No)'}
                  </label>
                  <input
                    type="text"
                    value={newCaseNumber}
                    onChange={(e) => setNewCaseNumber(e.target.value)}
                    placeholder={isOromo ? "F/M/D 48291/16" : "ፌ/መ/ደ 48291/16"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Gosa Seeraa' : 'የሕጉ ዘርፍ'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LegalCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="civil">{t('catCivil')}</option>
                    <option value="criminal">{t('catCriminal')}</option>
                    <option value="labor">{t('catLabor')}</option>
                    <option value="family">{t('catFamily')}</option>
                    <option value="commercial">{t('catCommercial')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Mana Murtii' : 'ፍርድ ቤት'}
                  </label>
                  <input
                    type="text"
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Dhaaddacha' : 'ችሎት / አዳራሽ'}
                  </label>
                  <input
                    type="text"
                    value={newBench}
                    onChange={(e) => setNewBench(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Himataa / Iyyataa' : 'ከሳሽ / አመልካች'}
                  </label>
                  <input
                    type="text"
                    value={newPlaintiff}
                    onChange={(e) => setNewPlaintiff(e.target.value)}
                    placeholder={isOromo ? "Obbo Birruuk Girmaa" : "አቶ ብሩክ ግርማ"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Himatamaa / Deebii Kennaa' : 'ተከሳሽ / መልስ ሰጪ'}
                  </label>
                  <input
                    type="text"
                    value={newDefendant}
                    onChange={(e) => setNewDefendant(e.target.value)}
                    placeholder={isOromo ? "Dhaabbata Abisiiniyaa" : "አቢሲኒያ ሪል እስቴት"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Hanga Maallaqa Barbaadamu (Qarshii)' : 'የተጠየቀ የገንዘብ መጠን (ብር)'}
                </label>
                <input
                  type="number"
                  value={newClaimAmount}
                  onChange={(e) => setNewClaimAmount(e.target.value)}
                  placeholder="150000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Ibsa Gabaabaa Himannaa' : 'የክሱ አጭር ማጠቃለያ'}
                </label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder={isOromo ? "Qabxii dhimmaa gabaabinaan ibsaa..." : "የጉዳዩን ፍሬ ነገር በአጭሩ ይግለጹ..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Court Fee Calculator Modal */}
      {showFeeCalculator && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <span>{isOromo ? 'Herreega Kaffaltii Askuutaa Mana Murtii' : 'የኢትዮጵያ ፌዴራል ፍርድ ቤቶች የዳኝነት አገልግሎት ክፍያ ማስያ'}</span>
              </h3>
              <button
                onClick={() => setShowFeeCalculator(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {isOromo
                ? 'Dambii Mana Maree Ministeerotaa Lakk. 433/2011 (Federal Courts Fee Regulation) bu\'uureffachuun kan shallagamu.'
                : 'በሚኒስትሮች ምክር ቤት ደንብ ቁጥር 433/2011 (Federal Courts Fee Regulation) መሠረት ተሰልቶ የቀረበ።'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Hanga Maallaqa Barbaadamu (Qarshii)' : 'የሚጠየቀው የገንዘብ መጠን (ብር)'}
                </label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Gosa Himannaa' : 'የክሱ ዓይነት'}
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value="civil_money">{isOromo ? 'Falmii Maallaqaa (Civil Money Claim)' : 'የፍትሐብሔር የገንዘብ ጥያቄ'}</option>
                  <option value="property">{isOromo ? 'Qabeenya Dhaabbataa / Mana (Real Estate)' : 'የማይንቀሳቀስ ንብረት ይዞታ'}</option>
                  <option value="non_pecuniary">{isOromo ? 'Falmii Maallaqaan Alatti (Non-Money Claim)' : 'የገንዘብ ግምት የሌለው ዳኝነት'}</option>
                </select>
              </div>

              <button
                onClick={handleCalculateFee}
                disabled={calcLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {calcLoading ? t('loading') : (isOromo ? 'Askuutaa Shallagi' : 'ክፍያውን አስላ')}
              </button>

              {calcResult && (
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2 mt-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{isOromo ? 'Kaffaltii Askuutaa (Court Fee Stamp):' : 'የዳኝነት አገልግሎት ማህተም ክፍያ፡'}</span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      {calcResult.totalFeeETB?.toLocaleString()} ETB
                    </strong>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {calcResult.breakdown || (isOromo ? 'Seeraan shallagameera' : 'በደንቡ መሠረት ተሰልቷል')}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-700">
              <button
                onClick={() => setShowFeeCalculator(false)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
