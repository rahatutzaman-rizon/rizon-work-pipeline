/**
 * Bangla Phonetic Transliteration Engine (Avro-style)
 * Converts phonetic English input (e.g. "ami tumi bhalo bcs poralekha") into fluent Bangla script ("আমি তুমি ভালো বিসিএস পড়াশোনা")
 */

const DICTIONARY: Record<string, string> = {
  ami: 'আমি',
  tumi: 'তুমি',
  apni: 'আপনি',
  se: 'সে',
  amra: 'আমরা',
  tomra: 'তোমরা',
  tara: 'তারা',
  amar: 'আমার',
  tomar: 'তোমার',
  amader: 'আমাদের',
  tomader: 'তোমাদের',
  bhalo: 'ভালো',
  kharaf: 'খারাপ',
  aj: 'আজ',
  kalk: 'কাল',
  bcs: 'বিসিএস',
  bangla: 'বাংলা',
  english: 'ইংরেজি',
  poralekha: 'পড়াশোনা',
  kaj: 'কাজ',
  somoy: 'সময়',
  software: 'সফটওয়্যার',
  system: 'সিস্টেম',
  design: 'ডিজাইন',
  note: 'নোট',
  document: 'ডকুমেন্ট',
  agent: 'এজেন্ট',
  research: 'গবেষণা',
  shadhinota: 'স্বাধীনতা',
  muktijuddho: 'মুক্তিযুদ্ধ',
  shongbidhan: 'সংবিধান',
  charyapad: 'চর্যাপদ',
  charyapada: 'চর্যাপদ',
  shahitto: 'সাহিত্য',
  bhasha: 'ভাষা',
  porikkha: 'পরীক্ষা',
  bank: 'ব্যাংক',
  gonit: 'গণিত',
  bijnan: 'বিজ্ঞান',
  shongskriti: 'সংস্কৃতি',
  shesh: 'শেষ',
  sonar: 'সোনার',
  desh: 'দেশ',
  jonno: 'জন্য',
  valobashi: 'ভালোবাসি',
  bhalobashi: 'ভালোবাসি',
  r: 'আর',
  o: 'ও',
};

const VOWELS: Record<string, string> = {
  o: 'অ',
  a: 'আ',
  i: 'ই',
  ee: 'ঈ',
  u: 'উ',
  oo: 'ঊ',
  rri: 'ঋ',
  e: 'এ',
  oi: 'ঐ',
  ou: 'ঔ',
};

const CONSONANTS: Record<string, string> = {
  k: 'ক',
  kh: 'খ',
  g: 'গ',
  gh: 'ঘ',
  ng: 'ঙ',
  ch: 'চ',
  chh: 'ছ',
  j: 'জ',
  jh: 'ঝ',
  t: 'ত',
  th: 'থ',
  d: 'দ',
  dh: 'ধ',
  n: 'ন',
  p: 'প',
  ph: 'ফ',
  f: 'ফ',
  b: 'ব',
  bh: 'ভ',
  v: 'ভ',
  m: 'ম',
  r: 'র',
  l: 'ল',
  sh: 'শ',
  s: 'স',
  h: 'হ',
  rr: 'ড়',
  rh: 'ঢ়',
  y: 'য়',
};

/**
 * Transliterate input string to Bangla phonetically
 */
export function convertPhoneticToBangla(text: string): string {
  if (!text) return '';

  const words = text.split(/(\s+|[.,!?;:()])/);

  return words
    .map((word) => {
      if (!word.trim() || /[.,!?;:()]/.test(word)) return word;

      const lower = word.toLowerCase();

      // 1. Direct dictionary match
      if (DICTIONARY[lower]) {
        return DICTIONARY[lower];
      }

      // 2. Rule-based phonetic parser
      let result = '';
      let i = 0;

      while (i < word.length) {
        const sub2 = lower.substring(i, i + 2);
        const sub1 = lower.substring(i, i + 1);

        if (CONSONANTS[sub2]) {
          result += CONSONANTS[sub2];
          i += 2;
        } else if (CONSONANTS[sub1]) {
          result += CONSONANTS[sub1];
          i += 1;
        } else if (VOWELS[sub2]) {
          result += VOWELS[sub2];
          i += 2;
        } else if (VOWELS[sub1]) {
          result += VOWELS[sub1];
          i += 1;
        } else {
          result += word[i];
          i += 1;
        }
      }

      return result;
    })
    .join('');
}
