import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Send,
  Scale,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookmarkPlus,
  Printer,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Layers,
  ShieldAlert,
  ChevronDown,
  X,
  FileSearch,
  BookOpen,
  ExternalLink,
  Globe,
  Copy,
  Check,
  Building,
  Calculator
} from 'lucide-react';
import { LegalAnalysisResult, LegalCategory, ClientRole, ManagedCase } from '../types/legal';
import { useLanguage } from '../context/LanguageContext';

interface LegalConsultationProps {
  onAddCaseToManagement: (caseData: Partial<ManagedCase>, analysis: LegalAnalysisResult) => void;
  onOpenLibraryWithSearch: (query: string) => void;
  onStartLawsuitFiling?: (caseData: any) => void;
  onStartDefenseFiling?: (defenseData: any) => void;
  onCheckJurisdiction?: (jurisdictionData: any) => void;
  onCalculateFee?: (claimAmount: number) => void;
}

export const LegalConsultation: React.FC<LegalConsultationProps> = ({
  onAddCaseToManagement,
  onOpenLibraryWithSearch,
  onStartLawsuitFiling,
  onStartDefenseFiling,
  onCheckJurisdiction,
  onCalculateFee,
}) => {
  const { t, isOromo, isEnglish, language } = useLanguage();
  const [caseText, setCaseText] = useState('');
  const [category, setCategory] = useState<LegalCategory>('general');
  const [clientRole, setClientRole] = useState<ClientRole>('plaintiff');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LegalAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedSuccessMessage, setAddedSuccessMessage] = useState(false);
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<'all' | 'civil' | 'criminal' | 'proclamations'>('all');

  const handleCopyArticle = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedArticleId(id);
    setTimeout(() => setCopiedArticleId(null), 2000);
  };

  // Chat follow-up state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const sampleScenarios = isOromo
    ? [
        {
          title: 'Waliigaltee bittaa mana jireenyaa diiguu',
          desc: 'Dhaabbatichi ijaarsaa akka waliigalteetti waggoota 2 keessatti mana osoo hin dabarsiin hafee ijaarsi kan dhaabbate.',
          cat: 'civil' as LegalCategory,
        },
        {
          label: 'Hojii irraa ari\'amuu seeraan alaa',
          title: 'Hojii irraa ari\'amuu fi beenyaa',
          desc: 'Hojjechiisaan osoo akeekkachiisa hin kennin fi sababa gahaa malee hojjetaa waggaa 7 amanamummaan hojjete kan ari\'e.',
          cat: 'labor' as LegalCategory,
        },
        {
          title: 'Cheekii baankii harka hin qabne (yakka)',
          desc: 'Bittaa meeshaatiif cheekii Qarshii 850,000 kan kenname herreega irratti maallaqa hin qabu jedhamee yoo deebi\'u.',
          cat: 'criminal' as LegalCategory,
        },
        {
          title: 'Wal-hiikuu fi qabeenya qooddachuu',
          desc: 'Yeroo gaa\'ilaatti qabeenya horatame mana fi konkolaataa qooddachuu akkasumas qeleba daa\'immanii ilaalchisee.',
          cat: 'family' as LegalCategory,
        },
      ]
    : [
        {
          title: 'የአፓርትመንት ቤት ሽያጭ ውል ማፍረስ',
          desc: 'ገንቢው በውሉ መሠረት በ2 ዓመት ውስጥ ቤቱን ሳያስረክብ የቀረ እና ግንባታው የቆመበት ሁኔታ።',
          cat: 'civil' as LegalCategory,
        },
        {
          title: 'ያላግባብ ከሥራ መባረርና የካሳ ጥያቄ',
          desc: 'አሠሪው ያለማስጠንቀቂያና ያለበቂ ምክንያት የ7 ዓመት ሠራተኛን ያሰናበተበት ክስ።',
          cat: 'labor' as LegalCategory,
        },
        {
          title: 'ያለስንቅ የተሰጠ የባንክ ቼክ ማጭበርበር',
          desc: 'ለሸቀጥ ግዢ የተሰጠ የ 850,000 ብር ቼክ ባንክ ሲቀርብ ስንቅ የሌለው ሆኖ የተመለሰበት ጉዳይ።',
          cat: 'criminal' as LegalCategory,
        },
        {
          title: 'የትዳር ፍቺና የጋራ ንብረት ክፍፍል',
          desc: 'በትዳር ወቅት የተገዛ ቤትና መኪና ክፍፍል እንዲሁም የልጆች የቀለብና አስተዳደግ ክርክር።',
          cat: 'family' as LegalCategory,
        },
      ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string || '';
        setAttachedFiles(prev => [
          ...prev,
          {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            content: content.slice(0, 50000), // safety slice
          }
        ]);
      };

      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!caseText.trim() && attachedFiles.length === 0) {
      setError(isOromo ? 'Maaloo qabxii dhimma keessanii barreessaa ykn sanada olkaawaa.' : 'እባክዎትን የኬዝዎን ዝርዝር መረጃ በጽሁፍ ያስገቡ ወይም የሰነድ ፋይል ይጫኑ።');
      return;
    }

    setLoading(true);
    setError(null);
    setAddedSuccessMessage(false);

    try {
      const combinedDocs = attachedFiles.map(f => `[Sanada/ፋይል፡ ${f.name}]\n${f.content.slice(0, 3000)}`).join('\n\n');

      const res = await fetch('/api/legal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseText,
          category,
          clientRole,
          documentText: combinedDocs,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        // Pre-populate chat context
        setChatMessages([
          {
            role: 'model',
            content: isOromo 
              ? 'Nagaa! Dhimma keessan bu\'uura seerota Itoophiyaatiin qoradheen jira. Keewwattoota eeraman, adeemsa mana murtii yookiin qophii himannaa irratti gaaffii kamiyyuu asitti na gaafachuu dandeessu.'
              : `ሰላም! የጉዳይዎን ዝርዝር በኢትዮጵያ ሕጎች መሠረት መርምሬያለሁ። በተጠቀሱት አንቀጾች፣ የፍርድ ቤት ቅደም ተከተል ወይም የክስ ማዘጋጀት ሂደት ላይ ማንኛውንም ጥያቄ እዚህ ሊጠይቁኝ ይችላሉ።`,
          }
        ]);
      } else {
        setError(data.error || (isOromo ? 'Xiinxala seeraa argachuun hin danda\'amne.' : 'የሕግ ትንተና ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።'));
      }
    } catch (err: any) {
      setError(err.message || (isOromo ? 'Sarara wajjin wal-qunnamuu hin danda\'amne.' : 'ከአገልጋዩ ጋር መገናኘት አልተቻለም።'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatInput('');

    const newHistory = [...chatMessages, { role: 'user' as const, content: userMsg }];
    setChatMessages(newHistory);
    setChatLoading(true);

    try {
      const res = await fetch('/api/legal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          caseContext: analysis,
          history: newHistory,
          language,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToManagedCases = () => {
    if (!analysis) return;

    const defaultCourt = isOromo ? 'Mana Murtii Sadarkaa Duraa Federaalaa' : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት';
    const defaultBench = isOromo ? 'Dhaaddacha Sivilii' : 'የፍትሐብሔር ችሎት';

    const newCaseData: Partial<ManagedCase> = {
      title: analysis.title,
      category: (category !== 'general' ? category : 'civil'),
      court: analysis.recommendedCourt || defaultCourt,
      bench: defaultBench,
      clientRole,
      plaintiff: clientRole === 'plaintiff' ? (isOromo ? 'Maqaa Keessan (Himataa)' : 'የእርስዎ ስም (ከሳሽ)') : (isOromo ? 'Himataa' : 'ተከራካሪ ወገን'),
      defendant: clientRole === 'defendant' ? (isOromo ? 'Maqaa Keessan (Himatamaa)' : 'የእርስዎ ስም (ተከሳሽ)') : (isOromo ? 'Himatamaa' : 'ተከሳሽ ወገን'),
      stage: 'pre_trial',
      summary: analysis.summary,
      notes: analysis.counselAdviceAmharic,
      evidences: attachedFiles.map((f, idx) => ({
        id: `ev-uploaded-${Date.now()}-${idx}`,
        title: f.name,
        type: 'contract',
        dateAdded: new Date().toISOString().split('T')[0],
        fileName: f.name,
        description: `${isOromo ? 'Sanada Olkaa\'ame' : 'የተጫነ ሰነድ'} (${f.size})`,
        verified: true,
      })),
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          date: new Date().toISOString().split('T')[0],
          title: isOromo ? 'Gorsi Seeraa Jalqabaa Kenname' : 'የመጀመሪያ የሕግ ምክክር ተደረገ',
          description: isOromo ? 'Xiinxala gadi-fagoo sirna kanaan kenname.' : 'በጠበቃው ጉልበት ሲስተም ጥልቅ ትንተና ተሰጥቷል።',
          completed: true,
        },
        {
          id: `m-${Date.now()}-2`,
          date: '',
          title: isOromo ? 'Ragaalee Walitti Qabuu fi Akeekkachiisa' : 'ማስረጃዎችን ማሰባሰብና የጽሁፍ ማስጠንቀቂያ',
          description: analysis.actionPlan?.[0] || (isOromo ? 'Ragaa qindeessuu' : 'ማስረጃ ማደራጀት'),
          completed: false,
        },
      ],
    };

    onAddCaseToManagement(newCaseData, analysis);
    setAddedSuccessMessage(true);
    setTimeout(() => setAddedSuccessMessage(false), 4000);
  };

  const handleStartClaimFiling = () => {
    if (!analysis) return;
    if (onStartLawsuitFiling) {
      onStartLawsuitFiling({
        courtName: analysis.recommendedCourt || (isOromo ? 'Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Lidataa' : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ'),
        benchName: isOromo ? 'Dhaaddacha Sivilii' : 'የፍትሐብሔር ችሎት',
        claimCategory: analysis.title || analysis.category,
        additionalFacts: caseText,
        questionAgreementDetails: analysis.caseFactsReview?.establishedFacts?.[0] || '',
        questionBreachDetails: analysis.caseFactsReview?.occurredSituation || analysis.caseFactsReview?.establishedFacts?.[1] || '',
        questionDemandAndNotice: analysis.caseFactsReview?.establishedFacts?.[2] || (isOromo ? 'Akeekkachiisni barreeffamaa himatamaaf kenname jiraatus deebii hin kennine.' : 'ለተከሳሹ የተሰጠ የጽሁፍ ማስጠንቀቂያ ቢኖርም ምላሽ ሳይሰጥ ቀርቷል።'),
        questionDamagesCaused: analysis.financialOrPenaltyEstimate || (isOromo ? 'Miidhaa fi kasaaraa maallaqaa himataa irra ga\'e.' : 'በከሳሽ ላይ የደረሰ የገንዘብና የንብረት ጉዳት።'),
        legalArticles: analysis.applicableArticles?.map(a => `${a.code} ${a.articleNumber} (${a.title})`).join('\n') || '',
        evidenceList: analysis.evidenceChecklist?.join('\n') || '',
        claimAmountETB: analysis.financialOrPenaltyEstimate?.replace(/[^0-9,]/g, '') || '',
        specificDemands: analysis.remedies?.map(r => r.option).join('፤ ') || (isOromo ? 'Maallaqni liqaa dhala seeraa 9% wajjin akka deebi\'u' : 'ዋናው ገንዘብ ወይም ንብረት ከነ 9% ሕጋዊ ወለድና ወጪ እንዲመለስ'),
      });
    }
  };

  const handleStartDefenseFiling = () => {
    if (!analysis) return;
    if (onStartDefenseFiling) {
      onStartDefenseFiling({
        courtName: analysis.recommendedCourt || (isOromo ? 'Mana Murtii Sadarkaa Duraa Federaalaa' : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት'),
        benchName: isOromo ? 'Dhaaddacha Sivilii' : 'የፍትሐብሔር ችሎት',
        disputeCategory: analysis.category,
        claimText: `${analysis.title}\n\n${analysis.summary}`,
        factsDenied: analysis.partiesAnalysis?.plaintiffRights?.length
          ? analysis.partiesAnalysis.plaintiffRights.map((r, i) => `${i + 1}. ከሳሽ የጠቀሰውን «${r}» የሚል ክስ መሠረተ-ቢስ በመሆኑ እክዳለሁ።`).join('\n')
          : 'ከሳሽ በክሱ የገለጸውን ፍሬ ነገር በሙሉ እክዳለሁ፤ የክስ ምክንያት የለውም።',
        affirmativeDefenses: analysis.counselAdviceAmharic || 'ተከሳሹ በሕጉ አግባብ ግዴታውን የተወጣ በመሆኑ ተጠያቂ ሊሆን አይገባም።',
        selectedObjections: ['limitation_expired', 'lack_of_jurisdiction', 'no_cause_of_action'],
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/60 border border-amber-900/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isOromo ? 'Wiirtuu Xiinxala Seera Itoophiyaa' : 'የኢትዮጵያ ሕጎች ብልህ የትንተና ማዕከል'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif mb-2">
            {isOromo ? 'Dhimma Keessan Galchaa yookiin Ragaa Olkaawaa' : 'የጉዳይዎን ዝርዝር ያስገቡ ወይም ሰነድ ይጫኑ'}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isOromo
              ? 'Dhimma keessan Seera Sivilii, Yakkaa, Hojjetaa fi Hojjechiisaa, Seera Maatii fi Murteewwan Dhaddacha Ijibbaata Federaalaa wajjin qorachuun keewwattoota fi furmaata seeraa isiniif kenna.'
              : 'ሲስተሙ ጉዳይዎን ከኢትዮጵያ ፍትሐብሔር ሕግ፣ የወንጀለኛ መቅጫ ሕግ፣ የሠራተኛ አዋጅ፣ የቤተሰብ ሕግ እና አስገዳጅ የፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ውሳኔዎች ጋር በማመሳከር ትክክለኛውን የሕግ አንቀጽ እና ተመራጭ መፍትሔ ያማክርዎታል።'}
          </p>
        </div>

        {/* Quick Sample Chips */}
        <div className="mt-6 pt-4 border-t border-slate-700/60">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">
              {isOromo ? 'Fakkeenya Dhimmootaa (Ilaaluuf tokko filadhaa)፦' : 'ፈጣን ናሙና ኬዞች (ምሳሌ ለማየት አንዱን ይምረጡ)፦'}
            </span>
            {caseText && (
              <button
                type="button"
                onClick={() => {
                  setCaseText('');
                  setCategory('general');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                {isOromo ? 'Qullaa godhii haaraa barreessi' : 'ጽሁፉን አጽዳና የራስዎን አዲስ ኬዝ ጻፉ'}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleScenarios.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCaseText(s.desc);
                  setCategory(s.cat);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-600/30 hover:border-amber-500/50 border border-slate-700 text-slate-200 transition-all text-left flex items-center gap-1.5 cursor-pointer"
              >
                <FileSearch className="w-3 h-3 text-amber-400" />
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-800/80 rounded-2xl p-5 sm:p-6 border border-slate-700 shadow-lg">
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{isOromo ? 'Qabxii fi Haala Dhimma Keessanii Ibsaa (Case Narrative)' : 'የኬዙ ፍሬ ነገርና የደረሰውን ሁኔታ በዝርዝር ይግለጹ (Case Narrative)'}</span>
              </span>
              <span className="text-xs text-slate-400">
                {isOromo ? 'Afaan Oromootiin ykn Ingiliffaan' : 'በአማርኛ ወይም በእንግሊዝኛ'}
              </span>
            </label>
            <div className="mb-2 text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              💡 <strong className="text-slate-300">{isOromo ? 'Yaadachiisa:' : 'ማስታወሻ፡'}</strong> {isOromo ? 'Dhimma falmii kamiyyuu (liqii maallaqaa, kiraa manaa, balaa konkolaataa, daldala, gaa\'ila, hojii ari\'annaa kkf) asitti barreessuu dandeessu.' : 'የትኛውንም አይነት የራስዎን የክርክር ሁኔታ (ለምሳሌ፡ የተሽከርካሪ ኪራይ ወይም አደጋ፣ የገንዘብ ብድር፣ የእቃ ሽያጭ፣ የቤት ኪራይ፣ ውርስ፣ ስንብት ወዘተ) እዚህ በቀጥታ መጻፍ ይችላሉ። ሲስተሙ በኢትዮጵያ ፍትሐብሔርና ወንጀል ሕግ መሠረት ያማክርዎታል።'}
            </div>
            <textarea
              rows={7}
              value={caseText}
              onChange={(e) => setCaseText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
              placeholder={isOromo ? "Dhimma keessan asitti barreessaa (fkn: 'Guyyaa 12/03/2016 tti himatamaan maallaqa Qarshii 250,000 liqeeffatee deebisuu dhabuun...')" : "የኬዝዎን ዝርዝር እዚህ ይጻፉ (ለምሳሌ፡ 'በቀን 12/03/2016 ዓ.ም ተከሳሽ የ 250,000 ብር ብድር ወስዶ በወቅቱ ሳይመልስ የቀረ ሲሆን፤ አድራሻውን በመቀየር የውል ግዴታውን ጥሷል...')"}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none leading-relaxed transition-all text-sm"
            />
          </div>

          {/* Attached Files Preview */}
          {attachedFiles.length > 0 && (
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
              <span className="text-xs font-semibold text-slate-300">
                {isOromo ? 'Sanadoota Olkaafaman:' : 'የተያያዙ ሰነዶች፦'}
              </span>
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <span className="text-slate-500 text-[10px]">({file.size})</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-slate-400 hover:text-red-400 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category & Client Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                {isOromo ? 'Gosa Seeraa (Category)' : 'የሕግ ዘርፍ (Category)'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'general', label: isOromo ? 'Waliigala' : 'አጠቃላይ' },
                  { id: 'civil', label: t('catCivil') },
                  { id: 'criminal', label: t('catCriminal') },
                  { id: 'labor', label: t('catLabor') },
                  { id: 'family', label: t('catFamily') },
                  { id: 'commercial', label: t('catCommercial') },
                ].map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id as LegalCategory)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      category === cat.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                {isOromo ? 'Gahee Keessan (Client Role)' : 'የእርስዎ ሚና (Client Role)'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'plaintiff', label: isOromo ? 'Himataa' : 'ከሳሽ / አመልካች' },
                  { id: 'defendant', label: isOromo ? 'Himatamaa' : 'ተከሳሽ / መልስ ሰጪ' },
                  { id: 'lawyer', label: isOromo ? 'Abukaatoo' : 'ጠበቃ / አማካሪ' },
                ].map(role => (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => setClientRole(role.id as ClientRole)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      clientRole === role.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Action & Upload Column */}
        <div className="space-y-5">
          {/* File Upload Drop Area */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{isOromo ? 'Ragaalee Olkaasaa (Sanadoota)' : 'ማስረጃ ሰነዶችን ይጫኑ'}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isOromo 
                ? 'Waliigaltee, nagahee baankii, xalayaa poostaa yookiin qaboo yaa\'ii (PDF/Image/Text) olkaasaa.' 
                : 'የተፈራረሟቸውን ውሎች፣ ደረሰኞች፣ የስራ ስንብት ወይም የፖሊስ ሪፖርት ፋይሎችን (PDF፣ Image ወይም Text) ይጫኑ።'}
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors bg-slate-900/40"
            >
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-semibold text-slate-200">
                {isOromo ? 'Fayilii Filachuuf Cuqaasaa' : 'ፋይሎችን ለመምረጥ እዚህ ይጫኑ'}
              </span>
              <span className="text-[10px] text-slate-500">PDF, TXT, PNG, JPG (Hanga 25MB)</span>
            </label>
          </div>

          {/* Action Trigger Box */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3">
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || (!caseText.trim() && attachedFiles.length === 0)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{isOromo ? 'Seerota Qorachaa Jira...' : 'ሕጎችን በመመርመር ላይ...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isOromo ? 'Xiinxala Seeraa Eegali' : 'ጥልቅ የሕግ ትንተና ጀምር'}</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div ref={resultsRef} className="space-y-6 pt-6 border-t border-slate-800">
          {/* Executive Header Card */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  {isOromo ? 'Bu\'aa Xiinxala Seeraa' : 'የሕግ ትንተና ውጤት'}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                {analysis.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isOromo ? 'Gosa Seeraa:' : 'የሕግ ዘርፍ፡'} <span className="text-slate-200 font-medium">{analysis.category}</span> • 
                {isOromo ? ' Mana Murtii Aangoo Qabu:' : ' ስልጣን ያለው ፍርድ ቤት፡'} <span className="text-slate-200 font-medium">{analysis.recommendedCourt}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isOromo ? "Maxxansi" : "ይህንን ማስታወሻ አትም"}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isOromo ? 'Maxxansi' : 'የሕግ ማስታወሻ አትም'}</span>
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>{showChat ? (isOromo ? 'Cufi' : 'ውይይት ዝጋ') : (isOromo ? 'Abukaatoo Gaafadhu' : 'ጠበቃውን ጠይቅ')}</span>
              </button>

              {onStartLawsuitFiling && (
                <button
                  onClick={handleStartClaimFiling}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                  title={isOromo ? "Gara qophii himannaatti darbi" : "በዚህ ኬዝ ላይ ይፋዊ የክስ ወረቀት በክስ መመስረቻ ማዕከል አዘጋጅ"}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('startFilingBtnFromConsultation')}</span>
                </button>
              )}

              {onStartDefenseFiling && (
                <button
                  onClick={handleStartDefenseFiling}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
                  title="ለዚህ ጉዳይ የተከሳሽ ይፋዊ የመከላከያ መልስ አዘጋጅ"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{isOromo ? 'Deebii Himatamaa' : 'የመከላከያ መልስ (ለተከሳሽ)'}</span>
                </button>
              )}

              {onCheckJurisdiction && (
                <button
                  onClick={() => onCheckJurisdiction({
                    disputeType: category,
                    caseSummary: analysis.summary,
                  })}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-500/20"
                >
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isOromo ? 'Aangoo' : 'ስልጣን ፈትሽ'}</span>
                </button>
              )}

              {onCalculateFee && (
                <button
                  onClick={() => onCalculateFee(450000)}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/20"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isOromo ? 'Kaffaltii' : 'ክፍያ አስላ'}</span>
                </button>
              )}

              <button
                onClick={handleSaveToManagedCases}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{isOromo ? 'Gara Wiirtuu Himannaatti Dabali' : 'ወደ ክስ መቆጣጠሪያ ማዕከል አክል'}</span>
              </button>
            </div>
          </div>

          {addedSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{isOromo ? 'Dhimmi kun milkaa\'inaan gara Wiirtuu To\'annoo Himannaatti galmaa\'eera!' : 'ይህ ኬዝ በተሳካ ሁኔታ ወደ "የክስ መቆጣጠሪያ ማዕከል" ተካቷል! መዝገቡንና ቀጠሮዎችን ከዚያ መከታተል ይችላሉ።'}</span>
            </div>
          )}

          {/* Strength Score + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  {t('caseStrengthTitle')}
                </span>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-4xl font-extrabold ${
                    analysis.caseStrengthScore >= 70 ? 'text-emerald-400' :
                    analysis.caseStrengthScore >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {analysis.caseStrengthScore}%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {analysis.caseStrengthScore >= 70 ? (isOromo ? 'Carraa Olaanaa' : 'ከፍተኛ የማሸነፍ እድል') :
                     analysis.caseStrengthScore >= 50 ? (isOromo ? 'Giddu-galeessa' : 'መካከለኛ / ድርድር የሚሻ') : (isOromo ? 'Gadi-aanaa' : 'ዝቅተኛ / ከፍተኛ ተጋላጭነት')}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      analysis.caseStrengthScore >= 70 ? 'bg-emerald-500' :
                      analysis.caseStrengthScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${analysis.caseStrengthScore}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                {analysis.caseStrengthExplanation}
              </p>
            </div>

            <div className="md:col-span-2 bg-slate-800/90 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-2">
                  {isOromo ? 'Gabaasa Dhimmaa (Executive Legal Summary)' : 'የጉዳዩ ማጠቃለያ እና ጭብጥ (Executive Legal Summary)'}
                </span>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4">
                  {analysis.summary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>{isOromo ? 'Yaada Abukaatoo:' : 'የጠበቃው ማሳሰቢያ፡'}</strong> {analysis.counselAdviceAmharic}
                </div>
              </div>
            </div>
          </div>

          {/* 1. Case Facts & Situation Detailed Review */}
          <div className="bg-slate-800/95 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-amber-400" />
                <h4 className="text-base sm:text-lg font-bold text-white font-serif">
                  {isOromo ? 'Qabxiiwwan Dhimmaa fi Haala Qabatamaa (Case Facts & Situation)' : 'የኬዙ ፍሬ ነገርና የደረሰው ሁኔታ ዝርዝር ግምገማ (Detailed Case Facts & Situation Review)'}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {isOromo ? 'Qorannoo Dhimmaa' : 'የተጨባጭ ሁኔታ ምርመራ'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Established Facts */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2.5">
                <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isOromo ? 'Qabxiiwwan Mirkanaa\'an (Established Facts)' : 'የተረጋገጡ የኬዙ ፍሬ ነገሮች (Established Facts)'}
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {(analysis.caseFactsReview?.establishedFacts && analysis.caseFactsReview.establishedFacts.length > 0
                    ? analysis.caseFactsReview.establishedFacts
                    : [
                        `${isOromo ? 'Haala dhimmaa:' : 'የቀረበው የጉዳይ ሁኔታ፡'} ${analysis.title}`,
                        `${isOromo ? 'Gosa falmii:' : 'የተፈጠረው ክርክር ዘርፍ፡'} ${analysis.category}`,
                        isOromo ? 'Waliigalteen ykn dirqamni seeraa jiraachuun mirkanaa\'eera' : 'በሁለቱ ወገኖች መካከል የውል ወይም የሕግ ግዴታ መኖሩ ተረጋግጧል'
                      ]
                  ).map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Occurred Situation & Core Issues */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    {isOromo ? 'Haala Qaqqabee fi Miidhaa (Occurred Situation & Harm)' : 'የደረሰው ሁኔታና ጉዳት (The Occurred Situation & Harm)'}
                  </h5>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    {analysis.caseFactsReview?.occurredSituation || analysis.summary}
                  </p>
                </div>

                {analysis.caseFactsReview?.legalIssues && analysis.caseFactsReview.legalIssues.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                      {isOromo ? 'Qabxiiwwan Seeraa Mana Murtiitiin Murtaa\'an፦' : 'ፍርድ ቤት የሚመልሳቸው ዋና ዋና የሕግ ጭብጦች፦'}
                    </span>
                    <div className="space-y-1.5">
                      {analysis.caseFactsReview.legalIssues.map((issue, idx) => (
                        <div key={idx} className="text-[11px] text-amber-200/90 flex items-start gap-1.5 bg-slate-950/30 p-1.5 rounded border border-slate-800/50">
                          <span className="text-amber-400 font-bold">•</span>
                          <span className="leading-snug">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Applicable Articles & Statutory Provisions */}
          <div className="bg-slate-800/95 rounded-2xl p-6 border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>{t('applicableArticlesTitle')}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isOromo ? 'Keewwattoota seera Itoophiyaa dhimma kana kallattiin to\'atan:' : 'የቀረበውን የኬዝ ፍሬ ነገርና የደረሰውን ሁኔታ በቀጥታ የሚገዙ የኢትዮጵያ ሕግ ድንጋጌዎች፦'}
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setArticleCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    articleCategoryFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isOromo ? `Hunda (${analysis.applicableArticles?.length || 0})` : `ሁሉም (${analysis.applicableArticles?.length || 0})`}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.applicableArticles?.map((art, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900/90 border border-slate-700/80 p-5 space-y-3.5 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                        {art.articleNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {art.code}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-white font-serif">
                      {art.title}
                    </h5>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      {art.contentSummary}
                    </p>

                    <div className="text-xs text-amber-200/90 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                      <strong className="text-amber-400 block mb-0.5">{isOromo ? 'Raawwii Dhimma Kanaa:' : 'በዚህ ኬዝ ላይ ያለው አፈጻጸም፦'}</strong>
                      <p>{art.applicationToCase}</p>
                    </div>

                    {art.legalEffectOrSanction && (
                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
                        <strong className="text-emerald-300">{isOromo ? 'Bu\'aa Seeraa:' : 'የሕጉ ውጤት / ተጠያቂነት፡ '}</strong>
                        {art.legalEffectOrSanction}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyArticle(`${art.code} ${art.articleNumber} - ${art.title}\n${art.contentSummary}`, art.articleNumber)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedArticleId === art.articleNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedArticleId === art.articleNumber ? t('copied') : t('copy')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Cassation Precedents */}
          {analysis.cassationPrecedents && analysis.cassationPrecedents.length > 0 && (
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>{t('cassationPrecedentsTitle')}</span>
              </h4>
              <div className="space-y-3 pt-1">
                {analysis.cassationPrecedents.map((cas, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-900/30 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <span className="inline-block px-2 py-1 rounded bg-slate-800 text-amber-300 text-xs font-semibold whitespace-nowrap border border-amber-500/20">
                        {cas.benchDecision}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-serif">
                        "{cas.legalPrinciple}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remedies & Action Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>{t('remediesTitle')}</span>
              </h4>
              <div className="space-y-2.5">
                {analysis.remedies?.map((rem, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-300">{rem.option}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {rem.feasibility}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{rem.steps}</p>
                  </div>
                ))}
              </div>

              {analysis.financialOrPenaltyEstimate && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200">
                  <strong>{isOromo ? 'Tilmaama Beenyaa ykn Adabbii:' : 'የካሳ ወይም የቅጣት ግምት፡'} </strong> {analysis.financialOrPenaltyEstimate}
                </div>
              )}
            </div>

            <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{t('actionPlanTitle')}</span>
              </h4>
              <div className="space-y-2">
                {analysis.actionPlan?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chat Dialog with Legal Advisor */}
          {showChat && (
            <div className="bg-slate-800 rounded-2xl p-5 sm:p-6 border border-amber-900/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <h4 className="text-base font-bold text-white">
                    {isOromo ? 'Abukaatoo wajjin mari\'adhaa (Legal Q&A)' : 'ከጠበቃው ጋር ቀጥታ ውይይት (Follow-up Legal Q&A)'}
                  </h4>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200 ml-8'
                        : 'bg-slate-900 border border-slate-700 text-slate-200 mr-8'
                    }`}
                  >
                    <span className="text-[10px] font-bold block mb-1 uppercase tracking-wider text-slate-400">
                      {msg.role === 'user' ? (isOromo ? 'Isin' : 'እርስዎ') : (isOromo ? 'Abukaatoo' : 'የሕግ አማካሪ')}
                    </span>
                    {msg.content}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isOromo ? "Gaaffii dabalataa asitti barreessaa..." : "ተጨማሪ የሕግ ጥያቄዎን እዚህ ጽፈው ይጠይቁ..."}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
