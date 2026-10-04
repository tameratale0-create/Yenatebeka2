import React, { useState, useEffect } from 'react';
import {
  Scale,
  BookOpen,
  Calendar,
  FolderKanban,
  FileText,
  Phone,
  ShieldCheck,
  HelpCircle,
  Globe,
  Languages,
  Building,
  Calculator,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  UserCheck,
  Sparkles,
  LayoutGrid,
  Users,
  LogIn,
  LogOut,
  UserPlus,
  User,
  Briefcase,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { JusticeLogo } from './JusticeLogo';

export type TabType =
  | 'consultation'
  | 'cases'
  | 'hearings'
  | 'library'
  | 'drafter'
  | 'defense'
  | 'translator'
  | 'jurisdiction'
  | 'courtFees'
  | 'lawyers';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  caseCount: number;
  hearingCount: number;
  onOpenHelp: () => void;
  onOpenAuth: (role?: 'client' | 'lawyer', mode?: 'login' | 'register') => void;
  onOpenAboutCompany?: () => void;
}

interface MenuItem {
  id: TabType;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  titleAm: string;
  titleOm: string;
  titleEn: string;
  descAm: string;
  descOm: string;
  badgeAm?: string;
  badgeOm?: string;
  count?: number;
}

interface MenuSection {
  titleAm: string;
  titleOm: string;
  titleEn: string;
  items: MenuItem[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  caseCount,
  hearingCount,
  onOpenHelp,
  onOpenAuth,
  onOpenAboutCompany,
}) => {
  const { language, setLanguage, t, isOromo, isEnglish } = useLanguage();
  const { currentUser, currentLawyer, logout, login, loginWithGoogle } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Grouped Menu Structure for Drawer
  const menuSections: MenuSection[] = [
    {
      titleAm: 'የክስና የመከላከያ ሰነዶች',
      titleOm: 'Sanadoota Himannaa fi Deebii',
      titleEn: 'Pleadings & Defense Drafters',
      items: [
        {
          id: 'drafter',
          icon: FileText,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
          titleAm: 'ክስ መመስረቻ (ለከሳሽ)',
          titleOm: 'Qophii Himannaa (Himataaf)',
          titleEn: 'Lawsuit Filing (Statement of Claim)',
          descAm: 'ይፋዊ የክስ ወረቀትና የከሳሽ መጠይቅ በራስ-ሰር ያዘጋጁ',
          descOm: 'Iyyannoo himannaa seera qabeessa mana murtii qopheessaa',
          badgeAm: 'ለከሳሽ',
          badgeOm: 'Himataaf',
        },
        {
          id: 'defense',
          icon: ShieldAlert,
          color: 'text-rose-400',
          bgColor: 'bg-rose-500/10 border-rose-500/30',
          titleAm: 'የመከላከያ መልስ (ለተከሳሽ)',
          titleOm: 'Deebii Himatamaa (Himatamaaf)',
          titleEn: 'Statement of Defense',
          descAm: 'የክስ ወረቀት ሰነድ በማስገባት ለፍርድ ቤት የመከላከያ መልስ ያዘጋጁ',
          descOm: 'Waraqaa himannaa galchuun deebii seeraa qopheessaa',
          badgeAm: 'ለተከሳሽ',
          badgeOm: 'Himatamaaf',
        },
      ],
    },
    {
      titleAm: 'የፍርድ ቤት ስልጣንና ክፍያዎች',
      titleOm: 'Aangoo fi Kaffaltiiwwan Mana Murtii',
      titleEn: 'Court Jurisdiction & Fees',
      items: [
        {
          id: 'jurisdiction',
          icon: Building,
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-500/10 border-indigo-500/30',
          titleAm: 'ፍርድ ቤት መለያ',
          titleOm: 'Aangoo Mana Murtii',
          titleEn: 'Court Jurisdiction Finder',
          descAm: 'ክሱ የሚቀርብበትን ተገቢ ፍርድ ቤት፣ ችሎትና ስልጣን ይለዩ',
          descOm: 'Mana murtii fi dhaddacha aangoo qabu adda baasaa',
          badgeAm: 'ስልጣን',
          badgeOm: 'Aangoo',
        },
        {
          id: 'courtFees',
          icon: Calculator,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30',
          titleAm: 'የዳኝነት ክፍያ ማስያ',
          titleOm: 'Shallaggii Kaffaltii Abbaa Seerummaa',
          titleEn: 'Court Fee Calculator',
          descAm: 'በአዲሱ ደንብ ቁጥር 1/2017 መሠረት የዳኝነት፣ የመጥሪያና ወጪ ስሌት',
          descOm: 'Akkaataa Dambii 1/2017 tiin shallaggii kaffaltii fi baasii',
          badgeAm: 'ደንብ 1/2017',
          badgeOm: 'Dambii 1/2017',
        },
      ],
    },
    {
      titleAm: 'መዝገቦችና የችሎት ቀጠሮዎች',
      titleOm: 'Galmee Dhimmaa fi Beellama',
      titleEn: 'Cases & Hearing Management',
      items: [
        {
          id: 'cases',
          icon: FolderKanban,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
          titleAm: 'የክስ መቆጣጠሪያ ማዕከል',
          titleOm: 'Wiirtuu To\'annoo Galmee',
          titleEn: 'Case Control Center',
          descAm: 'የተመዘገቡ መዝገቦች፣ ደረጃዎች፣ ማስረጃዎችና የሂደት ክትትል',
          descOm: 'Galmee dhimmootaa, ragaalee fi adeemsa hordofaa',
          count: caseCount,
        },
        {
          id: 'hearings',
          icon: Calendar,
          color: 'text-sky-400',
          bgColor: 'bg-sky-500/10 border-sky-500/30',
          titleAm: 'የቀጠሮ መከታተያ',
          titleOm: 'Hordoffii Beellama Mana Murtii',
          titleEn: 'Hearing Tracker',
          descAm: 'የፍርድ ቤት ቀጠሮዎች፣ የቅድመ-ችሎት ዝግጅት ማመሳከሪያና ማስታወሻ',
          descOm: 'Beellama mana murtii fi qophii dhaddachaa galmeessaa',
          count: hearingCount,
        },
      ],
    },
    {
      titleAm: 'ጠበቆች፣ ምክክርና የሕግ መሳሪያዎች',
      titleOm: 'Abukaatoota, Gorsa fi Meeshaalee Seeraa',
      titleEn: 'Lawyers, Consultation & Tools',
      items: [
        {
          id: 'lawyers',
          icon: Users,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
          titleAm: 'የተመዘገቡ ጠበቆች ማውጫ',
          titleOm: 'Galmee Abukaatootaa',
          titleEn: 'Find Licensed Lawyers',
          descAm: 'ፈቃድ ያላቸውን ጠበቆች፣ የሥራ ቦታ አድራሻና ስልክ በቀጥታ ያግኙ',
          descOm: 'Abukaatoota seera qabeeyyii, teessoo waajjiraa fi bilbila argadhaa',
          badgeAm: 'ጠበቆች',
          badgeOm: 'Abukaatoo',
        },
        {
          id: 'consultation',
          icon: Scale,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
          titleAm: 'የሕግ ምክክር',
          titleOm: 'Gorsa Seeraa',
          titleEn: 'Legal Consultation',
          descAm: 'የሕግ ችግሮችን በጥልቀት መተንተንና የማሸነፍ እድል ማወቅ',
          descOm: 'Dhimma seeraa qorachuu fi gorsa ogummaa argachuu',
        },
        {
          id: 'library',
          icon: BookOpen,
          color: 'text-teal-400',
          bgColor: 'bg-teal-500/10 border-teal-500/30',
          titleAm: 'የሕግ ቤተ-መጽሐፍትና ፍለጋ',
          titleOm: 'Mana Kitaaba Seeraa fi Barbaada',
          titleEn: 'Law Library & Search Engine',
          descAm: 'የፍትሐብሔር፣ የወንጀልና የአዋጆች ድንጋጌዎችን መፈለጊያ',
          descOm: 'Seerota Sivilii, Yakkaa fi Labsiilee Itoophiyaa barbaadaa',
        },
        {
          id: 'translator',
          icon: Languages,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10 border-cyan-500/30',
          titleAm: 'የሕግ ሰነድ ተርጓሚ',
          titleOm: 'Hiika Sanada Seeraa',
          titleEn: 'Legal Document Translator',
          descAm: 'ውሎችንና ማስረጃዎችን በአማርኛ፣ በኦሮምኛና በእንግሊዝኛ መተርጎሚያ',
          descOm: 'Waliigalteewwan fi ragaalee Afaan Oromoo, Amaariffaa fi Ingiliffaan hiikaa',
        },
      ],
    },
  ];

  // Helper to get active tab title for display
  const getActiveTabLabel = () => {
    switch (activeTab) {
      case 'consultation': return t('tabConsultation');
      case 'cases': return t('tabCases');
      case 'hearings': return t('tabHearings');
      case 'library': return t('tabLibrary');
      case 'drafter': return t('tabDrafter');
      case 'defense': return t('tabDefense');
      case 'jurisdiction': return t('tabJurisdiction');
      case 'courtFees': return t('tabCourtFees');
      case 'translator': return t('tabTranslator');
      case 'lawyers': return t('tabLawyers');
      default: return t('tabConsultation');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-900/30 text-white shadow-2xl">
        {/* Top Legal Notice & Federal Helpline & Auth Strip */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 px-3 sm:px-4 py-1.5 text-xs border-b border-amber-900/20 flex flex-wrap items-center justify-between text-slate-300 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium text-amber-300 text-[11px] sm:text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t('topStripNotice')}</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400 text-xs">
              {t('topStripCassation')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
            {/* User Auth Profile / Login Button in Top Strip */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                    title="የመለያ ዝርዝር መረጃዎችን ይመልከቱ"
                  >
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[9px]">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <span className="max-w-[110px] truncate font-bold text-white">
                      {currentUser.fullName}
                    </span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                        currentUser.role === 'lawyer'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {currentUser.role === 'lawyer' ? 'ጠበቃ' : 'ተጠቃሚ'}
                    </span>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3.5 z-50 text-slate-100 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                      <div className="border-b border-slate-800 pb-2">
                        <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{currentUser.emailOrPhone}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {currentUser.role === 'lawyer' ? 'የተረጋገጠ ሕጋዊ ጠበቃ' : 'የመድረኩ ተጠቃሚ / ደንበኛ'}
                        </span>
                      </div>

                      {currentLawyer && (
                        <div className="bg-slate-950 p-2 rounded-xl text-[11px] text-slate-300 space-y-1">
                          <div className="text-amber-300 font-mono text-[10px]">
                            ፍቃድ ቁ፦ {currentLawyer.licenseNumber}
                          </div>
                          <div className="text-slate-400 text-[10px] line-clamp-2">
                            አድራሻ፦ {currentLawyer.officeAddress}
                          </div>
                        </div>
                      )}

                      {/* Main Full Logout Button in Dropdown */}
                      <button
                        onClick={async () => {
                          await logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>🔴 ከመለያ ውጣ (Logout)</span>
                      </button>

                      <div className="pt-2 border-t border-slate-800 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400">ለሙከራ አዲስ መለያ መዝግብ፦</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={async () => {
                              await logout();
                              setIsUserDropdownOpen(false);
                              onOpenAuth('client', 'register');
                            }}
                            className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-emerald-300 border border-slate-700 cursor-pointer"
                          >
                            <UserPlus className="w-3 h-3 text-emerald-400" />
                            <span>አዲስ ተጠቃሚ</span>
                          </button>
                          <button
                            onClick={async () => {
                              await logout();
                              setIsUserDropdownOpen(false);
                              onOpenAuth('lawyer', 'register');
                            }}
                            className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 border border-slate-700 cursor-pointer"
                          >
                            <Briefcase className="w-3 h-3 text-amber-400" />
                            <span>አዲስ ጠበቃ</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">ፈጣን የሙከራ መቀየሪያ (1-Click Switch)፦</div>
                        <div className="space-y-1">
                          <button
                            onClick={async () => {
                              await login('0911000001');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 flex items-center justify-between cursor-pointer border border-slate-800"
                          >
                            <span>👤 የሙከራ ደንበኛ (ዳዊት በቀለ)</span>
                            <span className="text-[9px] text-emerald-400 font-mono">ተጠቃሚ</span>
                          </button>
                          <button
                            onClick={async () => {
                              await login('advocate.almaz@law.et');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 flex items-center justify-between cursor-pointer border border-slate-800"
                          >
                            <span>⚖️ የሙከራ ጠበቃ (አድቮኬት አልማዝ)</span>
                            <span className="text-[9px] text-amber-400 font-mono">ጠበቃ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* DIRECT PROMINENT RED LOGOUT BUTTON IN TOP BAR */}
                <button
                  onClick={async () => {
                    await logout();
                    setIsUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600/25 hover:bg-rose-600/40 text-rose-300 border border-rose-500/50 text-[11px] font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                  title="ከመለያዎ ውጣ (Logout)"
                >
                  <LogOut className="w-3 h-3 text-rose-400" />
                  <span>ውጣ (Logout)</span>
                </button>

                {/* DIRECT NEW USER REGISTRATION BUTTON IN TOP BAR */}
                <button
                  onClick={async () => {
                    await logout();
                    setIsUserDropdownOpen(false);
                    onOpenAuth('client', 'register');
                  }}
                  className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all cursor-pointer"
                  title="ይህንን ዘግተው ሌላ አዲስ ተጠቃሚ ለመመዝገብ"
                >
                  <UserPlus className="w-3 h-3 text-emerald-400" />
                  <span>+ አዲስ መዝግብ</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={async () => {
                    await loginWithGoogle('client');
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-900 text-[11px] font-bold transition-all cursor-pointer shadow-sm active:scale-95 border border-slate-200"
                  title="በGoogle አካውንትዎ በፍጥነት ይግቡ"
                >
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  onClick={() => onOpenAuth('client', 'login')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <LogIn className="w-3 h-3 text-amber-400" />
                  <span>ይግቡ (Login)</span>
                </button>
                <button
                  onClick={() => onOpenAuth('client', 'register')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-colors cursor-pointer"
                  title="አዲስ ተጠቃሚ ይመዝገቡ"
                >
                  <UserPlus className="w-3 h-3 text-emerald-400" />
                  <span>ተጠቃሚ መዝግብ</span>
                </button>
                <button
                  onClick={() => onOpenAuth('lawyer', 'register')}
                  className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors cursor-pointer"
                  title="እንደ ጠበቃ ይመዝገቡ"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>የጠበቃ ምዝገባ</span>
                </button>
                <button
                  onClick={async () => {
                    await login('0911000001');
                  }}
                  className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                  title="በሙከራ ተጠቃሚ በፍጥነት ይግቡ"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>⚡ የሙከራ ደንበኛ</span>
                </button>
                <button
                  onClick={async () => {
                    await login('advocate.almaz@law.et');
                  }}
                  className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                  title="በሙከራ ጠበቃ በፍጥነት ይግቡ"
                >
                  <Briefcase className="w-3 h-3 text-amber-400" />
                  <span>⚡ የሙከራ ጠበቃ</span>
                </button>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800/90 rounded-md p-0.5 border border-slate-700">
              <div className="px-1 py-0.5 text-amber-400 flex items-center">
                <Globe className="w-3 h-3" />
              </div>
              <button
                onClick={() => setLanguage('am')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition-colors ${
                  language === 'am'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="አማርኛ"
              >
                አማርኛ
              </button>
              <button
                onClick={() => setLanguage('om')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition-colors ${
                  language === 'om'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Afaan Oromoo"
              >
                Afaan Oromoo
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {onOpenAboutCompany && (
              <button
                onClick={onOpenAboutCompany}
                className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer text-[11px] sm:text-xs"
                title="ስለ ሲስተሙ አበልጻጊ (ውሽዬ ሶፍትዌር ሶሉሽን)"
              >
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">ውሽዬ ሶፍትዌር ሶሉሽን</span>
              </button>
            )}

            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer text-[11px] sm:text-xs"
              title="የአጠቃቀም መመሪያ"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('userGuide')}</span>
            </button>
          </div>
        </div>

        {/* Main Masthead */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0"
            onClick={() => setActiveTab('consultation')}
          >
            <JusticeLogo size={48} className="sm:w-[54px] sm:h-[54px]" />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white font-serif leading-tight">
                  {t('appTitle')}
                </h1>
                <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  {t('appBadge')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-slate-400 line-clamp-1 hidden sm:block">
                  {t('appSubtitle')}
                </p>
                {/* Current Active Tab Pill on Mobile */}
                <div className="sm:hidden flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-slate-400">ክፍል፡</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    activeTab === 'defense'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : activeTab === 'lawyers'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {getActiveTabLabel()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('consultation')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'consultation'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5 shrink-0" />
              <span>{t('tabConsultation')}</span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'cases'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 shrink-0" />
              <span>{t('tabCases')}</span>
              {caseCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'cases' ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-slate-700 text-slate-200'
                }`}>
                  {caseCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('hearings')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'hearings'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{t('tabHearings')}</span>
              {hearingCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                  activeTab === 'hearings' ? 'bg-slate-950 text-amber-400 font-bold' : 'bg-emerald-600/60 text-emerald-200'
                }`}>
                  {hearingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('drafter')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'drafter'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t('tabDrafter')}</span>
            </button>

            <button
              onClick={() => setActiveTab('defense')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'defense'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{t('tabDefense')}</span>
            </button>

            <button
              onClick={() => setActiveTab('lawyers')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'lawyers'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800 bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{t('tabLawyers')}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                activeTab === 'lawyers' ? 'bg-slate-950 text-amber-400' : 'bg-amber-400 text-slate-950'
              }`}>
                አድራሻ
              </span>
            </button>

            <button
              onClick={() => setActiveTab('jurisdiction')}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'jurisdiction'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{t('tabJurisdiction')}</span>
            </button>

            <button
              onClick={() => setActiveTab('courtFees')}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'courtFees'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t('tabCourtFees')}</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{t('tabLibrary')}</span>
            </button>

            <button
              onClick={() => setActiveTab('translator')}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'translator'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{t('tabTranslator')}</span>
            </button>
          </nav>

          {/* Mobile & Tablet Trigger & Quick Logout Button */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2">
            {currentUser && (
              <button
                type="button"
                onClick={async () => {
                  await logout();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/35 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                title="ከመለያዎ ውጣ (Logout)"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>ውጣ</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-amber-400 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{isOromo ? 'Menuu' : isEnglish ? 'Menu' : 'ሜኑ (Menu)'}</span>
              {(caseCount > 0 || hearingCount > 0) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-IN NAVIGATION DRAWER (MENU) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 text-slate-100">
              
              {/* Drawer Top Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-2.5">
                  <JusticeLogo size={36} />
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white font-serif">
                      {isOromo ? 'Menuu Tajaajila Seeraa' : 'የሕግ አገልግሎቶች ሜኑ'}
                    </h2>
                    <p className="text-[10px] text-slate-400">
                      {isOromo ? 'Filannoowwan fi kutaalee hundumaa' : 'ሁሉንም 10ሩን ክፍሎችና መሳሪያዎች ይምረጡ'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 sm:p-5 space-y-6 flex-1">
                {/* User Auth Card in Drawer */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  {currentUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                            {currentUser.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                              {currentUser.emailOrPhone}
                            </span>
                            <span className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              currentUser.role === 'lawyer'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {currentUser.role === 'lawyer' ? 'ሕጋዊ ጠበቃ' : 'የመድረክ ተጠቃሚ'}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                          ገባ
                        </span>
                      </div>

                      {currentLawyer && (
                        <div className="bg-slate-900 p-2 rounded-xl text-[10px] text-slate-300 border border-slate-800 space-y-0.5">
                          <div className="text-amber-300 font-mono">
                            ፍቃድ ቁ፦ {currentLawyer.licenseNumber}
                          </div>
                          <div className="text-slate-400 line-clamp-1">
                            አድራሻ፦ {currentLawyer.officeAddress}
                          </div>
                        </div>
                      )}

                      {/* Prominent Full-Width Red Logout Button */}
                      <button
                        onClick={async () => {
                          await logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>🔴 ከመለያው ውጣ (Logout)</span>
                      </button>

                      {/* Register New User / Lawyer Buttons for Easy Testing */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 block">
                          ለሙከራ አዲስ መለያ መዝግብ፦
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={async () => {
                              await logout();
                              setIsMobileMenuOpen(false);
                              onOpenAuth('client', 'register');
                            }}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-emerald-300 hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                            <span>+ አዲስ ተጠቃሚ</span>
                          </button>
                          <button
                            onClick={async () => {
                              await logout();
                              setIsMobileMenuOpen(false);
                              onOpenAuth('lawyer', 'register');
                            }}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-amber-300 hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                            <span>+ አዲስ ጠበቃ</span>
                          </button>
                        </div>
                      </div>

                      {/* Quick 1-click test switchers */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block">
                          ፈጣን የሙከራ መቀየሪያ (1-Click Switch)፦
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={async () => {
                              await login('0911000001');
                              setIsMobileMenuOpen(false);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-200 text-left cursor-pointer"
                          >
                            👤 ሙከራ ደንበኛ
                          </button>
                          <button
                            onClick={async () => {
                              await login('advocate.almaz@law.et');
                              setIsMobileMenuOpen(false);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-amber-300 text-left cursor-pointer"
                          >
                            ⚖️ ሙከራ ጠበቃ
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold text-slate-300 block">
                        መለያ ይምረጡ ወይም አዲስ ይመዝገቡ፦
                      </span>

                      {/* Google Sign In in Drawer */}
                      <button
                        onClick={async () => {
                          setIsMobileMenuOpen(false);
                          await loginWithGoogle('client');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>በGoogle አካውንት በፍጥነት ይግቡ</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onOpenAuth('client', 'login');
                          }}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300 hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <LogIn className="w-3.5 h-3.5 text-amber-400" />
                          <span>ይግቡ (Login)</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onOpenAuth('client', 'register');
                          }}
                          className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>ተጠቃሚ መዝግብ</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onOpenAuth('lawyer', 'register');
                          }}
                          className="p-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 text-[11px] font-bold hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>የጠበቃ ምዝገባ</span>
                        </button>
                        <button
                          onClick={async () => {
                            await login('0911000001');
                            setIsMobileMenuOpen(false);
                          }}
                          className="p-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>የሙከራ ግባ</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Categorized Menu Sections */}
                {menuSections.map((section, sIdx) => {
                  const sectionTitle = isOromo ? section.titleOm : isEnglish ? section.titleEn : section.titleAm;
                  return (
                    <div key={sIdx} className="space-y-2">
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        {sectionTitle}
                      </h3>

                      <div className="space-y-1.5">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isCurrent = activeTab === item.id;
                          const title = isOromo ? item.titleOm : isEnglish ? item.titleEn : item.titleAm;
                          const desc = isOromo ? item.descOm : item.descAm;
                          const badge = isOromo ? item.badgeOm : item.badgeAm;

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectTab(item.id)}
                              className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer group ${
                                isCurrent
                                  ? item.id === 'defense'
                                    ? 'bg-rose-950/60 border-rose-500 text-white shadow-md shadow-rose-950/50'
                                    : 'bg-amber-950/60 border-amber-500 text-white shadow-md shadow-amber-950/50'
                                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                  isCurrent
                                    ? item.id === 'defense'
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-amber-500 text-slate-950 font-bold'
                                    : `${item.bgColor} ${item.color}`
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <strong
                                    className={`text-xs font-bold truncate ${
                                      isCurrent ? 'text-white' : 'text-slate-200 group-hover:text-white'
                                    }`}
                                  >
                                    {title}
                                  </strong>

                                  {badge && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                                      {badge}
                                    </span>
                                  )}

                                  {item.count !== undefined && item.count > 0 && (
                                    <span
                                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                        isCurrent
                                          ? 'bg-slate-950 text-amber-400'
                                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      }`}
                                    >
                                      {item.count}
                                    </span>
                                  )}
                                </div>

                                <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                                  {desc}
                                </p>
                              </div>

                              <ChevronRight className={`w-4 h-4 shrink-0 mt-2 transition-transform group-hover:translate-x-0.5 ${
                                isCurrent ? 'text-white' : 'text-slate-600'
                              }`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Mobile Language Switcher Inside Drawer */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isOromo ? 'Afaan Jijjiirraa:' : 'ቋንቋ ይምረጡ (Select Language):'}</span>
                  </span>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => setLanguage('am')}
                      className={`py-2 px-2 rounded-xl font-bold text-center transition-all cursor-pointer ${
                        language === 'am'
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      አማርኛ
                    </button>
                    <button
                      onClick={() => setLanguage('om')}
                      className={`py-2 px-2 rounded-xl font-bold text-center transition-all cursor-pointer ${
                        language === 'om'
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      Oromoo
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`py-2 px-2 rounded-xl font-bold text-center transition-all cursor-pointer ${
                        language === 'en'
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* User Guide Button in Drawer */}
                <div className="space-y-2">
                  {onOpenAboutCompany && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenAboutCompany();
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      <Building className="w-4 h-4 text-amber-400" />
                      <span>ስለ አበልጻጊው (ውሽዬ ሶፍትዌር ሶሉሽን)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenHelp();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>{t('userGuide')}</span>
                  </button>
                </div>
              </div>

              {/* Drawer Bottom Emergency Call Strip */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/90 text-xs flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>የፍርድ ቤት መስመር፡</span>
                </span>
                <strong className="text-emerald-300 font-mono">991 / 8080</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION DOCK (Thumb Ergonomics) */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-[10px]">
          {/* 1. Legal Consultation */}
          <button
            onClick={() => setActiveTab('consultation')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'consultation'
                ? 'text-amber-400 font-bold bg-amber-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4 mb-0.5" />
            <span className="truncate">{isOromo ? 'Gorsa' : 'ምክክር'}</span>
          </button>

          {/* 2. Defense Drafter (For Defendant) */}
          <button
            onClick={() => setActiveTab('defense')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'defense'
                ? 'text-rose-400 font-bold bg-rose-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 mb-0.5 text-rose-400" />
            <span className="truncate">{isOromo ? 'Deebii' : 'መከላከያ'}</span>
          </button>

          {/* 3. Plaint Drafter (For Plaintiff) */}
          <button
            onClick={() => setActiveTab('drafter')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'drafter'
                ? 'text-amber-400 font-bold bg-amber-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="truncate">{isOromo ? 'Himannaa' : 'ክስ'}</span>
          </button>

          {/* 4. Lawyers Directory */}
          <button
            onClick={() => setActiveTab('lawyers')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'lawyers'
                ? 'text-amber-400 font-bold bg-amber-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="truncate">{isOromo ? 'Abukaatoo' : 'ጠበቆች'}</span>
          </button>

          {/* 5. Full Menu Drawer Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
              isMobileMenuOpen
                ? 'text-amber-300 font-bold bg-slate-800'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="truncate">{isOromo ? 'Menuu' : 'ሜኑ'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
