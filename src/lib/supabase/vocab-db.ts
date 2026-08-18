import { createClient, isSupabaseConfigured } from './client';

export interface FlashcardItem {
  id: string;
  lang: 'English' | 'Spanish';
  word: string;
  phonetic: string;
  bangla_meaning: string;
  english_meaning: string;
  example_sentence: string;
  category: 'Daily Speaking' | 'Job Interview' | 'Grammar & Vocab' | 'IT & Office';
  created_at: string;
}

export const INITIAL_VOCAB: FlashcardItem[] = [
  {
    id: 'card-1',
    lang: 'Spanish',
    word: '¡Hola! ¿Cómo estás?',
    phonetic: 'OH-lah, KOH-moh ehs-TAHS',
    bangla_meaning: 'হ্যালো! আপনি কেমন আছেন?',
    english_meaning: 'Hello! How are you?',
    example_sentence: '¡Hola! ¿Cómo estás? Me llamo Rizon y estudio para el examen.',
    category: 'Daily Speaking',
    created_at: new Date().toISOString(),
  },
  {
    id: 'card-2',
    lang: 'Spanish',
    word: 'Muchas gracias por su ayuda',
    phonetic: 'MOO-chahs GRAH-syahs por soo ah-YOO-dah',
    bangla_meaning: 'আপনার সাহায্যের জন্য আপনাকে অনেক ধন্যবাদ',
    english_meaning: 'Thank you very much for your help',
    example_sentence: 'Muchas gracias por su ayuda con el proyecto de software.',
    category: 'Job Interview',
    created_at: new Date().toISOString(),
  },
  {
    id: 'card-3',
    lang: 'English',
    word: 'Articulate & Persuasive',
    phonetic: 'ahr-TIK-yuh-lit & per-SWAY-siv',
    bangla_meaning: 'স্পষ্ট ও প্রশংসনীয় বক্তব্য প্রদানকারী',
    english_meaning: 'Expressing oneself clearly and effectively',
    example_sentence: 'She gave an articulate and persuasive presentation during the BCS viva exam.',
    category: 'Grammar & Vocab',
    created_at: new Date().toISOString(),
  },
  {
    id: 'card-4',
    lang: 'Spanish',
    word: 'Trabajo como ingeniero de software',
    phonetic: 'trah-BAH-hoh KOH-moh een-heh-NYEH-roh deh SOFT-ware',
    bangla_meaning: 'আমি একজন সফটওয়্যার প্রকৌশলী হিসেবে কাজ করি',
    english_meaning: 'I work as a software engineer',
    example_sentence: 'Trabajo como ingeniero de software en automatización.',
    category: 'IT & Office',
    created_at: new Date().toISOString(),
  },
  {
    id: 'card-5',
    lang: 'English',
    word: 'Conscientious & Diligent',
    phonetic: 'kon-shee-EN-shuhs & DIL-uh-juhnt',
    bangla_meaning: 'কর্তব্যপরায়ণ ও পরিশ্রমী',
    english_meaning: 'Wishing to do one’s work or duty well and thoroughly',
    example_sentence: 'Diligent candidate preparation leads to success in bank officer recruitment.',
    category: 'Job Interview',
    created_at: new Date().toISOString(),
  },
];

const LOCAL_VOCAB_KEY = 'rizon_vocab_cards_v1';

export function getLocalVocab(): FlashcardItem[] {
  if (typeof window === 'undefined') return INITIAL_VOCAB;
  const stored = localStorage.getItem(LOCAL_VOCAB_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_VOCAB_KEY, JSON.stringify(INITIAL_VOCAB));
    return INITIAL_VOCAB;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_VOCAB;
  }
}

export function saveLocalVocab(cards: FlashcardItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_VOCAB_KEY, JSON.stringify(cards));
  }
}

export async function fetchVocab(): Promise<FlashcardItem[]> {
  return getLocalVocab();
}

export async function createVocab(input: {
  lang: 'English' | 'Spanish';
  word: string;
  phonetic: string;
  bangla_meaning: string;
  english_meaning: string;
  example_sentence: string;
  category: 'Daily Speaking' | 'Job Interview' | 'Grammar & Vocab' | 'IT & Office';
}): Promise<FlashcardItem> {
  const newCard: FlashcardItem = {
    id: crypto.randomUUID(),
    lang: input.lang,
    word: input.word.trim(),
    phonetic: input.phonetic.trim(),
    bangla_meaning: input.bangla_meaning.trim(),
    english_meaning: input.english_meaning.trim(),
    example_sentence: input.example_sentence.trim(),
    category: input.category,
    created_at: new Date().toISOString(),
  };

  const current = getLocalVocab();
  const updated = [newCard, ...current];
  saveLocalVocab(updated);
  return newCard;
}

export async function updateVocab(
  id: string,
  input: Partial<Omit<FlashcardItem, 'id' | 'created_at'>>
): Promise<FlashcardItem> {
  const current = getLocalVocab();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Vocabulary item not found');

  const updated: FlashcardItem = {
    ...current[index],
    ...input,
  };

  current[index] = updated;
  saveLocalVocab(current);
  return updated;
}

export async function deleteVocab(id: string): Promise<boolean> {
  const current = getLocalVocab();
  const remaining = current.filter((c) => c.id !== id);
  saveLocalVocab(remaining);
  return true;
}
