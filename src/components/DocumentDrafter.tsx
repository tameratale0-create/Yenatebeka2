import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  Download,
  Scale,
  Building,
  UserCheck,
  FileCheck,
  HelpCircle,
  Plus,
  Trash2,
  BookmarkPlus,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Send,
  Eye,
  Edit3,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { LawsuitQuestionnaire, PlaintiffWitness, ManagedCase } from '../types/legal';
import { useLanguage } from '../context/LanguageContext';

interface DocumentDrafterProps {
  initialData?: Partial<LawsuitQuestionnaire> | null;
  onSaveToManagedCases?: (newCase: ManagedCase) => void;
  onNavigateToDefense?: () => void;
}

export const DocumentDrafter: React.FC<DocumentDrafterProps> = ({
  initialData,
  onSaveToManagedCases,
  onNavigateToDefense,
}) => {
  const { language, t, isOromo, isEnglish } = useLanguage();

  // Mode: Claim Formulator (ክስ መመስረቻ / Qophii Himannaa) vs General Drafter (ሌሎች ሰነዶች)
  const [activeMode, setActiveMode] = useState<'claim_filing' | 'general_docs'>('claim_filing');

  // Help Guide Accordion
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Plaintiff Questionnaire State
  const [plaintiffName, setPlaintiffName] = useState(
    isOromo ? 'Obbo Tashoomaa Baqqalaa Gamadaa' : 'አቶ ተስፋዬ በቀለ ገብረመድህን'
  );
  const [plaintiffAddress, setPlaintiffAddress] = useState(
    isOromo 
      ? 'Finfinnee, K/Magaalaa Qirqoos, Woreda 03, Lakk. Manaa 412' 
      : 'አዲስ አበባ፣ ቂርቆስ ክ/ከተማ፣ ወረዳ 03፣ የቤት ቁጥር 412'
  );
  const [plaintiffPhone, setPlaintiffPhone] = useState('+251 911 234567');
  const [plaintiffRole, setPlaintiffRole] = useState(
    isOromo ? 'Himataa / Abbaa Liqii / Qabeenya Qabeessa' : 'ከሳሽ / አበዳሪ / ባለመብት'
  );
  const [plaintiffAdvocate, setPlaintiffAdvocate] = useState(
    isOromo ? 'Ofiin kan dhihaate' : 'በግል የቀረበ'
  );

  const [defendantName, setDefendantName] = useState(
    isOromo ? 'Obbo Girmaa Walde-ab Hayiluu' : 'አቶ ግርማ ወልደአብ ሃይሉ'
  );
  const [defendantAddress, setDefendantAddress] = useState(
    isOromo 
      ? 'Finfinnee, K/Magaalaa Boolee, Woreda 05, Lakk. Manaa 890 (Bakka addaa: 22 naannawaa)' 
      : 'አዲስ አበባ፣ ቦሌ ክ/ከተማ፣ ወረዳ 05፣ የቤት ቁጥር 890 (ልዩ ቦታ፡ 22 ማዞሪያ አጠገብ)'
  );
  const [defendantPhone, setDefendantPhone] = useState('+251 922 765432');

  const [courtName, setCourtName] = useState(
    isOromo 
      ? 'Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Lidataa' 
      : 'የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ ችሎት'
  );
  const [courtBench, setCourtBench] = useState(
    isOromo ? 'Dhaaddacha Sivilii' : 'የፍትሐብሔር ችሎት'
  );
  const [jurisdictionBasis, setJurisdictionBasis] = useState(
    isOromo
      ? "Hangi maallaqa gaafatamee fi teessoon himatamaa aangoo mana murtii kabajamaa kanaa jalatti kan kufu waan ta'eef"
      : 'የገንዘቡ መጠን እና የተከሳሹ መኖሪያ አድራሻ በዚህ ክቡር ፍርድ ቤት ስልጣን ስር የሚወድቅ በመሆኑ'
  );

  const [claimCategory, setClaimCategory] = useState(
    isOromo 
      ? 'Iyyannoo Himannaa Liqii Maallaqaa Waliigalteen Alatti Hafe Deebisiisuu'
      : 'የተበደረውን ገንዘብ በውሉ መሠረት ሳይመልስ የቀረ ተበዳሪ የገንዘብ ማስመለስ ክስ'
  );
  const [claimAmount, setClaimAmount] = useState('250,000');

  // The 4 Core Written Questions required of the Plaintiff (ከሳሽ የሚጠበቅበት መጠይቆች / Gaaffilee Himataa)
  const [questionAgreementDetails, setQuestionAgreementDetails] = useState(
    isOromo
      ? "Guyyaa 12/03/2016 A.L.I tti himatamaan dhimma daldala ariifachiisaaf jecha Qarshii 250,000 (kuma dhibba lamaa fi shantama) waliigaltee barreeffamaatiin himataa irraa liqeeffateera. Maallaqichas ji'oota 6 keessatti hanga 12/09/2016 tti guutummaatti deebisuuf ifatti waliigaleera."
      : 'በቀን 12/03/2016 ዓ.ም ተከሳሽ ለአስቸኳይ የንግድ ስራ ማስኬጃ በሚል የ 250,000 (ሁለት መቶ ሃምሳ ሺህ) ብር ብድር በጽሁፍ ውል ከከሳሽ ተበድሯል። ገንዘቡንም በ6 ወራት ውስጥ እስከ 12/09/2016 ዓ.ም ድረስ ሙሉ በሙሉ ለመመለስ በውሉ ላይ በግልጽ ተስማምቷል።'
  );
  const [questionBreachDetails, setQuestionBreachDetails] = useState(
    isOromo
      ? "Yeroon kaffaltii waliigaltee 12/09/2016 tti kan xumurame ta'us, himatamaan maallaqa fudhate deebisuu dhabuu isaa malees; bilbila irra deddeebiin godhameef kaasuun dhiisuu fi teessoo isaa jijjiiruudhaan dirqama waliigaltee isaa guutummaatti diigeera."
      : 'የውሉ የመመለሻ ጊዜ በ12/09/2016 ዓ.ም ያበቃ ቢሆንም ተከሳሹ የተረከበውን ገንዘብ ሳይመልስ የቀረ ከመሆኑም በላይ፤ በተደጋጋሚ የተደረገለትን የስልክ ጥሪ ባለመመለስና አድራሻውን በመቀየር የውል ግዴታውን ሙሉ በሙሉ ጥሷል።'
  );
  const [questionDemandAndNotice, setQuestionDemandAndNotice] = useState(
    isOromo
      ? "Guyyaa 25/09/2016 A.L.I tti akeekkachiisni barreeffamaa guyyoota 7 (torba) kan kennamuuf karaa poostaatiin/bilbilaan kan ergameef ta'us, deebii tokkollee osoo hin kennin kaffaltiis hin raawwanne."
      : 'በቀን 25/09/2016 ዓ.ም በጽሁፍ የ 7 (ሰባት) ቀናት ማስጠንቀቂያ የተላከለት ቢሆንም ምንም ዓይነት ምላሽ ሳይሰጥና ክፍያውን ሳይፈጽም ቀርቷል።'
  );
  const [questionDamagesCaused, setQuestionDamagesCaused] = useState(
    isOromo
      ? "Gocha kanaan kan ka'e sochii daldalaa himataa kan gufachiise yoo ta'u; maallaqichi yeroon deebi'uu dhabuun hanqina qabeenyaa fi baasii seeraatiif himataa saaxileera."
      : 'በዚህ ድርጊት ምክንያት ከሳሽ የንግድ እንቅስቃሴው የተስተጓጎለ ሲሆን፤ ገንዘቡ በወቅቱ ባለመመለሱ ምክንያት ለከፍተኛ የገንዘብ እጥረትና ለሕጋዊ ወጪዎች ተዳርጓል።'
  );
  const [additionalFacts, setAdditionalFacts] = useState('');

  // Legal articles cited
  const [violatedArticles, setViolatedArticles] = useState(
    isOromo
      ? "Seera Sivilii Itoophiyaa keewwata 1675, 1731 (Dirqisiisummaa waliigaltee), 1771 fi 2027 (Bu'aa diiggaa waliigaltee) akkasumas keewwata 1790 (Kaffaltii dhala seeraa)"
      : 'የፍትሐብሔር ሕግ ቁጥር 1675፣ 1731 (የውል አስገዳጅነት)፣ 1771 እና 2027 (የውል ጥሰት ውጤቶች) እንዲሁም አንቀጽ 1790 (የሕጋዊ ወለድ ክፍያ)'
  );

  // Demands (Prayers for Relief)
  const [specificDemands, setSpecificDemands] = useState(
    isOromo
      ? "Liqiin duraa Qarshiin 250,000 hatattamaan akka deebi'u, guyyaa himannaan dhihaate irraa eegalee dhalli seeraa 9% waggaa akka kaffalamu, fi baasiin askuutaa mana murtii fi abukaatoo himatamaan akka danda'amu"
      : 'ዋናው እዳ 250,000 ብር በአስቸኳይ እንዲመለስ፣ ክሱ ከቀረበበት ቀን ጀምሮ የሚታሰብ የ 9% ዓመታዊ ሕጋዊ ወለድ እንዲከፈል፣ እና ለዚህ ክስ የወጣው የዳኝነት ማህተምና የጠበቃ አበል ወጪ በተከሳሽ እንዲሸፈን'
  );

  // Evidences
  const [evidenceList, setEvidenceList] = useState(
    isOromo
      ? "1. Sanada waliigaltee liqii duraa mallatteeffame\n2. Nageetti baankii Qarshii 250,000 dabarfame\n3. Garagalcha xalayaa akeekkachiisaa himatamaaf ergame"
      : '1. በሁለቱ ወገኖች የተፈረመ ዋናው የብድር ውል ሰነድ\n2. በባንክ የተላለፈ የ 250,000 ብር የሂሳብ ማስተላለፊያ ደረሰኝ\n3. ለተከሳሹ የተላከ የጽሁፍ ማስጠንቀቂያ ደብዳቤ ቅጂ'
  );

  // Witnesses
  const [witnesses, setWitnesses] = useState<PlaintiffWitness[]>([
    {
      id: 'w-1',
      name: isOromo ? 'Obbo Abbabaa Dammissee' : 'አቶ አበበ ደምሴ',
      address: isOromo ? 'Finfinnee, Qirqoos Woreda 03' : 'አዲስ አበባ፣ ቂርቆስ ወረዳ 03',
      phone: '+251 911 112233',
      testimonySubject: isOromo 
        ? 'Waliigaltee liqii mallatteessuu fi maallaqa fudhachuu irratti' 
        : 'ስለ ብድር ውሉ አፈራረም እና ገንዘቡ ስለመሰጠቱ',
    },
    {
      id: 'w-2',
      name: isOromo ? 'Aaddee Taarikwaa Kaasaa' : 'ወ/ሮ ታሪኳ ካሳ',
      address: isOromo ? 'Finfinnee, Qirqoos Woreda 03' : 'አዲስ አበባ፣ ቂርቆስ ወረዳ 03',
      phone: '+251 922 445566',
      testimonySubject: isOromo
        ? 'Himatamaan maallaqa yeroon deebisuu dhabuu fi akeekkachiisa kenname irratti'
        : 'ተከሳሹ ገንዘቡን በወቅቱ ሳይመልስ ስለመቅረቱና ስለተደረገው ማሳሰቢያ',
    },
  ]);

  const [verificationStatement, setVerificationStatement] = useState(
    isOromo
      ? "Ani himataan/tuun qabxiiwwan iyyannoo himannaa kana keessatti barreeffaman hundi dhugaa fi sirrii ta'uu koo seera deemsa falmii siviilii Itoophiyaa keewwata 92 bu'uureffachuun kakuudhaan nan mirkaneessa."
      : 'እኔ ከሳሽ በዚህ የክስ ማመልከቻ ላይ የተገለጹት ፍሬ ነገሮች በሙሉ እውነትና ትክክለኛ መሆናቸውን በኢትዮጵያ ፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 92 መሠረት በቃለ-መሀላ አረጋግጣለሁ።'
  );

  // General Drafter State (for other documents)
  const [docType, setDocType] = useState('defense');
  const [generalFacts, setGeneralFacts] = useState('');

  // Generation output state
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize defaults on language switch if default state unchanged
  useEffect(() => {
    if (!initialData && !generatedDraft) {
      if (isOromo) {
        setPlaintiffRole('Himataa / Abbaa Liqii / Qabeenya Qabeessa');
        setPlaintiffAdvocate('Ofiin kan dhihaate');
        setCourtName('Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Lidataa');
        setCourtBench('Dhaaddacha Sivilii');
        setJurisdictionBasis("Hangi maallaqa gaafatamee fi teessoon himatamaa aangoo mana murtii kabajamaa kanaa jalatti kan kufu waan ta'eef");
        setVerificationStatement("Ani himataan/tuun qabxiiwwan iyyannoo himannaa kana keessatti barreeffaman hundi dhugaa fi sirrii ta'uu koo seera deemsa falmii siviilii Itoophiyaa keewwata 92 bu'uureffachuun kakuudhaan nan mirkaneessa.");
      } else {
        setPlaintiffRole('ከሳሽ / አበዳሪ / ባለመብት');
        setPlaintiffAdvocate('በግል የቀረበ');
        setCourtName('የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ ችሎት');
        setCourtBench('የፍትሐብሔር ችሎት');
        setJurisdictionBasis('የገንዘቡ መጠን እና የተከሳሹ መኖሪያ አድራሻ በዚህ ክቡር ፍርድ ቤት ስልጣን ስር የሚወድቅ በመሆኑ');
        setVerificationStatement('እኔ ከሳሽ በዚህ የክስ ማመልከቻ ላይ የተገለጹት ፍሬ ነገሮች በሙሉ እውነትና ትክክለኛ መሆናቸውን በኢትዮጵያ ፍትሐብሔር ሥነ-ሥርዓት ሕግ ቁጥር 92 መሠረት በቃለ-መሀላ አረጋግጣለሁ።');
      }
    }
  }, [language]);

  // Apply initial data when passed from consultation
  useEffect(() => {
    if (initialData) {
      setActiveMode('claim_filing');
      if (initialData.courtName) setCourtName(initialData.courtName);
      if (initialData.benchName) setCourtBench(initialData.benchName);
      if (initialData.jurisdictionBasis) setJurisdictionBasis(initialData.jurisdictionBasis);
      if (initialData.defendantAddress) setDefendantAddress(initialData.defendantAddress);
      if (initialData.claimCategory) setClaimCategory(initialData.claimCategory);
      if (initialData.claimAmountETB) setClaimAmount(initialData.claimAmountETB);
      if (initialData.questionAgreementDetails) setQuestionAgreementDetails(initialData.questionAgreementDetails);
      if (initialData.questionBreachDetails) setQuestionBreachDetails(initialData.questionBreachDetails);
      if (initialData.questionDemandAndNotice) setQuestionDemandAndNotice(initialData.questionDemandAndNotice);
      if (initialData.questionDamagesCaused) setQuestionDamagesCaused(initialData.questionDamagesCaused);
      if (initialData.legalArticles) setViolatedArticles(initialData.legalArticles);
      if (initialData.evidenceList) setEvidenceList(initialData.evidenceList);
      if (initialData.additionalFacts) setAdditionalFacts(initialData.additionalFacts);
    }
  }, [initialData]);

  // Quick Preset Scenarios for instant filling in both languages
  const presetScenarios = isOromo
    ? [
        {
          id: 'loan',
          title: 'Liqii Maallaqaa Deebisiisuu',
          desc: 'Himannaa liqeeffataa maallaqa Qarshii 250,000 yeroon hin deebisnee',
          apply: () => {
            setCourtName('Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Lidataa');
            setCourtBench('Dhaaddacha Sivilii');
            setPlaintiffName('Obbo Tashoomaa Baqqalaa Gamadaa');
            setPlaintiffAddress('Finfinnee, K/Magaalaa Qirqoos, Woreda 03, Lakk. Manaa 412');
            setPlaintiffRole('Himataa / Abbaa Liqii');
            setDefendantName('Obbo Girmaa Walde-ab Hayiluu');
            setDefendantAddress('Finfinnee, K/Magaalaa Boolee, Woreda 05, Lakk. Manaa 890 (Bakka addaa: 22 naannawaa)');
            setClaimCategory('Iyyannoo Himannaa Liqii Maallaqaa Waliigalteen Alatti Hafe Deebisiisuu');
            setClaimAmount('250,000');
            setQuestionAgreementDetails("Guyyaa 12/03/2016 A.L.I tti himatamaan dhimma daldala ariifachiisaaf jecha Qarshii 250,000 (kuma dhibba lamaa fi shantama) waliigaltee barreeffamaatiin himataa irraa liqeeffateera. Maallaqichas ji'oota 6 keessatti hanga 12/09/2016 tti guutummaatti deebisuuf ifatti waliigaleera.");
            setQuestionBreachDetails("Yeroon kaffaltii waliigaltee 12/09/2016 tti kan xumurame ta'us, himatamaan maallaqa fudhate deebisuu dhabuu isaa malees; bilbila irra deddeebiin godhameef kaasuun dhiisuu fi teessoo isaa jijjiiruudhaan dirqama waliigaltee isaa guutummaatti diigeera.");
            setQuestionDemandAndNotice("Guyyaa 25/09/2016 A.L.I tti akeekkachiisni barreeffamaa guyyoota 7 (torba) kan kennamuuf karaa poostaatiin/bilbilaan kan ergameef ta'us, deebii tokkollee osoo hin kennin kaffaltiis hin raawwanne.");
            setQuestionDamagesCaused("Gocha kanaan kan ka'e sochii daldalaa himataa kan gufachiise yoo ta'u; maallaqichi yeroon deebi'uu dhabuun hanqina qabeenyaa fi baasii seeraatiif himataa saaxileera.");
            setViolatedArticles("Seera Sivilii Itoophiyaa keewwata 1675, 1731 (Dirqisiisummaa waliigaltee), 1771 fi 2027 (Bu'aa diiggaa waliigaltee) akkasumas keewwata 1790 (Kaffaltii dhala seeraa)");
            setSpecificDemands("Liqiin duraa Qarshiin 250,000 hatattamaan akka deebi'u, guyyaa himannaan dhihaate irraa eegalee dhalli seeraa 9% waggaa akka kaffalamu, fi baasiin askuutaa mana murtii fi abukaatoo himatamaan akka danda'amu");
            setEvidenceList("1. Sanada waliigaltee liqii duraa mallatteeffame\n2. Nageetti baankii Qarshii 250,000 dabarfame\n3. Garagalcha xalayaa akeekkachiisaa himatamaaf ergame");
          },
        },
        {
          id: 'house_rent',
          title: 'Kiraa Manaa fi Gadhiisiisuu',
          desc: 'Kiraa ji\'oota 4 hin kaffalinii fi mana gadhiisuu dide',
          apply: () => {
            setCourtName('Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Boolee');
            setCourtBench('Dhaaddacha Sivilii');
            setPlaintiffName('Aaddee Caaltuu Dinquu Lammii');
            setPlaintiffAddress('Finfinnee, Boolee Woreda 03, Lakk. Manaa 102');
            setPlaintiffRole('Abbaa Qabeenyaa / Abbaa Manaa');
            setDefendantName('Obbo Tolasaa Fiqaaduu');
            setDefendantAddress('Finfinnee, Boolee Woreda 03, Mana Lakk. 102');
            setClaimCategory('Iyyannoo Himannaa Kiraa Manaa Haftee fi Mana Gadhiisiisuu');
            setClaimAmount('120,000');
            setQuestionAgreementDetails('Himatamaan mana jireenyaa Boolee Woreda 03 keessatti argamu ji\'atti Qarshii 30,000\'n kireeffatee jiraachaa jira.');
            setQuestionBreachDetails('Himatamaan ji\'oota afran darban kiraa mana osoo hin kaffalin kan hafe yoo ta\'u, manicha akka gadhiisu yoo gaafatames dideera.');
            setQuestionDemandAndNotice('Akeekkachiisni ji\'a 1 barreeffamaan kan kennameef ta\'us kaffaltii hin raawwanne.');
            setQuestionDamagesCaused('Abbaan manaa galii liqii baankii ittiin deebisu dhabuun rakkoo maallaqaa keessa galeera.');
            setViolatedArticles('Seera Sivilii keewwata 2945, 2953 fi 2960');
            setSpecificDemands('1. Qarshiin 120,000 dhala seeraa wajjin akka kaffalamu\n2. Manichi qulqullinaan akka gadhiifamu\n3. Baasiin seeraa akka danda\'amu');
            setEvidenceList('1. Waliigaltee kiraa manaa\n2. Kaartaa abbaa qabeenyummaa\n3. Xalayaa akeekkachiisaa');
          },
        },
        {
          id: 'labor',
          title: 'Hojii Irraa Gaggeeysaa Seeraan Alaa',
          desc: 'Osoo akeekkachiisa hin kennin hojjetee waggaa 7 ari\'uun',
          apply: () => {
            setCourtName('Mana Murtii Ol\'aanaa Federaalaa Dhaaddacha Hojjetaa');
            setCourtBench('Dhaaddacha Hojjetaa fi Hojjechiisaa');
            setPlaintiffName('Obbo Daawit Hayiluu Tasfaayee');
            setPlaintiffAddress('Finfinnee, Kolfee Qaranxoo, Woreda 07');
            setPlaintiffRole('Himataa / Hojjetaa');
            setDefendantName('Dhaabbata Daldalaa Daandii Guddaa W.G.M');
            setDefendantAddress('Finfinnee, Nifaas Silki Laaftoo');
            setClaimCategory('Himannaa Hojii Irraa Ari\'amuu Seeraan Alaa fi Kaffaltii Beenyaa');
            setClaimAmount('185,000');
            setQuestionAgreementDetails('Himataan dhaabbata himatamaa keessatti mindaa ji\'aa Qarshii 22,000\'n waggoota 5f amanamummaan hojjeteera.');
            setQuestionBreachDetails('Dhaabbatichi osoo akeekkachiisa hin kennin fi sababa gahaa malee battalatti hojii irraa ari\'eera.');
            setQuestionDemandAndNotice('Koreen hojjetaa himannaa dhiheessus deebii dhabuun gara mana murtiitti dhufuuf dirqame.');
            setQuestionDamagesCaused('Himataan maatii isaa bulchuuf rakkatee qooda guddaa miidhameera.');
            setViolatedArticles('Labsii Hojjetaa fi Hojjechiisaa Lakk. 1156/2011 keewwata 24, 27, 39, 40 fi 44');
            setSpecificDemands('1. Mindaa ji\'oota 3 sababa gaggeeysaa seeraan alaaf\n2. Kaffaltii tajaajila waggoota 5 (Severance pay)\n3. Ragaan muuxannoo hojii hatattamaan akka kennamu');
            setEvidenceList('1. Xalayaa qacarii fi daballii mindaa\n2. Xalayaa ari\'annaa\n3. Isteetmantii baankii');
          },
        },
        {
          id: 'tort',
          title: 'Kasaaraa Balaa Konkolaataa',
          desc: 'Balaa tiraafikaatiin miidhaa qaqqabeef beenyaa gaafachuu',
          apply: () => {
            setCourtName('Mana Murtii Sadarkaa Duraa Federaalaa Ramaddii Boolee');
            setCourtBench('Dhaaddacha Sivilii');
            setPlaintiffName('Obbo Wandimmuu Taaddasaa');
            setPlaintiffAddress('Finfinnee, Boolee Woreda 04');
            setPlaintiffRole('Himataa / Abbaa Konkolaataa');
            setDefendantName('Obbo Baay\'isaa Dassaaleny');
            setDefendantAddress('Finfinnee, Yekkaa Woreda 02');
            setClaimCategory('Iyyannoo Himannaa Kasaaraa Balaa Konkolaataa fi Miidhaa Qaqqabee');
            setClaimAmount('340,000');
            setQuestionAgreementDetails('Guyyaa 18/11/2016 A.L.I tti daandii Boolee irratti seeraan utuu konkolaachisaa jiruu.');
            setQuestionBreachDetails('Himatamaan saffisaan dhufee duubaan konkolaataa himataa rukutuun miidhaa olaanaa geessiseera.');
            setQuestionDemandAndNotice('Poolisiin tiraafikaa qoratee %100 himatamaan balleessaa qaba jedhee murteesses kaffaluu dideera.');
            setQuestionDamagesCaused('Baasii suphaa Qarshii 280,000 fi wal\'aansa Qarshii 60,000.');
            setViolatedArticles('Seera Sivilii keewwata 2027, 2035, 2066 fi 2081');
            setSpecificDemands('1. Baasii suphaa Qarshii 280,000\n2. Beenyaa yaalaa Qarshii 60,000\n3. Baasii seeraa himatamaan akka danda\'u');
            setEvidenceList('1. Waraqaa qorannoo poolisii tiraafikaa\n2. Piroofoormaa gaaraajii eeyyamamee\n3. Nageetti yaala hospitaalaa');
          },
        }
      ]
    : [
        {
          id: 'loan',
          title: 'የገንዘብ ብድር ማስመለስ',
          desc: 'የተበደረውን 250,000 ብር በወቅቱ ያልመለሰ ተበዳሪ ክስ',
          apply: () => {
            setCourtName('የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ ችሎት');
            setCourtBench('የፍትሐብሔር ችሎት');
            setPlaintiffName('አቶ ተስፋዬ በቀለ ገብረመድህን');
            setPlaintiffAddress('አዲስ አበባ፣ ቂርቆስ ክ/ከተማ፣ ወረዳ 03፣ የቤት ቁጥር 412');
            setPlaintiffRole('ከሳሽ / አበዳሪ');
            setDefendantName('አቶ ግርማ ወልደአብ ሃይሉ');
            setDefendantAddress('አዲስ አበባ፣ ቦሌ ክ/ከተማ፣ ወረዳ 05፣ የቤት ቁጥር 890 (ልዩ ቦታ፡ 22 ማዞሪያ አጠገብ)');
            setClaimCategory('የተበደረውን ገንዘብ በውሉ መሠረት ሳይመልስ የቀረ ተበዳሪ የገንዘብ ማስመለስ ክስ');
            setClaimAmount('250,000');
            setQuestionAgreementDetails('በቀን 12/03/2016 ዓ.ም ተከሳሽ ለአስቸኳይ የንግድ ስራ ማስኬጃ በሚል የ 250,000 ብር ብድር በጽሁፍ ውል ከከሳሽ ተበድሯል። ገንዘቡንም በ6 ወራት ውስጥ እስከ 12/09/2016 ዓ.ም ድረስ ሙሉ በሙሉ ለመመለስ በውሉ ላይ በግልጽ ተስማምቷል።');
            setQuestionBreachDetails('የውሉ የመመለሻ ጊዜ በ12/09/2016 ዓ.ም ያበቃ ቢሆንም ተከሳሹ የተረከበውን ገንዘብ ሳይመልስ የቀረ ከመሆኑም በላይ፤ በተደጋጋሚ የተደረገለትን የስልክ ጥሪ ባለመመለስና አድራሻውን በመቀየር የውል ግዴታውን ሙሉ በሙሉ ጥሷል።');
            setQuestionDemandAndNotice('በቀን 25/09/2016 ዓ.ም በጽሁፍ የ 7 ቀናት ማስጠንቀቂያ የተላከለት ቢሆንም ምንም ዓይነት ምላሽ ሳይሰጥና ክፍያውን ሳይፈጽም ቀርቷል።');
            setQuestionDamagesCaused('በዚህ ድርጊት ምክንያት ከሳሽ የንግድ እንቅስቃሴው የተስተጓጎለ ሲሆን፤ ገንዘቡ በወቅቱ ባለመመለሱ ምክንያት ለከፍተኛ የገንዘብ እጥረትና ለሕጋዊ ወጪዎች ተዳርጓል።');
            setViolatedArticles('የፍትሐብሔር ሕግ አንቀጽ 1675፣ 1731 (የውል አስገዳጅነት)፣ 1771 እና 2027 (የውል ጥሰት ውጤቶች) እንዲሁም አንቀጽ 1790 (የሕጋዊ ወለድ ክፍያ)');
            setSpecificDemands('ዋናው እዳ 250,000 ብር በአስቸኳይ እንዲመለስ፣ ክሱ ከቀረበበት ቀን ጀምሮ የሚታሰብ የ 9% ዓመታዊ ሕጋዊ ወለድ እንዲከፈል፣ እና ለዚህ ክስ የወጣው የዳኝነት ማህተምና የጠበቃ አበል ወጪ በተከሳሽ እንዲሸፈን');
            setEvidenceList('1. በሁለቱ ወገኖች የተፈረመ ዋናው የብድር ውል ሰነድ\n2. በባንክ የተላለፈ የ 250,000 ብር የሂሳብ ማስተላለፊያ ደረሰኝ\n3. ለተከሳሹ የተላከ የጽሁፍ ማስጠንቀቂያ ደብዳቤ ቅጂ');
          },
        },
        {
          id: 'house_rent',
          title: 'የቤት ኪራይና ማስለቀቅ ክስ',
          desc: 'የ4 ወራት ኪራይ ያልከፈለና ቤት የማያስረክብ ተከራይ',
          apply: () => {
            setCourtName('የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ቦሌ ምድብ');
            setCourtBench('የፍትሐብሔር ችሎት');
            setPlaintiffName('ወ/ሮ ጫልቱ ድንቁ ለማ');
            setPlaintiffAddress('አዲስ አበባ፣ ቦሌ ወረዳ 03፣ የቤት ቁጥር 102');
            setPlaintiffRole('አከራይ / ባለቤት');
            setDefendantName('አቶ ቶሎሳ ፍቃዱ');
            setDefendantAddress('አዲስ አበባ፣ ቦሌ ወረዳ 03፣ የቤት ቁጥር 102');
            setClaimCategory('ያልተከፈለ ውዝፍ የቤት ኪራይ ማስከፈል እና ቤት የማስለቀቅ ክስ');
            setClaimAmount('120,000');
            setQuestionAgreementDetails('ተከሳሽ በቦሌ ክ/ከተማ ወረዳ 03 የሚገኘውን የመኖሪያ ቤት በወር 30,000 ብር ከከሳሽ ተከራይቶ እየኖረ ይገኛል።');
            setQuestionBreachDetails('ተከሳሹ ያለፉትን 4 ወራት የቤት ኪራይ ሳይከፍል የቆየ ሲሆን፤ ቤቱን እንዲያስረክብ ቢጠየቅም ፈቃደኛ ሳይሆን ቀርቷል።');
            setQuestionDemandAndNotice('የ 1 ወር የቅድሚያ የጽሁፍ ማሳሰቢያ ተሰጥቶት የነበረ ሲሆን ምንም ዓይነት ክፍያ አልፈጸመም።');
            setQuestionDamagesCaused('ከሳሽ ለባንክ ብድር መክፈያ የሚጠቀምበትን የኪራይ ገቢ በማጣቱ በከፍተኛ የገንዘብ ቅጣትና ችግር ውስጥ ወድቋል።');
            setViolatedArticles('የፍትሐብሔር ሕግ አንቀጽ 2945፣ 2953 እና አንቀጽ 2960');
            setSpecificDemands('1. ውዝፍ 120,000 ብር ኪራይ ከነ 9% ሕጋዊ ወለዱ እንዲከፈል\n2. ተከሳሹ ቤቱን ለቆ ለከሳሽ በንጹህ ይዞታ እንዲያስረክብ\n3. የዳኝነትና የጠበቃ አበል ወጪ እንዲሸፈን');
            setEvidenceList('1. የተፈረመ የመኖሪያ ቤት ኪራይ ውል\n2. የቤት ባለቤትነት ካርታ ቅጂ\n3. የተላከው የማስጠንቀቂያ ደብዳቤ');
          },
        },
        {
          id: 'labor',
          title: 'ያለአግባብ የስራ ስንብት ክስ',
          desc: 'ያለማስጠንቀቂያ የተባረረ ሰራተኛ የስንብትና የካሳ ክስ',
          apply: () => {
            setCourtName('የፌዴራል ከፍተኛ ፍርድ ቤት የሠራተኛ ችሎት');
            setCourtBench('የሠራተኛና አሠሪ ችሎት');
            setPlaintiffName('አቶ ዳዊት ሃይሉ ተስፋዬ');
            setPlaintiffAddress('አዲስ አበባ፣ ኮልፌ ቀራንዮ ወረዳ 07');
            setPlaintiffRole('ከሳሽ / ሠራተኛ');
            setDefendantName('ታላቁ መንገድ ንግድ አ.ማ');
            setDefendantAddress('አዲስ አበባ፣ ንፋስ ስልክ ላፍቶ');
            setClaimCategory('ያለአግባብ የተፈጸመ የሥራ ውል ስንብት፣ የካሳ ክፍያ እና የሰርቪስ አበል ክስ');
            setClaimAmount('185,000');
            setQuestionAgreementDetails('ከሳሽ በተከሳሹ ድርጅት ውስጥ በከፍተኛ የሂሳብ ባለሙያነት በወር 22,000 ብር ደሞዝ ለ 5 ዓመታት ያለ ምንም ጥፋት ሲያገለግል ቆይቷል።');
            setQuestionBreachDetails('ተከሳሹ ድርጅት ምንም ዓይነት የጽሁፍ ማስጠንቀቂያ ሳይሰጥና አግባብነት ያለው ሕጋዊ ምክንያት ሳይኖረው በድንገት ከስራ አሰናብቶታል።');
            setQuestionDemandAndNotice('ለድርጅቱ የስራ አስኪያጅ ቅሬታ አቅርቦ ምላሽ በማጣቱ ወደ ፍርድ ቤት ለመምጣት ተገዷል።');
            setQuestionDamagesCaused('ከሳሽ ድንገተኛ የገቢ መቋረጥ የገጠመው ከመሆኑም በላይ ለቤተሰቡ መተዳደሪያ አጥቷል።');
            setViolatedArticles('የአሠሪና ሠራተኛ ጉዳይ አዋጅ ቁጥር 1156/2011 አንቀጽ 24፣ 27፣ 39፣ 40 እና 44');
            setSpecificDemands('1. ያለአግባብ ለተደረገ ስንብት የ 3 ወራት ደሞዝ ካሳ\n2. የ 5 ዓመታት የስራ ስንብት (Severance Pay) ክፍያ\n3. የስራ ልምድ ማስረጃ በአስቸኳይ እንዲሰጥ');
            setEvidenceList('1. የቅጥር ውልና የደሞዝ ጭማሪ ደብዳቤዎች\n2. የስራ ስንብት ደብዳቤ\n3. የባንክ የደሞዝ ገቢ ስቴትመንት');
          },
        },
        {
          id: 'tort',
          title: 'የትራፊክ አደጋ የካሳ ክስ',
          desc: 'በተሽከርካሪ አደጋ የደረሰ የንብረትና የአካል ጉዳት ካሳ',
          apply: () => {
            setCourtName('የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ቦሌ ምድብ');
            setCourtBench('የፍትሐብሔር ችሎት');
            setPlaintiffName('አቶ ወንድሙ ታደሰ');
            setPlaintiffAddress('አዲስ አበባ፣ ቦሌ ወረዳ 04');
            setPlaintiffRole('ከሳሽ / ተበዳይ');
            setDefendantName('አቶ ባይሳ ደሳለኝ');
            setDefendantAddress('አዲስ አበባ፣ የካ ወረዳ 02');
            setClaimCategory('የትራፊክ አደጋ ያስከተለው የውል ውጭ ኃላፊነት፣ የንብረት ጥገና እና የጉዳት ካሳ ክስ');
            setClaimAmount('340,000');
            setQuestionAgreementDetails('በቀን 18/11/2016 ዓ.ም በአዲስ አበባ ቦሌ መንገድ ላይ ከሳሽ በሕጋዊ መንገድ ተሽከርካሪውን እያሽከረከረ በነበረበት ወቅት።');
            setQuestionBreachDetails('ተከሳሽ በቸልተኝነትና ፍጥነትን ባለመቆጣጠር የከሳሽን ተሽከርካሪ ከኋላ በመግጨት ከፍተኛ የንብረትና የአካል ጉዳት አድርሷል።');
            setQuestionDemandAndNotice('የትራፊክ ፖሊስ ምርመራ ተከሳሹን 100% ጥፋተኛ አድርጎ የወሰነ ሲሆን፤ ተከሳሹ የጥገና ወጪ ለመክፈል ፈቃደኛ ሳይሆን ቀርቷል።');
            setQuestionDamagesCaused('የመኪናው የ 280,000 ብር የጥገና ወጪ፣ የሕክምና ወጪ 60,000 ብር እና ተሽከርካሪው ጋራዥ በቆየበት ጊዜ የታጣ ገቢ።');
            setViolatedArticles('የፍትሐብሔር ሕግ አንቀጽ 2027፣ 2035፣ 2066 እና 2081');
            setSpecificDemands('1. የ 280,000 ብር የተሽከርካሪ ጥገና ወጪ\n2. የ 60,000 ብር የሕክምና እና የስነ-ልቦና ካሳ\n3. የዳኝነት ማህተም እና የጠበቃ አበል ወጪ በተከሳሽ እንዲሸፈን');
            setEvidenceList('1. የትራፊክ ፖሊስ የምርመራ ሰነድና የጥፋተኝነት ውሳኔ\n2. የተፈቀደላቸው ጋራዦች የሰጡት የጥገና ግምት ፕሮፎርማ\n3. የሕክምና ደረሰኞችና የሆስፒታል ሪፖርት');
          },
        },
      ];

  // Add/Remove witness handlers
  const handleAddWitness = () => {
    const newW: PlaintiffWitness = {
      id: `w-${Date.now()}`,
      name: '',
      address: '',
      phone: '',
      testimonySubject: '',
    };
    setWitnesses([...witnesses, newW]);
  };

  const handleRemoveWitness = (id: string) => {
    setWitnesses(witnesses.filter((w) => w.id !== id));
  };

  const handleUpdateWitness = (id: string, field: keyof PlaintiffWitness, val: string) => {
    setWitnesses(
      witnesses.map((w) => (w.id === id ? { ...w, [field]: val } : w))
    );
  };

  // Reset form to blank
  const handleClearForm = () => {
    setPlaintiffName('');
    setPlaintiffAddress('');
    setPlaintiffPhone('');
    setDefendantName('');
    setDefendantAddress('');
    setDefendantPhone('');
    setClaimCategory('');
    setClaimAmount('');
    setQuestionAgreementDetails('');
    setQuestionBreachDetails('');
    setQuestionDemandAndNotice('');
    setQuestionDamagesCaused('');
    setAdditionalFacts('');
    setViolatedArticles('');
    setSpecificDemands('');
    setEvidenceList('');
    setWitnesses([]);
    setGeneratedDraft('');
  };

  // Generate Document
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const payload = {
        language,
        docType: activeMode === 'claim_filing' ? 'plaint' : docType,
        courtName,
        courtBench,
        jurisdictionBasis,
        claimCategory,
        plaintiffName,
        plaintiffAddress,
        plaintiffPhone,
        plaintiffRole,
        plaintiffAdvocate,
        defendantName,
        defendantAddress,
        defendantPhone,
        claimAmount,
        facts: activeMode === 'claim_filing' ? additionalFacts : generalFacts,
        questionAgreementDetails,
        questionBreachDetails,
        questionDemandAndNotice,
        questionDamagesCaused,
        violatedArticles,
        specificDemands,
        evidenceList,
        witnesses,
        verificationStatement,
      };

      const res = await fetch('/api/legal/draft-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.draft) {
        setGeneratedDraft(data.draft);
        setIsEditingDraft(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedDraft], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    const fileName = isOromo
      ? `Iyyannoo_Himannaa_${plaintiffName.replace(/\s+/g, '_')}.txt`
      : `የክስ_ማመልከቻ_${plaintiffName.replace(/\s+/g, '_')}.txt`;
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const headerTitle = isOromo
      ? 'RIPAAKILIKAA DEMOKIRAATAAWA FEDERAALAA ITOOPHIYAA'
      : 'በኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ';
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${language}">
        <head>
          <title>${isOromo ? 'Iyyannoo Himannaa' : 'ይፋዊ የክስ ወረቀት'} - ${plaintiffName}</title>
          <meta charset="utf-8">
          <style>
            @page { size: A4; margin: 25mm 20mm 25mm 25mm; }
            body { 
              font-family: 'Nyala', 'Noto Sans Ethiopic', 'Times New Roman', serif; 
              color: #111; 
              line-height: 1.8; 
              font-size: 13pt; 
              padding: 20px;
            }
            .court-header {
              text-align: center;
              font-weight: bold;
              border-bottom: 2px solid #111;
              padding-bottom: 8px;
              margin-bottom: 20px;
            }
            .court-title { font-size: 15pt; }
            .court-sub { font-size: 13pt; margin-top: 4px; }
            pre { 
              white-space: pre-wrap; 
              font-family: inherit; 
              font-size: inherit; 
              line-height: 1.8;
            }
            .footer-stamp {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="court-header">
            <div class="court-title">${headerTitle}</div>
            <div class="court-sub">${courtName} (${courtBench})</div>
          </div>
          <pre>${generatedDraft}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSaveToControlCenter = () => {
    if (!onSaveToManagedCases) return;

    const newCase: ManagedCase = {
      id: `case-${Date.now()}`,
      caseNumber: isOromo 
        ? `F/M/D ${Math.floor(10000 + Math.random() * 90000)}/16` 
        : `ፌ/መ/ደ ${Math.floor(10000 + Math.random() * 90000)}/16`,
      title: claimCategory.slice(0, 60),
      category: 'civil',
      court: courtName,
      bench: courtBench,
      clientRole: 'plaintiff',
      plaintiff: plaintiffName || (isOromo ? 'Himataa' : 'ከሳሽ'),
      defendant: defendantName || (isOromo ? 'Himatamaa' : 'ተከሳሽ'),
      claimAmountETB: parseInt(claimAmount.replace(/[^0-9]/g, '')) || 0,
      stage: 'pre_trial',
      filingDate: new Date().toISOString().split('T')[0],
      summary: `${claimCategory}። ${isOromo ? 'Hanga Qarshii' : 'የተጠየቀ ገንዘብ'}፡ ${claimAmount} ETB.`,
      notes: isOromo
        ? `Qophii himannaa irraa kallattiin qophaa'e. Keewwattoota: ${violatedArticles}`
        : `ከክስ መመስረቻ ማዕከል በቀጥታ የተዘጋጀ የክስ ወረቀት። የተካተቱ አንቀጾች፡ ${violatedArticles}`,
      evidences: [
        {
          id: `ev-${Date.now()}-1`,
          title: isOromo ? 'Iyyannoo Himannaa Mana Murtii Seera Qabeessa' : 'የተዘጋጀ ይፋዊ የክስ ማመልከቻ ሰነድ',
          type: 'contract',
          dateAdded: new Date().toISOString().split('T')[0],
          description: isOromo 
            ? 'Seera deemsa falmii siviiliitiin kan qophaa\'e'
            : 'በፍትሐብሔር ሥነ-ሥርዓት ሕግ መሠረት የተዘጋጀ የክስ ወረቀት',
          verified: true,
        },
      ],
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          date: new Date().toISOString().split('T')[0],
          title: isOromo ? 'Iyyannoon Himannaa Qophaa\'e' : 'የክስ ወረቀት ተዘጋጀ',
          description: isOromo 
            ? 'Gaaffilee himataa bu\'uureffachuun iyyannoon xumurame.'
            : 'በከሳሽ መጠይቅ መሠረት የተሟላ የክስ ማመልከቻ ተጠናቋል።',
          completed: true,
        },
        {
          id: `m-${Date.now()}-2`,
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          title: isOromo ? 'Reejistiraara Mana Murtiif Galchuu' : 'ክሱን ለፍርድ ቤት ሬጅስትራር ማስገባት',
          description: isOromo 
            ? 'Askuutaa kaffalanii dhaaddachaaf galmeessuu.'
            : 'የዳኝነት ማህተም ከፍሎ ለችሎት መመዝገብ።',
          completed: false,
        },
      ],
      status: 'active',
    };

    onSaveToManagedCases(newCase);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Instructions */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/50 p-5 rounded-2xl border border-amber-900/40 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-2">
                <span>{t('drafterTitle')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-sans">
                  {isOromo ? 'Seera Deemsa Siviilii 222-224' : 'ፍትሐብሔር ሥ/ሥ/ሕ/ቁ 222-224'}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {t('drafterSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            {onNavigateToDefense && (
              <button
                type="button"
                onClick={onNavigateToDefense}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 text-xs border border-rose-800/60 transition-colors cursor-pointer shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{isOromo ? 'Deebii Himatamaa Qopheessi' : 'ተከሳሽ ኖት? የመከላከያ መልስ አዘጋጁ'}</span>
                <ArrowRight className="w-3 h-3 text-rose-400" />
              </button>
            )}

            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Qajeelfama Seeraa' : 'የክስ አዘገጃጀት ሕጋዊ መስፈርቶች'}</span>
              {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Ethiopian Legal Requirements Guide */}
        {isGuideOpen && (
          <div className="mt-3 pt-3 border-t border-amber-900/30 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                {isOromo ? '1. Teessoo Himataa fi Himatamaa' : '1. የከሳሽና የተከሳሽ ሙሉ አድራሻ'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {isOromo
                  ? 'Maqaan guutuun (abbaa fi akaakayyuu wajjin), teessoon (magaalaa, k/magaalaa, woreda, lakk. manaa) fi bilbilli wamichi dhaqqabu ifatti eeramuu qaba.'
                  : 'የከሳሽና የተከሳሽ ሙሉ ስም (ከነ አያት)፣ የመኖሪያ/የስራ ቦታ (ከተማ፣ ክ/ከተማ፣ ወረዳ፣ የቤት ቁጥር) እና መጥሪያ በቀላሉ የሚደርስበት ስልክ ቁጥር መጠቀስ አለበት።'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-amber-400" />
                {isOromo ? '2. Aangoo Mana Murtii' : '2. የፍርድ ቤቱ የዳኝነት ስልጣን'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {isOromo
                  ? 'Manni murtii himannaan dhihaatuuf aangoo maallaqaa (Material) fi aangoo naannoo (Territorial) qabaachuu isaa seera deemsa falmii siviiliin ibsamuu qaba.'
                  : 'ክሱ የቀረበበት ፍርድ ቤት በገንዘቡ መጠን (Material Jurisdiction) እና በቦታው (Territorial Jurisdiction) ስልጣን ያለው መሆኑ በክሱ መግቢያ ላይ መገለጽ አለበት።'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-amber-400" />
                {isOromo ? '3. Qabxiiwwan, Murtii fi Kakata' : '3. ፍሬ ነገር፣ ዳኝነትና ቃለ-መሀላ'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {isOromo
                  ? 'Qabxiiwwan dhimmaa tartiibaan, murtiin barbaadamu (hanga liqaa, dhala seeraa 9%, beenyaa) fi kakanni keewwata 92 mirkaneessu jiraachuu qaba.'
                  : 'የክሱ ፍሬ ነገር በቅደም ተከተል በቁጥር ተለይቶ፣ የሚጠየቀው ዳኝነት (ዋና ገንዘብ፣ 9% ወለድና ኪሳራ) እና በፍትሐብሔር ሥ/ሥ/ሕ/ቁ 92 መሠረት የቃለ-መሀላ ማረጋገጫ መያዝ አለበት።'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMode('claim_filing')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeMode === 'claim_filing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('modeClaimFiling')}</span>
          </button>

          <button
            onClick={() => setActiveMode('general_docs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeMode === 'general_docs'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{t('modeGeneralDraft')}</span>
          </button>
        </div>

        {activeMode === 'claim_filing' && (
          <button
            onClick={handleClearForm}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title={isOromo ? 'Qullaa godhi' : 'ቅጹን ባዶ አድርገው በራስዎ ጽሁፍ ይጀምሩ'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isOromo ? 'Qullaa Godhi' : 'ቅጹን ባዶ አድርግ'}</span>
          </button>
        )}
      </div>

      {/* Preset Scenario Buttons for Quick Fill */}
      {activeMode === 'claim_filing' && (
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('quickTemplatesTitle')}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {presetScenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={sc.apply}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs transition-all cursor-pointer flex items-center gap-1.5"
                title={sc.desc}
              >
                <span>{sc.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Form Column + Pleading Preview Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Plaintiff Form / Questionnaire */}
        <div className="lg:col-span-6 bg-slate-900/95 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-serif">
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>{isOromo ? 'Gaaffilee fi Odeeffannoo Himataan Guutuu Qabu' : 'ከሳሽ የሚጠበቅበት መጠይቅና መረጃዎች መሙያ'}</span>
            </h3>
            <span className="text-[11px] text-amber-400/90 font-medium">
              * {isOromo ? 'Hundumaa guutaa' : 'ሁሉንም በጽሁፍ ይሙሉ'}
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            {activeMode === 'general_docs' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isOromo ? 'Gosa Sanadaa *' : 'የሰነዱ ዓይነት *'}
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value="defense">{isOromo ? 'Deebii Himannaa (Defense)' : 'የመከላከያ መልስ (Statement of Defense)'}</option>
                  <option value="appeal">{isOromo ? 'Iyyannoo Ol-iyyannoo (Appeal)' : 'የይግባኝ አቤቱታ (Memorandum of Appeal)'}</option>
                  <option value="power_of_attorney">{isOromo ? 'Sanada Bakka Bu\'ummaa (Power of Attorney)' : 'የውክልና ሥልጣን ውል (Power of Attorney)'}</option>
                  <option value="settlement">{isOromo ? 'Waliigaltee Araaraa (Settlement)' : 'የዕርቅና የስምምነት ሰነድ (Settlement Agreement)'}</option>
                  <option value="lease_agreement">{isOromo ? 'Waliigaltee Kiraa (Lease Contract)' : 'የቤት / የንብረት ኪራይ ውል (Lease Contract)'}</option>
                </select>
              </div>
            )}

            {/* Section 1: Plaintiff Information */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  {t('secPlaintiffInfo')}
                </span>
                <span className="text-[10px] text-slate-400">1</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t('plaintiffFullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={plaintiffName}
                  onChange={(e) => setPlaintiffName(e.target.value)}
                  placeholder={isOromo ? "fkn: Obbo Tashoomaa Baqqalaa Gamadaa" : "ለምሳሌ፡ አቶ ተስፋዬ በቀለ ገብረመድህን"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t('plaintiffAddress')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={plaintiffAddress}
                    onChange={(e) => setPlaintiffAddress(e.target.value)}
                    placeholder={isOromo ? "Finfinnee, K/Magaalaa Qirqoos, Lakk. 412" : "አዲስ አበባ፣ ቂርቆስ፣ የቤት ቁጥር 412"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t('plaintiffPhone')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={plaintiffPhone}
                    onChange={(e) => setPlaintiffPhone(e.target.value)}
                    placeholder="+251 911 000000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t('plaintiffRole')}
                  </label>
                  <input
                    type="text"
                    value={plaintiffRole}
                    onChange={(e) => setPlaintiffRole(e.target.value)}
                    placeholder={isOromo ? "Himataa / Abbaa Liqii" : "ከሳሽ / አበዳሪ / ተበዳይ"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t('plaintiffAdvocate')}
                  </label>
                  <input
                    type="text"
                    value={plaintiffAdvocate}
                    onChange={(e) => setPlaintiffAdvocate(e.target.value)}
                    placeholder={isOromo ? "Ofiin yookiin Maqaa Abukaatoo" : "በግል የቀረበ ወይም የጠበቃ ስም"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Defendant Information */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <UserCheck className="w-4 h-4 text-rose-400" />
                  {t('secDefendantInfo')}
                </span>
                <span className="text-[10px] text-slate-400">2</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t('defendantFullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={defendantName}
                  onChange={(e) => setDefendantName(e.target.value)}
                  placeholder={isOromo ? "fkn: Obbo Girmaa Walde-ab Hayiluu" : "ለምሳሌ፡ አቶ ግርማ ወልደአብ ሃይሉ"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t('defendantAddress')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={defendantAddress}
                    onChange={(e) => setDefendantAddress(e.target.value)}
                    placeholder={isOromo ? "Finfinnee, Boolee, Woreda 05, Lakk. 890" : "አዲስ አበባ፣ ቦሌ፣ ወረዳ 05 (ልዩ ቦታ፡ 22 ማዞሪያ)"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t('defendantPhone')}
                  </label>
                  <input
                    type="text"
                    value={defendantPhone}
                    onChange={(e) => setDefendantPhone(e.target.value)}
                    placeholder="+251 922 000000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Court Jurisdiction Selection */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <Building className="w-4 h-4 text-sky-400" />
                  {t('secCourtInfo')}
                </span>
                <span className="text-[10px] text-slate-400">3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t('courtName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    placeholder={isOromo ? "Mana Murtii Sadarkaa Duraa Federaalaa..." : "የፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት..."}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {t('benchName')}
                  </label>
                  <input
                    type="text"
                    value={courtBench}
                    onChange={(e) => setCourtBench(e.target.value)}
                    placeholder={isOromo ? "Dhaaddacha Sivilii" : "የፍትሐብሔር ችሎት"}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t('jurisdictionBasis')}
                </label>
                <input
                  type="text"
                  value={jurisdictionBasis}
                  onChange={(e) => setJurisdictionBasis(e.target.value)}
                  placeholder={isOromo ? "Aangoo maallaqaa fi teessoo himatamaa..." : "የገንዘቡ መጠን እና የተከሳሹ መኖሪያ አድራሻ በዚህ ፍርድ ቤት ስልጣን ስር የሚወድቅ በመሆኑ"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 4: Claim Subject and Amount */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  {t('secClaimSubject')}
                </span>
                <span className="text-[10px] text-slate-400">4</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t('claimCategory')} *
                </label>
                <input
                  type="text"
                  required
                  value={claimCategory}
                  onChange={(e) => setClaimCategory(e.target.value)}
                  placeholder={isOromo ? "fkn: Iyyannoo Himannaa Liqii Maallaqaa Deebisiisuu" : "ለምሳሌ፡ የተበደረውን ገንዘብ በውሉ መሠረት ሳይመልስ የቀረ ተበዳሪ ክስ"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t('claimAmountETB')}
                </label>
                <input
                  type="text"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="250,000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Section 5: The 4 Mandatory Written Questions (ከሳሽ የሚጠበቅበት መጠይቆች / Gaaffilee Himataa) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 via-slate-950/80 to-slate-950 border-2 border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <div>
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {t('secQuestionsTitle')}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isOromo 
                      ? 'Gaaffilee kana sirriitti deebisaa; sirnichi iyyannoo seera qabeessa isiniif qopheessa.'
                      : 'ከሳሽ እነዚህን 4 ጥያቄዎች ሲመልስ ሲስተሙ የክስ ሰነዱን ፍሬ ነገር በሕግ ደረጃ አደራጅቶ ያዘጋጅለታል።'}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  {isOromo ? 'Gaaffilee 4' : '4ቱ ዋና መጠይቆች'}
                </span>
              </div>

              {/* Question 1: Agreement / Transaction Details */}
              <div className="space-y-1">
                <label className="block text-amber-200 font-semibold text-xs">
                  {t('qAgreementLabel')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionAgreementDetails}
                  onChange={(e) => setQuestionAgreementDetails(e.target.value)}
                  placeholder={isOromo ? "fkn: Guyyaa 12/03/2016 tti himatamaan maallaqa Qarshii 250,000 liqeeffate..." : "ለምሳሌ፡ በቀን 12/03/2016 ዓ.ም ተከሳሽ ለአስቸኳይ ስራ በሚል የ 250,000 ብር ብድር በውል ወስዷል..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none leading-relaxed text-xs"
                />
              </div>

              {/* Question 2: Breach of Obligation */}
              <div className="space-y-1">
                <label className="block text-amber-200 font-semibold text-xs">
                  {t('qBreachLabel')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionBreachDetails}
                  onChange={(e) => setQuestionBreachDetails(e.target.value)}
                  placeholder={isOromo ? "fkn: Yeroon kaffaltii yoo darbes maallaqa deebisuu dhabuun..." : "ለምሳሌ፡ የመመለሻ ጊዜው ቢያልፍም ሳይመልስ የቀረ ሲሆን ስልክ በማይነሳበት ሁኔታ መሰወሩ..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none leading-relaxed text-xs"
                />
              </div>

              {/* Question 3: Notice & Warnings */}
              <div className="space-y-1">
                <label className="block text-amber-200 font-semibold text-xs">
                  {t('qNoticeLabel')} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={questionDemandAndNotice}
                  onChange={(e) => setQuestionDemandAndNotice(e.target.value)}
                  placeholder={isOromo ? "fkn: Akeekkachiisni barreeffamaa guyyoota 7 kan kennamuuf ergamee..." : "ለምሳሌ፡ በቀን 25/09/2016 ዓ.ም የ 7 ቀናት የጽሁፍ ማስጠንቀቂያ የተሰጠው ቢሆንም..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none leading-relaxed text-xs"
                />
              </div>

              {/* Question 4: Damages & Losses */}
              <div className="space-y-1">
                <label className="block text-amber-200 font-semibold text-xs">
                  {t('qDamagesLabel')} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={questionDamagesCaused}
                  onChange={(e) => setQuestionDamagesCaused(e.target.value)}
                  placeholder={isOromo ? "fkn: Sochii daldalaa gufachiisuu fi baasii seeraatiif saaxiluu..." : "ለምሳሌ፡ በከሳሽ ላይ የንግድ እንቅስቃሴውን ያስተጓጎለ እና የገንዘብ ኪሳራ ያስከተለ መሆኑ..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none leading-relaxed text-xs"
                />
              </div>

              {/* Additional Details */}
              <div className="space-y-1">
                <label className="block text-slate-400 font-medium text-xs">
                  {t('qAdditionalLabel')}
                </label>
                <textarea
                  rows={2}
                  value={additionalFacts}
                  onChange={(e) => setAdditionalFacts(e.target.value)}
                  placeholder={isOromo ? "Ibsa dabalataa yoo jiraate asitti galchaa..." : "ተጨማሪ ማስታወሻዎች ካሉ እዚህ ያስገቡ..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Section 6: Legal Articles */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  {t('secLegalBases')}
                </span>
                <span className="text-[10px] text-slate-400">6</span>
              </div>

              <div>
                <textarea
                  rows={2}
                  value={violatedArticles}
                  onChange={(e) => setViolatedArticles(e.target.value)}
                  placeholder={isOromo ? "Seera Sivilii keewwata 1675, 1731, 1771..." : "የፍትሐብሔር ሕግ ቁጥር 1675፣ 1731፣ 1771 እና 2027..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Section 7: Demands (Prayers for Relief) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  {t('secPrayers')}
                </span>
                <span className="text-[10px] text-slate-400">7</span>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={specificDemands}
                  onChange={(e) => setSpecificDemands(e.target.value)}
                  placeholder={isOromo ? "Liqiin duraa akka deebi'u, dhalli 9% fi baasiin askuutaa akka kaffalamu..." : "ዋናው እዳ እንዲመለስ፣ 9% ዓመታዊ ወለድ እና የጠበቃ ወጪ በተከሳሽ እንዲሸፈን..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Section 8: Documentary Evidences & Witnesses */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <BookmarkPlus className="w-4 h-4 text-teal-400" />
                  {t('secEvidences')}
                </span>
                <span className="text-[10px] text-slate-400">8</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t('docEvidencesLabel')}
                </label>
                <textarea
                  rows={3}
                  value={evidenceList}
                  onChange={(e) => setEvidenceList(e.target.value)}
                  placeholder={isOromo ? "1. Sanada waliigaltee barreeffamaa\n2. Nageetti baankii" : "1. በሁለቱ ወገኖች የተፈረመ የውል ሰነድ\n2. የባንክ ማስተላለፊያ ደረሰኝ"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none text-xs font-mono"
                />
              </div>

              {/* Witnesses Subsection */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('witnessesHeader')}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddWitness}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t('addWitnessBtn')}</span>
                  </button>
                </div>

                {witnesses.map((w, index) => (
                  <div key={w.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400">
                        {isOromo ? `Dhugaa-baataa ${index + 1}` : `ምስክር ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWitness(w.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                        title={isOromo ? "Haqi" : "ሰርዝ"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={w.name}
                        onChange={(e) => handleUpdateWitness(w.id, 'name', e.target.value)}
                        placeholder={isOromo ? "Maqaa Guutuu" : "የምስክር ሙሉ ስም"}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:border-amber-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={w.address}
                        onChange={(e) => handleUpdateWitness(w.id, 'address', e.target.value)}
                        placeholder={isOromo ? "Teessoo / Bilbila" : "አድራሻ / ስልክ"}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <input
                      type="text"
                      value={w.testimonySubject}
                      onChange={(e) => handleUpdateWitness(w.id, 'testimonySubject', e.target.value)}
                      placeholder={isOromo ? "Qabxii Raga-ba'umsaa" : "የሚመሰክሩበት ነጥብ (ለምሳሌ፡ ስለ ብድር ውሉ አፈራረም)"}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9: Verification under Oath */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t('secVerification')}
                </span>
                <span className="text-[10px] text-slate-400">9</span>
              </div>
              <textarea
                rows={2}
                value={verificationStatement}
                onChange={(e) => setVerificationStatement(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-amber-500 focus:outline-none text-xs italic"
              />
            </div>

            {/* Submit / Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{t('generatingPleading')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{t('generateClaimPleadingBtn')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Court-Ready Plaint Display & Actions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/95 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-serif flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>{t('officialCourtPleadingPreview')}</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  {generatedDraft 
                    ? (isOromo ? 'Iyyannoon himannaa seera qabeessi qophaa\'eera' : 'የተዘጋጀው ሰነድ በቀጥታ ለፍርድ ቤት መቅረብ ይችላል')
                    : (isOromo ? 'Gaaffilee gama bitaa guutuun "Qopheessi" cuqaa' : 'መጠይቆቹን ሞልተው «የክስ ወረቀት አዘጋጅ»ን ሲጫኑ እዚህ ይዘጋጃል')}
                </span>
              </div>

              {generatedDraft && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setIsEditingDraft(!isEditingDraft)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title={isOromo ? "Gulaali" : "ጽሁፉን አርም"}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEditingDraft ? (isOromo ? 'Xumuri' : 'ጨርስ') : (isOromo ? 'Gulaali' : 'አርም')}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title={isOromo ? "Garagalchi" : "ጽሁፉን ቅዳ"}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('copied') : t('copy')}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title={isOromo ? "Buusi" : "በፋይል አውርድ"}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('download')}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-md"
                    title={isOromo ? "Maxxansi" : "ይፋዊ የፍርድ ቤት ሰነድ አትም"}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('print')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Document Content View / Text Editor */}
            {generatedDraft ? (
              <div className="space-y-4">
                {isEditingDraft ? (
                  <div className="space-y-2">
                    <span className="text-[11px] text-amber-300 flex items-center gap-1">
                      <Edit3 className="w-3 h-3" />
                      <span>{isOromo ? 'Barreeffama iyyannoo himannaa kana gulaaluu dandeessu:' : 'ጽሁፉን እንደፈለጉ እዚህ ማስተካከልና ማረም ይችላሉ፦'}</span>
                    </span>
                    <textarea
                      rows={22}
                      value={generatedDraft}
                      onChange={(e) => setGeneratedDraft(e.target.value)}
                      className="w-full bg-slate-950 border border-amber-500/40 rounded-xl p-4 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 font-mono text-xs leading-relaxed text-slate-200 max-h-[75vh] overflow-y-auto shadow-inner whitespace-pre-wrap selection:bg-amber-500 selection:text-slate-950">
                    {/* Authentic Ethiopian Court Seal Stamp Header */}
                    <div className="text-center border-b-2 border-slate-700 pb-3 mb-4 space-y-1">
                      <div className="text-[11px] font-bold text-amber-400 tracking-wider">
                        {isOromo ? 'RIPAAKILIKAA DEMOKIRAATAAWA FEDERAALAA ITOOPHIYAA' : 'በኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ'}
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        {courtName} ({courtBench})
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isOromo ? 'Waraqaa Himannaa Seera Qabeessa' : 'ይፋዊ የፍርድ ቤት የክስ ማመልከቻ ሰነድ'}
                      </div>
                    </div>

                    {generatedDraft}

                    {/* Footer Verification Seal */}
                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        <span>{isOromo ? 'Mallattoo Himataa' : 'የከሳሽ ፊርማ'}፡ __________________</span>
                      </div>
                      <div>
                        <span>{isOromo ? 'Askuutaa Mana Murtii' : 'የፍርድ ቤት ማህተም'} [ ____________ ]</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save to Managed Cases action button */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white text-xs block">
                      {isOromo ? 'Iyyannoo kana gara Wiirtuu To\'annoo Himannaatti Galmeessuu' : 'ይህንን ክስ ወደ ክስ መቆጣጠሪያ ማዕከል መዝግብ'}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {isOromo
                        ? 'Lakk. galmee fi beellama mana murtii qabachuun akka hordofamu godha.'
                        : 'የመዝገብ ቁጥር ሰጥቶ የፍርድ ቤት ቀጠሮ ለመያዝና ማስረጃዎችን ለማደራጀት።'}
                    </p>
                  </div>

                  <button
                    onClick={handleSaveToControlCenter}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-lg shadow-emerald-900/30"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? (isOromo ? 'Galmaa\'eera!' : 'ተመዝግቧል!') : t('saveToCasesBtn')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 px-6 text-center space-y-3 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-amber-400/80" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {isOromo ? 'Iyyannoon himannaa ammaan tana hin qophoofne' : 'የክስ ወረቀቱ ገና አልተዘጋጀም'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {isOromo 
                    ? 'Gama bitaatti gaaffilee himataa fi dhimmoota jiran guutuudhaan "Iyyannoo Himannaa Qopheessi" kan jedhu cuqaasaa.'
                    : 'በግራ በኩል ከሳሽ የሚጠበቅበትን 4 ዋና የጽሁፍ መጠይቆችና የፓርቲዎችን መረጃ ሞልተው «የክስ ወረቀት አዘጋጅ» የሚለውን ሲጫኑ ይፋዊው ሰነድ እዚህ ወዲያው ይዘጋጅልዎታል።'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
