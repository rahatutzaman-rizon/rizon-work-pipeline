'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  Eye,
  Edit3,
  Clock,
} from 'lucide-react';
import { MCQQuestion, WrittenQuestion, fetchMCQsByTopic, fetchWrittenByTopic } from '@/lib/supabase/quiz-db';

interface ExamQuizEngineProps {
  categoryId?: string;
  categoryName?: string;
}

export const ExamQuizEngine: React.FC<ExamQuizEngineProps> = ({
  categoryId,
  categoryName = 'Interactive Exam',
}) => {
  const [examMode, setExamMode] = useState<'MCQ' | 'Written'>('MCQ');

  // MCQ State
  const [mcqs, setMcqs] = useState<MCQQuestion[]>([]);
  const [mcqIndex, setMcqIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});

  // Written State
  const [writtenList, setWrittenList] = useState<WrittenQuestion[]>([]);
  const [writtenIndex, setWrittenIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadQuestions();
  }, [categoryId]);

  const loadQuestions = async () => {
    const [fetchedMcqs, fetchedWritten] = await Promise.all([
      fetchMCQsByTopic(categoryId),
      fetchWrittenByTopic(categoryId),
    ]);
    setMcqs(fetchedMcqs);
    setWrittenList(fetchedWritten);
    setMcqIndex(0);
    setWrittenIndex(0);
    setSelectedOptions({});
    setShowExplanations({});
    setUserAnswers({});
    setRevealedAnswers({});
  };

  const currentMcq = mcqs[mcqIndex];
  const currentWritten = writtenList[writtenIndex];

  // Calculate MCQ score
  const answeredCount = Object.keys(selectedOptions).length;
  let correctCount = 0;
  Object.entries(selectedOptions).forEach(([qIdx, optIdx]) => {
    if (mcqs[Number(qIdx)] && mcqs[Number(qIdx)].correct_option_index === optIdx) {
      correctCount++;
    }
  });

  const handleSelectMcqOption = (optIdx: number) => {
    if (selectedOptions[mcqIndex] !== undefined) return; // Already answered
    setSelectedOptions({ ...selectedOptions, [mcqIndex]: optIdx });
    setShowExplanations({ ...showExplanations, [mcqIndex]: true });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-6 animate-fade-in">
      {/* Top Banner & Mode Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Exam Test Engine</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {categoryName} Exam Test Center
          </h3>
          <p className="text-xs text-slate-500">
            Practice topic-specific MCQ prelims & Written model questions with instant explanations.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setExamMode('MCQ')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              examMode === 'MCQ'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>MCQ Test Mode ({mcqs.length})</span>
          </button>
          <button
            onClick={() => setExamMode('Written')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              examMode === 'Written'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Written Exam Mode ({writtenList.length})</span>
          </button>
        </div>
      </div>

      {/* MCQ TEST ENGINE */}
      {examMode === 'MCQ' && (
        currentMcq ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Score & Progress Header */}
            <div className="flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 text-xs">
              <span className="font-extrabold text-emerald-900">
                Question {mcqIndex + 1} of {mcqs.length}
              </span>
              <span className="font-extrabold text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-2xs border border-emerald-200">
                Score: {correctCount} / {answeredCount} Correct
              </span>
              <span className="text-[10px] uppercase font-mono font-bold text-white bg-emerald-700 px-2 py-0.5 rounded">
                {currentMcq.exam_source}
              </span>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {currentMcq.bangla_question || currentMcq.question}
              </h3>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentMcq.options.map((opt, idx) => {
                  const isSelected = selectedOptions[mcqIndex] === idx;
                  const isCorrect = currentMcq.correct_option_index === idx;
                  const hasAnswered = selectedOptions[mcqIndex] !== undefined;

                  let optionStyle = 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400';
                  if (hasAnswered) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-red-500 text-white border-red-500 font-bold shadow-md';
                    } else {
                      optionStyle = 'bg-white text-slate-400 border-slate-100 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectMcqOption(idx)}
                      disabled={hasAnswered}
                      className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 border border-slate-200">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                      {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Popover */}
              {showExplanations[mcqIndex] && (
                <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-xs leading-relaxed space-y-1 animate-fade-in">
                  <span className="font-extrabold uppercase text-[10px] text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Answer Explanation & Hint</span>
                  </span>
                  <p className="font-sans font-medium">{currentMcq.explanation}</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setMcqIndex((prev) => Math.max(prev - 1, 0))}
                disabled={mcqIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40"
              >
                Previous Question
              </button>

              <button
                onClick={() => setMcqIndex((prev) => Math.min(prev + 1, mcqs.length - 1))}
                disabled={mcqIndex === mcqs.length - 1}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No MCQ practice questions loaded for this category</p>
          </div>
        )
      )}

      {/* WRITTEN EXAM ENGINE */}
      {examMode === 'Written' && (
        currentWritten ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 text-xs">
              <span className="font-extrabold text-emerald-900">
                Written Question {writtenIndex + 1} of {writtenList.length}
              </span>
              <span className="font-extrabold text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-2xs border border-emerald-200">
                Full Marks: {currentWritten.marks}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold text-white bg-emerald-700 px-2 py-0.5 rounded">
                {currentWritten.exam_source}
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {currentWritten.bangla_question || currentWritten.question}
              </h3>

              {/* Candidate Answer Text Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Write your Answer Draft below:</label>
                <textarea
                  rows={6}
                  placeholder="Draft your written response here..."
                  value={userAnswers[writtenIndex] || ''}
                  onChange={(e) => setUserAnswers({ ...userAnswers, [writtenIndex]: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-sans leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Reveal Model Answer Button */}
              <button
                onClick={() => setRevealedAnswers({ ...revealedAnswers, [writtenIndex]: !revealedAnswers[writtenIndex] })}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>{revealedAnswers[writtenIndex] ? 'Hide Model Answer' : 'Reveal Model Solution & Key Points'}</span>
              </button>

              {/* Model Answer View */}
              {revealedAnswers[writtenIndex] && (
                <div className="p-5 rounded-2xl bg-white border border-emerald-200 space-y-3 text-xs leading-relaxed animate-fade-in shadow-xs">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                    <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>Official BCS / Bank Model Solution</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Model Score: {currentWritten.marks}/{currentWritten.marks}
                    </span>
                  </div>

                  <div className="prose text-slate-800 text-xs whitespace-pre-wrap font-sans">
                    {currentWritten.model_answer}
                  </div>

                  {currentWritten.key_points && currentWritten.key_points.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Key Scoring Criteria to Cover:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentWritten.key_points.map((pt, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900 font-semibold">
                            ✓ {pt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setWrittenIndex((prev) => Math.max(prev - 1, 0))}
                disabled={writtenIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40"
              >
                Previous Written
              </button>

              <button
                onClick={() => setWrittenIndex((prev) => Math.min(prev + 1, writtenList.length - 1))}
                disabled={writtenIndex === writtenList.length - 1}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1"
              >
                <span>Next Written</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <Edit3 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No written questions loaded for this category</p>
          </div>
        )
      )}
    </div>
  );
};
