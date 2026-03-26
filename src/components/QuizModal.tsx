import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Trophy, RotateCcw, ChevronLeft, Brain, Sparkles } from 'lucide-react';
import type { AIContent, QuizQuestion } from '../data/aiContent';

interface Props {
  subject: string;
  title: string;
  content: AIContent;
  onClose: () => void;
}

type AnswerState = number | null; // chosen index, null = not answered

function QuestionCard({
  q,
  index,
  total,
  onAnswer,
}: {
  q: QuizQuestion;
  index: number;
  total: number;
  onAnswer: (idx: number) => void;
}) {
  const [chosen, setChosen] = useState<AnswerState>(null);
  const [revealed, setRevealed] = useState(false);

  function pick(idx: number) {
    if (revealed) return;
    setChosen(idx);
    setRevealed(true);
    setTimeout(() => onAnswer(idx), 820);
  }

  const LETTERS = ['أ', 'ب', 'ج', 'د'];

  return (
    <div className="animate-scale-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-bold text-white/55">
          السؤال {index + 1} / {total}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < index ? 'bg-primary-400 w-6' : i === index ? 'bg-primary-600 w-8' : 'bg-gray-200 w-6'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-50 rounded-2xl p-5 mb-5 border border-white/15">
        <p className="font-bold text-base leading-relaxed" style={{ color: '#0d2825' }}>{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          // Each option gets a distinct tint to differentiate them visually
          const optionTints = [
            'bg-[#1a3f5c] border-2 border-blue-400/25 text-blue-100',
            'bg-[#2d1f4a] border-2 border-purple-400/25 text-purple-100',
            'bg-[#1a3d2e] border-2 border-emerald-400/25 text-emerald-100',
            'bg-[#3d2a12] border-2 border-amber-400/25 text-amber-100',
          ];
          let style = `${optionTints[i]} hover:brightness-125`;
          if (revealed) {
            if (i === q.correctIndex) {
              style = 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200';
            } else if (i === chosen && chosen !== q.correctIndex) {
              style = 'bg-red-500/20 border-2 border-red-400 text-red-200';
            } else {
              style = 'bg-[#112825] border-2 border-white/8 text-white/30';
            }
          }
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-right font-medium text-sm ${style} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                revealed && i === q.correctIndex ? 'bg-emerald-500 text-white' :
                revealed && i === chosen && chosen !== q.correctIndex ? 'bg-red-400 text-white' :
                i === 0 ? 'bg-blue-500/30 text-blue-200' : i === 1 ? 'bg-purple-500/30 text-purple-200' : i === 2 ? 'bg-emerald-500/30 text-emerald-200' : 'bg-amber-500/30 text-amber-200'
              }`}>
                {LETTERS[i]}
              </span>
              <span className="flex-1">{opt}</span>
              {revealed && i === q.correctIndex && <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />}
              {revealed && i === chosen && chosen !== q.correctIndex && <XCircle size={20} className="text-red-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`mt-4 p-4 rounded-2xl border animate-slide-up flex gap-3 ${
          chosen === q.correctIndex
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-blue-900/25 border-blue-200'
        }`}>
          {chosen === q.correctIndex
            ? <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
            : <Sparkles size={20} className="text-blue-500 flex-shrink-0" />
          }
          <div>
            <p className={`font-bold text-sm mb-1 ${chosen === q.correctIndex ? 'text-emerald-700' : 'text-blue-700'}`}>
              {chosen === q.correctIndex ? 'إجابة صحيحة!' : 'الإجابة الصحيحة:'}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>{q.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultScreen({
  score,
  total,
  onRetry,
  onClose,
}: {
  score: number;
  total: number;
  onRetry: () => void;
  onClose: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    let frame: number;
    let current = 0;
    function step() {
      current += 2;
      if (current > pct) { setAnimPct(pct); return; }
      setAnimPct(current);
      frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [pct]);

  const grade =
    pct >= 90 ? { label: 'ممتاز', color: 'text-emerald-600', bg: 'from-emerald-400 to-teal-500' } :
    pct >= 70 ? { label: 'جيد جداً', color: 'text-blue-400', bg: 'from-blue-400 to-primary-500' } :
    pct >= 50 ? { label: 'جيد', color: 'text-amber-600', bg: 'from-amber-400 to-orange-500' } :
                { label: 'تحتاج مراجعة', color: 'text-red-600', bg: 'from-red-400 to-rose-500' };

  const circumference = 2 * Math.PI * 52;

  return (
    <div className="py-8 px-6 flex flex-col items-center text-center animate-scale-in">
      <Trophy size={40} className="text-amber-500 mb-4" />
      <h3 className="text-2xl font-black text-white mb-1">انتهى الاختبار!</h3>
      <p className={`text-lg font-bold mb-6 ${grade.color}`}>{grade.label}</p>

      {/* Ring */}
      <div className="relative w-36 h-36 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (animPct / 100) * circumference}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3c7974" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{animPct}%</span>
          <span className="text-sm text-white/55">{score}/{total}</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="flex gap-6 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-1">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600">{score}</span>
          <span className="text-xs text-white/45">صحيح</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-1">
            <XCircle size={22} className="text-red-400" />
          </div>
          <span className="text-2xl font-black text-red-400">{total - score}</span>
          <span className="text-xs text-white/45">خطأ</span>
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-white/20 text-primary-700 rounded-xl font-bold hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={16} />
          إعادة
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-gradient-to-l from-primary-600 to-primary-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          إنهاء
        </button>
      </div>
    </div>
  );
}

export default function QuizModal({ subject, title, content, onClose }: Props) {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0); // force re-mount on retry

  const questions = content.quiz;

  function handleAnswer(idx: number) {
    const next = [...answers, idx];
    setAnswers(next);
    if (next.length >= questions.length) {
      setTimeout(() => setDone(true), 400);
    } else {
      setTimeout(() => setCurrentQ(q => q + 1), 600);
    }
  }

  function retry() {
    setAnswers([]);
    setCurrentQ(0);
    setDone(false);
    setKey(k => k + 1);
  }

  const score = answers.filter((a, i) => a === questions[i]?.correctIndex).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#163a37] rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col animate-scale-in">

        {/* Header */}
        <div className="bg-gradient-to-l from-primary-600 to-primary-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#163a37]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Brain size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-white/70 font-medium">اختبر نفسك</span>
              <span className="flex items-center gap-1 bg-[#163a37]/20 text-white text-xs px-2 py-0.5 rounded-full">
                <Sparkles size={10} />
                {questions.length} أسئلة
              </span>
            </div>
            <h2 className="text-white font-black text-base truncate">{title}</h2>
            <p className="text-white/60 text-xs mt-0.5">{subject}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors flex-shrink-0">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!started ? (
            /* Intro screen */
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-100 rounded-3xl flex items-center justify-center mb-5">
                <Brain size={36} className="text-primary-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">اختبار {subject}</h3>
              <p className="text-white/55 text-sm mb-6 leading-relaxed">
                {questions.length} أسئلة اختيار من متعدد مولّدة من محتوى الملف.<br />
                ستظهر الإجابة الصحيحة وشرحها فور الإجابة.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-xs">
                {[
                  { label: 'أسئلة', value: questions.length },
                  { label: 'دقيقة تقديرية', value: `~${questions.length * 1.5 | 0}` },
                  { label: 'مستوى', value: 'متوسط' },
                ].map(s => (
                  <div key={s.label} className="bg-[#112825] rounded-2xl p-3 flex flex-col items-center gap-1">
                    <span className="text-lg font-black text-white">{s.value}</span>
                    <span className="text-xs text-white/45">{s.label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStarted(true)}
                className="w-full max-w-xs py-3.5 bg-gradient-to-l from-primary-600 to-primary-600 text-white rounded-2xl font-black text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary-200"
              >
                ابدأ الاختبار
              </button>
            </div>
          ) : done ? (
            <ResultScreen score={score} total={questions.length} onRetry={retry} onClose={onClose} />
          ) : (
            <div className="p-6" key={key}>
              <QuestionCard
                key={`${key}-${currentQ}`}
                q={questions[currentQ]}
                index={currentQ}
                total={questions.length}
                onAnswer={handleAnswer}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
