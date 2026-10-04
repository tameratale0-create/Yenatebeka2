export type Language = 'am' | 'om' | 'en';

export interface Translations {
  [key: string]: {
    am: string;
    om: string;
    en: string;
  };
}

export const UI_TRANSLATIONS: Translations = {
  // App Title & Tagline
  appTitle: {
    am: 'የእኔ ጠበቃ',
    om: 'Abukaatoo Koo',
    en: 'My Lawyer',
  },
  appSubtitle: {
    am: 'የሕግ ምክክር • የፍርድ ቤት ቀጠሮ መከታተያ • የክስ መቆጣጠሪያ ማዕከል',
    om: 'Gorsa Seeraa • Hordoffii Beellama Mana Murtii • Wiirtuu To\'annoo Himannaa',
    en: 'Legal Consultation • Court Hearing Tracker • Case Management Center',
  },
  appBadge: {
    am: 'የኢትዮጵያ ሕግ ቴክኖሎጂ',
    om: 'Teknolojii Seera Itoophiyaa',
    en: 'Ethiopian Legal Tech',
  },
  topStripNotice: {
    am: 'የኢትዮጵያ ፍትሐብሔርና የወንጀለኛ መቅጫ ሕጎች ጥናትና ምክክር ማዕከል',
    om: 'Wiirtuu Qorannoo fi Gorsa Seera Sivilii fi Yakkaa Itoophiyaa',
    en: 'Ethiopian Civil & Criminal Laws Research and Consultation Center',
  },
  topStripCassation: {
    am: 'አስገዳጅ የፌዴራል ሰበር ችሎት ውሳኔዎችን ያካተተ',
    om: 'Murteewwan Dirqisiisoo Dhaddacha Ijibbaata Federaalaa Kan Hammate',
    en: 'Including Binding Federal Supreme Court Cassation Decisions',
  },
  courtHelpline: {
    am: 'የፍርድ ቤቶች መረጃ መስጫ፡',
    om: 'Odeeffannoo Mana Murtii:',
    en: 'Court Information Hotline:',
  },
  userGuide: {
    am: 'የአጠቃቀም መመሪያ',
    om: 'Qajeelfama Fayyadamaa',
    en: 'User Guide',
  },

  // Tabs
  tabConsultation: {
    am: 'የሕግ ምክክርና ሰነድ ትንተና',
    om: 'Gorsa Seeraa & Xiinxala Ragaa',
    en: 'Legal Consultation & Analysis',
  },
  tabCases: {
    am: 'የክስ መቆጣጠሪያ ማዕከል',
    om: 'Wiirtuu To\'annoo Himannaa',
    en: 'Case Control Center',
  },
  tabHearings: {
    am: 'የፍርድ ቤት ቀጠሮ አስተዳደር',
    om: 'Bulchiinsa Beellama Mana Murtii',
    en: 'Court Hearing Tracker',
  },
  tabLibrary: {
    am: 'የሕግ መረጃ ፍለጋ ሞተር',
    om: 'Barbaada Seeraa & Dhaddachaa',
    en: 'Legal Search Engine & Library',
  },
  tabDrafter: {
    am: 'ክስ መመስረቻ',
    om: 'Qophii Himannaa',
    en: 'Lawsuit Filing (Pleading Drafter)',
  },
  tabDrafterBadge: {
    am: 'የክስ ወረቀት',
    om: 'Waraqaa Himannaa',
    en: 'Statement of Claim',
  },
  tabTranslator: {
    am: 'ተርጓሜ',
    om: 'Hiikaa',
    en: 'Translator',
  },
  tabTranslatorBadge: {
    am: 'ጽሑፍና ሰነድ',
    om: 'Barruu fi Sanada',
    en: 'Text & Doc',
  },
  tabJurisdiction: {
    am: 'ክስ የማየት ስልጣን',
    om: 'Aangoo Dhimma Ilaaluu',
    en: 'Court Jurisdiction',
  },
  tabJurisdictionBadge: {
    am: 'ፍርድ ቤት መለያ',
    om: 'Adda Baasaa Mana Murtii',
    en: 'Court Finder',
  },
  tabCourtFees: {
    am: 'የዳኝነት ክፍያ',
    om: 'Kaffaltii Abbaa Seerummaa',
    en: 'Court Fee Calculator',
  },
  tabCourtFeesBadge: {
    am: 'የክፍያ ስሌት',
    om: 'Shallaggii Kaffaltii',
    en: 'Fee Calc',
  },
  tabDefense: {
    am: 'የመከላከያ መልስ',
    om: 'Deebii Himatamaa',
    en: 'Statement of Defense',
  },
  tabDefenseBadge: {
    am: 'ለተከሳሽ',
    om: 'Himatamaaf',
    en: 'For Defendant',
  },
  tabLawyers: {
    am: 'ጠበቆች ማውጫ',
    om: 'Galmee Abukaatootaa',
    en: 'Find Lawyers',
  },
  tabLawyersBadge: {
    am: 'ሕጋዊ ጠበቃ',
    om: 'Abukaatoo',
    en: 'Advocates',
  },

  // General Actions
  save: { am: 'መዝግብ / አስቀምጥ', om: 'Galmeessi / Olkaawi', en: 'Save' },
  cancel: { am: 'ይቅር', om: 'Dhiisi', en: 'Cancel' },
  close: { am: 'ዝጋ', om: 'Cufi', en: 'Close' },
  edit: { am: 'አድስ / አርም', om: 'Gulaali', en: 'Edit' },
  delete: { am: 'ሰርዝ', om: 'Haqi', en: 'Delete' },
  search: { am: 'ፈልግ', om: 'Barbaadi', en: 'Search' },
  filter: { am: 'አጣራ', om: 'Calali', en: 'Filter' },
  copy: { am: 'ቅዳ', om: 'Garagalchi', en: 'Copy' },
  copied: { am: 'ተቀድቷል!', om: 'Garagalfameera!', en: 'Copied!' },
  print: { am: 'አትም / Print', om: 'Maxxansi', en: 'Print' },
  download: { am: 'አውርድ (Download)', om: 'Buusi (Download)', en: 'Download' },
  all: { am: 'ሁሉም', om: 'Hunda', en: 'All' },
  active: { am: 'በሂደት ላይ', om: 'Adeemsa Irra Jira', en: 'Active' },
  completed: { am: 'የተጠናቀቀ', om: 'Xumurameera', en: 'Completed' },
  upcoming: { am: 'የሚመጣ', om: 'Kan Dhufu', en: 'Upcoming' },
  daysRemaining: { am: 'ቀናት ቀርተዋል', om: 'guyyootatu hafe', en: 'days remaining' },
  today: { am: 'ዛሬ', om: 'Har\'a', en: 'Today' },
  tomorrow: { am: 'ነገ', om: 'Boru', en: 'Tomorrow' },
  loading: { am: 'በማስላት ላይ...', om: 'Qorachaa jira...', en: 'Loading...' },
  actions: { am: 'ድርጊቶች', om: 'Tarkaanfilee', en: 'Actions' },

  // Lawsuit Drafter / Questionnaire (ክስ መመስረቻ)
  drafterTitle: {
    am: 'ክስ መመስረቻ (የከሳሽ መጠይቅና የክስ ማመልከቻ ማዘጋጃ)',
    om: 'Qophii Himannaa (Gaaffilee Himataa fi Iyyannoo Himannaa)',
    en: 'Lawsuit Filing (Plaintiff Questionnaire & Statement of Claim Drafter)',
  },
  drafterSubtitle: {
    am: 'ከሳሽ የሚጠበቅበትን መረጃዎች በሙሉ በቅደም ተከተል ሞልቶ ይፋዊ የፍርድ ቤት የክስ ወረቀት (Statement of Claim) በራስ-ሰር ማዘጋጃ።',
    om: 'Odeeffannoo fi gaaffilee himataa guutuudhaan iyyannoo himannaa seera qabeessa mana murtii qopheessuu.',
    en: 'Fill out the mandatory plaintiff questionnaire to generate an official court-ready Statement of Claim automatically.',
  },
  modeClaimFiling: {
    am: 'የክስ ማመልከቻ (Statement of Claim)',
    om: 'Iyyannoo Himannaa (Statement of Claim)',
    en: 'Statement of Claim (Plaint)',
  },
  modeGeneralDraft: {
    am: 'ሌሎች የሕግ ሰነዶች (ውል / መከላከያ / ማመልከቻ)',
    om: 'Barreeffamoota Seeraa Biroo (Waliigaltee / Deebii / Iyyannoo)',
    en: 'Other Legal Documents (Defense, Contract, Petition)',
  },
  quickTemplatesTitle: {
    am: 'ፈጣን የክስ አብነቶች (ምሳሌዎች)፦',
    om: 'Fakkeenya Dhimmoota Himannaa Yeroo Baay\'ee Dhihaatan፦',
    en: 'Quick Case Filing Templates:',
  },
  tplLoan: {
    am: 'የብድር ገንዘብ ማስመለስ ክስ',
    om: 'Himannaa Liqii Maallaqaa Deebisiisuu',
    en: 'Loan Repayment Recovery',
  },
  tplRent: {
    am: 'የቤት ኪራይ ክፍያና ማስለቀቂያ ክስ',
    om: 'Himannaa Kiraa Manaa fi Gadhiisiisuu',
    en: 'House Rent & Eviction',
  },
  tplConstruction: {
    am: 'የህንጻ / ቤት ሽያጭ ውል ጥሰት ክስ',
    om: 'Himannaa Diiggaa Waliigaltee Ijaarsaa/Bittaa',
    en: 'Construction / Sales Breach',
  },
  tplLabor: {
    am: 'ሕገ-ወጥ የሥራ ስንብትና የካሳ ክስ',
    om: 'Himannaa Hojii Irraa Ari\'amuu Seeraan Alaa',
    en: 'Unlawful Dismissal & Compensation',
  },
  tplCarAccident: {
    am: 'የመኪና አደጋ የጉዳት ካሳ ክስ',
    om: 'Himannaa Kasaaraa Balaa Konkolaataa',
    en: 'Traffic Accident Tort Damages',
  },

  // Questionnaire Sections
  secPlaintiffInfo: {
    am: '1. የከሳሽ (አመልካች) ሙሉ መረጃ',
    om: '1. Odeeffannoo Guutuu Himataa (Iyyataa)',
    en: '1. Plaintiff Information',
  },
  plaintiffFullName: {
    am: 'የከሳሽ ሙሉ ስም (ከነ አያት)',
    om: 'Maqaa Guutuu Himataa',
    en: 'Plaintiff Full Name',
  },
  plaintiffAddress: {
    am: 'የከሳሽ አድራሻ (ከተማ፣ ክ/ከተማ፣ ወረዳ፣ የቤት ቁ.)',
    om: 'Teessoo Himataa (Magaalaa, K/magaalaa, Woreda, Lakk. Manaa)',
    en: 'Plaintiff Address',
  },
  plaintiffPhone: {
    am: 'የስልክ ቁጥር',
    om: 'Lakk. Bilbilaa',
    en: 'Phone Number',
  },
  plaintiffRole: {
    am: 'የከሳሽ ማንነት / ማዕረግ (ከሳሽ፣ አበዳሪ፣ አከራይ ወዘተ)',
    om: 'Gahee Himataa (Himataa, Abbaa Liqii, Abbaa Qabeenyaa kkf)',
    en: 'Plaintiff Role / Capacity',
  },
  plaintiffAdvocate: {
    am: 'ውክልና (በግል የቀረበ ወይም የሕግ ጠበቃ ስም)',
    om: 'Bakka Bu\'ummaa (Ofiin yookiin Maqaa Abukaatoo)',
    en: 'Representation (Self or Advocate)',
  },

  secDefendantInfo: {
    am: '2. የተከሳሽ (መልስ ሰጪ) ሙሉ መረጃ',
    om: '2. Odeeffannoo Guutuu Himatamaa (Deebii Kennaa)',
    en: '2. Defendant Information',
  },
  defendantFullName: {
    am: 'የተከሳሽ ሙሉ ስም (ከነ አያት)',
    om: 'Maqaa Guutuu Himatamaa',
    en: 'Defendant Full Name',
  },
  defendantAddress: {
    am: 'የተከሳሽ አድራሻና ልዩ መለያ ቦታ',
    om: 'Teessoo Himatamaa fi Ibsa Bakka Addaa',
    en: 'Defendant Address & Landmark',
  },
  defendantPhone: {
    am: 'የተከሳሽ ስልክ ቁጥር (ካለ)',
    om: 'Lakk. Bilbila Himatamaa (yoo jiraate)',
    en: 'Defendant Phone (if known)',
  },

  secCourtInfo: {
    am: '3. የፍርድ ቤትና የችሎት መረጣ',
    om: '3. Mana Murtii fi Dhaaddacha',
    en: '3. Court & Bench Jurisdiction',
  },
  courtName: {
    am: 'የፍርድ ቤቱ ስም',
    om: 'Maqaa Mana Murtii',
    en: 'Court Name',
  },
  benchName: {
    am: 'የችሎቱ ዓይነት (ፍትሐብሔር፣ ወንጀል፣ ሠራተኛ)',
    om: 'Gosa Dhaaddachaa (Sivilii, Yakkaa, Hojjetaa)',
    en: 'Bench Name',
  },
  jurisdictionBasis: {
    am: 'የፍርድ ቤቱ የዳኝነት ስልጣን መሠረት',
    om: 'Bu\'uura Aangoo Mana Murtii',
    en: 'Jurisdiction Basis',
  },

  secClaimSubject: {
    am: '4. የክሱ ዓይነትና የሚጠየቀው የገንዘብ መጠን',
    om: '4. Gosa Himannaa fi Hanga Maallaqaa',
    en: '4. Claim Category & Amount in ETB',
  },
  claimCategory: {
    am: 'የክሱ ርዕስ ወይም ዓይነት',
    om: 'Mata-duree yookiin Gosa Himannaa',
    en: 'Claim Subject / Title',
  },
  claimAmountETB: {
    am: 'የሚጠየቀው የገንዘብ መጠን (ብር)',
    om: 'Hanga Maallaqa Barbaadamu (Qarshii)',
    en: 'Claim Amount (ETB)',
  },

  secQuestionsTitle: {
    am: '5. ከሳሽ የሚጠበቅበት የጽሁፍ መጠይቆች (Core Plaintiff Questionnaire)',
    om: '5. Gaaffilee Barreeffamaa Himataan Guutuu Qabu (Questionnaire)',
    en: '5. Mandatory Written Plaintiff Questionnaire',
  },
  qAgreementLabel: {
    am: 'ጥያቄ 1፡ ውሉ ወይም ግንኙነቱ መቼና እንዴት ተደረገ? (ቀን፣ ስምምነትና ግዴታ)',
    om: 'Gaaffii 1፡ Waliigalteen yookiin dhimmi kun yoom fi akkamitti raawwatame? (Guyyaa, Waliigaltee fi Dirqama)',
    en: 'Question 1: When & how was the agreement/transaction entered?',
  },
  qBreachLabel: {
    am: 'ጥያቄ 2፡ ተከሳሹ ምን አደረገ? ምን ዓይነት የውል ወይም የሕግ ጥሰት ፈጸመ?',
    om: 'Gaaffii 2፡ Himatamaan maal balleesse? Dirqama isaa akkamitti diige?',
    en: 'Question 2: What did the defendant do? How was the obligation breached?',
  },
  qNoticeLabel: {
    am: 'ጥያቄ 3፡ ለተከሳሹ የተሰጠ የጽሁፍ ማስጠንቀቂያ፣ የስልክ ጥሪ ወይም ማሳሰቢያ አለ?',
    om: 'Gaaffii 3፡ Akeekkachiisni barreeffamaa yookiin bilbilli himatamaaf kenname jiraa?',
    en: 'Question 3: Was formal written notice, demand, or warning served to the defendant?',
  },
  qDamagesLabel: {
    am: 'ጥያቄ 4፡ በከሳሽ ላይ ምን ዓይነት ጉዳት፣ ኪሳራ ወይም ጫና ደረሰ?',
    om: 'Gaaffii 4፡ Himataa irra miidhaan, kasaaraan yookiin dhiibbaan akkamii ga\'e?',
    en: 'Question 4: What specific damages, financial loss, or harm did the plaintiff suffer?',
  },
  qAdditionalLabel: {
    am: 'ተጨማሪ ፍሬ ነገሮች (ካለ)',
    om: 'Ibsa Dabalataa (yoo jiraate)',
    en: 'Additional Facts & Context (Optional)',
  },

  secLegalBases: {
    am: '6. የተጣሱ የሕግ ድንጋጌዎች (የሕግ መሠረት)',
    om: '6. Keewwattoota Seeraa Diigaman (Bu\'uuraalee Seeraa)',
    en: '6. Violated Legal Articles & Bases',
  },
  secPrayers: {
    am: '7. ለፍርድ ቤቱ የሚቀርብ የዳኝነት ጥያቄ (Prayers for Relief)',
    om: '7. Murtii fi Ajaja Barbaadamu (Gaaffii Abbaa-seerummaa)',
    en: '7. Relief / Demands Requested from Court',
  },
  secEvidences: {
    am: '8. የሰነድ ማስረጃዎችና ምስክሮች',
    om: '8. Ragaalee Barreeffamaa fi Dhugaa-baatota',
    en: '8. Documentary Evidence & Witnesses',
  },
  docEvidencesLabel: {
    am: 'የሰነድ ማስረጃዎች ዝርዝር (ውሎች፣ ደረሰኞች፣ የባንክ ስቴትመንት...)',
    om: 'Tarree Ragaalee Barreeffamaa (Waliigaltee, Nageetti, Isluphii Baankii...)',
    en: 'List of Documentary Evidences (Contracts, Receipts, Bank Slips)',
  },
  witnessesHeader: {
    am: 'የከሳሽ ምስክሮች (የሰው ማስረጃ)',
    om: 'Dhugaa-baatota Himataa (Ragaalee Namaa)',
    en: 'Plaintiff Witnesses',
  },
  addWitnessBtn: {
    am: '+ ምስክር ጨምር',
    om: '+ Dhugaa-baataa Dabali',
    en: '+ Add Witness',
  },
  witnessName: {
    am: 'የምስክር ሙሉ ስም',
    om: 'Maqaa Guutuu Dhugaa-baataa',
    en: 'Witness Full Name',
  },
  witnessAddress: {
    am: 'አድራሻ',
    om: 'Teessoo',
    en: 'Address',
  },
  witnessSubject: {
    am: 'የሚመሰክሩበት ፍሬ ነገር',
    om: 'Qabxii Dhugaa-ba\'umsaa',
    en: 'Subject of Testimony',
  },

  secVerification: {
    am: '9. የከሳሽ ቃለ-መሀላ ማረጋገጫ (Verification under Oath)',
    om: '9. Kakata Dhugummaa Mirkaneessuu (Verification under Oath)',
    en: '9. Verification under Oath',
  },
  generateClaimPleadingBtn: {
    am: 'ይፋዊ የፍርድ ቤት የክስ ወረቀት አዘጋጅ (Generate Plaint)',
    om: 'Iyyannoo Himannaa Mana Murtii Qopheessi (Generate)',
    en: 'Generate Official Court Statement of Claim',
  },
  generatingPleading: {
    am: 'የክስ ወረቀቱ በኢትዮጵያ ፍርድ ቤት ቅርጸት እየተዘጋጀ ነው...',
    om: 'Iyyannoon himannaa haala seera qabeessaan qophaa\'aa jira...',
    en: 'Drafting authentic court pleading...',
  },
  officialCourtPleadingPreview: {
    am: 'የተዘጋጀው ይፋዊ የክስ ወረቀት (Official Court Statement of Claim)',
    om: 'Iyyannoo Himannaa Seera Qabeessa Mana Murtiif Qophaa\'e',
    en: 'Official Court Statement of Claim Document',
  },
  saveToCasesBtn: {
    am: 'ወደ ክስ መቆጣጠሪያ ማዕከል መዝግብ',
    om: 'Gara Wiirtuu To\'annoo Himannaatti Dabali',
    en: 'Save to Case Control Center',
  },

  // Case Control Center
  caseCenterTitle: {
    am: 'የክስ መቆጣጠሪያ ማዕከል',
    om: 'Wiirtuu To\'annoo Himannaa',
    en: 'Case Control Center',
  },
  caseCenterSubtitle: {
    am: 'የፍርድ ቤት መዝገቦችዎን፣ የማስረጃ ሰነዶችንና የክርክር ሂደቶችን በአንድ ማዕከል ይከታተሉ።',
    om: 'Galmee mana murtii, ragaalee barreeffamaa fi sadarkaalee falmii bakka tokkotti hordofaa.',
    en: 'Manage your court dockets, evidentiary files, and trial milestones in one centralized hub.',
  },
  newCaseBtn: {
    am: '+ አዲስ መዝገብ መዝግብ',
    om: '+ Galmee Haaraa Dabali',
    en: '+ Register New Case',
  },
  searchCasesPlaceholder: {
    am: 'በመዝገብ ቁጥር፣ በተከሳሽ ወይም በርዕስ ፈልግ...',
    om: 'Lakk. Galmeetin, Himatamaan yookiin Mata-dureedhaan barbaadi...',
    en: 'Search by docket number, party, or title...',
  },
  totalCasesCount: {
    am: 'ጠቅላላ መዝገቦች',
    om: 'Waliigala Galmeewwanii',
    en: 'Total Dockets',
  },
  activeCasesCount: {
    am: 'ንቁ ክርክሮች',
    om: 'Falmiiwwan Adeemsa Irra Jiran',
    en: 'Active Disputes',
  },
  courtFeeCalculator: {
    am: 'የፍርድ ቤት ማህተም/ዳኝነት ክፍያ ማስያ',
    om: 'Herreega Kaffaltii Askuutaa Mana Murtii',
    en: 'Court Fee Stamp Calculator',
  },

  // Hearing Tracker
  hearingsTitle: {
    am: 'የፍርድ ቤት ቀጠሮ አስተዳደር',
    om: 'Bulchiinsa Beellama Mana Murtii',
    en: 'Court Hearing Tracker',
  },
  hearingsSubtitle: {
    am: 'የፍርድ ቤት ቀጠሮዎችን፣ ችሎቶችን፣ የምስክርና የሰነድ ዝግጅት ማረጋገጫዎችን ይከታተሉ።',
    om: 'Beellama mana murtii, dhaaddachaa fi qophii ragaa dhagahuu hordofaa.',
    en: 'Track trial dates, bench sessions, checklists, and legal alerts.',
  },
  addHearingBtn: {
    am: '+ አዲስ ቀጠሮ መዝግብ',
    om: '+ Beellama Haaraa Galmeessi',
    en: '+ Schedule Hearing',
  },
  checklistTitle: {
    am: 'የችሎት ዝግጅት ማረጋገጫ (Checklist)',
    om: 'Tarree Qophii Dhaaddachaa (Checklist)',
    en: 'Hearing Preparation Checklist',
  },
  hearingPurpose: {
    am: 'የቀጠሮው ዓላማ',
    om: 'Kaayyoo Beellamaa',
    en: 'Hearing Purpose',
  },

  // Law Library
  libraryTitle: {
    am: 'የሕግ መረጃ ፍለጋ ሞተርና ቤተ-መጽሐፍት',
    om: 'Barbaada Seeraa & Mana Kitaabaa',
    en: 'Legal Search Engine & Digital Law Library',
  },
  librarySubtitle: {
    am: 'የኢትዮጵያ ፍትሐብሔር፣ ወንጀል፣ ሠራተኛ፣ ቤተሰብ ሕጎችንና አስገዳጅ የሰበር ውሳኔዎችን ይፈልጉ።',
    om: 'Seera sivilii, yakkaa, hojjetaa fi hojjechiisaa, maatii fi murteewwan ijibbaataa barbaadaa.',
    en: 'Search Ethiopian civil, criminal, labor, and family codes, plus binding cassation decisions.',
  },
  searchLibraryPlaceholder: {
    am: 'የጉዳይዎን ፍሬ ነገር ወይም የሚፈልጉትን የሕግ አንቀጽ እዚህ ይጻፉ...',
    om: 'Qabxii dhimma keessanii yookiin keewwata seeraa barbaaddan asitti barreessaa...',
    en: 'Type your legal issue, incident, or article number here...',
  },
  popularSearchesTitle: {
    am: 'ተደጋጋሚ የሕግ ፍለጋዎች (ምሳሌዎች)፦',
    om: 'Barbaada Seeraa Yeroo Baay\'ee Gaafataman፦',
    en: 'Popular Legal Queries:',
  },
  abyssiniaDirectLink: {
    am: 'በ Abyssinia Law ላይ በቀጥታ ፈልግ',
    om: 'Abyssinia Law irratti kallattiin barbaadi',
    en: 'Direct Search on Abyssinia Law',
  },

  // Legal Consultation
  consultationTitle: {
    am: 'የሕግ ምክክርና የሰነድ ትንተና',
    om: 'Gorsa Seeraa & Xiinxala Ragaalee',
    en: 'Legal Consultation & Document Analysis',
  },
  consultationSubtitle: {
    am: 'የሕግ ችግርዎን በጽሁፍ ያብራሩ ወይም ውሎችዎን ይጫኑ፤ ሲስተሙ አግባብነት ያላቸውን የኢትዮጵያ ሕጎችና ሰበር ውሳኔዎችን በመመርመር ይመክራል።',
    om: 'Dhimma seeraa keessan barreessaa yookiin ragaalee olkaawaa; seerota Itoophiyaa fi murteewwan ijibbaataan xiinxalamee gorsi ni kennama.',
    en: 'Describe your dispute or upload documents; our system analyzes relevant Ethiopian laws and cassation rulings to counsel you.',
  },
  startFilingBtnFromConsultation: {
    am: 'ወደ ክስ መመስረቻ ማዘጋጃ ቀጥል (Filing Lawsuit)',
    om: 'Gara Qophii Himannaatti Darbi (File Lawsuit)',
    en: 'Proceed to Lawsuit Drafter',
  },
  caseStrengthTitle: {
    am: 'የማሸነፍ እድልና የክስ ጥንካሬ (Strength Score)',
    om: 'Cimina Dhimmaa & Carraa Injifannoo',
    en: 'Case Strength & Win Probability',
  },
  applicableArticlesTitle: {
    am: 'የሚመለከቷቸው የሕግ ድንጋጌዎች',
    om: 'Keewwattoota Seeraa Dhimma Kanaan Walqabatan',
    en: 'Applicable Legal Provisions',
  },
  cassationPrecedentsTitle: {
    am: 'አስገዳጅ የፌዴራል ሰበር ችሎት ውሳኔዎች',
    om: 'Murteewwan Dirqisiisoo Dhaddacha Ijibbaata Federaalaa',
    en: 'Binding Federal Supreme Court Cassation Precedents',
  },
  rightsAndLiabilitiesTitle: {
    am: 'የከሳሽ መብቶችና የተከሳሽ ግዴታዎች',
    om: 'Mirga Himataa fi Dirqama Himatamaa',
    en: 'Plaintiff Rights & Defendant Liabilities',
  },
  remediesTitle: {
    am: 'የሕግ መፍትሔዎችና አማራጮች',
    om: 'Filannoowwan Furmaata Seeraa',
    en: 'Legal Remedies & Options',
  },
  actionPlanTitle: {
    am: 'የተግባር ቅደም ተከተል (Action Plan)',
    om: 'Tarkaanfilee Hojiirra Ooluu Qaban',
    en: 'Action Plan & Next Steps',
  },
  evidenceChecklistTitle: {
    am: 'የሚያስፈልጉ ማስረጃዎች ማረጋገጫ',
    om: 'Tarree Ragaalee Qophaa\'uu Qabanii',
    en: 'Evidence Checklist',
  },

  // Categories
  catCivil: { am: 'ፍትሐብሔር', om: 'Sivilii', en: 'Civil' },
  catCriminal: { am: 'ወንጀል', om: 'Yakkaa', en: 'Criminal' },
  catLabor: { am: 'የሠራተኛ ክርክር', om: 'Hojjetaa fi Hojjechiisaa', en: 'Labor' },
  catFamily: { am: 'የቤተሰብ ሕግ', om: 'Maatii', en: 'Family' },
  catCommercial: { am: 'የንግድ ሕግ', om: 'Daldalaa', en: 'Commercial' },
  catCassation: { am: 'የሰበር ውሳኔዎች', om: 'Murteewwan Ijibbaataa', en: 'Cassation' },

  // Stages
  stagePreTrial: { am: 'ቅድመ-ክስ / ማስረጃ ማሰባሰብ', om: 'Qophii Duraa / Ragaa Walitti Qabuu', en: 'Pre-Trial / Evidence Gathering' },
  stageFiled: { am: 'ክስ ተመሠረተ', om: 'Himannaan Banameera', en: 'Claim Filed' },
  stageSummons: { am: 'መጥሪያና መልስ', om: 'Wamicha fi Deebii', en: 'Summons Served & Defense' },
  stageFraming: { am: 'ጭብጥ መያዝ / የቃል ክርክር', om: 'Qabxii Qabachuu / Falmii Afaanii', en: 'Framing Issues' },
  stageWitness: { am: 'የምስክሮች መስማት', om: 'Ragaa Dhagahuu', en: 'Witness Hearing' },
  stageJudgment: { am: 'ውሳኔ / ፍርድ', om: 'Murtii Mana Murtii', en: 'Judgment / Verdict' },
  stageAppeal: { am: 'ይግባኝ / ሰበር', om: 'Ol-iyyannoo / Ijibbaata', en: 'Appeal / Cassation' },
  stageExecution: { am: 'ፍርድ አፈጻጸም', om: 'Raawwii Murtii', en: 'Execution' },

  // Roles
  rolePlaintiff: { am: 'ከሳሽ', om: 'Himataa', en: 'Plaintiff' },
  roleDefendant: { am: 'ተከሳሽ', om: 'Himatamaa', en: 'Defendant' },
  roleLawyer: { am: 'ጠበቃ', om: 'Abukaatoo', en: 'Lawyer' },
  roleNeutral: { am: 'ገለልተኛ / አማካሪ', om: 'Giddu-galeessa / Gorsaa', en: 'Neutral / Advisor' },

  // Translator Module (ተርጓሜ / Hiikaa)
  translatorTitle: {
    am: 'የሕግና ሰነዶች ተርጓሜ (አማርኛ ⇄ Afaan Oromoo ⇄ English)',
    om: 'Hiikaa Seeraa fi Sanadootaa (Afaan Oromoo ⇄ አማርኛ ⇄ English)',
    en: 'Legal & Document Translator (Amharic ⇄ Afaan Oromoo ⇄ English)',
  },
  translatorSubtitle: {
    am: 'በኢትዮጵያ የሕግ ቃላት፣ የፍርድ ቤት አቤቱታዎች፣ ውሎች እና ይፋዊ ሰነዶች ላይ ያተኮረ ባለሙያ ትርጉም በፅሁፍ እና በሰነድ',
    om: 'Jechoota seeraa Itoophiyaa, iyyannoowwan mana murtii, waliigalteewwan fi sanadoota seeraa irratti kan xiyyeeffate barruu fi sanadaan',
    en: 'Specialized translation for Ethiopian legal terminology, court pleadings, contracts, and official documents in text and files',
  },
  translatorModeText: {
    am: 'የጽሑፍ ትርጉም',
    om: 'Hiika Barruu',
    en: 'Text Translation',
  },
  translatorModeDoc: {
    am: 'የሰነድ ትርጉም (በሰነድ)',
    om: 'Hiika Sanadaa (Faayila)',
    en: 'Document Translation',
  },
  translatorModeLexicon: {
    am: 'የሕግ ቃላት መዝገበ-ቃላት',
    om: 'Galmee Jechoota Seeraa',
    en: 'Legal Glossary',
  },
  domainLegal: {
    am: 'የሕግና ፍርድ ቤት ይዘት (Legal & Court)',
    om: 'Qabiyyee Seeraa fi Mana Murtii',
    en: 'Legal & Judicial',
  },
  domainFormal: {
    am: 'ይፋዊና አስተዳደራዊ (Official / Formal)',
    om: 'Akeeka Mootummaa & Bulchiinsaa',
    en: 'Official & Administrative',
  },
  domainGeneral: {
    am: 'አጠቃላይና ንግግር (General)',
    om: 'Waliigalaa & Haasaa',
    en: 'General & Conversational',
  },
  autoDetect: {
    am: 'ቋንቋውን በራሱ ለይ (Detect Language)',
    om: 'Afaan ofumaan adda baasi',
    en: 'Detect Language',
  },
  sourceTextPlaceholder: {
    am: 'የሚተረጎመውን ጽሑፍ እዚህ ይጻፉ ወይም ይለጥፉ...',
    om: 'Barruu hiikamu asitti barreessaa ykn maxxansaa...',
    en: 'Type or paste text to translate here...',
  },
  translatedPlaceholder: {
    am: 'የተተረጎመው ጽሑፍ እዚህ ይወጣል...',
    om: 'Barruun hiikame asitti mul\'ata...',
    en: 'Translated text will appear here...',
  },
  translateBtn: {
    am: 'ተርጉም',
    om: 'Hiiki',
    en: 'Translate',
  },
  translatingBtn: {
    am: 'በመተርጎም ላይ...',
    om: 'Hiikaa jira...',
    en: 'Translating...',
  },
  swapLanguages: {
    am: 'ቋንቋዎችን ቀያይር (⇄)',
    om: 'Afaanota wal-jijjiiri (⇄)',
    en: 'Swap Languages (⇄)',
  },
  clearText: {
    am: 'አጽዳ',
    om: 'Qulqulleessi',
    en: 'Clear',
  },
  pasteClipboard: {
    am: 'ለጥፍ',
    om: 'Maxxansi',
    en: 'Paste',
  },
  sendToDrafter: {
    am: 'ወደ ክስ መመስረቻ ላክ',
    om: 'Gara Qophii Himannaatti Ergi',
    en: 'Send to Lawsuit Drafter',
  },
  sendToConsultation: {
    am: 'ወደ ሕግ ምክክር ላክ',
    om: 'Gara Gorsa Seeraatti Ergi',
    en: 'Send to Consultation',
  },
  uploadDocTitle: {
    am: 'የሚተረጎመውን ሰነድ ይጫኑ',
    om: 'Sanada hiikamu ol-fe\'aa',
    en: 'Upload Document to Translate',
  },
  uploadDocSub: {
    am: 'የጽሑፍ ፋይሎች (.txt, .doc, .docx, .rtf, .json, .csv) ተቀባይነት አላቸው',
    om: 'Faayiloota barruu (.txt, .doc, .docx, .rtf, .json, .csv) ni simata',
    en: 'Supports text documents (.txt, .doc, .docx, .rtf, .json, .csv)',
  },
  translateDocBtn: {
    am: 'ሰነዱን ተርጉም',
    om: 'Sanadicha Hiiki',
    en: 'Translate Document',
  },
  downloadTranslatedDoc: {
    am: 'የተተረጎመውን ሰነድ አውርድ (.doc)',
    om: 'Sanada Hiikame Buufadhu (.doc)',
    en: 'Download Translated Document (.doc)',
  },
  compareView: {
    am: 'የጎንዮሽ እይታ (Side-by-Side)',
    om: 'Mula\'ta Wal-biraa (Side-by-Side)',
    en: 'Side-by-Side View',
  },
  sampleSnippetsTitle: {
    am: 'የናሙና የሕግ አባባሎችና ውሎች',
    om: 'Fakkeenya Jechoota Seeraa fi Waliigaltee',
    en: 'Sample Legal Snippets & Templates',
  },

  // Court Jurisdiction Module (ክስ የማየት ስልጣን / Aangoo Dhimma Ilaaluu)
  jurisdictionTitle: {
    am: 'የፍርድ ቤቶች ክስ የማየት ስልጣን መለያና የቅድመ-ክስ መስፈርቶች',
    om: 'Qorannoo Aangoo Manneen Murtii fi Ulaagaalee Himannaa Duraa',
    en: 'Court Jurisdiction Checker & Pre-Filing Requirements Advisor',
  },
  jurisdictionSubtitle: {
    am: 'የክርክሩን ፍሬ ነገር፣ የገንዘብ መጠንና የተከሳሹን አድራሻ በመመዘን ተገቢውን ፍርድ ቤት፣ ችሎትና ምድብ እንዲሁም የሚያስፈልጉ ሰነዶችን በዝርዝር የሚያሳይ ስርዓት',
    om: 'Qabiyyee dhimmaa, hanga maallaqaa fi teessoo himatamaa madaaluun mana murtii aangoo qabu, dhaddacha fi ulaagaalee barbaachisan tarreessee agarsiisa',
    en: 'Determines the competent court, bench, and local venue based on subject matter, claim amount, and geography, with a complete filing checklist',
  },
  jurisdictionWizardStep1: {
    am: '1. የክርክሩ ሁኔታና አይነት',
    om: '1. Haala fi Akaakuu Falmii',
    en: '1. Nature & Subject Matter',
  },
  jurisdictionWizardStep2: {
    am: '2. የተከራካሪዎች ማንነትና የገንዘብ መጠን',
    om: '2. Eenyummaa Wal-falmitootaa & Maallaqa',
    en: '2. Parties & Claim Amount',
  },
  jurisdictionWizardStep3: {
    am: '3. የቦታና የግዛት ሁኔታ (Venue)',
    om: '3. Iddoo fi Daangaa Teessoo (Venue)',
    en: '3. Location & Local Venue',
  },
  jurisdictionWizardStep4: {
    am: '4. ውጤትና የሚያስፈልጉ ነገሮች',
    om: '4. Bu\'aa fi Ulaagaalee Barbaachisan',
    en: '4. Jurisdiction & Requirements',
  },
  analyzeJurisdictionBtn: {
    am: 'ክስ የማየት ስልጣኑን ለይ',
    om: 'Aangoo Mana Murtii Adda Baasi',
    en: 'Determine Jurisdiction',
  },
  analyzingJurisdictionBtn: {
    am: 'ስልጣኑን በሕጉ መሠረት በመመርመር ላይ...',
    om: 'Aangoo seeraan sakatta\'aa jira...',
    en: 'Evaluating Jurisdiction...',
  },
  competentCourtLabel: {
    am: 'ጉዳዩን የማየት ስልጣን ያለው ፍርድ ቤት',
    om: 'Mana Murtii Dhimma Ilaaluuf Aangoo Qabu',
    en: 'Competent Court Having Jurisdiction',
  },
  competentBenchLabel: {
    am: 'የተመደበው ችሎት',
    om: 'Dhaddacha Ramaddame',
    en: 'Designated Bench',
  },
  localVenueLabel: {
    am: 'የቦታ / የምድብ ስልጣን (Venue)',
    om: 'Aangoo Iddoo / Ramaddii (Venue)',
    en: 'Local Venue / Division',
  },
  legalGroundsLabel: {
    am: 'የሕግ መሠረቶችና ድንጋጌዎች',
    om: 'Bu\'uuraalee Seeraa fi Keewwattoota',
    en: 'Statutory Grounds & Articles',
  },
  preliminaryRequirementsLabel: {
    am: 'ክሱን ለመመስረት በቅድሚያ የሚያስፈልጉ ነገሮች (Checklist)',
    om: 'Ulaagaalee Himannaa Banuuf Duraan Barbaachisan',
    en: 'Mandatory Pre-Filing Checklist',
  },
  potentialObjectionsLabel: {
    am: 'ሊያጋጥሙ የሚችሉ የመጀመርያ ደረጃ መቃወሚያዎች',
    om: 'Mormiiwwan Sadarkaa Duraa Mudachuu Danda\'an',
    en: 'Anticipated Preliminary Objections',
  },
  actionSendToDrafter: {
    am: 'በዚህ ፍርድ ቤት ክስ አዘጋጅ (ወደ ክስ መመስረቻ ላክ)',
    om: 'Mana Murtii Kanaan Himannaa Qopheessi',
    en: 'Draft Lawsuit for this Court',
  },
  actionPrintReport: {
    am: 'የስልጣን ውሳኔ ሪፖርት አትም',
    om: 'Gabaasa Aangoo Mana Murtii Maxxansi',
    en: 'Print Jurisdiction Report',
  },

  // Court Fee Calculator (የዳኝነት ክፍያ ማስያ / Kaffaltii Abbaa Seerummaa)
  feeCalculatorTitle: {
    am: 'የፌዴራል ፍርድ ቤቶች አዲስ የዳኝነት ክፍያ ደንብ ቁጥር ፩/፪ሺ፲፯ (Regulation 1/2024)',
    om: 'Dambii Haaraa Kaffaltii Abbaa Seerummaa Manneen Murtii Federaalaa Lakk. 1/2017',
    en: 'Federal Courts Judicial Fee Regulation No. 1/2017 (Regulation 1/2024)',
  },
  feeCalculatorSubtitle: {
    am: 'የቀድሞውን የ1952 ደንብ በመሻር የወጣውን አዲሱን የፌዴራል ፍርድ ቤቶች የዳኝነት አገልግሎት ክፍያ ደንብ ቁጥር 1/2017 (1/2024) እና የፍትሐብሔር ሥነ-ሥርዓት ድንጋጌዎችን መሠረት ያደረገ ይፋዊ የክፍያ ማስያ',
    om: 'Dambii kaffaltii bara 1952 ture haquun kan ba\'e Dambii Kaffaltii Abbaa Seerummaa Manneen Murtii Federaalaa Lakk. 1/2017 (1/2024) irratti hundaa\'ee shallaga',
    en: 'Official court fee calculator based on the newly enacted Federal Courts Court Fee Regulation No. 1/2017 (Regulation 1/2024), which repealed the 1952 rules',
  },
  claimAmountInputLabel: {
    am: 'የይገባኛል ጥያቄው የገንዘብ መጠን (በኢትዮጵያ ብር - ETB)',
    om: 'Hanga Maallaqa Iyyatame (Qarshii Itoophiyaa - ETB)',
    en: 'Claim Amount (Ethiopian Birr - ETB)',
  },
  claimTypePecuniary: {
    am: 'በገንዘብ የሚተመን ክስ (Pecuniary Claim)',
    om: 'Himannaa Maallaqaan Tilmaamamu',
    en: 'Pecuniary Claim (Valued in Money)',
  },
  claimTypeNonPecuniary: {
    am: 'የገንዘብ ግምት የሌለው ክስ (Non-Pecuniary)',
    om: 'Himannaa Gatii Maallaqaa Hin Qabne',
    en: 'Non-Pecuniary (Not Admitting of Valuation)',
  },
  calculatedTotalCourtFee: {
    am: 'አጠቃላይ የሚፈለግ የመጀመርያ ደረጃ የዳኝነት ክፍያ',
    om: 'Ida\'ama Kaffaltii Abbaa Seerummaa Sadarkaa Duraa',
    en: 'Total First-Instance Court Fee Payable',
  },
  baseFeeLabel: {
    am: 'ዋና የዳኝነት ክፍያ (Base Court Fee)',
    om: 'Kaffaltii Bu\'uuraa Abbaa Seerummaa',
    en: 'Base Court Fee',
  },
  summonsFeeLabel: {
    am: 'የመጥሪያና ማስታወቂያ ክፍያ',
    om: 'Kaffaltii Waamicha Mana Murtii',
    en: 'Summons & Service of Process Fee',
  },
  appealFeeLabel: {
    am: 'የይግባኝ አቤቱታ ክፍያ',
    om: 'Kaffaltii Iyyannoo Ol-iyyannoo',
    en: 'Appeal Petition Fee',
  },
  cassationFeeLabel: {
    am: 'የሰበር አቤቱታ ምዝገባ ክፍያ',
    om: 'Kaffaltii Galmee Ijibbaataa',
    en: 'Cassation Registration Fee',
  },
  executionFeeLabel: {
    am: 'የፍርድ አፈጻጸም ክፍያ',
    om: 'Kaffaltii Raawwii Murtii',
    en: 'Decree Execution Fee',
  },
  inFormaPauperisTitle: {
    am: 'በደሃ ደንብ ክስ መመስረት (የፍ/ብ/ሥ/ሥ/ሕ/ቁ 467-479)',
    om: 'Kaffaltii Malee Himannaa Banuu (In Forma Pauperis)',
    en: 'Suits in Forma Pauperis (Court Fee Waiver)',
  },
  compromiseRefundTitle: {
    am: 'በዕርቅ ወይም በስምምነት ሲጠናቀቅ የሚመለስ ክፍያ (አንቀጽ 278)',
    om: 'Kaffaltii Yeroo Araaraan Xumuramu Deebi\'u (Kw. 278)',
    en: 'Court Fee Refund upon Settlement / Compromise (Art. 278)',
  },
  costRecoveryTitle: {
    am: 'ከተሸናፊ ወገን የሚመለስ ወጪና ኪሳራ (አንቀጽ 462-466)',
    om: 'Baasii fi Kasaaraa Qaama Mo\'ame Irraa Deebi\'u (Kw. 462)',
    en: 'Recovery of Court Costs & Fees from Losing Party (Arts. 462-466)',
  },
  printAssessmentSlip: {
    am: 'የክፍያ ማጠቃለያ ደረሰኝ አትም',
    om: 'Nagahee Shallaggii Kaffaltii Maxxansi',
    en: 'Print Fee Assessment Slip',
  },
  copyCalculationSummary: {
    am: 'የክፍያ ስሌቱን ቅዳ',
    om: 'Gabaasa Shallaggii Garagalchi',
    en: 'Copy Calculation Breakdown',
  },

  // Statement of Defense Module (የተከሳሽ የመከላከያ መልስ አዘጋጅ / Deebii Himatamaa)
  defenseDrafterTitle: {
    am: 'የተከሳሽ የመከላከያ መልስ አዘጋጅ (AI Statement of Defense Drafter)',
    om: 'Qopheessaa Deebii Himatamaa (AI Statement of Defense)',
    en: 'Defendant Statement of Defense AI Drafter (Civil Procedure Code)',
  },
  defenseDrafterSubtitle: {
    am: 'የክስ ወረቀት ሲደርስዎ ሰነዱን (PDF፣ ምስል ወይም ፎቶ) በማስገባት ወይም ጽሑፉን በመለጠፍ ለፍርድ ቤቱ በሕጉ መሠረት የተሟላ የመከላከያ መልስ፣ የመጀመሪያ ደረጃ መቃወሚያዎችና ማስረጃዎችን በራስ-ሰር ያዘጋጃል',
    om: 'Waraqaan himannaa yoo isin qaqqabe sanadicha (PDF, suuraa) galchuun ykn barruu maxxansuun deebii himatamaa guutuu, mormiiwwan sadarkaa duraa fi ragaalee seeraan qopheessa',
    en: 'Upload the plaintiff claim document (PDF, photo, scan) or paste text to automatically generate a formal court Statement of Defense with preliminary objections and substantive denials',
  },
  uploadClaimDocLabel: {
    am: 'የደረሰዎትን የክስ ሰነድ ወይም መጥሪያ ያስገቡ (PDF ወይም ምስል/ፎቶ)',
    om: 'Sanada Himannaa ykn Waamicha Isin Qaqqabe Galchaa (PDF/Suuraa)',
    en: 'Upload Served Lawsuit / Summons Document (PDF or Photo)',
  },
  pasteClaimTextLabel: {
    am: 'ወይም የክሱን ጽሑፍ እዚህ ይለጥፉ / ይጻፉ',
    om: 'Yookiin Barruu Himannichaa Asitti Barreessaa / Maxxansaa',
    en: 'Or Paste / Type Plaintiff\'s Claim Text Here',
  },
  defenseStep1: {
    am: '1. የክስ ሰነድና መረጃ ማስገቢያ',
    om: '1. Sanada Himannaa & Odeeffannoo',
    en: '1. Claim Paper & Info',
  },
  defenseStep2: {
    am: '2. የተከሳሽ መከራከሪያና መቃወሚያዎች',
    om: '2. Mormiiwwan & Falmii Himatamaa',
    en: '2. Objections & Facts',
  },
  defenseStep3: {
    am: '3. የተዘጋጀ ይፋዊ የመከላከያ መልስ',
    om: '3. Waraqaa Deebii Himatamaa',
    en: '3. Statement of Defense',
  },
  generateDefenseBtn: {
    am: 'የመከላከያ መልስ አዘጋጅ',
    om: 'Deebii Himatamaa Qopheessi',
    en: 'Generate Statement of Defense',
  },
  generatingDefenseBtn: {
    am: 'የመከላከያ መልስ በሕጉ መሠረት እየተዘጋጀ ነው...',
    om: 'Deebiin seeraan qophaa\'aa jira...',
    en: 'Drafting Statement of Defense...',
  },
  preliminaryObjectionsSection: {
    am: 'የመጀመሪያ ደረጃ መቃወሚያዎች (የፍ/ሥ/ሥ/ሕ/ቁ 244)',
    om: 'Mormiiwwan Sadarkaa Duraa (Kw. 244)',
    en: 'Preliminary Objections (Art. 244)',
  },
  factsDenialSection: {
    am: 'ለክሱ ፍሬ ነገር የተሰጠ መልስና ክህደት (የፍ/ሥ/ሥ/ሕ/ቁ 235-236)',
    om: 'Qabiyyee Himannaa Irratti Deebii fi Waakkannaa (Kw. 235)',
    en: 'Substantive Response & Specific Denials (Arts. 235-236)',
  },
  affirmativeDefenseSection: {
    am: 'የተከሳሽ አዎንታዊ መከላከያ ነጥቦች (Affirmative Defenses)',
    om: 'Qabxiiwwan Ittisaa Dabalataa Himatamaa',
    en: 'Defendant Affirmative Defenses',
  },
  remediesSoughtSection: {
    am: 'የሚጠየቅ ዳኝነት (Prayer for Relief)',
    om: 'Murtii Gaafatamu (Relief Sought)',
    en: 'Prayer / Relief Sought',
  },
  evidenceSection: {
    am: 'የተከሳሽ ማስረጃዎችና ምስክሮች (የፍ/ሥ/ሥ/ሕ/ቁ 223/234)',
    om: 'Ragaalee Sanadaa fi Ragoolee Himatamaa',
    en: 'Defendant Evidence & Witness List',
  },
  defenseVerificationSection: {
    am: 'የተከሳሽ የሕግ ማረጋገጫ ቃለ-መሐላ (የፍ/ሥ/ሥ/ሕ/ቁ 92)',
    om: 'Kakuu fi Mirkaneessa Seeraa Himatamaa (Kw. 92)',
    en: 'Legal Verification / Affidavit (Art. 92)',
  },
};

