export interface TeamMember {
  name: string;
  roleAm: string;
  roleOm: string;
  roleEn: string;
  bioAm: string;
  bioOm: string;
  icon: string;
}

export const COMPANY_INFO = {
  nameAm: 'ውሽዬ ሶፍትዌር ሶሉሽን',
  nameOm: 'Weshye Software Solution',
  nameEn: 'Weshye Software Solution',
  taglineAm: 'ለኢትዮጵያ የሕግ፣ የንግድና የቴክኖሎጂ ዘርፍ ዘመናዊና ጥራት ያላቸው ዲጂታል መፍትሔዎች',
  taglineOm: 'Furmaata Teeknoolojii Ammayyaa fi Qulqullina Qabu Itoophiyaaf',
  taglineEn: 'Pioneering Modern LegalTech & Digital Solutions in Ethiopia',
  country: 'ኢትዮጵያ (Ethiopia)',
  city: 'አዲስ አበባ፣ ኢትዮጵያ',
  phone1: '+251 911 029 070',
  phone2: '+251 701 370 299',
  email: 'tameratale2@gmail.com',
  website: 'https://weshya-sofetyer-solshene.netlify.app/#deployment-modes',
  establishedYear: '2024',
  copyrightText: '© 2024 - 2026 ውሽዬ ሶፍትዌር ሶሉሽን (Weshye Software Solution). መብቱ በሕግ የተጠበቀ ነው።',

  team: [
    {
      name: 'ታምራት አሌ (Tamerat Ale)',
      roleAm: 'ማናጀር፣ ዋና ሲስተም አልሚ (Lead Developer) እና UI/UX ዲዛይነር',
      roleOm: 'Meneejara, Hojjetaa Ijoo Siistamaa fi Dizaayinara UI/UX',
      roleEn: 'General Manager, Lead Developer & UI/UX Architect',
      bioAm: 'የሲስተሙ ዋና አርክቴክት፣ የፊት ገጽ (Frontend) ምህንድስና፣ የሕግ ፎርሞችና የተጠቃሚ ምቾት (UX) ቀያሽ።',
      bioOm: 'Hoggansaa fi dizaayinii fuula duraa siistama seeraa kana kan qopheesse.',
      icon: 'manager',
    },
    {
      name: 'ውሽዬ ታምራት (Weshye Tamerat)',
      roleAm: 'የባክኢንድና የዳታቤዝ ኢንጂነር (Backend Developer)',
      roleOm: 'Ogeessa Baak-Eendii fi Kuusaa Daataa (Backend Developer)',
      roleEn: 'Backend & Cloud Database Engineer',
      bioAm: 'የCloud Firestore ዳታቤዝ አወቃቀር፣ የደህንነት ሕጎች (Security Rules) እና የዳታ ማከማቻ ሎጂክ መሃንዲስ።',
      bioOm: 'Ijaarsa kuusaa daataa Firebase fi eegumsa iccitii siistamichaa kan hooggane.',
      icon: 'backend',
    },
    {
      name: 'ቡሩክ ጎበና (Buruk Gobena)',
      roleAm: 'የኔትወርክ ዝርጋታና መሰረተ-ልማት መሃንዲስ (Network Installation Specialist)',
      roleOm: 'Ogeessa Diriirsa Neetwoorkii fi Bu\'uuraalee Misoomaa',
      roleEn: 'Network Installation & Infrastructure Engineer',
      bioAm: 'የአውታር ዝርጋታ፣ የሰርቨር ግንኙነት፣ የሲስተም ፍጥነት እና የመሰረተ-ልማት ደህንነት አስተዳዳሪ።',
      bioOm: 'Diriirsa neetwoorkii, ariitii fi nageenya walqunnamtii seervaraa kan to\'atu.',
      icon: 'network',
    },
  ],

  services: [
    {
      titleAm: 'የሕግ ቴክኖሎጂ (LegalTech Solutions)',
      descAm: 'የፍርድ ቤት ክስ መከታተያ፣ የሕግ ማማከሪያ AI እና የጠበቆች ማውጫ ሲስተሞች ግንባታ።',
    },
    {
      titleAm: 'የድርጅት ሶፍትዌሮች (Enterprise Web & Mobile)',
      descAm: 'ለግልና ለመንግስታዊ ድርጅቶች ብጁ የሆኑ ፈጣን፣ ደህንነታቸው የተጠበቀ የዌብና ሞባይል አፖች።',
    },
    {
      titleAm: 'የኔትወርክ ዝርጋታና ሲስተም ኢንስታሌሽን (Network & IT Infrastructure)',
      descAm: 'የቢሮና የድርጅት ኔትወርክ ዝርጋታ፣ የዳታ ማዕከል እና የኔትወርክ ጥገና አገልግሎት።',
    },
    {
      titleAm: 'የዳታቤዝ አስተዳደርና የክላውድ ደህንነት (Cloud Database & Security)',
      descAm: 'Firebase፣ Cloud SQL፣ የዳታ ኢንክሪፕሽን እና አስተማማኝ የባክአፕ ዝርጋታ።',
    },
  ],
};
