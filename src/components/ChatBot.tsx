import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Bot } from 'lucide-react';

/* ── Knowledge base — Arabic Q&A ── */
type QA = { patterns: string[]; answer: string };

const KB: QA[] = [
  {
    patterns: ['مرحبا', 'السلام', 'هلا', 'أهلا', 'هاي', 'صباح', 'مساء'],
    answer: 'أهلاً وسهلاً! أنا مساعد منصة **زمرة**. يسعدني مساعدتك في أي استفسار عن الإرشاد الأكاديمي أو المكتبة أو الحجز. بماذا أستطيع خدمتك؟',
  },
  {
    patterns: ['حجز', 'احجز', 'جلسة', 'مرشد', 'موعد'],
    answer: 'لحجز جلسة إرشادية:\n1. اذهب إلى صفحة **"احجز جلسة"**\n2. اختر تخصصك والمادة\n3. تصفّح المرشدين المتاحين\n4. اضغط "احجز جلسة" واملأ التفاصيل\n\nستصلك رسالة تأكيد فوراً!',
  },
  {
    patterns: ['مكتبة', 'ملخص', 'ملخصات', 'ملفات', 'ملف', 'تحميل'],
    answer: 'في مكتبة زمرة ستجد:\n• ملخصات شاملة\n• بنوك أسئلة سابقة\n• مقاطع فيديو شرح\n• شرائح وملاحظات\n\nكلها مرتبة حسب التخصص والمادة والفصل الدراسي!',
  },
  {
    patterns: ['شهادة', 'شهادات', 'توثيق', 'pdf'],
    answer: 'شهادات زمرة تُصدر **تلقائياً** عند:\n• إتمام **5 جلسات** → شهادة شكر وتقدير\n• إتمام **20 جلسة** → شهادة تفوق\n• إتمام **50 جلسة** + تقييم +4.0 → شهادة تميز استثنائي\n\nيتم إرسال الشهادة PDF فوراً للمرشد وللإدارة',
  },
  {
    patterns: ['نقاط', 'شارات', 'شارة', 'gamification', 'تحفيز'],
    answer: 'نظام النقاط في زمرة:\n• كل جلسة تكتمل = 20 نقطة للمرشد\n• تقييم ممتاز = 5 نقاط إضافية\n• رفع محتوى في المكتبة = 10 نقاط\n\nتراكم النقاط يرفعك في **لوحة الشرف**',
  },
  {
    patterns: ['تسجيل', 'حساب', 'اشتراك', 'دخول', 'login'],
    answer: 'لتسجيل حسابك:\n1. اضغط "ابدأ الآن" في الصفحة الرئيسية\n2. أدخل بريدك الجامعي\n3. اختر تخصصك ومستواك الدراسي\n4. انتهيت! الحساب مجاني تماماً',
  },
  {
    patterns: ['تخصص', 'تخصصات', 'قسم', 'أقسام'],
    answer: 'التخصصات المتاحة في الكلية:\n• هندسة البرمجيات (ENP)\n• علوم الحاسب (CSC)\n• نظم المعلومات (INS)\n• هندسة الحاسب (CE)\n\nجميع التخصصات مدعومة بمرشدين متخصصين!',
  },
  {
    patterns: ['مادة', 'مواد', 'كورس', 'موضوع'],
    answer: 'يمكنك البحث عن مرشد حسب المادة مباشرة! فقط:\n1. اختر تخصصك أولاً\n2. ستظهر المواد الخاصة بتخصصك\n3. اختر المادة التي تحتاج مساعدة فيها\n\nلدينا مرشدون في جميع مواد الخطة الدراسية',
  },
  {
    patterns: ['لوحة شرف', 'ترتيب', 'مسابقة', 'أفضل'],
    answer: 'لوحة الشرف تُحدَّث أسبوعياً وتُرتّب المرشدين حسب:\n• إجمالي النقاط\n• عدد الجلسات\n• متوسط التقييم\n\nأعلى ثلاثة مرشدين يحصلون على شارات ذهبية خاصة!',
  },
  {
    patterns: ['شكرا', 'شكراً', 'ممتاز', 'رائع', 'حلو', 'مشكور'],
    answer: 'العفو! يسعدنا خدمتك. إذا كان لديك أي استفسار آخر فلا تتردد. بالتوفيق في دراستك!',
  },
  {
    patterns: ['مشكلة', 'خطأ', 'error', 'مساعدة', 'دعم'],
    answer: 'للإبلاغ عن مشكلة أو طلب الدعم التقني:\n• راسل إدارة المنصة من لوحة التحكم\n• أو تواصل مع وحدة الإرشاد الأكاديمي في الكلية\n\nسنرد عليك في أقرب وقت ممكن',
  },
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const qa of KB) {
    if (qa.patterns.some(p => lower.includes(p))) return qa.answer;
  }
  return `لم أفهم سؤالك تماماً. يمكنك السؤال عن:\n• **الحجز** — كيف أحجز جلسة؟\n• **المكتبة** — كيف أرفع ملخصاً؟\n• **الشهادات** — متى أحصل عليها؟\n• **النقاط والشارات** — كيف تعمل؟\n\nأو تواصل مع الإدارة مباشرة`;
}

