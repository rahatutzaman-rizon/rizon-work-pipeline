export interface SyllabusSection {
  title: string;
  marks: string;
  topics: string[];
  description: string;
}

export const BPSC_SYLLABUS_MAP: Record<string, SyllabusSection[]> = {
  // Bangla (bcs-bangla / bangla-language-literature)
  'bangla-language-literature': [
    {
      title: '১. বাংলা ভাষা (Grammar & Linguistics)',
      marks: '১৫ নম্বর',
      topics: [
        'প্রয়োগ-অপপ্রয়োগ ও বানান শুদ্ধি',
        'পরিভাষা ও ব্যাকরণিক শব্দশ্রেণি',
        'সমার্থক ও বিপরীতার্থক শব্দ',
        'ধ্বনি, বর্ণ, শব্দ, পদ, বাক্য, প্রত্যয়, সন্ধি ও সমাস',
      ],
      description: 'বিসিএস প্রিলিমিনারি পরীক্ষা সূচিপত্র পৃষ্ঠা ২: ব্যাকরণ ও ভাষা প্রয়োগ থেকে ১৫ নম্বরের প্রশ্ন থাকবে।',
    },
    {
      title: '২. বাংলা সাহিত্য (Bangla Literature)',
      marks: '১৫ নম্বর',
      topics: [
        'ক. প্রাচীন ও মধ্যযুগ (চর্যাপদ, শ্রীকৃষ্ণকীর্তন, মঙ্গলকাব্য, বৈষ্ণব পদাবলী, রোমান্টিক প্রণয়োপাখ্যান) — ০৫ নম্বর',
        'খ. আধুনিক যুগ (১৮০০ থেকে বর্তমান সময় পর্যন্ত কবি, ঔপন্যাসিক, প্রাবন্ধিক ও নাটক) — ১০ নম্বর',
      ],
      description: 'চর্যাপদ ও মঙ্গলকাব্য এবং আধুনিক যুগের পঞ্চপান্ডব, রবীন্দ্রনাথ ও নজরুল সাহিত্যের বিশদ আলোচনা।',
    },
  ],

  // English (bcs-english / english-language-literature)
  'english-language-literature': [
    {
      title: 'PART-I : English Language',
      marks: '15 Marks',
      topics: [
        'Parts of Speech (Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction)',
        'Idioms & Phrases (Meanings, Kinds & Identification)',
        'Clauses (Principal Clause, Subordinate Noun/Adjective/Adverbial Clause)',
        'Corrections (Tense, Verb, Preposition, Determiner, Subject-Verb Agreement)',
        'Sentences & Transformations (Simple, Compound, Complex, Active/Passive Voice, Degree)',
        'Words (Synonyms, Antonyms, Spellings, Prefixes & Suffixes)',
      ],
      description: 'Page 3-4 of BPSC Syllabus: English Grammar, Syntax, Corrections and Vocabulary.',
    },
    {
      title: 'PART-II : English Literature',
      marks: '15 Marks',
      topics: [
        'Names of writers of literary pieces from Elizabethan period to the 21st Century',
        'Quotations from drama/poetry of different ages (Shakespeare, Milton, Wordsworth, Keats, T.S. Eliot)',
      ],
      description: 'Literary movements, famous titles, characters and author quotes.',
    },
  ],

  // Computer & IT (bcs-computer / computer-it)
  'computer-it': [
    {
      title: '১. কম্পিউটার অংশ (Computer Hardware & Systems)',
      marks: '১০ নম্বর',
      topics: [
        'কম্পিউটার পেরিফেরালস (Keyboard, Mouse, OCR, Scanner)',
        'কম্পিউটার আর্কিটেকচার (CPU, Hard Disk, ALU, RAM, ROM)',
        'কম্পিউটার নম্বর ব্যবস্থা (Binary, Octal, Hexadecimal, ASCII, Unicode)',
        'অপারেটিং সিস্টেমস (Windows, Linux, Android, iOS)',
        'কম্পিউটার ভাইরাস ও ফায়ারওয়াল (Virus, Malware, Firewall, Antivirus)',
        'ডাটাবেজ সিস্টেম (Relational DB, SQL, Primary Key, Foreign Key)',
      ],
      description: 'বিসিএস সূচিপত্র পৃষ্ঠা ৯: কম্পিউটার হার্ডওয়্যার, নেটওয়ার্ক, লজিক গেট ও অপারেটিং সিস্টেম।',
    },
    {
      title: '২. তথ্যপ্রযুক্তি অংশ (Information Technology & Cloud)',
      marks: '০৫ নম্বর',
      topics: [
        'ই-কমার্স (B2B, B2C, Payment Gateways)',
        'সেলুলার ডাটা নেটওয়ার্ক (2G, 3G, 4G, 5G, Wimax)',
        'কম্পিউটার নেটওয়ার্ক (LAN, MAN, WAN, WiFi, IP Address)',
        'ইন্টারনেট ও ডব্লিউডব্লিউডব্লিউ (WWW, HTTP, Domain Name, DNS, Protocol)',
        'ক্লাউড কম্পিউটিং ও সোশ্যাল নেটওয়ার্কিং (Cloud, Facebook, LinkedIn, Cyber Crime)',
      ],
      description: 'নেটওয়ার্ক প্রোটোকল, সেলুলার ব্রডব্যান্ড, ক্লাউড সার্ভিসেস ও সাইবার নিরাপত্তা।',
    },
  ],

  // Mathematical Reasoning (bcs-math / mathematical-reasoning)
  'mathematical-reasoning': [
    {
      title: '১. পাটিগণিত ও বীজগণিত (Arithmetics & Algebra)',
      marks: '০৮ নম্বর',
      topics: [
        'বাস্তব সংখ্যা, ল.সা.গু, গ.সা.গু, শতকরা, সরল ও যৌগিক মুনাফা, অনুপাত ও সমানুপাত, লাভ ও ক্ষতি',
        'বীজগণিতীয় সূত্রাবলী, বহুপদী উৎপাদক, সরল ও দ্বিপদী সমীকরণ, অসমতা ও সহসমীকরণ',
      ],
      description: 'বিসিএস সূচিপত্র পৃষ্ঠা ১০: পাটিগণিত ও বীজগণিত সূত্রের প্রয়োগ।',
    },
    {
      title: '২. জ্যামিতি, সেট ও বিন্যাস (Geometry & Probability)',
      marks: '০৭ নম্বর',
      topics: [
        'সূচক ও লগারিদম, সমান্তর ও গুণোত্তর অনুক্রম ও ধারা',
        'রেখা, কোণ, ত্রিভুজ ও চতুর্ভুজ সংক্রান্ত উপপাদ্য, পিথাগোরাসের উপপাদ্য, বৃত্ত ও পরিমিতি',
        'সেট, বিন্যাস ও সমাবেশ, পরিসংখ্যান ও সম্ভাব্যতা',
      ],
      description: 'জ্যামিতিক পরিমিতি, সেট তত্ত্ব ও সম্ভাব্যতা শর্টকাট।',
    },
  ],
};
