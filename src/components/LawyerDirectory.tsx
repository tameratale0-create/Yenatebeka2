import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Award,
  Building,
  Briefcase,
  CheckCircle2,
  Filter,
  UserPlus,
  Send,
  Sparkles,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LawyerProfile } from '../data/sampleLawyers';

interface LawyerDirectoryProps {
  onOpenLawyerRegister?: () => void;
  onSelectLawyerForConsultation?: (lawyer: LawyerProfile) => void;
}

export const LawyerDirectory: React.FC<LawyerDirectoryProps> = ({
  onOpenLawyerRegister,
  onSelectLawyerForConsultation,
}) => {
  const { t, isOromo, isEnglish } = useLanguage();
  const { lawyers, currentUser, sendConsultationRequest } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [inquiryModalLawyer, setInquiryModalLawyer] = useState<LawyerProfile | null>(null);
  const [inquiryCaseSummary, setInquiryCaseSummary] = useState('');
  const [inquirySentSuccess, setInquirySentSuccess] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  // Extract unique cities
  const cities = useMemo(() => {
    const list = Array.from(new Set(lawyers.map((l) => l.city).filter(Boolean)));
    return ['all', ...list];
  }, [lawyers]);

  // Filtered lawyers
  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lawyer.fullName.toLowerCase().includes(q) ||
        lawyer.officeAddress.toLowerCase().includes(q) ||
        lawyer.specialization.toLowerCase().includes(q) ||
        lawyer.licenseNumber.toLowerCase().includes(q);

      const matchesCity = selectedCity === 'all' || lawyer.city === selectedCity;
      const matchesSpecialty =
        selectedSpecialty === 'all' || lawyer.specialization.includes(selectedSpecialty);

      return matchesSearch && matchesCity && matchesSpecialty;
    });
  }, [lawyers, searchQuery, selectedCity, selectedSpecialty]);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryModalLawyer || !inquiryCaseSummary.trim()) return;

    setIsSubmittingInquiry(true);
    const res = await sendConsultationRequest(inquiryModalLawyer.id, inquiryCaseSummary.trim());
    setIsSubmittingInquiry(false);

    if (res.success) {
      setInquirySentSuccess(true);
      setTimeout(() => {
        setInquirySentSuccess(false);
        setInquiryModalLawyer(null);
        setInquiryCaseSummary('');
      }, 1800);
    }
  };

  const getCourtLevelText = (level: LawyerProfile['licenseLevel']) => {
    switch (level) {
      case 'all_federal_courts':
        return isOromo
          ? 'Mana Murtii Waliigalaa Federaalaa fi Hundumaa'
          : 'በፌዴራል ጠቅላይ ሰበር ችሎት እና በሁሉም ፍርድ ቤቶች';
      case 'federal_high_first_instance':
        return isOromo
          ? 'Mana Murtii Ol\'aanaa fi Sadarkaa Duraa Federaalaa'
          : 'በፌዴራል ከፍተኛና የመጀመሪያ ደረጃ ፍርድ ቤቶች';
      case 'federal_first_instance':
        return isOromo
          ? 'Mana Murtii Sadarkaa Duraa Federaalaa'
          : 'በፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ብቻ';
      case 'regional_supreme':
        return isOromo
          ? 'Mana Murtii Waliigalaa Naannoo'
          : 'በክልል ጠቅላይና ከፍተኛ ፍርድ ቤቶች';
      default:
        return 'በፌዴራል ፍርድ ቤቶች';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner / Header Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isOromo ? 'Galmee Abukaatoota Seera Qabeeyyii' : 'የተመዘገቡ ሕጋዊ ጠበቆች ማውጫ'}</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white font-serif tracking-tight leading-tight">
            {isOromo
              ? 'Abukaatoo Seera Qabeessa Dhimma Keessaniif Filadhaa'
              : 'ለጉዳይዎ ብቁና ፈቃድ ያለው ሕጋዊ ጠበቃ ያግኙ'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isOromo
              ? 'Abukaatoota eeyyama qaban, teessoo waajjira isaanii, bilbila fi gosa dhimma isaan keessatti hojjetan ilaaluudhaan kallattiin qunnamaa.'
              : 'በፍትሕ ሚኒስቴር የታደሰ የጥብቅና ፈቃድ ያላቸውን ጠበቆች የሥራ ቦታ አድራሻ፣ የስልክ ቁጥርና የፍርድ ቤት ስልጣን ደረጃ በመመልከት በቀጥታ ይደውሉ ወይም የክስ ጉዳይዎን ያማክሩ።'}
          </p>

          {/* Quick Lawyer Registration CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenLawyerRegister}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/50 flex items-center gap-2 cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isOromo ? 'Akka Abukaatootti Galmaa\'aa' : 'እርስዎም ጠበቃ ነዎት? ይመዝገቡ'}</span>
            </button>
            <span className="text-xs text-slate-400">
              {lawyers.length} {isOromo ? 'abukaatoon galmaa\'aniiru' : 'ሕጋዊ ጠበቆች በሲስተሙ ተመዝግበዋል'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="በጠበቃው ስም፣ አድራሻ፣ የፍቃድ ቁጥር ወይም የስራ ዘርፍ ይፈልጉ..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* City Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">ሁሉም ከተሞች / አድራሻዎች</option>
                {cities
                  .filter((c) => c !== 'all')
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Specialization Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">ሁሉም የስራ ዘርፎች</option>
                <option value="ፍትሐብሔር">ፍትሐብሔርና ንብረት</option>
                <option value="ንግድ">ንግድና ኮንትራት</option>
                <option value="ወንጀል">የወንጀለኛ መቅጫ</option>
                <option value="ቤተሰብ">ቤተሰብና ውርስ</option>
                <option value="ሠራተኛ">የሠራተኛና አሠሪ (አዋጅ 1156)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lawyers Directory Cards Grid */}
      {filteredLawyers.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Building className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">የተፈለገው ጠበቃ አልተገኘም</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            የተለየ የፍለጋ ቃል በመጠቀም ይሞክሩ ወይም የከተማ ማጣሪያውን «ሁሉም ከተሞች» ያድርጉት።
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredLawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between space-y-4 group hover:shadow-amber-950/20"
            >
              {/* Lawyer Top Identity */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-serif text-amber-400 font-black text-lg">
                        {lawyer.fullName.split(' ')[1]?.charAt(0) || lawyer.fullName.charAt(0)}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {lawyer.fullName}
                        </h3>
                        {lawyer.isVerified && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            title="በፍትሕ ሚኒስቴር የተረጋገጠ የጥብቅና ፍቃድ"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>ሕጋዊ ፈቃድ ያለው</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-amber-400 font-medium mt-0.5">
                        {getCourtLevelText(lawyer.licenseLevel)}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {lawyer.experienceYears} ዓመት ልምድ
                  </span>
                </div>

                {/* License Badge */}
                <div className="flex items-center gap-2 text-xs bg-slate-950/80 p-2 rounded-xl border border-slate-800 font-mono">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-slate-400 text-[11px]">የጥብቅና ፍቃድ ቁ.፦</span>
                  <strong className="text-amber-300 text-[11px] font-bold">
                    {lawyer.licenseNumber}
                  </strong>
                </div>

                {/* Office Location Address (THE KEY USER REQUIREMENT) */}
                <div className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Building className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>የሰራው ቦታው አድራሻ (Office Location)፦</span>
                  </div>
                  <p className="text-xs text-slate-200 pl-5 leading-relaxed font-sans">
                    {lawyer.officeAddress}
                  </p>
                </div>

                {/* Specialization */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    ዋና የስራ ዘርፎች፦
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lawyer.specialization.split('፣').map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                {lawyer.bio && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                    «{lawyer.bio}»
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {lawyer.phone && (
                    <a
                      href={`tel:${lawyer.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
                      title="በስልክ ይደውሉ"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lawyer.phone}</span>
                    </a>
                  )}

                  {lawyer.emailOrPhone.includes('@') && (
                    <a
                      href={`mailto:${lawyer.emailOrPhone}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      title="ኢሜል ይላኩ"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setInquiryModalLawyer(lawyer)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-950/40 flex items-center gap-1.5 cursor-pointer transition-all ml-auto"
                >
                  <Send className="w-3 h-3" />
                  <span>ጉዳይዎን ያማክሩ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Dialog Modal */}
      {inquiryModalLawyer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  ለጠበቃ {inquiryModalLawyer.fullName} የጉዳይ ማማከሪያ ይላኩ
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  የቢሮ አድራሻ፡ {inquiryModalLawyer.officeAddress}
                </p>
              </div>
              <button
                onClick={() => setInquiryModalLawyer(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inquirySentSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-300">
                  ማማከሪያዎ በተሳካ ሁኔታ ለጠበቃው ተልኳል!
                </h4>
                <p className="text-xs text-slate-400">
                  ጠበቃው መልእክትዎን አይተው በስልክ ቁጥርዎ ወይም በኢሜልዎ ያገኙዎታል።
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    የሕግ ክርክሩ / የጉዳይዎ አጭር ማጠቃለያ
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryCaseSummary}
                    onChange={(e) => setInquiryCaseSummary(e.target.value)}
                    placeholder="ለምሳሌ፡ የውርስ ክፍፍል ክስ፣ የቤት ሽያጭ ውል አለመፈጸም፣ ያለአግባብ ከሥራ መባረር ወይም የወንጀል ዋስትና ጥያቄ..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {!currentUser && (
                  <p className="text-[11px] text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
                    ማስታወሻ፡ ጥያቄውን ለመላክ እባክዎ መጀመሪያ በስምዎና ስልክዎ ይግቡ ወይም ይመዝገቡ።
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalLawyer(null)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                  >
                    ይቅር
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingInquiry || !currentUser}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-950/40 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingInquiry ? 'በመላክ ላይ...' : 'ጥያቄውን ላክ'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
