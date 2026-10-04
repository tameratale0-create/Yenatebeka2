import React, { useState, useRef } from 'react';
import {
  Languages,
  ArrowRightLeft,
  FileText,
  Upload,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  BookOpen,
  Scale,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  ChevronRight,
  Search,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface TranslatorProps {
  onNavigateToDrafter?: (prefillText: string) => void;
  onNavigateToDefense?: (prefillText: string) => void;
  onNavigateToConsultation?: (caseText: string) => void;
}

type TranslationDomain = 'legal' | 'formal' | 'general';
type SourceLang = 'auto' | 'am' | 'om' | 'en';
type TargetLang = 'am' | 'om' | 'en';

interface LegalGlossaryItem {
  id: string;
  am: string;
  om: string;
  en: string;
  category: string;
  citation: string;
  definitionAm: string;
  definitionOm: string;
}

const LEGAL_GLOSSARY: LegalGlossaryItem[] = [
  {
    id: '1',
    am: 'ከሳሽ',
    om: 'Himataa',
    en: 'Plaintiff / Claimant',
    category: 'Procedural',
    citation: 'የፍ/ብ/ሥ/ሥ/ሕ/ቁ 222',
    definitionAm: 'መብቴ ተጥሷል ወይም ጥቅሜ ተጎድቷል ብሎ ለፍርድ ቤት የመጀመሪያውን የክስ አቤቱታ የሚያቀርብ ወገን።',
    definitionOm: 'Nama ykn qaama mirgi koo sarbameera jedhee mana murtiitti iyyannoo himannaa jalqabaa dhiheessu.',
  },
  {
    id: '2',
    am: 'ተከሳሽ',
    om: 'Himatamaa',
    en: 'Defendant / Respondent',
    category: 'Procedural',
    citation: 'የፍ/ብ/ሥ/ሥ/ሕ/ቁ 234',
    definitionAm: 'ክስ የቀረበበትና በፍርድ ቤት ቀርቦ መልስ ወይም የመከላከያ መልስ እንዲሰጥ የተጠራ ወገን።',
    definitionOm: 'Qaama himanni irratti banamee mana murtii duratti deebii akka kennuuf waamichi godhameef.',
  },
  {
    id: '3',
    am: 'ዳኝነት / ዳኛ',
    om: 'Abbaa Seerummaa / Abbaa Murtii',
    en: 'Adjudication / Judge',
    category: 'Judicial',
    citation: 'ሕገ-መንግሥት አንቀጽ 79',
    definitionAm: 'ክርክርን በሕግ አግባብ አይቶ ውሳኔ የመስጠት ስልጣን ወይም ስልጣን የተሰጠው ዳኛ።',
    definitionOm: 'Aangoo falmii seeraan ilaalee murtii kennuu ykn qaama aangoon kun kennameef.',
  },
  {
    id: '4',
    am: 'የክስ ማመልከቻ',
    om: 'Iyyannoo Himannaa',
    en: 'Statement of Claim / Plaint',
    category: 'Procedural',
    citation: 'የፍ/ብ/ሥ/ሥ/ሕ/ቁ 222-224',
    definitionAm: 'ከሳሽ የክሱን ፍሬ ነገር፣ የሕግ መሠረትና የሚጠይቀውን ዳኝነት ዘርዝሮ ለፍርድ ቤት የሚያቀርበው ሰነድ።',
    definitionOm: 'Waraqaa qabiyyee dhimmaa, bu\'uura seeraa fi murtii barbaadamu tarreessee dhihaatu.',
  },
  {
    id: '5',
    am: 'ውል / ስምምነት',
    om: 'Waliigaltee',
    en: 'Contract / Agreement',
    category: 'Civil',
    citation: 'የፍትሐብሔር ሕግ ቁጥር 1675',
    definitionAm: 'በሁለት ወይም ከዚያ በላይ በሆኑ ሰዎች መካከል የንብረት ወይም የግዴታ ግንኙነት ለመፍጠር የሚደረግ አስገዳጅ ስምምነት።',
    definitionOm: 'Walii-galtee namoota lama ykn isaa ol gidduutti mirgaa fi dirqama uumuuf taasifamu.',
  },
  {
    id: '6',
    am: 'የውል ጥሰት',
    om: 'Diiggaa / Cabsa Waliigaltee',
    en: 'Breach of Contract',
    category: 'Civil',
    citation: 'የፍትሐብሔር ሕግ ቁጥር 1771',
    definitionAm: 'አንደኛው ተዋዋይ ወገን በውሉ ውስጥ የተጣለበትን ግዴታ ሳይፈጽም ሲቀር የሚፈጠር ሕጋዊ ተጠያቂነት።',
    definitionOm: 'Qaamni tokko dirqama waliigaltee keessatti ibsame osoo hin raawwatiin hafuu.',
  },
  {
    id: '7',
    am: 'ካሳ / ኪሳራ',
    om: 'Beenyaa / Kasaaraa',
    en: 'Compensation / Damages',
    category: 'Civil',
    citation: 'የፍትሐብሔር ሕግ ቁጥር 1790, 2090',
    definitionAm: 'በውል ጥሰት ወይም በአደጋ ምክንያት ለደረሰ ጉዳት ወይም መስተጓጎል የሚከፈል የገንዘብ ማካካሻ።',
    definitionOm: 'Miidhaa sababa cabsa waliigaltee ykn balaatiin qaqqabeef maallaqa kaffalamu.',
  },
  {
    id: '8',
    am: 'መጥሪያ',
    om: 'Waamicha Mana Murtii',
    en: 'Court Summons / Notice',
    category: 'Procedural',
    citation: 'የፍ/ብ/ሥ/ሥ/ሕ/ቁ 94',
    definitionAm: 'ፍርድ ቤት ለተከሳሽ ወይም ለምስክር በችሎት እንዲቀርቡ የሚያስተላልፈው ይፋዊ ትዕዛዝ።',
    definitionOm: 'Ajaja seeraa mana murtii namni akka dhihaatuuf beeksisa kennamu.',
  },
  {
    id: '9',
    am: 'ይግባኝ',
    om: 'Ol-iyyannoo',
    en: 'Appeal',
    category: 'Appellate',
    citation: 'የፍ/ብ/ሥ/ሥ/ሕ/ቁ 320',
    definitionAm: 'በታችኛው ፍርድ ቤት ውሳኔ ቅር የተሰኘ ወገን ለበላይ ፍርድ ቤት የሚያቀርበው አቤቱታ።',
    definitionOm: 'Iyyannoo murtii mana murtii jalaatti quubsaa hin taaneef mana murtii ol\'aanaatti dhihaatu.',
  },
  {
    id: '10',
    am: 'ሰበር አቤቱታ',
    om: 'Ijibbaata',
    en: 'Cassation',
    category: 'Appellate',
    citation: 'አዋጅ ቁጥር 1234/2013 አንቀጽ 10',
    definitionAm: 'መሰረታዊ የሕግ ስህተት ያለበት የመጨረሻ ውሳኔ እንዲታረም ለጠቅላይ ፍርድ ቤት ሰበር ችሎት የሚቀርብ።',
    definitionOm: 'Murtii dhumaa dogoggora bu\'uura seeraa qabu sirreessuuf Dhaddacha Ijibbaataatti dhihaatu.',
  },
  {
    id: '11',
    am: 'የውክልና ስልጣን',
    om: 'Bakka-bu\'iinsa',
    en: 'Power of Attorney / Agency',
    category: 'Civil',
    citation: 'የፍትሐብሔር ሕግ ቁጥር 2199',
    definitionAm: 'አንድ ሰው በሌላ ሰው ስም እና ምትክ ሆኖ ሕጋዊ ተግባራትን እንዲያከናውን የሚሰጥ ህጋዊ ሰነድ።',
    definitionOm: 'Sanada seera qabeessa nama biraa bakka bu\'anii hojii seeraa raawwachuuf kennamu.',
  },
  {
    id: '12',
    am: 'የእውነት ቃል መሐላ / ማረጋገጫ',
    om: 'Kakata / Mirkaneessa Dhugaa',
    en: 'Oath / Verification',
    category: 'Procedural',
    citation: 'የፍ/ብ/ሥ/ሥ/ሕ/ቁ 92',
    definitionAm: 'በፍርድ ቤት ወይም በመንግስት አካል ፊት የሚቀርብ መረጃ እውነት መሆኑን በፈጣሪ ወይም በክብር ማረጋገጥ።',
    definitionOm: 'Odeeffannoon dhihaate dhugaa ta\'uu isaa mana murtii duratti waadaa galuu.',
  },
];

export const Translator: React.FC<TranslatorProps> = ({
  onNavigateToDrafter,
  onNavigateToDefense,
  onNavigateToConsultation,
}) => {
  const { t, isOromo, isEnglish, language } = useLanguage();

  const [activeMode, setActiveMode] = useState<'text' | 'document' | 'lexicon'>('text');
  const [sourceLang, setSourceLang] = useState<SourceLang>('auto');
  const [targetLang, setTargetLang] = useState<TargetLang>(isOromo ? 'am' : 'om');
  const [domain, setDomain] = useState<TranslationDomain>('legal');

  // Text Mode State
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translationStats, setTranslationStats] = useState<{
    wordCount: number;
    translatedWordCount: number;
    summaryNotes?: string;
  } | null>(null);

  // Document Mode State
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
    content: string;
  } | null>(null);
  const [docTranslatedContent, setDocTranslatedContent] = useState('');
  const [isTranslatingDoc, setIsTranslatingDoc] = useState(false);
  const [docViewSplit, setDocViewSplit] = useState<'split' | 'target'>('split');
  const [docErrorMessage, setDocErrorMessage] = useState<string | null>(null);
  const [docCopyFeedback, setDocCopyFeedback] = useState(false);

  // Lexicon State
  const [lexiconSearch, setLexiconSearch] = useState('');
  const [lexiconCategory, setLexiconCategory] = useState<string>('all');
  const [copiedTermId, setCopiedTermId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample Snippets for quick demonstration
  const sampleSnippets = [
    {
      title: isOromo ? 'Waliigaltee Liqii Maallaqaa (Oromoo ➔ አማርኛ)' : 'የብድር ውል ስምምነት (ኦሮምኛ ➔ አማርኛ)',
      source: 'om' as SourceLang,
      target: 'am' as TargetLang,
      text: `WALIIGALTEE LIQII MAALLAQAA
Guyyaa: 15/07/2016
Iddoo: Finfinnee

Nu warri maqaanii fi teessoon keenya armaan gaditti caqasame:
1. Obbo Tulluu Mokonnon (Liqeeffataa)
2. Aadde Caaltuu Dassaaleny (Liqeessituu)

Waliigaltee armaan gadii irratti waliigalleerra:
1. Liqeessituun maallaqa Qarshii 450,000 (Kuma dhibba afurii fi shantama) Liqeeffataaf liqeessitee jirti.
2. Liqeeffataan maallaqa kana guyyaa har'aa irraa eegalee ji\'oota 6 keessatti dhala seeraa dhibbeentaa 9% waliin deebisuuf dirqama seeneera.
3. Yoo Liqeeffataan yeroo jedhame keessatti maallaqa kana deebisuu baate, Liqeessituun mana murtii aangoo qabutti iyyannoo himannaa dhiheessuuf mirga guutuu qabdi.`,
    },
    {
      title: isOromo ? 'Iyyannoo Himannaa Mana Murtii (አማርኛ ➔ Oromoo)' : 'የፍርድ ቤት የክስ አቤቱታ (አማርኛ ➔ ኦሮምኛ)',
      source: 'am' as SourceLang,
      target: 'om' as TargetLang,
      text: `ለፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ የፍትሐብሔር ችሎት
አዲስ አበባ

ከሳሽ፡ አቶ በቀለ ታደሰ - አድራሻ፡ አዲስ አበባ፣ ቂርቆስ ክ/ከተማ፣ ወረዳ 03፣ የቤት ቁጥር 124
ተከሳሽ፡ አቶ ግርማ ወልዴ - አድራሻ፡ አዲስ አበባ፣ ቦሌ ክ/ከተማ፣ ወረዳ 05፣ የቤት ቁጥር 890

የክሱ ፍሬ ነገር፡- የቤት ኪራይ ውል ጥሰትና ያልተከፈለ የቤት ኪራይ ዕዳ እንዲከፈል መጠየቅ
1. ከሳሽ በቦሌ ክ/ከተማ የሚገኘውን የመኖሪያ ቤቱን ለተከሳሽ በወር 25,000 (ሃያ አምስት ሺህ) ብር አከራይቶታል።
2. ተከሳሹ ላለፉት 4 ወራት አጠቃላይ 100,000 (አንድ መቶ ሺህ) ብር የቤት ኪራይ ሳይከፍል ቀርቷል።
3. ስለሆነም ክቡር ፍርድ ቤቱ ተከሳሹ ያልከፈለውን ዋና ዕዳ ከነሕጋዊ ወለዱ ጋር እንዲከፍልና ቤቱን ለከሳሽ በአስቸኳይ እንዲያስረክብ ውሳኔ እንዲሰጥልኝ በአክብሮት እጠይቃለሁ።`,
    },
    {
      title: isOromo ? 'Waliigaltee Daldalaa (English ➔ Oromoo & አማርኛ)' : 'የንግድ ውል አንቀጽ (English ➔ አማርኛ / ኦሮምኛ)',
      source: 'en' as SourceLang,
      target: isOromo ? ('om' as TargetLang) : ('am' as TargetLang),
      text: `SECTION 12: BREACH OF CONTRACT AND LIQUIDATED DAMAGES
1. In the event either party fails to perform any of its material obligations under this Agreement, the non-breaching party shall serve a formal written notice allowing fifteen (15) calendar days for rectification.
2. If the default is not cured within the stipulated period, the injured party shall have the right to terminate the contract immediately pursuant to Articles 1771 and 1785 of the Ethiopian Civil Code.
3. The breaching party shall remain liable to pay liquidated damages amounting to twenty percent (20%) of the total contract value, without prejudice to other remedies available under the law.`,
    },
    {
      title: isOromo ? 'Waraqaa Bakka-Bu\'iinsaa (አማርኛ ➔ English)' : 'ልዩ የውክልና ስልጣን (አማርኛ ➔ እንግሊዝኛ)',
      source: 'am' as SourceLang,
      target: 'en' as TargetLang,
      text: `የውክልና ስልጣን ማረጋገጫ ሰነድ
እኔ ወካይ አቶ ታሪኩ ለማ የኢትዮጵያ ዜግነት ያለኝና ነዋሪነቴ አዲስ አበባ የሆነ፣ ወኪሌ አቶ ዳዊት ከበደ በእኔ ምትክ ሆኖ፡-
1. በፌዴራልና በክልል ፍርድ ቤቶች፣ በይግባኝ ሰሚና በሰበር ችሎቶች ቀርቦ በእኔ ስም ክስ እንዲመሰርት፣ መልስና የመከላከያ ማስረጃዎችን እንዲያቀርብ፤
2. በመንግሥታዊና መንግሥታዊ ባልሆኑ ተቋማት ዘንድ ቀርቦ የእኔን ጉዳይ እንዲያስፈጽምና ሰነዶችን እንዲፈርም ልዩ የውክልና ሥልጣን ሰጥቼዋለሁ።`,
    },
  ];

  // Swap source and target languages
  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') {
      const currentResolved = detectedLang === 'om' ? 'om' : detectedLang === 'en' ? 'en' : 'am';
      const newTarget = currentResolved === targetLang ? (targetLang === 'om' ? 'am' : 'om') : currentResolved;
      setSourceLang(targetLang);
      setTargetLang(newTarget as TargetLang);
    } else {
      const newSource = targetLang;
      const newTarget = sourceLang;
      setSourceLang(newSource as SourceLang);
      setTargetLang(newTarget);
    }

    // Also swap text if translated
    if (translatedText.trim()) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  // Perform Text Translation
  const handleTranslateText = async () => {
    if (!sourceText.trim()) {
      setErrorMessage(isOromo ? 'Maaloo dura barruu hiikamu galchaa.' : 'እባክዎ መጀመሪያ የሚተረጎመውን ጽሑፍ ያስገቡ።');
      return;
    }

    setIsTranslating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/legal/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang,
          domain,
          isDocument: false,
        }),
      });

      const data = await res.json();
      if (data.success && data.translation) {
        setTranslatedText(data.translation);
        setDetectedLang(data.detectedSourceLang);
        setTranslationStats({
          wordCount: data.wordCount,
          translatedWordCount: data.translatedWordCount,
          summaryNotes: data.summaryNotes,
        });
      } else {
        setErrorMessage(data.error || (isOromo ? 'Hiikuun hin danda\'amne.' : 'ትርጉሙን ማግኘት አልተቻለም።'));
      }
    } catch (err: any) {
      setErrorMessage(err.message || (isOromo ? 'Dogoggora qunnamtii sararaa.' : 'የግንኙነት ስህተት አጋጥሟል።'));
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle Document File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'text/plain',
        content,
      });
      setDocTranslatedContent('');
      setDocErrorMessage(null);
    };

    reader.onerror = () => {
      setDocErrorMessage(isOromo ? 'Faayilicha dubbisuun hin danda\'amne.' : 'ፋይሉን ማንበብ አልተቻለም።');
    };

    reader.readAsText(file);
  };

  // Load predefined sample document
  const handleLoadSampleDoc = (index: number) => {
    const sampleDocs = [
      {
        name: 'Waliigaltee_Kireeffannaa_Manaa.doc',
        size: '4.2 KB',
        type: 'application/msword',
        content: `WALIIGALTEE KIREEFFANNAA MANA JIREENYAA
Iddoo: Magaalaa Finfinnee, Kutaa Magaalaa Lidataa
Guyyaa: 01/05/2016

Kireessaa: Obbo Alamuu Fayyisaa (Lakk. Waraqaa Eenyummaa: 12345/AA)
Kireeffataa: Obbo Geetaachoo Mokonnon (Lakk. Waraqaa Eenyummaa: 98765/AA)

KIRAA FI HAFEENYA WALIIGALTEE:
1. Kireessaan mana jireenyaa Lidataa warda 04 keessatti argamu kireeffataaf kireessee jira.
2. Kaffaltiin kireeffannaa ji\'atti Qarshii 18,000 (Kuma kudha saddeet) ta\'a.
3. Kireeffataan guyyaa 1 hanga 5 ji\'a kaffalticha baankii kireessaa herreega 100023456 irratti galchuu qaba.
4. Kireeffataan manicha qulqullinaan eeguu fi akkaataa seera sivilii keewwata 2896 tiin tajaajila manichaaf eeyyamame qofaan fayyadamuu qaba.
5. Yoo kireeffataan kaffaltii ji\'a 2 ol walitti qabe kireessaan akeekkachiisa guyyaa 15 kennuudhaan manicha gadi-dhiisisiisuuf mirga qaba.

Mirkaneessa Mallattoo:
Kireessaa: _______________   Kireeffataa: _______________`,
      },
      {
        name: 'የብድር_ማረጋገጫና_ቃል_ኪዳን_ሰነድ.txt',
        size: '3.8 KB',
        type: 'text/plain',
        content: `የገንዘብ ብድር ማረጋገጫና የመክፈያ ቃል ኪዳን ሰነድ
ቀን፡ የካቲት 20 ቀን 2016 ዓ.ም
ቦታ፡ አዲስ አበባ

እኔ ተበዳሪ አቶ ተስፋዬ በቀለ (የመ/ቁ 44556/አአ) ከአበዳሪ ወ/ሮ ሰላማዊት አበራ (የመ/ቁ 77889/አአ) የጥሬ ገንዘብ ብድር 300,000 (ሦስት መቶ ሺህ) የኢትዮጵያ ብር ተቀብያለሁ።

የውሉ ዝርዝር ቅድመ-ሁኔታዎች፡-
1ኛ. የተበደርኩትን ገንዘብ እስከ ሰኔ 30 ቀን 2016 ዓ.ም ድረስ ያለ ምንም ማመንታት በሙሉ ለመክፈል ቃል እገባለሁ።
2ኛ. በተጠቀሰው ቀን ክፍያውን ካላጠናቀቅኩ ከቀነ-ቀጠሮው ጀምሮ በፍትሐብሔር ሕግ ቁጥር 1790 መሠረት ሕጋዊ ወለድ ታክኮበት እንድከፍል ተስማምቻለሁ።
3ኛ. ለዚህ ውል አለመፈጸም ምክንያት ለሚወጡ የፍርድ ቤት፣ የጠበቃ እና ሌሎች የክርክር ወጪዎች በሙሉ ኃላፊነቱን እወስዳለሁ።

ተበዳሪ፡ ተስፋዬ በቀለ ፊርማ፡ ___________
አበዳሪ፡ ሰላማዊት አበራ ፊርማ፡ ___________
ምስክሮች፡
1. አቶ ከበደ ለማ ፊርማ፡ ___________
2. ወ/ሮ ማርታ ደጀኔ ፊርማ፡ ___________`,
      },
      {
        name: 'Special_Power_of_Attorney.doc',
        size: '5.1 KB',
        type: 'application/msword',
        content: `SPECIAL POWER OF ATTORNEY FOR COURT REPRESENTATION
Date: March 12, 2024
Jurisdiction: Federal Democratic Republic of Ethiopia

I, the undersigned Principal, Mr. Samuel Hailu, residing in Addis Ababa, hereby appoint and constitute Advocate Martha Girma as my lawful Attorney-in-Fact to represent me in all civil and commercial disputes before any competent court in Ethiopia.

POWERS CONFERRED:
1. To institute, prosecute, and defend civil actions before Federal First Instance, High Court, and Federal Supreme Court.
2. To submit pleadings, statements of claim, written defense, counterclaims, and documentary evidence pursuant to the Civil Procedure Code.
3. To compromise, settle, or arbitrate claims, and to sign any necessary court instruments on my behalf.
4. To lodge appeals or petitions to the Cassation Division of the Federal Supreme Court against adverse rulings.

In Witness Whereof, I have signed this Special Power of Attorney.
Principal: Samuel Hailu
Signature: ______________________`,
      },
    ];

    const doc = sampleDocs[index];
    if (doc) {
      setUploadedFile(doc);
      setDocTranslatedContent('');
      setDocErrorMessage(null);
    }
  };

  // Perform Document Translation
  const handleTranslateDocument = async () => {
    if (!uploadedFile || !uploadedFile.content.trim()) {
      setDocErrorMessage(isOromo ? 'Maaloo dura sanada ol-fe\'aa.' : 'እባክዎ መጀመሪያ ሰነድ ይጫኑ።');
      return;
    }

    setIsTranslatingDoc(true);
    setDocErrorMessage(null);

    try {
      const res = await fetch('/api/legal/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: uploadedFile.content,
          sourceLang,
          targetLang,
          domain,
          isDocument: true,
          fileName: uploadedFile.name,
        }),
      });

      const data = await res.json();
      if (data.success && data.translation) {
        setDocTranslatedContent(data.translation);
        setDetectedLang(data.detectedSourceLang);
      } else {
        setDocErrorMessage(data.error || (isOromo ? 'Sanadicha hiikuun hin danda\'amne.' : 'ሰነዱን መተርጎም አልተቻለም።'));
      }
    } catch (err: any) {
      setDocErrorMessage(err.message || (isOromo ? 'Dogoggora qunnamtii sararaa.' : 'የግንኙነት ስህተት አጋጥሟል።'));
    } finally {
      setIsTranslatingDoc(false);
    }
  };

  // Copy helper
  const handleCopyText = (text: string, isDoc = false) => {
    navigator.clipboard.writeText(text);
    if (isDoc) {
      setDocCopyFeedback(true);
      setTimeout(() => setDocCopyFeedback(false), 2000);
    } else {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  // Download translated file
  const handleDownloadFile = (content: string, baseName: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${baseName}_Translated_${targetLang.toUpperCase()}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Print document
  const handlePrintDocument = (content: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Times New Roman', 'Noto Sans Ethiopic', serif; padding: 40px; line-height: 1.6; color: #111; }
            h2 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .meta { font-size: 12px; color: #666; margin-bottom: 25px; text-align: right; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
            .cert { margin-top: 40px; border-top: 1px dashed #666; padding-top: 15px; font-size: 12px; font-style: italic; }
          </style>
        </head>
        <body>
          <h2>${isOromo ? 'WARAQAA HIIKA SEERAA' : 'ይፋዊ የሕግ ትርጉም ሰነድ'}</h2>
          <div class="meta">
            ${isOromo ? 'Afaan Jalqabaa:' : 'የመነሻ ቋንቋ፡'} ${sourceLang.toUpperCase()} ➔ ${targetLang.toUpperCase()} | 
            ${new Date().toLocaleDateString()}
          </div>
          <pre>${content}</pre>
          <div class="cert">
            ${isOromo 
              ? 'Waraqaan kun sirna seeraa fi jechoota mana murtii Itoophiyaa bu\'uureffachuun kan qophaa\'e dha.'
              : 'ይህ ሰነድ የኢትዮጵያ የፍትሐብሔርና የወንጀል ሕጎችን ሥነ-ሥርዓት መሠረት አድርጎ የተተረጎመ ይፋዊ ቅጅ ነው።'}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Text to Speech
  const handleToggleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (targetLang === 'en') {
      utterance.lang = 'en-US';
    } else {
      utterance.lang = 'am-ET';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Filtered Lexicon
  const filteredLexicon = LEGAL_GLOSSARY.filter((item) => {
    const matchesSearch =
      item.am.toLowerCase().includes(lexiconSearch.toLowerCase()) ||
      item.om.toLowerCase().includes(lexiconSearch.toLowerCase()) ||
      item.en.toLowerCase().includes(lexiconSearch.toLowerCase()) ||
      item.citation.toLowerCase().includes(lexiconSearch.toLowerCase());

    const matchesCategory = lexiconCategory === 'all' || item.category.toLowerCase() === lexiconCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-900/30 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <Languages className="w-3.5 h-3.5" />
              <span>{isOromo ? 'Hiikaa Seeraa & Sanadootaa' : isEnglish ? 'Legal & Document Translator' : 'የሕግና የሰነዶች ተርጓሜ'}</span>
              <span className="text-amber-500/50">•</span>
              <span className="text-amber-300">አማርኛ ⇄ Afaan Oromoo ⇄ English</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('translatorTitle')}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              {t('translatorSubtitle')}
            </p>
          </div>

          {/* Quick Stats or Mode Navigation */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveMode('text')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'text'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('translatorModeText')}</span>
            </button>

            <button
              onClick={() => setActiveMode('document')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'document'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t('translatorModeDoc')}</span>
            </button>

            <button
              onClick={() => setActiveMode('lexicon')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'lexicon'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t('translatorModeLexicon')}</span>
            </button>
          </div>
        </div>

        {/* Global Language Direction Selector Bar */}
        {activeMode !== 'lexicon' && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Source Lang */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
                <span className="text-xs text-slate-400 font-medium">
                  {isOromo ? 'Madda:' : isEnglish ? 'From:' : 'የመነሻ ቋንቋ፡'}
                </span>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value as SourceLang)}
                  className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                >
                  <option value="auto" className="bg-slate-900 text-white">
                    ✨ {t('autoDetect')}
                  </option>
                  <option value="am" className="bg-slate-900 text-white">
                    አማርኛ (Amharic)
                  </option>
                  <option value="om" className="bg-slate-900 text-white">
                    Afaan Oromoo (Oromo)
                  </option>
                  <option value="en" className="bg-slate-900 text-white">
                    English (እንግሊዝኛ)
                  </option>
                </select>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapLanguages}
                className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
                title={t('swapLanguages')}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              {/* Target Lang */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
                <span className="text-xs text-slate-400 font-medium">
                  {isOromo ? 'Gara:' : isEnglish ? 'To:' : 'የመድረሻ ቋንቋ፡'}
                </span>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value as TargetLang)}
                  className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                >
                  <option value="om" className="bg-slate-900 text-white">
                    Afaan Oromoo (Oromo)
                  </option>
                  <option value="am" className="bg-slate-900 text-white">
                    አማርኛ (Amharic)
                  </option>
                  <option value="en" className="bg-slate-900 text-white">
                    English (እንግሊዝኛ)
                  </option>
                </select>
              </div>
            </div>

            {/* Translation Domain Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {isOromo ? 'Haala Jechootaa:' : isEnglish ? 'Tone / Domain:' : 'የይዘት አይነት፡'}
              </span>
              <div className="flex bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
                <button
                  onClick={() => setDomain('legal')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    domain === 'legal'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={t('domainLegal')}
                >
                  ⚖️ {isOromo ? 'Seera' : isEnglish ? 'Legal' : 'ሕግና ፍርድ ቤት'}
                </button>
                <button
                  onClick={() => setDomain('formal')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    domain === 'formal'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={t('domainFormal')}
                >
                  🏛️ {isOromo ? 'Mootummaa' : isEnglish ? 'Official' : 'ይፋዊ'}
                </button>
                <button
                  onClick={() => setDomain('general')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    domain === 'general'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={t('domainGeneral')}
                >
                  💬 {isOromo ? 'Waliigala' : isEnglish ? 'General' : 'አጠቃላይ'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODE 1: TEXT TRANSLATION */}
      {activeMode === 'text' && (
        <div className="space-y-6">
          {/* Preset Samples Pill Row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {t('sampleSnippetsTitle')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {sampleSnippets.map((snippet, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSourceLang(snippet.source);
                    setTargetLang(snippet.target);
                    setSourceText(snippet.text);
                    setTranslatedText('');
                    setErrorMessage(null);
                  }}
                  className="text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition-all group"
                >
                  <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 line-clamp-1">
                    {snippet.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {snippet.text.slice(0, 75)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Translation Work Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Source Text Input */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">
                    {sourceLang === 'auto'
                      ? t('autoDetect')
                      : sourceLang === 'am'
                      ? 'አማርኛ (Amharic)'
                      : sourceLang === 'om'
                      ? 'Afaan Oromoo'
                      : 'English'}
                  </span>
                  {detectedLang && sourceLang === 'auto' && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                      {isOromo ? 'Afaan Adda Bahe:' : 'የተለየው፡'}{' '}
                      {detectedLang === 'am' ? 'አማርኛ' : detectedLang === 'om' ? 'Afaan Oromoo' : 'English'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const clip = await navigator.clipboard.readText();
                        setSourceText(clip);
                      } catch (e) {
                        // ignore
                      }
                    }}
                    className="hover:text-white px-2 py-0.5 rounded bg-slate-800 text-[11px]"
                    title={t('pasteClipboard')}
                  >
                    {t('pasteClipboard')}
                  </button>
                  {sourceText && (
                    <button
                      onClick={() => {
                        setSourceText('');
                        setTranslatedText('');
                        setErrorMessage(null);
                      }}
                      className="hover:text-red-400 px-2 py-0.5 rounded bg-slate-800 text-[11px]"
                      title={t('clearText')}
                    >
                      {t('clearText')}
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={t('sourceTextPlaceholder')}
                rows={12}
                className="w-full mt-3 bg-transparent text-slate-100 placeholder-slate-500 text-sm leading-relaxed resize-none focus:outline-none"
              />

              <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {sourceText.length} {isOromo ? 'qubeewwan' : 'ፊደላት'} • {sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0} {isOromo ? 'jechoota' : 'ቃላት'}
                </span>
                <button
                  onClick={handleTranslateText}
                  disabled={isTranslating || !sourceText.trim()}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    isTranslating || !sourceText.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
                  <span>{isTranslating ? t('translatingBtn') : t('translateBtn')}</span>
                </button>
              </div>
            </div>

            {/* Right: Translated Output */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-lg relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-400">
                    {targetLang === 'am' ? 'አማርኛ (Amharic)' : targetLang === 'om' ? 'Afaan Oromoo' : 'English'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                    {domain === 'legal' ? '⚖️ Legal' : domain === 'formal' ? '🏛️ Official' : '💬 General'}
                  </span>
                </div>

                {translatedText && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleSpeak(translatedText)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title={isSpeaking ? 'Mute' : 'Listen'}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopyText(translatedText)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title={t('copy')}
                    >
                      {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDownloadFile(translatedText, 'Translation')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title={t('download')}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handlePrintDocument(translatedText, 'Legal Translation')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title={t('print')}
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {isTranslating ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                  <p className="text-sm font-semibold text-slate-300">{t('translatingBtn')}</p>
                  <p className="text-xs text-slate-500">
                    {isOromo ? 'Jechoota seeraa Itoophiyaa bu\'uureffatee hiikamaa jira...' : 'የኢትዮጵያን የሕግ ቃላትና ድንጋጌዎች በጠበቀ መልኩ በመተርጎም ላይ...'}
                  </p>
                </div>
              ) : translatedText ? (
                <div className="mt-3 flex-1 flex flex-col">
                  <textarea
                    readOnly
                    value={translatedText}
                    rows={12}
                    className="w-full flex-1 bg-transparent text-slate-100 text-sm leading-relaxed resize-none focus:outline-none"
                  />
                  {translationStats?.summaryNotes && (
                    <div className="mt-3 p-2 rounded-lg bg-amber-950/30 border border-amber-900/30 text-amber-300 text-xs">
                      <span className="font-semibold">{isOromo ? 'Hubachiisa:' : 'ማስታወሻ፡'}</span> {translationStats.summaryNotes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-500 space-y-2">
                  <Languages className="w-10 h-10 text-slate-700" />
                  <p className="text-xs sm:text-sm">{t('translatedPlaceholder')}</p>
                </div>
              )}

              {/* Action shortcuts to other app modules */}
              {translatedText && !isTranslating && (
                <div className="mt-auto pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400">
                    {translatedText.trim().split(/\s+/).length} {isOromo ? 'jechoota' : 'ቃላት'}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {onNavigateToDrafter && (
                      <button
                        onClick={() => onNavigateToDrafter(translatedText)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('sendToDrafter')}</span>
                      </button>
                    )}
                    {onNavigateToDefense && (
                      <button
                        onClick={() => onNavigateToDefense(translatedText)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>{isOromo ? 'Gara Deebii Himatamaatti' : 'ወደ መከላከያ መልስ'}</span>
                      </button>
                    )}
                    {onNavigateToConsultation && (
                      <button
                        onClick={() => onNavigateToConsultation(translatedText)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t('sendToConsultation')}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: DOCUMENT TRANSLATION (በሰነድ) */}
      {activeMode === 'document' && (
        <div className="space-y-6">
          {/* File Upload Box */}
          <div className="bg-slate-900 border-2 border-dashed border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 sm:p-8 text-center transition-all">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.doc,.docx,.rtf,.json,.csv,.md"
              className="hidden"
            />

            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">{t('uploadDocTitle')}</h3>
              <p className="text-xs text-slate-400">{t('uploadDocSub')}</p>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  {isOromo ? 'Faayila Filadhaa' : isEnglish ? 'Browse File' : 'ፋይል ይምረጡ'}
                </button>
              </div>
            </div>

            {/* Quick Sample Documents for instant trial */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium block mb-3">
                {isOromo ? 'Yookiin sanada fakkeenyaa kanaan yaalaa:' : 'ወይም በእነዚህ የናሙና ሰነዶች ይሞክሩ፡'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleLoadSampleDoc(0)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-slate-700 transition-colors"
                >
                  📄 Waliigaltee Kireeffannaa Manaa (Oromoo)
                </button>
                <button
                  onClick={() => handleLoadSampleDoc(1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-slate-700 transition-colors"
                >
                  📄 የገንዘብ ብድር ማረጋገጫ ሰነድ (አማርኛ)
                </button>
                <button
                  onClick={() => handleLoadSampleDoc(2)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-slate-700 transition-colors"
                >
                  📄 Special Power of Attorney (English)
                </button>
              </div>
            </div>
          </div>

          {/* Uploaded File Overview Card */}
          {uploadedFile && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{uploadedFile.name}</h4>
                    <p className="text-xs text-slate-400">
                      {uploadedFile.size} • {uploadedFile.content.split('\n').length} {isOromo ? 'sararoota' : 'መስመሮች'} •{' '}
                      {uploadedFile.content.trim().split(/\s+/).length} {isOromo ? 'jechoota' : 'ቃላት'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTranslateDocument}
                    disabled={isTranslatingDoc}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      isTranslatingDoc
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95'
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${isTranslatingDoc ? 'animate-spin' : ''}`} />
                    <span>{isTranslatingDoc ? t('translatingBtn') : t('translateDocBtn')}</span>
                  </button>
                </div>
              </div>

              {docErrorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{docErrorMessage}</span>
                </div>
              )}

              {/* View layout toggle when translation is available */}
              {docTranslatedContent && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setDocViewSplit('split')}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        docViewSplit === 'split' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('compareView')}
                    </button>
                    <button
                      onClick={() => setDocViewSplit('target')}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        docViewSplit === 'target' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isOromo ? 'Sanada Hiikame Qofa' : 'የተተረጎመው ሰነድ ብቻ'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(docTranslatedContent, true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                      title={t('copy')}
                    >
                      {docCopyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{docCopyFeedback ? t('copied') : t('copy')}</span>
                    </button>
                    <button
                      onClick={() => handlePrintDocument(docTranslatedContent, uploadedFile.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                      title={t('print')}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t('print')}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile(docTranslatedContent, uploadedFile.name.replace(/\.[^/.]+$/, ''))}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t('downloadTranslatedDoc')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Document Display Panes */}
              <div
                className={`grid gap-4 ${
                  docTranslatedContent && docViewSplit === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {/* Original Document Pane */}
                {(!docTranslatedContent || docViewSplit === 'split') && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 mb-3">
                      <span className="font-semibold text-slate-300">
                        {isOromo ? 'Sanada Jalqabaa (Original)' : 'የመጀመሪያው ሰነድ (ኦሪጅናል)'}
                      </span>
                      <span>
                        {sourceLang.toUpperCase()}
                      </span>
                    </div>
                    <pre className="text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                      {uploadedFile.content}
                    </pre>
                  </div>
                )}

                {/* Translated Document Pane */}
                {docTranslatedContent && (
                  <div className="bg-slate-950/80 border border-amber-900/30 rounded-xl p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 mb-3">
                      <span className="font-semibold text-amber-400">
                        {isOromo ? 'Sanada Hiikame (Translated)' : 'የተተረጎመው ሰነድ (ይፋዊ)'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">
                        {targetLang.toUpperCase()}
                      </span>
                    </div>
                    <pre className="text-xs sm:text-sm text-slate-100 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                      {docTranslatedContent}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: LEGAL LEXICON / GLOSSARY (የሕግ ቃላት መዝገበ-ቃላት) */}
      {activeMode === 'lexicon' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" />
                  <span>{t('translatorModeLexicon')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isOromo
                    ? 'Jechoota seeraa Itoophiyaa gurguddoo Afaan Oromoo, አማርኛ fi English tiin wal-bira qabuu'
                    : 'በኢትዮጵያ ፍርድ ቤቶችና ሕጎች ውስጥ በተደጋጋሚ የሚሰሩ የሕግ ፍሬ ቃላት መፍቻ'}
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lexiconSearch}
                  onChange={(e) => setLexiconSearch(e.target.value)}
                  placeholder={isOromo ? 'Jechoota seeraa barbaadi...' : 'የሕግ ቃላትን ፈልግ...'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-medium">{t('filter')}:</span>
              {['all', 'Procedural', 'Civil', 'Judicial', 'Appellate'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLexiconCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    lexiconCategory === cat
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all'
                    ? isOromo
                      ? 'Hunda'
                      : 'ሁሉም'
                    : cat === 'Procedural'
                    ? isOromo
                      ? 'Adeemsa Falmii'
                      : 'ሥነ-ሥርዓት'
                    : cat === 'Civil'
                    ? isOromo
                      ? 'Sivilii'
                      : 'ፍትሐብሔር'
                    : cat === 'Judicial'
                    ? isOromo
                      ? 'Mana Murtii'
                      : 'ዳኝነት'
                    : isOromo
                    ? 'Ol-iyyannoo'
                    : 'ይግባኝ'}
                </button>
              ))}
            </div>

            {/* Lexicon Cards Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {filteredLexicon.map((term) => (
                <div
                  key={term.id}
                  className="bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 rounded-xl p-4 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-base text-amber-300">{term.am}</span>
                      <span className="text-slate-500">⇄</span>
                      <span className="font-bold text-base text-white">{term.om}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {term.citation}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${term.am} = ${term.om} (${term.en})`);
                          setCopiedTermId(term.id);
                          setTimeout(() => setCopiedTermId(null), 2000);
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title={t('copy')}
                      >
                        {copiedTermId === term.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-400">
                    <span className="text-slate-500">English:</span> {term.en}
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                    {isOromo ? term.definitionOm : term.definitionAm}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
