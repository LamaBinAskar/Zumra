import React, { useState, useEffect } from 'react';
import { X, Brain, ChevronDown, ChevronUp, Lightbulb, BookOpen, Tag, Sparkles } from 'lucide-react';
import type { AIContent } from '../data/aiContent';

interface Props {
  subject: string;
  title: string;
  content: AIContent;
  onClose: () => void;
}

/* Animated text that types character by character */
function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 18);
    return () => clearTimeout(t);
  }, [started, displayed, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-0.5 h-4 bg-primary-900/250 animate-pulse ml-0.5 align-middle" />
      )}
    </span>
  );
}

export default function SummaryModal({ subject, title, content, onClose }: Props) {
  const [showTerms, setShowTerms] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Simulate AI loading
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#163a37] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">

        {/* Header */}
        <div className="bg-gradient-to-l from-primary-600 to-primary-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#163a37]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Brain size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-white/70 font-medium">ملخص ذكي بالذكاء الاصطناعي</span>
              <span className="flex items-center gap-1 bg-[#163a37]/20 text-white text-xs px-2 py-0.5 rounded-full">
                <Sparkles size={10} />
                AI
              </span>
            </div>
            <h2 className="text-white font-black text-base truncate">{title}</h2>
            <p className="text-white/60 text-xs mt-0.5">{subject}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors flex-shrink-0">
            <X size={22} />
          </button>
        </div>

        {/* Loading state */}
        {!loaded ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-white/15 border-t-primary-600 animate-spin" />
              <Brain size={20} className="absolute inset-0 m-auto text-primary-500" />
            </div>
            <div className="text-center">
              <p className="text-white/80 font-semibold">يتم تحليل المحتوى...</p>
              <p className="text-white/45 text-sm mt-1">الذكاء الاصطناعي يقرأ الملف ويستخلص أهم النقاط</p>
            </div>
            <div className="flex gap-2 mt-2">
              {['تحليل النص', 'استخلاص المفاهيم', 'توليد الملخص'].map((step, i) => (
                <span key={step} className="text-xs bg-primary-900/25 text-primary-600 px-3 py-1.5 rounded-full font-medium"
                  style={{ animationDelay: `${i * 300}ms` }}>
                  {step}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* Intro */}
            <div className="rounded-2xl p-5 border" style={{ background: 'linear-gradient(135deg,#1e4a45,#163a37)', borderColor: 'rgba(94,203,195,0.25)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={14} className="text-white" />
                </div>
                <h3 className="font-black text-white text-sm">نبذة عامة</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)' }}>
                <TypeWriter text={content.summary.intro} />
              </p>
            </div>

            {/* Key points */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✦</span>
                </div>
                <h3 className="font-black text-white text-sm">أهم النقاط</h3>
              </div>
              <div className="space-y-2.5">
                {content.summary.points.map((point, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start bg-[#163a37] border border-white/8 rounded-xl p-3.5 shadow-sm animate-slide-up"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key terms — collapsible */}
            <div className="border border-white/8 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowTerms(v => !v)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#112825] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Tag size={13} className="text-white" />
                  </div>
                  <span className="font-black text-white text-sm">المصطلحات الرئيسية</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    {content.summary.keyTerms.length} مصطلح
                  </span>
                </div>
                {showTerms ? <ChevronUp size={18} className="text-white/45" /> : <ChevronDown size={18} className="text-white/45" />}
              </button>
              {showTerms && (
                <div className="px-4 pb-4 grid sm:grid-cols-2 gap-2.5 border-t border-white/8 pt-3">
                  {content.summary.keyTerms.map((kt, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.22)' }}>
                      <p className="font-bold text-xs mb-1" style={{ color: '#34d399' }}>{kt.term}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{kt.definition}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exam tips — collapsible */}
            <div className="border border-amber-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowTips(v => !v)}
                className="w-full flex items-center justify-between p-4 hover:bg-amber-900/25/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-900/250 rounded-lg flex items-center justify-center">
                    <Lightbulb size={13} className="text-white" />
                  </div>
                  <span className="font-black text-white text-sm">نصائح للاختبار</span>
                  <span className="text-xs bg-amber-800/30 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                    {content.summary.examTips.length} نصيحة
                  </span>
                </div>
                {showTips ? <ChevronUp size={18} className="text-white/45" /> : <ChevronDown size={18} className="text-white/45" />}
              </button>
              {showTips && (
                <div className="px-4 pb-4 space-y-2 border-t border-amber-100 pt-3">
                  {content.summary.examTips.map((tip, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <Lightbulb size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-white/8 bg-[#112825] flex items-center justify-between gap-3">
          <p className="text-xs text-white/45">هذا الملخص تم توليده بالذكاء الاصطناعي — راجع المصدر الأصلي دائماً</p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors flex-shrink-0"
          >
            حسناً
          </button>
        </div>
      </div>
    </div>
  );
}
