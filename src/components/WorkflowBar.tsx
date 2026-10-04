import React, { useState } from 'react';
import {
  Scale,
  Building,
  Calculator,
  FileText,
  ShieldAlert,
  Calendar,
  FolderKanban,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  UserCheck,
  Shield
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type UserLegalRole = 'plaintiff' | 'defendant' | 'general';
export type AppTabType = 'consultation' | 'cases' | 'hearings' | 'library' | 'drafter' | 'defense' | 'translator' | 'jurisdiction' | 'courtFees' | 'lawyers';

interface WorkflowBarProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  caseCount: number;
  hearingCount: number;
}

export const WorkflowBar: React.FC<WorkflowBarProps> = ({
  activeTab,
  onSelectTab,
  caseCount,
  hearingCount,
}) => {
  const { isOromo, isEnglish } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Automatically determine active role or let user toggle
  const [role, setRole] = useState<UserLegalRole>(() => {
    if (activeTab === 'defense') return 'defendant';
    if (activeTab === 'drafter') return 'plaintiff';
    return 'plaintiff';
  });

  // Switch role if tab changes to defense or drafter
  React.useEffect(() => {
    if (activeTab === 'defense' && role !== 'defendant') {
      setRole('defendant');
    } else if (activeTab === 'drafter' && role !== 'plaintiff') {
      setRole('plaintiff');
    }
  }, [activeTab]);

  // Plaintiff Flow Steps
  const plaintiffSteps = [
    {
      id: 'consultation',
      num: 1,
      tab: 'consultation' as const,
      icon: Scale,
      titleAm: 'የሕግ ምክክር',
      titleOm: 'Gorsa Seeraa',
      titleEn: 'Legal Consult',
      descAm: 'የችግሩን ሁኔታና ጥንካሬ ይተንትኑ',
      descOm: 'Dhimma qoradhaa',
    },
    {
      id: 'jurisdiction',
      num: 2,
      tab: 'jurisdiction' as const,
      icon: Building,
      titleAm: 'ፍርድ ቤት መለያ',
      titleOm: 'Aangoo Mana Murtii',
      titleEn: 'Jurisdiction',
      descAm: 'ተገቢው ፍርድ ቤትና ችሎት',
      descOm: 'Mana murtii sirrii',
    },
    {
      id: 'courtFees',
      num: 3,
      tab: 'courtFees' as const,
      icon: Calculator,
      titleAm: 'የዳኝነት ክፍያ',
      titleOm: 'Kaffaltii Abbaa Seerummaa',
      titleEn: 'Court Fee',
      descAm: 'የዳኝነት ክፍያና መጥሪያ ስሌት',
      descOm: 'Shallaggii kaffaltii',
    },
    {
      id: 'drafter',
      num: 4,
      tab: 'drafter' as const,
      icon: FileText,
      titleAm: 'ክስ መመስረቻ',
      titleOm: 'Qophii Himannaa',
      titleEn: 'Draft Plaint',
      descAm: 'ይፋዊ የክስ ወረቀት ያዘጋጁ',
      descOm: 'Waraqaa himannaa',
    },
    {
      id: 'cases',
      num: 5,
      tab: 'cases' as const,
      icon: FolderKanban,
      titleAm: 'መዝገብና ክትትል',
      titleOm: 'To\'annoo Galmee',
      titleEn: 'Case Center',
      descAm: 'የክሱን ሂደትና ቀጠሮዎች ይከታተሉ',
      descOm: 'Adeemsa hordofaa',
    },
  ];

  // Defendant Flow Steps
  const defendantSteps = [
    {
      id: 'defense',
      num: 1,
      tab: 'defense' as const,
      icon: ShieldAlert,
      titleAm: 'ሰነድ/ጽሑፍ ማስገባት',
      titleOm: 'Sanada/Barruu Galchuu',
      titleEn: 'Upload Lawsuit',
      descAm: 'የደረሰዎትን የክስ ወረቀት ያስገቡ',
      descOm: 'Waraqaa himannaa galchaa',
    },
    {
      id: 'jurisdiction',
      num: 2,
      tab: 'jurisdiction' as const,
      icon: Building,
      titleAm: 'የስልጣን መቃወሚያ',
      titleOm: 'Mormii Aangoo',
      titleEn: 'Jurisdiction Check',
      descAm: 'ፍርድ ቤቱ ስልጣን እንዳለው ያረጋግጡ',
      descOm: 'Aangoo qabaachuu mirkaneessaa',
    },
    {
      id: 'courtFees',
      num: 3,
      tab: 'courtFees' as const,
      icon: Calculator,
      titleAm: 'የወጪ/ኪሳራ ስሌት',
      titleOm: 'Baasii fi Kasaaraa',
      titleEn: 'Costs / Counterclaim',
      descAm: 'የመልሶ ክስ ወይም ወጪ ስሌት',
      descOm: 'Baasii abukaatoo',
    },
    {
      id: 'defense_draft',
      num: 4,
      tab: 'defense' as const,
      icon: Shield,
      titleAm: 'የመከላከያ መልስ',
      titleOm: 'Deebii Himatamaa',
      titleEn: 'Statement of Defense',
      descAm: 'ይፋዊ የመከላከያ መልስ ያዘጋጁ',
      descOm: 'Waraqaa deebii xumuraa',
    },
    {
      id: 'hearings',
      num: 5,
      tab: 'hearings' as const,
      icon: Calendar,
      titleAm: 'የመልስ ቀጠሮ መከታተል',
      titleOm: 'Beellama Deebii',
      titleEn: 'Hearing Tracker',
      descAm: 'የፍርድ ቤት ቀጠሮዎን ይመዝግቡ',
      descOm: 'Beellama galmeessaa',
    },
  ];

  const currentSteps = role === 'defendant' ? defendantSteps : plaintiffSteps;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md transition-all">
      {/* Top Bar: Role Selector & Expand/Collapse Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isOromo ? 'Imala Seeraa (Workflow):' : 'የሕግ ጉዞ ቅደም-ተከተል (Workflow):'}</span>
          </span>

          {/* Role Pill Switcher */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => {
                setRole('plaintiff');
                if (activeTab === 'defense') onSelectTab('drafter');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                role === 'plaintiff'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Ani Himataadha (Plaintiff)' : 'ከሳሽ ነኝ (Plaintiff)'}</span>
            </button>

            <button
              onClick={() => {
                setRole('defendant');
                if (activeTab === 'drafter') onSelectTab('defense');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                role === 'defendant'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Ani Himatamaadha (Defendant)' : 'ተከሳሽ ነኝ (Defendant)'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
          <span className="text-[11px] text-slate-400 hidden md:inline">
            {role === 'plaintiff'
              ? isOromo
                ? 'Imala Himannaa: Qorannoo ➔ Aangoo ➔ Kaffaltii ➔ Himannaa ➔ To\'annoo'
                : 'የከሳሽ ጉዞ፡ ምክክር ➔ ስልጣን ➔ ክፍያ ➔ ክስ ማዘጋጀት ➔ መዝገብ'
              : isOromo
                ? 'Imala Himatamaa: Sanada ➔ Mormii Aangoo ➔ Deebii ➔ Beellama'
                : 'የተከሳሽ ጉዞ፡ ሰነድ ማስገባት ➔ ስልጣን መቃወሚያ ➔ የመከላከያ መልስ ➔ ቀጠሮ'}
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
            title={isExpanded ? 'አሳንስ' : 'ዘርጋ'}
          >
            {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{isExpanded ? (isOromo ? 'Xiqqeessi' : 'አሳንስ') : (isOromo ? 'Barsiisi' : 'የጉዞ ቅደም-ተከተል አሳይ')}</span>
          </button>
        </div>
      </div>

      {/* Expanded Interactive Stepper Pipeline */}
      {isExpanded && (
        <div className="pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {currentSteps.map((s, idx) => {
              const Icon = s.icon;
              const isCurrent = activeTab === s.tab;
              const stepTitle = isOromo ? s.titleOm : isEnglish ? s.titleEn : s.titleAm;
              const stepDesc = isOromo ? s.descOm : s.descAm;

              return (
                <button
                  key={idx}
                  onClick={() => onSelectTab(s.tab)}
                  className={`group relative text-left p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? role === 'defendant'
                        ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-950/50 ring-1 ring-rose-500/50'
                        : 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-950/50 ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                          isCurrent
                            ? role === 'defendant'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                        }`}
                      >
                        {s.num}
                      </span>
                      {s.tab === 'cases' && caseCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          {caseCount}
                        </span>
                      )}
                      {s.tab === 'hearings' && hearingCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                          {hearingCount}
                        </span>
                      )}
                    </div>

                    <Icon
                      className={`w-4 h-4 ${
                        isCurrent
                          ? role === 'defendant'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                          : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                  </div>

                  <div>
                    <strong
                      className={`block text-xs font-bold leading-snug line-clamp-1 ${
                        isCurrent ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {stepTitle}
                    </strong>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 hidden sm:block">
                      {stepDesc}
                    </span>
                  </div>

                  {/* Active Indicator Bar */}
                  {isCurrent && (
                    <div
                      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                        role === 'defendant' ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
