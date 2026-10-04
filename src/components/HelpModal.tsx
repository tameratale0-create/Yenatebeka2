import React from 'react';
import { Scale, Calendar, FolderKanban, FileText, BookOpen, ShieldCheck, X, Languages, Building, Calculator, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { isOromo, isEnglish } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-serif">
              {isOromo
                ? 'Humna Abukaatoo - Qajeelfama Fayyadamaa fi Tajaajilaa'
                : isEnglish
                ? 'Advocate Power - User Manual & Operating Guide'
                : 'የጠበቃው ጉልበት - የአጠቃቀምና የአገልግሎት መመሪያ'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
            <strong className="text-amber-300 block text-sm">
              {isOromo
                ? 'Baga Gara Wiirtuu Teknolojii Seeraa "Humna Abukaatoo"tti Nagaan Dhuftan!'
                : isEnglish
                ? 'Welcome to "Advocate Power" Legal Tech Platform!'
                : 'እንኳን ወደ "የጠበቃው ጉልበት" የሕግ ቴክኖሎጂ መድረክ በደህና መጡ!'}
            </strong>
            <p>
              {isOromo
                ? 'Miseensi hawaasaa yookiin abukaatoon kamiyyuu falmii mana murtii fi mirgoota seeraa isaa haala ammayyaatiin akka to\'atuuf, seerota sivilii, yakkaa, hojjetaa fi hojjechiisaa, maatii fi murteewwan dirqisiisoo dhaddacha ijibbaata federaalaa wajjin wal-qabsiisuun kan qophaa\'eedha.'
                : isEnglish
                ? 'Designed for litigants, lawyers, and citizens across Ethiopia to formulate lawsuits, review legal positions, manage case dockets, and track court trial dates pursuant to Ethiopian Civil, Criminal, Labor codes and Supreme Court Cassation precedents.'
                : 'ይህ መተግበሪያ ማንኛውም ሰው ወይም የሕግ ባለሙያ የፍርድ ቤት ክርክሩን እና የሕግ መብቶቹን በዘመናዊ መንገድ እንዲቆጣጠር ከኢትዮጵያ ፍትሐብሔር፣ የወንጀል፣ የሠራተኛ፣ የቤተሰብ ሕጎችና ከሰበር ውሳኔዎች ጋር በማስተሳሰር የተዘጋጀ ነው።'}
            </p>
          </div>

          <div className="space-y-3">
            {/* 1. Legal Consultation */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '1. Gorsa Seeraa fi Xiinxala Ragaalee'
                    : isEnglish
                    ? '1. Legal Consultation & Evidence Analysis'
                    : '1. የሕግ ምክክርና የሰነድ ትንተና'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Dhimma keessan barreeffamaan galchaa yookiin ragaalee (waliigaltee, nagahee, qaboo yaa\'ii) olkaawaa. Sirnichi keewwattoota seeraa ilaallatan, carraa injifannoo (Case Strength Score), mirgaa fi dirqama qaamolee akkasumas tilmaama beenyaa qoratee gorsa kenna.'
                    : isEnglish
                    ? 'Input your dispute details or upload contractual documents and receipts. The system computes case strength scores, cites applicable statutory provisions, outlines remedies, and estimates damages.'
                    : 'የጉዳይዎን ዝርዝር በጽሁፍ ያስገቡ ወይም የተፈራረሟቸውን ውሎች፣ ደረሰኞች ወይም ሰነዶች ይጫኑ። ሲስተሙ የሚመለከቱትን አንቀጾች፣ የማሸነፍ እድል (Case Strength Score)፣ የወገኖች መብትና ግዴታ እንዲሁም የካሳ ግምት አዘጋጅቶ ያማክርዎታል።'}
                </p>
              </div>
            </div>

            {/* 2. Case Management */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <FolderKanban className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '2. Wiirtuu To\'annoo Himannaa'
                    : isEnglish
                    ? '2. Case Control Center'
                    : '2. የክስ ሂደት መቆጣጠሪያ ማዕከል'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Galmeewwan mana murtii keessanii galmeessaa. Sadarkaalee falmii (qophii duraa, iyyannoo baname, beellama deebii, qabxii qabachuu, ragaa dhagahuu hanga murtii fi raawwiitti) hordofaa; kaffaltii askuutaa mana murtii shallagaa.'
                    : isEnglish
                    ? 'Keep full records of your legal dockets, document exhibits, and track stage-by-stage progression from pre-trial through judgment and execution.'
                    : 'ንቁ መዝገቦችዎን ይመዝግቡ። ክሱ በየትኛው ደረጃ ላይ እንዳለ (ከቅድመ-ክስ እስከ ውሳኔና አፈጻጸም) በደረጃ መከታተል፣ የማስረጃ ሰነዶችን ማከማቸት እና የሚከፈለውን የዳኝነት ማህተም ክፍያ ማስላት ይችላሉ።'}
                </p>
              </div>
            </div>

            {/* 3. Hearings */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '3. Hordoffii Beellama Mana Murtii'
                    : isEnglish
                    ? '3. Court Hearing Tracker'
                    : '3. የፍርድ ቤት ቀጠሮ መከታተያ'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Guyyaa beellamaa, sa\'aatii, dhaaddacha fi abbaa seeraa galmeessaa. Akeekkachiisa beellama duraa guyyoota hafan agarsiisu kenna; tarree qophii ragaalee (Checklist) of keessaa qaba.'
                    : isEnglish
                    ? 'Schedule hearings with court room, date, and judge. Includes automated day-countdown alerts and pre-hearing preparation checklists.'
                    : 'የፍርድ ቤት ቀጠሮዎን ቀን፣ ሰዓት፣ ችሎትና ዳኛ ይመዝግቡ። ቀጠሮው ከመድረሱ በፊት የቀሩትን ቀናት የሚያሳይ ማስጠንቀቂያ ይሰጣል፤ እንዲሁም የምስክሮችና የሰነድ ዝግጅት ማረጋገጫ (Checklist) ያካትታል።'}
                </p>
              </div>
            </div>

            {/* 4. Law Library */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <BookOpen className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '4. Barbaada Seeraa & Murteewwan Dhaaddachaa'
                    : isEnglish
                    ? '4. Legal Search Engine & Jurisprudence'
                    : '4. የሕግ መረጃ ፍለጋ ሞተር'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Keewwattoota seera sivilii, yakkaa, hojjetaa fi hojjechiisaa, maatii fi murteewwan ijibbaata federaalaa galchanii barbaaduun ragaa fi gorsa argachuu dandeessu.'
                    : isEnglish
                    ? 'Search Ethiopian legal codes and cross-reference with Abyssinia Law / Ethiopian Legal Brief precedents.'
                    : 'የኢትዮጵያ ፍትሐብሔር፣ ወንጀል፣ ሠራተኛ፣ ቤተሰብ ሕጎችንና አስገዳጅ የሰበር ውሳኔዎችን በቀላሉ መፈለግና ማጣቀሻዎችን ማግኘት ይችላሉ።'}
                </p>
              </div>
            </div>

            {/* 5. Lawsuit Drafter */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '5. Qophii Himannaa (Gaaffilee Himataa fi Iyyannoo Himannaa)'
                    : isEnglish
                    ? '5. Lawsuit Filing (Plaintiff Questionnaire & Statement of Claim)'
                    : '5. ክስ መመስረቻ (የከሳሽ መጠይቅና የክስ ወረቀት ማዘጋጃ)'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Seera deemsa falmii siviilii Itoophiyaa keewwata 222-224 bu\'uureffachuun gaaffilee barreeffamaa himataan guutuu qabu (odeeffannoo himataa fi himatamaa, aangoo mana murtii, gaaffilee bu\'uura waliigaltee, diiggaa fi miidhaa qaqqabee, bu\'uura seeraa, murtii barbaadamu, ragaalee fi kakata) guutuudhaan iyyannoo himannaa seera qabeessa mana murtii (Statement of Claim / Plaint) Afaan Oromootiin yookiin Amaariffaan battalatti qopheessa.'
                    : isEnglish
                    ? 'Structured questionnaire based on Articles 222-224 of the Ethiopian Civil Procedure Code: fill in party addresses, jurisdictional basis, chronological breach facts, cited codes, relief prayed, evidence/witnesses, and verification under oath to draft a complete court-ready plaint.'
                    : 'በኢትዮጵያ ፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 222-224 መሠረት ከሳሽ የሚጠበቅበትን የጽሁፍ መጠይቆች (የከሳሽና የተከሳሽ አድራሻ፣ የፍርድ ቤት ስልጣን፣ የክሱ ፍሬ ነገር፣ የሕግ አንቀጾች፣ የሚጠየቀው ዳኝነት እና ማስረጃዎች) በመሙላት፤ ሲስተሙ ፍርድ ቤት የሚገባ ይፋዊ የክስ ወረቀት (Statement of Claim / Plaint) ያዘጋጅልዎታል።'}
                </p>
              </div>
            </div>

            {/* 6. Translator (ተርጓሜ) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <Languages className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '6. Hiikaa Seeraa fi Sanadaa (Afaan Oromoo ⇄ አማርኛ ⇄ English)'
                    : isEnglish
                    ? '6. Legal & Document Translator (Amharic ⇄ Afaan Oromoo ⇄ English)'
                    : '6. ተርጓሜ (የሕግና ሰነድ ትርጉም - አማርኛ ⇄ ኦሮምኛ ⇄ እንግሊዝኛ)'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Barruu fi faayiloota sanadaa (waliigaltee, ragaa, murtii) Afaan Oromoo gara Amaariffaa ykn Ingiliffaatti, Amaariffa gara Oromootti ykn Ingiliffaatti, akkasumas Ingiliffa gara Oromoo fi Amaariffaatti jechoota seeraa Itoophiyaa sirritti eeguun battalatti hiika.'
                    : isEnglish
                    ? 'Translates legal text and full document files between Afaan Oromoo, Amharic, and English. Preserves court citations, statutory terminology, and contractual formatting.'
                    : 'ጽሑፎችንና ሙሉ የሰነድ ፋይሎችን (ውሎች፣ ማስረጃዎች፣ ፍርዶች) ከኦሮምኛ ወደ አማርኛ ወይም እንግሊዝኛ፣ ከአማርኛ ወደ ኦሮምኛ ወይም እንግሊዝኛ፣ እንዲሁም ከእንግሊዝኛ ወደ አማርኛ ወይም ኦሮምኛ የሕግ ቃላትን በጠበቀ መልኩ ይተረጉማል።'}
                </p>
              </div>
            </div>

            {/* 7. Court Jurisdiction (ክስ የማየት ስልጣን) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <Building className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '7. Aangoo Dhimma Ilaaluu (Manneen Murtii fi Ulaagaalee)'
                    : isEnglish
                    ? '7. Court Jurisdiction Checker (Competent Court & Pre-Filing Checklist)'
                    : '7. ክስ የማየት ስልጣን (ተገቢው ፍርድ ቤት፣ ችሎትና የሚያስፈልጉ ነገሮች)'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Labsii Manneen Murtii Federaalaa Lakk. 1234/2013 fi Seera Adeemsa Falmii Sivilii Kw. 1-31 irratti hundaa\'uun dhimma keessan madaalee manni murtii aangoo qabu (Sadarkaa Duraa, Ol\'aanaa, Shari\'aa ykn Naannoo) kam akka ta\'e, dhaddacha, ramaddii fi ulaagaalee himannaan dura barbaachisan (akeekkachiisa, nagahee, kaffaltii abbaa seerummaa) tarreessee agarsiisa.'
                    : isEnglish
                    ? 'Based on Federal Courts Proclamation 1234/2021 and Civil Procedure Code Arts 1-31, evaluates your case circumstance to determine the competent court (First Instance, High Court, Sharia, or Regional), specific bench, local venue, and outputs a complete mandatory pre-filing checklist.'
                    : 'በፌዴራል ፍርድ ቤቶች አዋጅ ቁጥር 1234/2013 እና በፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 1-31 መሠረት የክስዎን ሁኔታና የገንዘብ መጠን ገምግሞ ጉዳዩን የትኛው ፍርድ ቤት (የመጀመሪያ ደረጃ፣ ከፍተኛ፣ የሸሪዓ ወይም የክልል ፍርድ ቤት)፣ የትኛው ችሎትና ምድብ ማየት እንደሚችል እና ክሱን ለመመስረት በዝርዝር የሚያስፈልጉ ነገሮችን (የቅድመ ክስ ማስጠንቀቂያ፣ የዳኝነት ክፍያ፣ ማስረጃዎች ወዘተ) ያሳያል።'}
                </p>
              </div>
            </div>

            {/* 8. Court Fee Calculator (የዳኝነት ክፍያ ማስያ) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <Calculator className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '8. Shallaggii Kaffaltii Abbaa Seerummaa (Court Fee Calculator)'
                    : isEnglish
                    ? '8. Court Fee Calculator (Civil Procedure Code Schedule)'
                    : '8. የዳኝነት ክፍያ ማስያ (በፍትሐብሔር ሥነ-ሥርዓት ሕግ መመሪያ መሠረት)'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Akkaataa Gabatee Kaffaltii Seera Adeemsa Falmii Siviliitiin hanga maallaqa iyyatame galchuun kaffaltii abbaa seerummaa, waamicha himatamtootaa, iyyannoo ol-iyyannoo fi raawwii ofumaan shallaga. Akkasumas araaraan yoo xumuramu kaffaltii deebi\'u (Kw. 278) fi bilisaan himachuuf (In Forma Pauperis - Kw. 467) ulaagaalee jiran ibsa.'
                    : isEnglish
                    ? 'Input any claim amount in ETB to automatically compute court fees across all 7 graduated brackets under the Civil Procedure Code, calculate summons and registry charges, determine 50% settlement refund (Art. 278), and inspect pauper suit waiver requirements (Arts. 467-479).'
                    : 'የይገባኛል ጥያቄውን የገንዘብ መጠን በኢትዮጵያ ብር (ETB) በማስገባት በፍትሐብሔር ሥነ-ሥርዓት ሕግ የክፍያዎች ሰንጠረዥ 7 እርከኖች መሠረት የሚፈለገውን የዳኝነት፣ የመጥሪያ፣ የይግባኝ እና የአፈጻጸም ክፍያዎችን በራስ-ሰር ያሰላል። በተጨማሪም በዕርቅ ሲጠናቀቅ ተመላሽ የሚሆነውን 50% ክፍያ (አንቀጽ 278) እና በደሃ ደንብ ያለ ክፍያ የመክሰስ ህጋዊ መብትን (አንቀጽ 467-479) በዝርዝር ያሳያል።'}
                </p>
              </div>
            </div>

            {/* 9. Defense Drafter (የተከሳሽ የመከላከያ መልስ) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '9. Qopheessaa Deebii Himatamaa (Statement of Defense / Deebii Mana Murtii)'
                    : isEnglish
                    ? '9. Defendant\'s Statement of Defense (Lawsuit Response Drafter)'
                    : '9. የተከሳሽ የመከላከያ መልስ ማዘጋጃ (ለተከሰሰበት ፍርድ ቤት መልስ)'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Himatamaan waraqaan himannaa yeroo isa ga\'u, sanada dhiyeessuun (PDF/Suuraa/Faayila) yookiin barreeffama himannaa garagalchuun galchuun; sirnichi Seera Adeemsa Falmii Sivilii Kw. 234-245 irratti hundaa\'uun mormiiwwan sadarkaa duraa (yeroon darbuu, aangoo, k.k.f), waakkannaa fi falmii deebii dhiyeessuun waraqaa deebii seera qabeessa guutuu mana murtiitti dhiyaatu ofumaan qopheessa.'
                    : isEnglish
                    ? 'When a defendant is served with a lawsuit/charge sheet, upload the document (PDF, image, doc) or paste the lawsuit text. The system automatically structures a formal Statement of Defense under Civil Procedure Code Arts. 234-245, incorporating preliminary objections (limitation, jurisdiction, lack of cause of action), specific paragraph denials, affirmative defenses, and prayers.'
                    : 'ተከሳሽ ሆኖ የተከሰሰበት የክስ ወረቀት ሲደርሰው ሰነዱን (PDF፣ ምስል ወይም ፋይል) በማስገባት ወይም የክሱን ጽሑፍ በመገልበጥ/በመጻፍ፤ ሲስተሙ በኢትዮጵያ ፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 234-245 መሠረት የመጀመሪያ ደረጃ መቃወሚያዎችን (የይርጋ፣ የስልጣን ማጣት፣ የክስ ምክንያት እጦት)፣ የክህደት ነጥቦችንና አዎንታዊ መከላከያዎችን በማካተት ለተከሰሰበት ፍርድ ቤት መልስ የሚሆን የተሟላ ይፋዊ የመከላከያ መልስ (Statement of Defense) በራስ-ሰር ያዘጋጃል።'}
                </p>
              </div>
            </div>

            {/* 10. Lawyers Directory (የተመዘገቡ ጠበቆች ማውጫ) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
              <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">
                  {isOromo
                    ? '10. Galmee Abukaatoota Seera Qabeeyyii (Lawyers Directory & Offices)'
                    : isEnglish
                    ? '10. Licensed Advocates Directory & Office Locations'
                    : '10. የተመዘገቡ ሕጋዊ ጠበቆች ማውጫና የቢሮ አድራሻ'}
                </strong>
                <p className="text-slate-400 text-xs">
                  {isOromo
                    ? 'Abukaatoota eeyyama qaban, teessoo waajjira isaanii, bilbila fi gosa dhimma isaan keessatti hojjetan ilaaluudhaan kallattiin qunnamuuf yookiin dhimma himannaa keessan mariisisuuf gargaara.'
                    : isEnglish
                    ? 'Search licensed Ethiopian advocates by court jurisdiction, office address, and specialization. Contact lawyers directly by phone, email, or send in-app case consultation requests.'
                    : 'በፍትሕ ሚኒስቴር የታደሰ ፈቃድ ያላቸውን ጠበቆች የሥራ ቦታ አድራሻ፣ የስልክ ቁጥርና የፍርድ ቤት ስልጣን ደረጃ በመመልከት በቀጥታ ለመደወል ወይም የክስ ጉዳይዎን ለማማከር ያስችላል።'}
                </p>
              </div>
            </div>

            {/* Developer & Company Credit Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  የሲስተሙ አበልጻጊ ድርጅት፦ ውሽዬ ሶፍትዌር ሶሉሽን (Weshye Software Solution)
                </span>
                <span className="text-[10px] text-slate-400">ኢትዮጵያ</span>
              </div>
              <p className="text-xs text-slate-300">
                ማናጀርና ዋና አልሚ፦ <strong>ታምራት አሌ</strong> | ባክኢንድ፦ <strong>ውሽዬ ታምራት</strong> | ኔትወርክ፦ <strong>ቡሩክ ጎበና</strong> | ዲዛይን፦ <strong>ታምራት አሌ</strong>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-emerald-400 font-mono pt-1">
                <span>ስልክ፡ +251 911 029 070 / +251 701 370 299</span>
                <span>•</span>
                <a
                  href="https://weshya-sofetyer-solshene.netlify.app/#deployment-modes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline"
                >
                  weshya-sofetyer-solshene.netlify.app
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
          >
            {isOromo ? 'Hubadheera / Cufi' : isEnglish ? 'Understood / Close' : 'ተረድቻለሁ / ዝጋ'}
          </button>
        </div>
      </div>
    </div>
  );
};
