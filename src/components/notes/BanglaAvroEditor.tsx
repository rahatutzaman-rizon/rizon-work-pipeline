'use client';

import React, { useState, useRef } from 'react';
import {
  Languages,
  Sparkles,
  Check,
  Copy,
  RotateCcw,
  Bold,
  Italic,
  List,
  Heading2,
  Code,
  Quote,
  Keyboard,
} from 'lucide-react';
import { convertPhoneticToBangla } from '@/lib/bangla-converter';

interface BanglaAvroEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

const SWARA_BORNO = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ'];
const BYANJON_BORNO = [
  'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
  'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন',
  'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ',
  'স', 'হ', 'ড়', 'ঢ়', 'য়', 'ৎ', 'ং', 'ঃ', 'ঁ', '৳'
];
const KAR_SIGNS = ['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ', '্'];

export const BanglaAvroEditor: React.FC<BanglaAvroEditorProps> = ({
  value,
  onChange,
  placeholder = "Type in Banglish (e.g. 'ami bcs bangla sahityo porchi')...",
  rows = 7,
}) => {
  const [liveMode, setLiveMode] = useState<boolean>(false);
  const [activeKeyTab, setActiveKeyTab] = useState<'swara' | 'byanjon' | 'kar'>('swara');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Safe client-side Avro parsing with fallback
  const parseBanglaText = (text: string): string => {
    if (typeof window !== 'undefined') {
      try {
        // Attempt dynamic avro-phonetic if window.jQuery exists or fallback engine
        const avro = require('avro-phonetic');
        if (avro && typeof avro.parse === 'function') {
          return avro.parse(text);
        }
      } catch (err) {
        // Fallback to internal Avro Phonetic Engine
      }
    }
    return convertPhoneticToBangla(text);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawVal = e.target.value;
    if (liveMode) {
      const converted = parseBanglaText(rawVal);
      onChange(converted);
    } else {
      onChange(rawVal);
    }
  };

  const handleInsertTag = (startTag: string, endTag: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = `${startTag}${selectedText || 'text'}${endTag}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
  };

  const handleInsertChar = (char: string) => {
    onChange(value + char);
  };

  const handleConvertEntireText = () => {
    if (!value) return;
    const converted = parseBanglaText(value);
    onChange(converted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm('Clear editor content?')) {
      onChange('');
    }
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="rounded-3xl bg-white border border-emerald-200 shadow-xl overflow-hidden space-y-0 transition-all">
      {/* EDITOR HEADER TOOLBAR */}
      <div className="p-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <Languages className="w-5 h-5 text-lime-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">
                Avro Phonetic Live Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-lime-400 text-emerald-950 uppercase">
                Phonetic Parser
              </span>
            </div>
            <p className="text-[11px] text-emerald-200">
              Type 'ami tumi porikkha bcs' ➔ Live converts to 'আমি তুমি পরীক্ষা বিসিএস'
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border shadow-sm ${
              liveMode
                ? 'bg-lime-400 text-emerald-950 border-lime-300 hover:bg-lime-300'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${liveMode ? 'text-emerald-900 animate-pulse' : 'text-slate-300'}`} />
            <span>Banglish Live: {liveMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleConvertEntireText}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition-all"
            title="Convert entire text to Bangla via Avro"
          >
            Convert All
          </button>
        </div>
      </div>

      {/* FORMATTING TOOLBAR */}
      <div className="px-4 py-2 bg-slate-50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-slate-700">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleInsertTag('**', '**')}
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertTag('*', '*')}
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertTag('## ')}
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
            title="Heading"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertTag('- ')}
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertTag('> ')}
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertTag('```\n', '\n```')}
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition-colors"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
              showKeyboard
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Bangla Keys</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 font-semibold">
            {wordCount} words | {charCount} chars
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            title="Clear Text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CANVAS */}
      <div className="p-4 bg-slate-50/50">
        <textarea
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none shadow-inner"
        />
      </div>

      {/* KEYBOARD DRAWER */}
      {showKeyboard && (
        <div className="p-4 bg-emerald-50/60 border-t border-emerald-100 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase text-emerald-950 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bangla Soft Keyboard</span>
            </span>

            <div className="flex gap-1 p-0.5 bg-white rounded-xl border border-emerald-200">
              <button
                type="button"
                onClick={() => setActiveKeyTab('swara')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                  activeKeyTab === 'swara'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                স্বরবর্ণ
              </button>
              <button
                type="button"
                onClick={() => setActiveKeyTab('byanjon')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                  activeKeyTab === 'byanjon'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                ব্যঞ্জনবর্ণ
              </button>
              <button
                type="button"
                onClick={() => setActiveKeyTab('kar')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                  activeKeyTab === 'kar'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                কার / ফলা
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {activeKeyTab === 'swara' &&
              SWARA_BORNO.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleInsertChar(char)}
                  className="px-2 py-1 bg-white hover:bg-emerald-200 text-emerald-950 border border-emerald-200 rounded-lg text-xs font-black font-mono transition-all hover:scale-105"
                >
                  {char}
                </button>
              ))}

            {activeKeyTab === 'byanjon' &&
              BYANJON_BORNO.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleInsertChar(char)}
                  className="px-2 py-1 bg-white hover:bg-emerald-200 text-emerald-950 border border-emerald-200 rounded-lg text-xs font-black font-mono transition-all hover:scale-105"
                >
                  {char}
                </button>
              ))}

            {activeKeyTab === 'kar' &&
              KAR_SIGNS.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleInsertChar(char)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-200 text-emerald-950 border border-emerald-200 rounded-lg text-xs font-black font-mono transition-all hover:scale-105"
                >
                  {char}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
