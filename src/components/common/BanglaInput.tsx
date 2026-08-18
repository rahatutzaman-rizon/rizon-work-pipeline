'use client';

import React, { useState } from 'react';
import { Languages, Bold, Italic, List, Sparkles } from 'lucide-react';
import { convertPhoneticToBangla } from '@/lib/bangla-converter';

interface BanglaInputProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  isTextarea?: boolean;
  rows?: number;
  label?: string;
  required?: boolean;
}

export const BanglaInput: React.FC<BanglaInputProps> = ({
  value,
  onChange,
  placeholder = 'Type here...',
  isTextarea = false,
  rows = 3,
  label,
  required = false,
}) => {
  const [isBanglaMode, setIsBanglaMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawText = e.target.value;
    if (isBanglaMode) {
      const converted = convertPhoneticToBangla(rawText);
      onChange(converted);
    } else {
      onChange(rawText);
    }
  };

  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    onChange(`${prefix}${value}${suffix}`);
  };

  return (
    <div className="space-y-1.5">
      {/* Label & Controls Toolbar */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Formatting Controls for Textareas */}
          {isTextarea && (
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => applyFormatting('**')}
                title="Bold"
                className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors text-xs font-bold"
              >
                <Bold className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('*')}
                title="Italic"
                className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors text-xs italic"
              >
                <Italic className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('\n- ')}
                title="Bullet List"
                className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors text-xs"
              >
                <List className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Bangla Phonetic Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsBanglaMode(!isBanglaMode)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all border ${
              isBanglaMode
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isBanglaMode ? 'বাংলা Active' : 'বাংলা Typing'}</span>
          </button>
        </div>
      </div>

      {/* Input / Textarea Field */}
      {isTextarea ? (
        <textarea
          value={value}
          onChange={handleInputChange}
          rows={rows}
          placeholder={
            isBanglaMode
              ? 'বাংলায় লিখতে টাইপ করুন (যেমন: ami = আমি, tumi = তুমি)...'
              : placeholder
          }
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none shadow-xs font-sans"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={
            isBanglaMode
              ? 'বাংলায় লিখতে টাইপ করুন (যেমন: ami = আমি, bcs = বিসিএস)...'
              : placeholder
          }
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs font-sans"
        />
      )}
    </div>
  );
};