interface Message { id: number; from: 'bot' | 'user'; text: string; }

const INITIAL: Message[] = [
  { id: 0, from: 'bot', text: 'مرحباً! أنا **زمّور**، مساعد منصة زمرة الذكي.\n\nكيف أستطيع مساعدتك اليوم؟' },
];

const SUGGESTIONS = ['كيف أحجز جلسة؟', 'ما التخصصات المتاحة؟', 'كيف تعمل الشهادات؟', 'اشرح نظام النقاط'];

function RenderText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <span className="whitespace-pre-line">
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p === '\n') return <br key={i} />;
        return p;
      })}
    </span>
  );
}

export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [unread, setUnread]   = useState(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) { setUnread(0); endRef.current?.scrollIntoView({ behavior: 'smooth' }); }
  }, [open, messages]);

  function send(text = input.trim()) {
    if (!text) return;
    setMessages(p => [...p, { id: Date.now(), from: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, { id: Date.now() + 1, from: 'bot', text: findAnswer(text) }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  }

  return (
    <>
      {/* ── FAB ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[9990] w-16 h-16 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all group"
        style={{ background: 'linear-gradient(135deg, #25a89d 0%, #1b8c82 100%)', boxShadow: '0 6px 24px rgba(13,148,136,0.45)' }}
        aria-label="المساعد الذكي">
        {open ? <X size={22} /> : <MessageCircle size={22} className="group-hover:animate-bounce" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unread}
          </span>
        )}
      </button>

      {/* ── CHAT WINDOW ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[9989] w-96 sm:w-[460px] rounded-3xl flex flex-col overflow-hidden chat-open"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(13,148,136,0.18)',
            boxShadow: '0 20px 60px rgba(13,148,136,0.15), 0 4px 16px rgba(0,0,0,0.08)',
            maxHeight: '78vh',
          }}>

          {/* Header */}
          <div className="p-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #1b8c82 0%, #25a89d 100%)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.20)' }}>
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-black text-white text-sm">زمّور — المساعد الذكي</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                <span className="text-xs text-white/80">متاح الآن</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ minHeight: 0, background: '#f4f9f8' }}>
            {messages.map(m => (
              <div key={m.id} className={`flex gap-2.5 chat-msg ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.from === 'bot' && (
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: 'rgba(13,148,136,0.12)' }}>
                    <Bot size={14} style={{ color: '#1b8c82' }} />
                  </div>
                )}
                <div className="max-w-[80%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed font-medium"
                  style={m.from === 'bot'
                    ? { background: '#ffffff', border: '1px solid rgba(13,148,136,0.18)', color: '#0d2825', borderTopRightRadius: 4, boxShadow: '0 2px 8px rgba(13,148,136,0.10)' }
                    : { background: 'linear-gradient(135deg, #0d9488, #0891b2)', color: '#fff', borderTopLeftRadius: 4, fontWeight: 600 }
                  }>
                  <RenderText text={m.text} />
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(13,148,136,0.12)' }}>
                  <Bot size={14} style={{ color: '#1b8c82' }} />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tr-sm"
                  style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.12)', boxShadow: '0 1px 4px rgba(13,148,136,0.07)' }}>
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: '#1b8c82', animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto"
              style={{ borderTop: '1px solid rgba(13,148,136,0.10)', background: '#ffffff' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="flex-shrink-0 text-xs rounded-full px-3 py-1.5 transition-all font-medium hover:shadow-sm"
                  style={{ background: 'rgba(13,148,136,0.07)', color: '#1b8c82', border: '1px solid rgba(13,148,136,0.16)' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 flex gap-2"
            style={{ borderTop: '1px solid rgba(13,148,136,0.10)', background: '#ffffff' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 text-base rounded-xl px-4 py-3 focus:outline-none text-right"
              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.15)', color: '#0d2825' }}
              dir="rtl"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              className="w-12 h-12 text-white rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #25a89d, #1b8c82)' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
