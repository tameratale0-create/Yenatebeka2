import React from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  ShieldCheck,
  Code2,
  Database,
  Network,
  Palette,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyInfo';
import { useLanguage } from '../context/LanguageContext';
import { JusticeLogo } from './JusticeLogo';

interface AboutCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutCompanyModal: React.FC<AboutCompanyModalProps> = ({ isOpen, onClose }) => {
  const { isOromo, isEnglish } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-950/50 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black font-serif text-white tracking-tight">
                  {COMPANY_INFO.nameAm}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  IT & Software
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isOromo ? COMPANY_INFO.nameOm : COMPANY_INFO.nameEn} — {COMPANY_INFO.country}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Mission & Purpose */}
          <div className="bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-900 p-4 sm:p-5 rounded-2xl border border-amber-900/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ስለ ሲስተሙ አበልጻጊ ድርጅት (About The Developer)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              ይህ የሕግ መረጃና የጠበቆች ማውጫ መተግበሪያ በኢትዮጵያ ውስጥ የፍትሕና የሕግ አገልግሎቶችን ለዜጎች፣ ለጠበቆችና ለሕግ ባለሙያዎች ተደራሽ፣ ፈጣንና አስተማማኝ ለማድረግ በ**«{COMPANY_INFO.nameAm}»** የቴክኖሎጂ ቡድን የተገነባ ነው።
            </p>
          </div>

          {/* Quick Contact & Links Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone Numbers */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>ስልክ ቁጥሮች (Contact Phones)</span>
              </span>
              <div className="flex flex-col gap-1 text-xs">
                <a
                  href="tel:+251911029070"
                  className="font-mono text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                >
                  {COMPANY_INFO.phone1}
                </a>
                <a
                  href="tel:+251701370299"
                  className="font-mono text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                >
                  {COMPANY_INFO.phone2}
                </a>
              </div>
            </div>

            {/* Email & Website */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>ዌብሳይትና ኢሜል</span>
              </span>
              <div className="space-y-1 text-xs">
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-slate-300 hover:text-white flex items-center gap-1 truncate"
                >
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{COMPANY_INFO.email}</span>
                </a>
                <a
                  href={COMPANY_INFO.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 truncate transition-colors"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">weshya-sofetyer-solshene.netlify.app</span>
                </a>
              </div>
            </div>
          </div>

          {/* Development Team Credits (THE EXACT CORE ROLES) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>የቴክኖሎጂ ቡድን አባላት (System Development Team)</span>
              </h3>
              <span className="text-[10px] text-slate-400">ውሽዬ ሶፍትዌር ሶሉሽን</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Member 1: Tamerat Ale */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    <Palette className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">ታምራት አሌ</h4>
                    <span className="text-[10px] font-bold text-amber-400 block leading-tight mt-0.5">
                      ማናጀር ፣ ዋና ሲስተም አልሚ (Lead Developer) እና UI/UX ዲዛይን
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
                  የሲስተሙ አጠቃላይ አስተዳደር፣ የተጠቃሚ ተሞክሮ (UI/UX) እና የFrontend አርክቴክቸር ግንባታ።
                </p>
              </div>

              {/* Member 2: Weshye Tamerat */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    <Database className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">ውሽዬ ታምራት</h4>
                    <span className="text-[10px] font-bold text-emerald-400 block leading-tight mt-0.5">
                      ባክኢንድና ዳታቤዝ ኢንጂነር (Backend Developer)
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
                  የCloud Firestore ዳታቤዝ፣ የሴኪዩሪቲ ህጎችና የሰርቨር ሎጂክ አስተዳደር።
                </p>
              </div>

              {/* Member 3: Buruk Gobena */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-sky-500/50 transition-all space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                    <Network className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">ቡሩክ ጎበና</h4>
                    <span className="text-[10px] font-bold text-sky-400 block leading-tight mt-0.5">
                      ኔትወርክ ኢንስታሌሽንና መሰረተ-ልማት
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
                  የአውታር ዝርጋታ፣ የኔትወርክ ደህንነትና የመሰረተ-ልማት ስራዎች ባለሙያ።
                </p>
              </div>
            </div>
          </div>

          {/* Services Provided by the Company */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 block">
              የድርጅቱ ዋና ዋና አገልግሎቶች (Services)፦
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {COMPANY_INFO.services.map((srv, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-200 text-[11px]">{srv.titleAm}</strong>
                    <span className="text-[10px] text-slate-400">{srv.descAm}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 font-mono text-center sm:text-left">
              {COMPANY_INFO.copyrightText}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={COMPANY_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-950/40 flex items-center gap-1.5 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>ኦፊሴላዊ ድረ-ገጻችንን ይጎብኙ</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
