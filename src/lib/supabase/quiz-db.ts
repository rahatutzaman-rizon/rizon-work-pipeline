export interface MCQQuestion {
  id: string;
  category_id: string;
  topic_title: string;
  question: string;
  bangla_question?: string;
  options: [string, string, string, string];
  correct_option_index: number;
  explanation: string;
  exam_source: string; // e.g. "46th BCS Prelim", "Combined 9 Bank 2025"
}

export interface WrittenQuestion {
  id: string;
  category_id: string;
  topic_title: string;
  question: string;
  bangla_question?: string;
  marks: number;
  model_answer: string;
  key_points: string[];
  exam_source: string;
}

export const INITIAL_MCQS: MCQQuestion[] = [
  {
    id: 'mcq-1',
    category_id: '11111111-1111-1111-1111-111111111111', // Bangla
    topic_title: 'চর্যাপদ ও মধ্যযুগ',
    question: 'চর্যাপদ হরপ্রসাদ শাস্ত্রী কর্তৃক নেপালের রাজদরবারের গ্রন্থগার থেকে কত সালে আবিষ্কৃত হয়?',
    bangla_question: 'চর্যাপদ কত সালে আবিষ্কৃত হয়?',
    options: ['১৯০৫ সালে', '১৯০৭ সালে', '১৯১৬ সালে', '১৯২১ সালে'],
    correct_option_index: 1, // ১৯০৭ সালে
    explanation: 'মহামহোপাধ্যায় হরপ্রসাদ শাস্ত্রী ১৯০৭ সালে নেপালের রাজদরবারের গ্রন্থগার থেকে চর্যাপদের মূল পুথি আবিষ্কার করেন।',
    exam_source: '43rd BCS Prelim',
  },
  {
    id: 'mcq-2',
    category_id: '11111111-1111-1111-1111-111111111111', // Bangla
    topic_title: 'চর্যাপদ',
    question: 'চর্যাপদে সবচেয়ে বেশি পদ রচনা করেছেন কে?',
    bangla_question: 'চর্যাপদে সর্বাধিক পদ রচয়িতা কে?',
    options: ['লুইপা', 'কাহ্নপা', 'ভুসুকুপা', 'শবরপা'],
    correct_option_index: 1, // কাহ্নপা
    explanation: 'কাহ্নপা চর্যাপদে সর্বাধিক ১৩টি পদ রচনা করেন। দ্বিতীয় সর্বোচ্চ ৮টি পদ রচনা করেন ভুসুকুপা।',
    exam_source: '45th BCS Prelim',
  },
  {
    id: 'mcq-3',
    category_id: '55555555-5555-5555-5555-555555555555', // Math
    topic_title: 'বীজগণিত ও পাটিগণিত',
    question: 'A pipe fills a tank in 10 hours and a leak empties it in 15 hours. How long will it take to fill the tank?',
    bangla_question: 'একটি পাইপ ১০ ঘণ্টায় চৌবাচ্চা পূর্ণ করে এবং ফুটো দিয়ে ১৫ ঘণ্টায় খালি হয়। চৌবাচ্চাটি পূর্ণ হতে কত সময় লাগবে?',
    options: ['20 hours', '25 hours', '30 hours', '35 hours'],
    correct_option_index: 2, // 30 hours
    explanation: 'Formula: (10 × 15) / (15 - 10) = 150 / 5 = 30 hours.',
    exam_source: 'Bank Senior Officer 2024',
  },
  {
    id: 'mcq-4',
    category_id: '88888888-8888-8888-8888-888888888888', // IT
    topic_title: 'System Design & DevOps',
    question: 'Which HTTP method is idempotent and primarily used to request data from a specified server resource?',
    bangla_question: 'সার্ভার থেকে ডাটা রিড করার জন্য কোন আইডেমপোটেন্ট এইচটিটিপি মেথড ব্যবহৃত হয়?',
    options: ['POST', 'GET', 'PUT', 'DELETE'],
    correct_option_index: 1, // GET
    explanation: 'GET methods are idempotent as multiple identical requests produce the same server state.',
    exam_source: 'BCC IT Analyst Exam 2025',
  },
];

export const INITIAL_WRITTEN: WrittenQuestion[] = [
  {
    id: 'written-1',
    category_id: '33333333-3333-3333-3333-333333333333', // BD Affairs
    topic_title: 'বাংলাদেশ সংবিধান',
    question: 'বাংলাদেশ সংবিধানের মূল চার নীতি ব্যাখ্যা করুন এবং অনুচ্ছেদ ৭ এর গুরুত্ব বর্ণনা করুন।',
    bangla_question: 'সংবিধানের মূল চার নীতি ও অনুচ্ছেদ ৭',
    marks: 15,
    model_answer: `### বাংলাদেশ সংবিধানের মূল চার নীতি (অনুচ্ছেদ ৮):
১. জাতীয়তাবাদ
২. সমাজতন্ত্র ও সামাজিক ন্যায়বিচার
৩. গণতন্ত্র ও মানবাধিকার
৪. ধর্মনিরপেক্ষতা ও ধর্মীয় স্বাধীনতা

### অনুচ্ছেদ ৭ এর গুরুত্ব:
- অনুচ্ছেদ ৭(১) অনুযায়ী প্রজাতন্ত্রের সকল ক্ষমতার মালিক জনগণ।
- ৭(২) অনুযায়ী সংবিধানই রাজ্যের সর্বোচ্চ আইন। সংবিধানের সাথে অসমঞ্জস যেকোনো আইন বাতিল বলে গণ্য হবে।`,
    key_points: ['চার নীতি বর্ণনা', 'জনগণের সার্বভৌমত্ব (৭.১)', 'সংবিধানের প্রাধান্য (৭.২)'],
    exam_source: '44th BCS Written Exam',
  },
  {
    id: 'written-2',
    category_id: '77777777-7777-7777-7777-777777777777', // Bank Job
    topic_title: 'Bank Focus Writing',
    question: 'Write a Focus Essay on "Role of Digital Banking & Smart Financial Inclusion in Bangladesh Economy".',
    bangla_question: 'ডিজিটাল ব্যাংকিং ও স্মার্ট আর্থিক অন্তর্ভুক্তি নিয়ে ফোকাস রাইটিং',
    marks: 20,
    model_answer: `Digital Banking has transformed the financial landscape of Bangladesh through Mobile Financial Services (MFS) like bKash and Nagad.

Key Points to Cover:
1. Expansion of Agent Banking & QR Code payments in rural regions.
2. Reduction of cash handling costs and transaction friction.
3. Central Bank Bangladesh Bank initiatives for digital credit scoring.`,
    key_points: ['MFS & Agent Banking', 'GDP Growth Contribution', 'Cyber Security Concerns'],
    exam_source: 'Combined 9 Bank Written 2024',
  },
];

export async function fetchMCQsByTopic(categoryId?: string): Promise<MCQQuestion[]> {
  if (!categoryId || categoryId === 'all') return INITIAL_MCQS;
  return INITIAL_MCQS.filter((q) => q.category_id === categoryId);
}

export async function fetchWrittenByTopic(categoryId?: string): Promise<WrittenQuestion[]> {
  if (!categoryId || categoryId === 'all') return INITIAL_WRITTEN;
  return INITIAL_WRITTEN.filter((q) => q.category_id === categoryId);
}
