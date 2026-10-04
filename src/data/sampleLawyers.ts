export interface LawyerProfile {
  id: string;
  fullName: string; // ስም እስከ አያት
  emailOrPhone: string;
  licenseNumber: string; // የጥብቅና ፍቃድ
  licenseLevel: 'all_federal_courts' | 'federal_high_first_instance' | 'federal_first_instance' | 'regional_supreme';
  officeAddress: string; // የሰራው ቦታው አድራሻ
  specialization: string; // ፍትሐብሔር፣ ውልና ንግድ፣ ወንጀል ወዘተ
  experienceYears: number;
  bio: string;
  isVerified: boolean;
  phone: string;
  city: string;
  courtExperience: string[];
  createdAt: string;
}

export const INITIAL_LAWYERS: LawyerProfile[] = [
  {
    id: 'lawyer-001',
    fullName: 'አቶ ዳንኤል ታደሰ ወልደየስ',
    emailOrPhone: 'daniel.tadesse.legal@gmail.com',
    phone: '+251 911 234 567',
    licenseNumber: 'FDRE/MOJ/ADV/2012/4819',
    licenseLevel: 'all_federal_courts',
    officeAddress: 'አዲስ አበባ፣ ቂርቆስ ክ/ከተማ፣ ለገሃር ባቡር ጣቢያ ፊት ለፊት፣ አል-ሳም ሕንፃ 4ኛ ፎቅ ቢሮ ቁጥር 408',
    specialization: 'ፍትሐብሔር፣ የንግድና የኮንትራት ሕግ፣ የባንክና ኢንሹራንስ ክርክሮች',
    experienceYears: 14,
    bio: 'በፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ችሎት፣ ከፍተኛ እና የመጀመሪያ ደረጃ ፍርድ ቤቶች ከ14 ዓመታት በላይ በንግድ፣ ባንክና ውል ጉዳዮች ሰፊ የጥብቅና ልምድ ያላቸው ባለሙያ።',
    isVerified: true,
    city: 'አዲስ አበባ',
    courtExperience: ['የፌዴራል ጠቅላይ ሰበር ችሎት', 'የፌዴራል ከፍተኛ ፍርድ ቤት', 'የንግድ ችሎት'],
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'lawyer-002',
    fullName: 'ወ/ሮ ሄለን በቀለ ገብረሥላሴ',
    emailOrPhone: 'helen.bekele.law@outlook.com',
    phone: '+251 922 456 789',
    licenseNumber: 'FDRE/MOJ/ADV/2015/6321',
    licenseLevel: 'all_federal_courts',
    officeAddress: 'አዲስ አበባ፣ ቦሌ ክ/ከተማ፣ ቦሌ መድኃኔዓለም ጀርባ፣ ፍሬንድሺፕ የንግድ ማዕከል 6ኛ ፎቅ ቢሮ 612',
    specialization: 'የሪል እስቴትና የመሬት ሕግ፣ የግንባታ ውሎች፣ የቤተሰብና ውርስ ማጣራት',
    experienceYears: 10,
    bio: 'የአፓርትመንትና የመኖሪያ ቤት ግዥ ውሎች፣ የግንባታ ክርክሮች እና የጋብቻና ውርስ ሀብት ክፍፍል ላይ የካበተ የሙያ ተሞክሮ ያካበቱ።',
    isVerified: true,
    city: 'አዲስ አበባ',
    courtExperience: ['የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት', 'የፌዴራል ከፍተኛ ፍርድ ቤት', 'የይግባኝ ሰሚ ችሎት'],
    createdAt: '2024-03-20T10:30:00Z',
  },
  {
    id: 'lawyer-003',
    fullName: 'አቶ ገመቹ ቶሎሳ ደበላ',
    emailOrPhone: 'gemechu.tolosa.attorney@ethionet.et',
    phone: '+251 912 345 678',
    licenseNumber: 'FDRE/MOJ/ADV/2017/8912',
    licenseLevel: 'federal_high_first_instance',
    officeAddress: 'አዳማ፣ ቀበሌ 04፣ ፍርድ ቤት አደባባይ ፊት ለፊት፣ ጊዮን ሕንፃ 2ኛ ፎቅ ቢሮ 14',
    specialization: 'የሠራተኛና አሠሪ ክርክር (አዋጅ 1156/2011)፣ የታክስና ጉምሩክ ሕግ',
    experienceYears: 8,
    bio: 'የአሠሪና ሠራተኛ ቅሬታዎች፣ ያለአግባብ ከስራ መባረር ካሳ፣ እና የኦሮሚያ ክልልና ፌዴራል ፍርድ ቤቶች ሙግት ባለሙያ (በአማርኛና በAfaan Oromoo አገልጋይ)።',
    isVerified: true,
    city: 'አዳማ (ናዝሬት)',
    courtExperience: ['የአዳማ ከፍተኛ ፍርድ ቤት', 'የኦሮሚያ ጠቅላይ ፍርድ ቤት', 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት'],
    createdAt: '2024-05-12T14:15:00Z',
  },
  {
    id: 'lawyer-004',
    fullName: 'አቶ ዮናስ አበበ ኃይለማርያም',
    emailOrPhone: 'yonas.legal.chamber@gmail.com',
    phone: '+251 930 112 233',
    licenseNumber: 'FDRE/MOJ/ADV/2010/3140',
    licenseLevel: 'all_federal_courts',
    officeAddress: 'ሐዋሳ፣ ፒያሳ፣ ፍርድ ቤት ጎዳና፣ ሉዓላዊት ሕንፃ 3ኛ ፎቅ ቢሮ 302',
    specialization: 'የወንጀለኛ መቅጫ ሕግ፣ የዋስትና ጥያቄዎች፣ የሰብአዊ መብቶች ጥበቃ',
    experienceYears: 16,
    bio: 'ውስብስብ የወንጀል ክሶች፣ የዋስትና መብት ማስከበር እና የመጀመሪያ ደረጃ የምርመራ ክትትል ላይ ከ16 ዓመታት በላይ የካበተ ልምድ ያላቸው ከፍተኛ ጠበቃ።',
    isVerified: true,
    city: 'ሐዋሳ',
    courtExperience: ['የሲዳማ ክልል ጠቅላይ ፍርድ ቤት', 'የፌዴራል ከፍተኛ ፍርድ ቤት', 'የፌዴራል ጠቅላይ ሰበር ችሎት'],
    createdAt: '2024-06-01T11:00:00Z',
  },
  {
    id: 'lawyer-005',
    fullName: 'ወ/ሮ ትዕግሥት መለሰ ወርቁ',
    emailOrPhone: 'tigist.melesse.advocacy@gmail.com',
    phone: '+251 918 889 900',
    licenseNumber: 'FDRE/MOJ/ADV/2018/9541',
    licenseLevel: 'federal_high_first_instance',
    officeAddress: 'ባሕር ዳር፣ ቀበሌ 03፣ አባይ ድልድይ አቅራቢያ፣ ጣና ፕላዛ 4ኛ ፎቅ ቢሮ 418',
    specialization: 'የንግድ ድርጅቶች ምስረታ፣ የንግድ ምልክት (IP) እና ውል ረቂቆች',
    experienceYears: 7,
    bio: 'የአክሲዮን ማህበራት ምዝገባ፣ የባለቤትነት መብቶች ጥበቃ እና ዓለም አቀፍ የንግድ ስምምነቶች ላይ የሚያማክሩ ጠበቃና የሕግ አማካሪ።',
    isVerified: true,
    city: 'ባሕር ዳር',
    courtExperience: ['የአማራ ክልል ጠቅላይ ፍርድ ቤት', 'የባሕር ዳር ከፍተኛ ፍርድ ቤት'],
    createdAt: '2024-08-10T16:40:00Z',
  },
];
