import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, language = 'english' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const text = message.trim();
    const lower = text.toLowerCase();

    let aiResponse = '';
    let grammarTip = '';
    let correctedText = '';
    let translationBn = '';

    if (language === 'english') {
      // 1. Check Common English Grammar Rules
      if (lower.includes('i goes') || lower.includes('he go') || lower.includes('she go')) {
        correctedText = text.replace(/i goes/gi, 'I go').replace(/he go/gi, 'He goes').replace(/she go/gi, 'She goes');
        grammarTip = 'Subject-Verb Agreement: 3rd person singular subjects (He, She, It) take verbs ending in -s or -es.';
      } else if (lower.includes('discuss about')) {
        correctedText = text.replace(/discuss about/gi, 'discuss');
        grammarTip = 'Redundancy: "Discuss" already means "talk about", so do not include "about".';
      } else if (lower.includes('more better') || lower.includes('more faster')) {
        correctedText = text.replace(/more better/gi, 'better').replace(/more faster/gi, 'faster');
        grammarTip = 'Double Comparative: Do not combine "more" with adjectives ending in "-er".';
      }

      // 2. Intelligent Contextual Intent Understanding
      if (lower.includes('bcs') || lower.includes('syllabus') || lower.includes('exam')) {
        aiResponse = `Regarding the BCS examination, consistent study and practice of Preliminary subjects (Bangla, English, BD Affairs, IT, Math) is key to scoring above 110. How is your preparation going for ${text.includes('bangla') ? 'Bangla Literature' : 'English & General Science'}?`;
        translationBn = 'বিসিএস পরীক্ষার ক্ষেত্রে, প্রিলিমিনারি বিষয়গুলো (বাংলা, ইংরেজি, বাংলাদেশ বিষয়াবলি, আইটি, গণিত) নিয়মিত অনুশীলন করা ১০০+ পাওয়ার মূল চাবিকাঠি। আপনার প্রস্তুতি কেমন চলছে?';
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        aiResponse = 'Hello! I am your AI Spoken English & Writing Tutor. I can help you correct your sentences, understand complex grammar rules, and build fluent speech. What would you like to discuss?';
        translationBn = 'হ্যালো! আমি আপনার এআই ইংরেজি স্পোকেন ও রাইটিং টিউটর। আমি আপনাকে বাক্য সংশোধন, ব্যাকরণ বুঝতে এবং সাবলীল কথা বলতে সাহায্য করতে পারি।';
      } else if (lower.includes('how are you')) {
        aiResponse = 'I am doing great and ready to assist you! How are your studies going today?';
        translationBn = 'আমি খুব ভালো আছি এবং আপনাকে সাহায্য করতে প্রস্তুত! আজ আপনার পড়াশোনা কেমন চলছে?';
      } else if (lower.includes('grammar') || lower.includes('rule') || lower.includes('tense')) {
        aiResponse = 'Mastering tenses and sentence structures is essential for BCS English (30 Marks) and Bank IT written exams. Would you like a quick quiz or rule explanation?';
        translationBn = 'বিসিএস ইংরেজি (৩০ নম্বর) ও ব্যাংক আইটি লিখিত পরীক্ষার জন্য Tense ও বাক্য গঠন আয়ত্ত করা অত্যন্ত জরুরি। আপনি কি কোনো দ্রুত কুইজ বা নিয়ম দেখতে চান?';
      } else if (lower.includes('bank') || lower.includes('it') || lower.includes('software') || lower.includes('n8n')) {
        aiResponse = 'For Bank IT and Software Engineering, focus heavily on System Analysis, Relational Databases (SQL), Data Structures, and Automated Workflows like n8n.';
        translationBn = 'ব্যাংক আইটি ও সফটওয়্যার ইঞ্জিনিয়ারিংয়ের জন্য সিস্টেম অ্যানালাইসিস, ডাটাবেজ (SQL), ডাটা স্ট্রাকচার এবং n8n অটোমেশনের ওপর গুরুত্ব দিন।';
      } else {
        aiResponse = `That is an insightful point! Regarding "${text}", could you explain more or ask a specific question? I am here to help you refine your expression.`;
        translationBn = 'এটি একটি চমৎকার পয়েন্ট! আপনি কি এ বিষয়ে আরও বিস্তারিত বলতে চান? আপনার যেকোনো প্রশ্নের উত্তর দিতে আমি প্রস্তুত।';
      }
    } else {
      // Spanish AI Response Logic
      if (lower.includes('yo gusto')) {
        correctedText = text.replace(/yo gusto/gi, 'Me gusta');
        grammarTip = 'Spanish Verb Rule: Use "Me gusta" (It is pleasing to me) instead of "Yo gusto".';
      }

      if (lower.includes('hola') || lower.includes('buenos')) {
        aiResponse = '¡Hola! Es un gusto hablar contigo. ¿De qué tema te gustaría conversar hoy para practicar tu español?';
        translationBn = 'হ্যালো! আপনার সাথে কথা বলে খুব ভালো লাগলো। আজ আপনার স্প্যানিশ অনুশীলনের জন্য কোন বিষয়ে কথা বলতে চান?';
      } else {
        aiResponse = `¡Muy bien! Practicar español diariamente es la mejor forma de ganar fluidez. ¿Tienes alguna duda sobre tu frase "${text}"?`;
        translationBn = 'খুব ভালো! প্রতিদিন স্প্যানিশ অনুশীলন করাই সাবলীলতা অর্জনের সেরা উপায়।';
      }
    }

    return NextResponse.json({
      text: aiResponse,
      grammarTip: grammarTip || null,
      correctedText: correctedText || null,
      translation_bn: translationBn,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
