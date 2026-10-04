import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  User,
  CheckSquare,
  Square,
  Printer,
  Download,
  Filter,
  Share2,
  CalendarCheck,
  ChevronRight,
  Sparkles,
  Bell,
  BellRing,
  Volume2,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Building,
  Check,
  Copy,
  Info,
  ShieldAlert,
  FileText,
  FolderKanban,
} from 'lucide-react';
import { CourtHearing, ManagedCase, HearingType } from '../types/legal';
import { useLanguage } from '../context/LanguageContext';

interface HearingTrackerProps {
  hearings: CourtHearing[];
  cases: ManagedCase[];
  onUpdateHearing: (updatedHearing: CourtHearing) => void;
  onCreateHearing: (newHearing: CourtHearing) => void;
  onDeleteHearing: (hearingId: string) => void;
  filterByCaseId?: string | null;
  onNavigateToCase?: (caseId: string) => void;
  onNavigateToDefense?: (caseData: any) => void;
  onNavigateToDrafter?: (caseData: any) => void;
}

export const HearingTracker: React.FC<HearingTrackerProps> = ({
  hearings,
  cases,
  onUpdateHearing,
  onCreateHearing,
  onDeleteHearing,
  filterByCaseId,
  onNavigateToCase,
  onNavigateToDefense,
  onNavigateToDrafter,
}) => {
  const { t, isOromo, isEnglish } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjournModal, setShowAdjournModal] = useState<CourtHearing | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>(filterByCaseId || 'all');
  const [browserNotificationAllowed, setBrowserNotificationAllowed] = useState(false);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  // New Hearing Form State
  const [newCaseId, setNewCaseId] = useState(cases[0]?.id || '');
  const [newDate, setNewDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState(isOromo ? 'Ganama 3:30' : 'ጠዋት 3:30');
  const [newCourt, setNewCourt] = useState(
    isOromo ? 'Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Lidataa' : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ'
  );
  const [newBench, setNewBench] = useState(isOromo ? 'Dhaaddacha Sivilii 3ffaa' : '3ኛ የፍትሐብሔር ችሎት');
  const [newRoomNumber, setNewRoomNumber] = useState(isOromo ? 'Galma 12 (Kutaa 204)' : 'አዳራሽ 12 (ቢሮ 204)');
  const [newJudge, setNewJudge] = useState('');
  const [newAdvocate, setNewAdvocate] = useState('');
  const [newHearingType, setNewHearingType] = useState<HearingType>('witness');
  const [newPurpose, setNewPurpose] = useState(
    isOromo ? 'Dhugaa-baatota himataa dhagahuu' : 'የከሳሽ ምስክሮች መስማት'
  );
  const [newChecklistText, setNewChecklistText] = useState(
    isOromo
      ? "Sanada ragaa duraa qabachuu\nDhugaa-baatota yeroon geessuu\nNageetti kaffaltii askuutaa qabachuu"
      : 'የሰነዶች ኦሪጅናል ይዞ መገኘት\nምስክሮችን በጊዜ ማድረስ\nየዳኝነት ክፍያ ማህተም ደረሰኝ መያዝ'
  );
  const [remindDaysBefore, setRemindDaysBefore] = useState<number[]>([7, 3, 1, 0]);

  // Adjournment State
  const [adjournNewDate, setAdjournNewDate] = useState('');
  const [adjournNewTime, setAdjournNewTime] = useState(isOromo ? 'Ganama 3:30' : 'ጠዋት 3:30');
  const [adjournReason, setAdjournReason] = useState(
    isOromo ? 'Abbaa seeraa walga\'ii qabaachuu isaatiin' : 'ዳኛ በስብሰባ ምክንያት'
  );

  // Check browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setBrowserNotificationAllowed(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setBrowserNotificationAllowed(true);
        new Notification(isOromo ? 'Humna Abukaatoo - Yaaddachiisni Banameera!' : 'የጠበቃው ጉልበት - ማሳሰቢያ ነቅቷል!', {
          body: isOromo 
            ? 'Beellamni mana murtii keessanii yoo dhiyaatu yaadachiisni ni ergama.'
            : 'የፍርድ ቤት ቀጠሮዎችዎ ሲቃረቡ ማሳሰቢያ ይደርስዎታል።',
          icon: '/favicon.ico',
        });
      }
    }
  };

  const playNotificationChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  const getDaysRemaining = (hearingDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(hearingDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleToggleChecklist = (hearing: CourtHearing, itemIndex: number) => {
    const updatedChecklist = hearing.preparationChecklist.map((item, idx) => {
      if (idx === itemIndex) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    const updated: CourtHearing = {
      ...hearing,
      preparationChecklist: updatedChecklist,
    };

    onUpdateHearing(updated);
  };

  const handleShareHearing = (hearing: CourtHearing) => {
    const shareText = isOromo
      ? `Beellama Mana Murtii:
Galmee: ${hearing.caseNumber}
Mata-duree: ${hearing.caseTitle}
Guyyaa: ${hearing.date} (${hearing.timeAmharic})
Mana Murtii: ${hearing.court}
Dhaaddacha: ${hearing.bench}
Kutaa: ${hearing.roomNumber || '-'}
Kaayyoo: ${hearing.hearingPurpose}`
      : `የፍርድ ቤት ቀጠሮ መረጃ፡
መዝገብ ቁጥር፡ ${hearing.caseNumber}
ጉዳዩ፡ ${hearing.caseTitle}
የቀጠሮ ቀን፡ ${hearing.date} (${hearing.timeAmharic})
ፍርድ ቤት፡ ${hearing.court}
ችሎት፡ ${hearing.bench}
አዳራሽ፡ ${hearing.roomNumber || '-'}
የቀጠሮ ዓላማ፡ ${hearing.hearingPurpose}`;

    navigator.clipboard.writeText(shareText);
    setCopiedShareId(hearing.id);
    setTimeout(() => setCopiedShareId(null), 2500);
  };

  const handleAdjournSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAdjournModal || !adjournNewDate) return;

    // Mark current hearing as adjourned
    const currentUpdated: CourtHearing = {
      ...showAdjournModal,
      status: 'adjourned',
      adjournmentReason: adjournReason,
    };
    onUpdateHearing(currentUpdated);

    // Create next hearing automatically
    const nextHearing: CourtHearing = {
      id: `h-${Date.now()}`,
      caseId: showAdjournModal.caseId,
      caseTitle: showAdjournModal.caseTitle,
      caseNumber: showAdjournModal.caseNumber,
      date: adjournNewDate,
      timeAmharic: adjournNewTime,
      court: showAdjournModal.court,
      bench: showAdjournModal.bench,
      roomNumber: showAdjournModal.roomNumber,
      judgeName: showAdjournModal.judgeName,
      hearingType: showAdjournModal.hearingType,
      hearingPurpose: showAdjournModal.hearingPurpose,
      preparationChecklist: showAdjournModal.preparationChecklist.map(c => ({ ...c, completed: false })),
      status: 'upcoming',
      notes: isOromo 
        ? `Beellama darbe ${showAdjournModal.date} irraa sababa '${adjournReason}' tiin kan darbe.`
        : `ከቀዳሚው ቀጠሮ (${showAdjournModal.date}) በ${adjournReason} ምክንያት የተሸጋገረ።`,
    };

    onCreateHearing(nextHearing);
    setShowAdjournModal(null);
    setAdjournNewDate('');
  };

  const handleCreateHearingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parentCase = cases.find(c => c.id === newCaseId);

    const checklistItems = newChecklistText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean)
      .map(item => ({ item, completed: false }));

    const created: CourtHearing = {
      id: `h-${Date.now()}`,
      caseId: newCaseId,
      caseTitle: parentCase?.title || (isOromo ? 'Dhimma Himannaa' : 'የክስ ጉዳይ'),
      caseNumber: parentCase?.caseNumber || (isOromo ? 'F/M/D 12345/16' : 'ፌ/መ/ደ 12345/16'),
      date: newDate,
      timeAmharic: newTime,
      court: newCourt,
      bench: newBench,
      roomNumber: newRoomNumber,
      judgeName: newJudge,
      hearingType: newHearingType,
      hearingPurpose: newPurpose || (isOromo ? 'Ragaa dhagahuu fi murtii kennuu' : 'የቀረቡ ማስረጃዎችን መመርመር'),
      preparationChecklist: checklistItems.length > 0 ? checklistItems : [
        { item: isOromo ? 'Sanadoota qabachuu' : 'የሰነዶች ኦሪጅናል ይዞ መገኘት', completed: false },
        { item: isOromo ? 'Dhugaa-baatota qopheessuu' : 'ምስክሮችን ማዘጋጀት', completed: false }
      ],
      assignedAdvocate: newAdvocate,
      status: 'upcoming',
    };

    onCreateHearing(created);
    setShowAddModal(false);
  };

  // Filter hearings
  const filteredHearings = hearings.filter(h => {
    const matchesStatus = filterStatus === 'all' || h.status === filterStatus;
    const matchesCase = selectedCaseFilter === 'all' || h.caseId === selectedCaseFilter;
    return matchesStatus && matchesCase;
  });

  const urgentHearings = hearings.filter(h => {
    if (h.status !== 'upcoming') return false;
    const days = getDaysRemaining(h.date);
    return days >= 0 && days <= 5;
  });

  // Calendar .ics export generator
  const exportToICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Advocate Power Legal Tech//Ethiopian Court Calendar//AM\n";
    filteredHearings.forEach(h => {
      const dt = h.date.replace(/-/g, '');
      icsContent += `BEGIN:VEVENT\nSUMMARY:${h.caseNumber} - ${h.hearingPurpose}\nDESCRIPTION:${h.caseTitle} (${h.court} - ${h.bench})\nLOCATION:${h.court} ${h.roomNumber || ''}\nDTSTART;VALUE=DATE:${dt}\nDTEND;VALUE=DATE:${dt}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Ethiopian_Court_Hearings_${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            <span>{t('hearingsTitle')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('hearingsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!browserNotificationAllowed && (
            <button
              onClick={requestNotificationPermission}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Yaadachiisa Bani' : 'ማሳሰቢያ አብራ'}</span>
            </button>
          )}

          <button
            onClick={exportToICS}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Calendar export (.ics)"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isOromo ? 'Kaalaandariitti (.ics)' : 'ወደ ካላንደር ላክ (.ics)'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{isOromo ? 'Maxxansi' : 'የቀጠሮ ዶኬት አትም'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addHearingBtn')}</span>
          </button>
        </div>
      </div>

      {/* Urgent Hearings Alert Banner */}
      {urgentHearings.length > 0 && (
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/60 p-4 rounded-2xl border border-red-500/50 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>
                {isOromo 
                  ? `Akeekkachiisa Beellama Ariifachiisaa (${urgentHearings.length} beellamoota dhufan)`
                  : `አስቸኳይ የቀጠሮ ማሳሰቢያ (${urgentHearings.length} መጪ ቀጠሮዎች)`}
              </span>
            </div>
            <button
              onClick={playNotificationChime}
              className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> {isOromo ? 'Sagalee Mokkori' : 'ድምጽ ሞክር'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {urgentHearings.map(uh => {
              const days = getDaysRemaining(uh.date);
              return (
                <div
                  key={uh.id}
                  className="bg-slate-900/90 p-3 rounded-xl border border-red-500/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 truncate">{uh.caseNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300">
                      {days === 0 ? (isOromo ? 'Har\'a!' : 'ዛሬ!') : days === 1 ? (isOromo ? 'Boru!' : 'ነገ!') : isOromo ? `Guyyaa ${days} booda` : `ከ${days} ቀናት በኋላ`}
                    </span>
                  </div>
                  <p className="text-slate-300 truncate text-[11px]">{uh.caseTitle}</p>
                  <div className="text-[10px] text-amber-300">
                    {uh.court} • {uh.timeAmharic}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs & Case Picker */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-850 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: isOromo ? 'Beellama Hunda' : 'ሁሉም ቀጠሮዎች' },
            { id: 'upcoming', label: isOromo ? 'Kan Dhufu' : 'መጪ ቀጠሮዎች' },
            { id: 'completed', label: isOromo ? 'Xumurameera' : 'የተጠናቀቁ' },
            { id: 'adjourned', label: isOromo ? 'Kan Darbe / Jijjiirame' : 'ተለዋጭ ቀጠሮ የተሰጠባቸው' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === f.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Case Filter Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{isOromo ? 'Galmeen Calali:' : 'በመዝገብ ለይ፡'}</span>
          <select
            value={selectedCaseFilter}
            onChange={(e) => setSelectedCaseFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">{isOromo ? 'Galmee Hunda Agarsiisi' : 'ሁሉንም መዝገቦች አሳይ'}</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.title.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hearing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHearings.map(h => {
          const daysRemaining = getDaysRemaining(h.date);
          const isUrgent = daysRemaining >= 0 && daysRemaining <= 3;
          const isToday = daysRemaining === 0;
          const isPast = daysRemaining < 0;

          return (
            <div
              key={h.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between shadow-xl transition-all ${
                isToday
                  ? 'bg-slate-800 border-red-500/80 ring-2 ring-red-500/30'
                  : isUrgent
                  ? 'bg-slate-800 border-amber-500/70'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div>
                {/* Header: Date + Remaining Days Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">
                      {h.date}
                    </span>
                    <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {h.timeAmharic}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight ${
                      isToday
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                        : isUrgent
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isPast
                        ? 'bg-slate-700 text-slate-400'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isToday
                      ? (isOromo ? 'Har\'a!' : 'ዛሬ!')
                      : daysRemaining === 1
                      ? (isOromo ? 'Boru!' : 'ነገ!')
                      : daysRemaining > 1
                      ? (isOromo ? `Guyyaa ${daysRemaining} hafe` : `${daysRemaining} ቀናት ቀሩ`)
                      : (isOromo ? 'Darbeera' : 'አልፏል')}
                  </span>
                </div>

                {/* Case Title & Docket Number */}
                <div className="space-y-1 mb-3">
                  <span className="text-xs font-mono font-bold text-amber-300/90 block">
                    {h.caseNumber}
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-2 font-serif leading-snug">
                    {h.caseTitle}
                  </h4>
                </div>

                {/* Court, Bench & Room Details */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{h.court}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{h.bench}</span>
                    {h.roomNumber && <span className="font-mono text-amber-400/90">{h.roomNumber}</span>}
                  </div>

                  {h.judgeName && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{isOromo ? 'Abbaa Seeraa:' : 'ዳኛ፡'} {h.judgeName}</span>
                    </div>
                  )}
                </div>

                {/* Hearing Purpose */}
                <div className="mb-3">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    {t('hearingPurpose')}:
                  </span>
                  <p className="text-xs font-medium text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 leading-snug">
                    {h.hearingPurpose}
                  </p>
                </div>

                {/* Cross-Module Quick Jump links */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                  {onNavigateToCase && h.caseId && (
                    <button
                      onClick={() => onNavigateToCase(h.caseId)}
                      className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-750 text-slate-300 text-[10px] font-semibold border border-slate-700/80 flex items-center gap-1 transition-colors cursor-pointer"
                      title="ወደ ክስ መዝገቡ ዝርዝር ይሂዱ"
                    >
                      <FolderKanban className="w-3 h-3 text-amber-400" />
                      <span>{isOromo ? 'Galmee Ilaali' : 'መዝገቡን ክፈት'}</span>
                    </button>
                  )}

                  {onNavigateToDefense && (
                    <button
                      onClick={() => onNavigateToDefense({
                        courtName: h.court,
                        benchName: h.bench,
                        caseNumber: h.caseNumber,
                        claimText: h.hearingPurpose,
                      })}
                      className="px-2 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[10px] font-semibold border border-rose-800/50 flex items-center gap-1 transition-colors cursor-pointer"
                      title="ለዚህ ቀጠሮ የመከላከያ መልስ አዘጋጅ"
                    >
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                      <span>{isOromo ? 'Deebii Qopheessi' : 'የመከላከያ መልስ አዘጋጅ'}</span>
                    </button>
                  )}

                  {onNavigateToDrafter && (
                    <button
                      onClick={() => onNavigateToDrafter({
                        courtName: h.court,
                        benchName: h.bench,
                        claimCategory: h.caseTitle,
                      })}
                      className="px-2 py-1 rounded-md bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-[10px] font-semibold border border-amber-800/50 flex items-center gap-1 transition-colors cursor-pointer"
                      title="የክስ ማመልከቻ ሰነድ ይመልከቱ"
                    >
                      <FileText className="w-3 h-3 text-amber-400" />
                      <span>{isOromo ? 'Waraqaa Himannaa' : 'ክስ ማመልከቻ'}</span>
                    </button>
                  )}
                </div>

                {/* Preparation Checklist */}
                {h.preparationChecklist && h.preparationChecklist.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                      <span>{t('checklistTitle')}</span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {h.preparationChecklist.filter(c => c.completed).length} / {h.preparationChecklist.length}
                      </span>
                    </span>

                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {h.preparationChecklist.map((c, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleToggleChecklist(h, idx)}
                          className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-900/50 cursor-pointer text-xs transition-colors"
                        >
                          {c.completed ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                          )}
                          <span
                            className={`text-[11px] leading-tight ${
                              c.completed ? 'line-through text-slate-500' : 'text-slate-300'
                            }`}
                          >
                            {c.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons at Card Bottom */}
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleShareHearing(h)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title={isOromo ? "Odeeffannoo beellamaa garagalchi" : "የቀጠሮ መረጃ ቅዳ"}
                  >
                    {copiedShareId === h.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteHearing(h.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
                    title={isOromo ? "Beellama haqi" : "ቀጠሮ ሰርዝ"}
                  >
                    <RotateCcw className="w-3.5 h-3.5 rotate-45" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {h.status === 'upcoming' && (
                    <button
                      onClick={() => setShowAdjournModal(h)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title={isOromo ? "Beellama jijjiiri / dabarsi" : "ተለዋጭ ቀጠሮ አስይዝ"}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isOromo ? 'Jijjiiri' : 'ተለዋጭ'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const newStatus = h.status === 'completed' ? 'upcoming' : 'completed';
                      onUpdateHearing({ ...h, status: newStatus });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      h.status === 'completed'
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{h.status === 'completed' ? (isOromo ? 'Xumurame' : 'ተጠናቋል') : (isOromo ? 'Xumuri' : 'ተከናውኗል')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHearings.length === 0 && (
        <div className="py-20 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">
            {isOromo ? 'Beellamni galmaa\'e hin jiru' : 'ምንም ዓይነት የቀጠሮ መረጃ አልተገኘም'}
          </h4>
          <p className="text-xs text-slate-400">
            {isOromo ? 'Beellama haaraa galmeessuuf "+ Beellama Haaraa Galmeessi" kan jedhu cuqaasaa.' : 'አዲስ ቀጠሮ ለመመዝገብ «አዲስ ቀጠሮ አስይዝ» የሚለውን ይጫኑ።'}
          </p>
        </div>
      )}

      {/* Add New Hearing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>{isOromo ? 'Beellama Mana Murtii Haaraa Galmeessi' : 'አዲስ የፍርድ ቤት ቀጠሮ መመዝገቢያ'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHearingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Galmee Dhimmaa (Case Docket) *' : 'የሚመለከተው መዝገብ *'}
                </label>
                <select
                  value={newCaseId}
                  onChange={(e) => {
                    setNewCaseId(e.target.value);
                    const c = cases.find(item => item.id === e.target.value);
                    if (c) {
                      setNewCourt(c.court);
                      setNewBench(c.bench);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                >
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Guyyaa Beellamaa *' : 'የቀጠሮ ቀን *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Sa\'aatii *' : 'ሰዓት *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder={isOromo ? "Ganama 3:30" : "ጠዋት 3:30"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
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
                    {isOromo ? 'Dhaaddacha / Kutaa' : 'ችሎት / አዳራሽ'}
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
                    {isOromo ? 'Gosa Beellamaa' : 'የቀጠሮ ዓይነት'}
                  </label>
                  <select
                    value={newHearingType}
                    onChange={(e) => setNewHearingType(e.target.value as HearingType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="first_appearance">{isOromo ? 'Beellama Jalqabaa' : 'የመጀመሪያ ቀጠሮ'}</option>
                    <option value="summons_response">{isOromo ? 'Deebii Himannaa' : 'የክስ ምላሽ'}</option>
                    <option value="oral_argument">{isOromo ? 'Falmii Afaanii' : 'የቃል ክርክርና ጭብጥ'}</option>
                    <option value="witness">{isOromo ? 'Ragaa Dhagahuu' : 'የምስክሮች መስማት'}</option>
                    <option value="verdict">{isOromo ? 'Murtii / Murtee' : 'ውሳኔ / ፍርድ'}</option>
                    <option value="appeal">{isOromo ? 'Ol-iyyannoo' : 'ይግባኝ'}</option>
                    <option value="execution">{isOromo ? 'Raawwii Murtii' : 'ፍርድ አፈጻጸም'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isOromo ? 'Kutaa Dhaaddachaa' : 'የችሎት አዳራሽ / ቢሮ'}
                  </label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder={isOromo ? "Galma 12" : "አዳራሽ 12"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Kaayyoo Beellamaa *' : 'የቀጠሮው ዝርዝር ዓላማ *'}
                </label>
                <input
                  type="text"
                  required
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder={isOromo ? "fkn: Ragaalee dhagahuu fi falmii xumuruuf" : "ለምሳሌ፡ የከሳሽ ምስክሮችን ለመስማት"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Tarree Qophii Dhaaddachaa (Checklist)' : 'የችሎት ቅድመ ዝግጅት ማረጋገጫ (Checklist)'}
                </label>
                <textarea
                  rows={3}
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder={isOromo ? "Qabxii tokko sarara tokkotti galchaa..." : "በየመስመሩ አንድ ማረጋገጫ ነጥብ ያስገቡ..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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

      {/* Adjournment (ተለዋጭ ቀጠሮ) Modal */}
      {showAdjournModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <span>{isOromo ? 'Beellama Jijjiiruu / Dabarsuu (Adjourn)' : 'ተለዋጭ ቀጠሮ መስጫ (Adjourn Hearing)'}</span>
              </h3>
              <button
                onClick={() => setShowAdjournModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {isOromo 
                ? `Lakk. Galmee ${showAdjournModal.caseNumber} tiif beellama haaraa fi sababa isaa galmeessaa.`
                : `ለመዝገብ ቁጥር ${showAdjournModal.caseNumber} ተለዋጭ የፍርድ ቤት ቀጠሮ ቀንና ምክንያት ይመዝግቡ።`}
            </p>

            <form onSubmit={handleAdjournSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Guyyaa Beellama Haaraa *' : 'አዲሱ የቀጠሮ ቀን *'}
                </label>
                <input
                  type="date"
                  required
                  value={adjournNewDate}
                  onChange={(e) => setAdjournNewDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Sa\'aatii Haaraa' : 'አዲሱ ሰዓት'}
                </label>
                <input
                  type="text"
                  value={adjournNewTime}
                  onChange={(e) => setAdjournNewTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Sababa Beellamni Jijjiirameef *' : 'የተለዋጭ ቀጠሮው ምክንያት *'}
                </label>
                <select
                  value={adjournReason}
                  onChange={(e) => setAdjournReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                >
                  <option value={isOromo ? "Abbaa seeraa walga'ii qabaachuu isaatiin" : "ዳኛ በስብሰባ ወይም በእረፍት ምክንያት"}>
                    {isOromo ? "Abbaa seeraa walga'ii qabaachuu isaatiin" : "ዳኛ በስብሰባ ወይም በእረፍት ምክንያት"}
                  </option>
                  <option value={isOromo ? "Dhugaa-baatonni waan hin dhihaatiniif" : "የተከሳሽ/የከሳሽ ምስክሮች ባለመቅረባቸው"}>
                    {isOromo ? "Dhugaa-baatonni waan hin dhihaatiniif" : "የተከሳሽ/የከሳሽ ምስክሮች ባለመቅረባቸው"}
                  </option>
                  <option value={isOromo ? "Wamichi mana murtii waan hin dhaqqabneef" : "የፍርድ ቤት መጥሪያ ሰነድ ባለመድረሱ"}>
                    {isOromo ? "Wamichi mana murtii waan hin dhaqqabneef" : "የፍርድ ቤት መጥሪያ ሰነድ ባለመድረሱ"}
                  </option>
                  <option value={isOromo ? "Ragaa dabalataa dhiheessuuf" : "ተጨማሪ የጽሁፍ ማስረጃ ለማቅረብ"}>
                    {isOromo ? "Ragaa dabalataa dhiheessuuf" : "ተጨማሪ የጽሁፍ ማስረጃ ለማቅረብ"}
                  </option>
                  <option value={isOromo ? "Qorannoo fi murtiif yeroon waan barbaachiseef" : "ችሎቱ ለምርመራና ውሳኔ ጊዜ ስለወሰደ"}>
                    {isOromo ? "Qorannoo fi murtiif yeroon waan barbaachiseef" : "ችሎቱ ለምርመራና ውሳኔ ጊዜ ስለወሰደ"}
                  </option>
                  <option value={isOromo ? "Abukaatoonni waliigalteen yeroo waan gaafataniif" : "የግራ ቀኙ ጠበቆች በስምምነት ማራዘሚያ ስለጠየቁ"}>
                    {isOromo ? "Abukaatoonni waliigalteen yeroo waan gaafataniif" : "የግራ ቀኙ ጠበቆች በስምምነት ማራዘሚያ ስለጠየቁ"}
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAdjournModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  {isOromo ? 'Jijjiirraa Galmeessi' : 'ተለዋጭ ቀጠሮ መዝግብ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
