import React, { useState, useEffect } from 'react';
import {
  Search,
  Scale,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Filter,
  BookmarkPlus,
  HelpCircle,
  Lightbulb,
  Globe,
  ShieldAlert,
} from 'lucide-react';
import { LegalCodeArticle, LegalSearchResult, ApplicableArticle, CassationPrecedent } from '../types/legal';
import { PRESET_LAW_ARTICLES } from '../data/sampleData';
import { useLanguage } from '../context/LanguageContext';

interface LawLibraryProps {
  initialSearch?: string;
  onTransferToCase?: (title: string, summary: string, articles: ApplicableArticle[]) => void;
  onNavigateToDrafter?: (articleText: string) => void;
  onNavigateToDefense?: (articleText: string) => void;
}

export const LawLibrary: React.FC<LawLibraryProps> = ({
  initialSearch = '',
  onTransferToCase,
  onNavigateToDrafter,
  onNavigateToDefense,
}) => {
  const { t, isOromo, isEnglish, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articles, setArticles] = useState<LegalCodeArticle[]>(PRESET_LAW_ARTICLES);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search Engine State
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<LegalSearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'smart_engine' | 'browse_articles' | 'external_portals'>('smart_engine');

  const popularLegalQueries = isOromo
    ? [
        {
          label: 'Waliigaltee bittaa mana jireenyaa diiguu fi beenyaa',
          query: 'Qabeenya dhaabbataa yookiin mana jireenyaa bittaa fi gurgurtaa taasifamee sanadoota ragaatiin osoo hin galmaayin maallaqa kaffalamee ergasii yoo deebisuu dide seerri maal jedha?',
        },
        {
          label: 'Cheekii baankii harka hin qabne (seera yakkaa)',
          query: 'Bittaa meeshaatiif cheekii baankii Qarshii 850,000 kan kenname herreega irratti maallaqa hin qabu jedhamee yoo deebi\'u itti-gaafatamummaan yakkaa fi siviilii maali?',
        },
        {
          label: 'Hojii irraa ari\'amuu seeraan alaa',
          query: 'Hojjechiisaan osoo akeekkachiisa hin kennin fi sababa gahaa malee hojjetaa yoo ari\'e Labsii 1156/2011 bu\'uureffachuun beenyaan kaffalamu meeqa?',
        },
        {
          label: 'Wal-hiikuu fi qabeenya waliinii qooddachuu',
          query: 'Yeroo gaa\'ilaatti manni jireenyaa bitame maqaa abbaa warraatiin yoo galmaa\'es yeroo wal-hiikkaa Seera Maatiitiin qooddachiisuun akkamitti raawwatama?',
        },
        {
          label: 'Balaa konkolaataatiin miidhaa qaqqabeef beenyaa',
          query: 'Balaa tiraafikaatiin qaama namaa fi qabeenya irra miidhaa ga\'eef seera siviilii dirqama waliigalteen alaa (Tort) bu\'uureffachuun beenyaan akkamitti gaafatama?',
        },
      ]
    : [
        {
          label: 'የቤት ሽያጭ ውል ማፍረስና ካሳ',
          query: 'የማይንቀሳቀስ ንብረት ወይም የቤት ሽያጭ ውል ተደርጎ በውልና ማስረጃ ሳይመዘገብ ገንዘብ ሰጥቼ አሁን አልመልስም ቢለኝ ሕጉ ምን ይላል?',
        },
        {
          label: 'ያለስንቅ የተሰጠ የባንክ ቼክ',
          query: 'ለእቃ ግዢ የተሰጠ የ 850,000 ብር የባንክ ቼክ በቂ ስንቅ የለውም ተብሎ ሲመለስ የወንጀልና የፍትሐብሔር እዳው ምንድነው?',
        },
        {
          label: 'ሕገ-ወጥ የሥራ ስንብት',
          query: 'አሠሪው ያለማስጠንቀቂያና ያለበቂ ምክንያት ሠራተኛን ቢያሰናብት በአዋጅ 1156/2011 መሠረት የሚከፈለው የስንብት ካሳ ስንት ነው?',
        },
        {
          label: 'የትዳር ፍቺና የጋራ ንብረት',
          query: 'በትዳር ወቅት የተገዛ ቤት በባል ስም ቢመዘገብም ፍቺ ሲፈጸም በፍትሐብሔርና በቤተሰብ ሕግ የጋራ ንብረት ክፍፍሉ እንዴት ነው?',
        },
        {
          label: 'የመኪና አደጋ የጉዳት ካሳ',
          query: 'በተሽከርካሪ አደጋ በሰው አካልና በንብረት ላይ ለደረሰ ጉዳት ከውል ውጭ ባለው ኃላፊነት (Tort) መሠረት ካሳ የሚጠየቀው እንዴት ነው?',
        },
      ];

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
      handleExecuteSearch(initialSearch);
    }
  }, [initialSearch]);

  const handleExecuteSearch = async (queryToSearch?: string) => {
    const q = queryToSearch || searchQuery;
    if (!q.trim()) return;

    setIsSearchingAI(true);
    setSearchError(null);
    setActiveViewMode('smart_engine');

    try {
      const res = await fetch('/api/legal/search-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          codeFilter: selectedCategory,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setAiSearchResult(data.result);
      } else {
        setSearchError(data.error || (isOromo ? 'Odeeffannoo seeraa argachuun hin danda\'amne.' : 'የሕግ መረጃ ማግኘት አልተቻለም።'));
      }
    } catch (err: any) {
      setSearchError(err.message || (isOromo ? 'Sarara wajjin wal-qunnamuu hin danda\'amne.' : 'ከአገልጋዩ ጋር መገናኘት አልተቻለም።'));
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter for browsing articles
  const filteredArticles = articles.filter(art => {
    const matchesCat = selectedCategory === 'all' || art.type === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesQuery =
      art.title.toLowerCase().includes(q) ||
      art.articleNumber.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.code.toLowerCase().includes(q) ||
      art.keywords.some(k => k.toLowerCase().includes(q));

    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Search Engine Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/60 border border-amber-900/40 p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isOromo ? 'Mootora Barbaada Seera Itoophiyaa (Legal Search Engine)' : 'የኢትዮጵያ ሕጎች ብልህ የፍለጋ ሞተር (Ethiopian Legal Search Engine)'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif mb-2">
            {isOromo 
              ? 'Qabxii Dhimma Keessanii Galchaa; Keewwattoota Seeraa fi Gorsa Argadhaa' 
              : 'የክስ ዝርዝርዎን ያስገቡ፤ ተገቢውን የሕግ አንቀጾችና ምክር ያግኙ'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {isOromo
              ? 'Dhimma falmii yookiin gaaffii seeraa qabdan yoo galchitan, sirnichi Seera Sivilii (1952), Seera Yakkaa (1996), Labsii Hojjetaa fi Murteewwan Dhaddacha Ijibbaata Federaalaa wajjin wal-qabsiisuun keewwattoota fi gorsa seeraa isiniif kenna.'
              : 'የተፈጠረውን የክርክር ወይም የክስ ሁኔታ በፈለጉት ቋንቋ ሲያስገቡ፣ ስርዓቱ ከኢትዮጵያ የፍትሐብሔር ሕግ (1952)፣ የወንጀል ሕግ (1996)፣ የሠራተኛ አዋጅ እና አስገዳጅ የፌዴራል ሰበር ውሳኔዎች ጋር በቅጽበት በማመሳከር ተገቢውን የሕግ አንቀጾች እና ሙያዊ የሕግ ምክር በራስ-ሰር ያቀርባል።'}
          </p>
        </div>

        {/* Popular Legal Query Chips */}
        <div className="mt-5 pt-4 border-t border-slate-700/60">
          <span className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('popularSearchesTitle')}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {popularLegalQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(item.query);
                  handleExecuteSearch(item.query);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-amber-500/20 hover:border-amber-500/50 border border-slate-700 text-slate-200 transition-all text-left flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3 h-3 text-amber-400" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Search Input Form */}
      <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteSearch();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <Search className="w-5 h-5 text-amber-400 absolute left-4 top-4" />
            <textarea
              rows={3}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleExecuteSearch();
                }
              }}
              placeholder={isOromo ? "Qabxii dhimma keessanii yookiin keewwata seeraa barbaaddan asitti barreessaa (fkn: 'Waliigalteen kiraa manaa diigame, abbaan qabeenyaa maallaqa liqaa hin deebisu jedhe...')" : "የክስዎን ፍሬ ነገር ወይም የሕግ ጥያቄዎን እዚህ ያስገቡ (ለምሳሌ፡ 'የቤት ኪራይ ውል ተጣሰ፣ አከራዩ ቤቱን አስረክባለሁ ባለው ቀን ሳያስረክብ የቀረ ሲሆን ገንዘቡንም አልመልስም ብሏል...')"}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none leading-relaxed transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: isOromo ? 'Seerota Hunda' : 'ሁሉም ሕጎች (ፍትሐብሔርና ወንጀል)' },
                { id: 'civil', label: isOromo ? 'Seera Sivilii (1952)' : 'የፍትሐብሔር ሕግ (1952)' },
                { id: 'criminal', label: isOromo ? 'Seera Yakkaa (1996)' : 'የወንጀል ሕግ (1996)' },
                { id: 'labor', label: isOromo ? 'Labsii Hojjetaa (1156/2011)' : 'የሠራተኛ አዋጅ (1156/2011)' },
                { id: 'family', label: isOromo ? 'Seera Maatii' : 'የቤተሰብ ሕግ' },
                { id: 'cassation', label: isOromo ? 'Murteewwan Ijibbaataa' : 'የሰበር ውሳኔዎች' },
              ].map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSearchingAI || !searchQuery.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSearchingAI ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{isOromo ? 'Seera qorachaa jira...' : 'ሕጉን በመመርመር ላይ...'}</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    <span>{isOromo ? 'Seerri Maal Jedha? Barbaadi' : 'ሕጉ ምን ይላል? ፈልግ'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {searchError && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Switcher: Search Results View vs Browse All Articles */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveViewMode('smart_engine')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeViewMode === 'smart_engine'
                ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isOromo ? 'Bu\'aa Barbaada Seeraa' : 'የብልህ ፍለጋው ትንተና ውጤት'}
            {aiSearchResult && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                {(aiSearchResult.civilCodeMatches?.length || 0) + (aiSearchResult.criminalCodeMatches?.length || 0)} {isOromo ? 'keewwattoota' : 'አንቀጾች'}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveViewMode('browse_articles')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeViewMode === 'browse_articles'
                ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isOromo ? `Keewwattoota Seeraa Hunda Ilaali (${filteredArticles.length})` : `ሁሉንም የሕግ ድንጋጌዎች ተመልከት (${filteredArticles.length})`}
          </button>

          <button
            onClick={() => setActiveViewMode('external_portals')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'external_portals'
                ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{isOromo ? 'Kuusaa Seeraa (Abyssinia Law & Legal Brief)' : 'የሕግ ማህደሮች (abyssinialaw.com & ethiopianlegalbrief.com)'}</span>
          </button>
        </div>

        {aiSearchResult && (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isOromo ? `Wal-simannaa: ${aiSearchResult.relevanceScore}%` : `ተዛማጅነት፡ ${aiSearchResult.relevanceScore}%`}
          </span>
        )}
      </div>

      {/* View 1: Smart Search Results */}
      {activeViewMode === 'smart_engine' && (
        <div className="space-y-6">
          {aiSearchResult ? (
            <>
              {/* Executive Legal Issue & Direct Counsel */}
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                      {isOromo ? 'Gosa Seeraa:' : 'የሕግ ዘርፍ፡'} {aiSearchResult.recognizedCategory}
                    </span>
                    <span className="text-xs text-slate-400">
                      {isOromo ? 'Qabxii Wal-simannaa:' : 'ተዛማጅነት ምጣኔ፡'} {aiSearchResult.relevanceScore}%
                    </span>
                  </div>

                  {onTransferToCase && (
                    <button
                      onClick={() => onTransferToCase(
                        aiSearchResult.legalIssueSummary,
                        aiSearchResult.customCounsel,
                        [...(aiSearchResult.civilCodeMatches || []), ...(aiSearchResult.criminalCodeMatches || [])]
                      )}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>{isOromo ? 'Gara Wiirtuu Himannaatti Dabarsi' : 'ይህንን ኬዝ ወደ መቆጣጠሪያ ማዕከል አክል'}</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                    {isOromo ? 'Qabxii Dhimma Seeraa:' : 'የሕግ ጭብጥ ማጠቃለያ፡'}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60">
                    {aiSearchResult.legalIssueSummary}
                  </p>
                </div>

                {/* Direct Counsel Advice Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/30 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Scale className="w-4 h-4" />
                    <span>{isOromo ? 'Gorsa Seeraa fi Kallattii Furmaataa (Authoritative Legal Advice)፦' : 'ተገቢው የሕግ ምክርና አቅጣጫ (Authoritative Legal Advice)፦'}</span>
                  </div>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {aiSearchResult.customCounsel}
                  </p>
                </div>

                {/* Recommended Procedural Action Steps */}
                {aiSearchResult.actionSteps && aiSearchResult.actionSteps.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-300 block mb-2">
                      {isOromo ? 'Tarkaanfilee Seeraa Fudhatamuu Qaban (Actionable Next Steps)፦' : 'ቀጣይ የሕግ እርምጃዎች (Actionable Next Steps)፦'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {aiSearchResult.actionSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                        >
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Civil Code Provisions Section */}
              {aiSearchResult.civilCodeMatches && aiSearchResult.civilCodeMatches.length > 0 && (
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                      <span>{isOromo ? 'Keewwattoota Seera Sivilii (Civil Code Articles)' : 'የፍትሐብሔር ሕግ ድንጋጌዎችና አንቀጾች (Civil Code Articles)'}</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      {aiSearchResult.civilCodeMatches.length} {isOromo ? 'keewwattoota' : 'ተዛማጅ አንቀጾች'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiSearchResult.civilCodeMatches.map((art, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-900/90 border border-slate-700/80 p-4 space-y-2.5 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
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
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-emerald-400 font-semibold">
                            {art.confidenceScore}% {isOromo ? 'wal-simannaa' : 'ተዛማጅነት'}
                          </span>

                          <div className="flex items-center gap-2">
                            {onNavigateToDrafter && (
                              <button
                                onClick={() => onNavigateToDrafter(`${art.code} ${art.articleNumber} (${art.title})`)}
                                className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                                title="ወደ ክስ መመስረቻ አንቀጹን ውሰድ"
                              >
                                <FileText className="w-3 h-3" />
                                <span>{isOromo ? 'Himannaaf' : 'ወደ ክስ'}</span>
                              </button>
                            )}

                            {onNavigateToDefense && (
                              <button
                                onClick={() => onNavigateToDefense(`${art.code} ${art.articleNumber} (${art.title})`)}
                                className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                                title="ወደ መከላከያ መልስ አንቀጹን ውሰድ"
                              >
                                <ShieldAlert className="w-3 h-3" />
                                <span>{isOromo ? 'Deebiif' : 'ወደ መከላከያ'}</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleCopy(`${art.articleNumber} - ${art.title}\n${art.contentSummary}`, `civ-${idx}`)}
                              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === `civ-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedId === `civ-${idx}` ? t('copied') : t('copy')}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Criminal Code Provisions Section */}
              {aiSearchResult.criminalCodeMatches && aiSearchResult.criminalCodeMatches.length > 0 && (
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                      <Shield className="w-5 h-5 text-rose-400" />
                      <span>{isOromo ? 'Keewwattoota Seera Yakkaa (Criminal Code Articles)' : 'የወንጀል ሕግ ድንጋጌዎችና አንቀጾች (Criminal Code Articles)'}</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      {aiSearchResult.criminalCodeMatches.length} {isOromo ? 'keewwattoota' : 'ተዛማጅ አንቀጾች'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiSearchResult.criminalCodeMatches.map((art, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-900/90 border border-slate-700/80 p-4 space-y-2.5 hover:border-rose-500/40 transition-colors flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30">
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

                          <div className="text-xs text-rose-200/90 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/30">
                            <strong className="text-rose-400 block mb-0.5">{isOromo ? 'Itti-gaafatamummaa Yakkaa:' : 'የወንጀል ተጠያቂነት አፈጻጸም፦'}</strong>
                            <p>{art.applicationToCase}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[11px] text-emerald-400 font-semibold">
                            {art.confidenceScore}% {isOromo ? 'wal-simannaa' : 'ተዛማጅነት'}
                          </span>
                          <button
                            onClick={() => handleCopy(`${art.articleNumber} - ${art.title}\n${art.contentSummary}`, `crim-${idx}`)}
                            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === `crim-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === `crim-${idx}` ? t('copied') : t('copy')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cassation Precedents Section */}
              {aiSearchResult.cassationMatches && aiSearchResult.cassationMatches.length > 0 && (
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                      <Scale className="w-5 h-5 text-amber-400" />
                      <span>{isOromo ? 'Murteewwan Dirqisiisoo Dhaddacha Ijibbaata Federaalaa' : 'አስገዳጅ የፌዴራል ሰበር ችሎት ውሳኔዎች (Cassation Decisions)'}</span>
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {aiSearchResult.cassationMatches.map((cas, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-900/90 border border-slate-700/80 p-4 space-y-2 hover:border-amber-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300 font-mono">
                            {cas.benchDecision}
                          </span>
                          {cas.volumeNumber && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {cas.volumeNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                          "{cas.legalPrinciple}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center space-y-3 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700">
              <Search className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white font-serif">
                {isOromo ? 'Barbaada Seeraa Eegalaa' : 'ፍለጋዎን እዚህ ይጀምሩ'}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {isOromo 
                  ? 'Gama oliitti qabxii dhimma keessanii galchuudhaan "Seerri Maal Jedha? Barbaadi" kan jedhu cuqaasaa.'
                  : 'ከላይ ባለው ሳጥን ውስጥ የጉዳይዎን ፍሬ ነገር ወይም ጥያቄ አስገብተው «ሕጉ ምን ይላል? ፈልግ» የሚለውን ይጫኑ።'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* View 2: Browse All Law Articles */}
      {activeViewMode === 'browse_articles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((art, idx) => (
              <div
                key={idx}
                className="bg-slate-800 rounded-2xl p-5 border border-slate-700/80 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between"
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

                  <h4 className="text-sm font-bold text-white font-serif">
                    {art.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {art.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {art.keywords.map((k, kidx) => (
                      <span
                        key={kidx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    {art.type}
                  </span>
                  <button
                    onClick={() => handleCopy(`${art.articleNumber} - ${art.title}\n${art.summary}`, `art-${idx}`)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `art-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === `art-${idx}` ? t('copied') : t('copy')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: External Legal Portals & Repositories */}
      {activeViewMode === 'external_portals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                AL
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Abyssinia Law</h4>
                <span className="text-xs text-amber-400 font-mono">www.abyssinialaw.com</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isOromo
                ? 'Kuusaa murteewwan dhaddacha ijibbaata federaalaa qorannoo seera sivilii fi yakkaa qabate.'
                : 'የፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት አስገዳጅ ውሳኔዎችን (ቅጽ 1-25) እና የኢትዮጵያ ሕግ ኮዶችን ለማንበብ።'}
            </p>
            <a
              href="https://www.abyssinialaw.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700"
            >
              <span>{isOromo ? 'Abyssinia Law Bani' : 'ወደ Abyssinia Law ሂድ'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ELB
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Ethiopian Legal Brief</h4>
                <span className="text-xs text-emerald-400 font-mono">ethiopianlegalbrief.com</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isOromo
                ? 'Labsiiwwan, dambiiwwan fi qorannoowwan seeraa Negarit Gazetaa buusuuf.'
                : 'የፌዴራል ነጋሪት ጋዜጣ አዋጆችን፣ ደንቦችንና የሕግ ማብራሪያዎችን በቀጥታ ለመፈለግና ለማውረድ።'}
            </p>
            <a
              href="https://ethiopianlegalbrief.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-emerald-200 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700"
            >
              <span>{isOromo ? 'Legal Brief Bani' : 'ወደ Ethiopian Legal Brief ሂድ'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
