import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Users, Award, Star, ArrowLeft, CheckCircle,
  Zap, Shield, Clock, Flame, Trophy, Brain,
  GraduationCap, FileText, Calendar, MessageCircle,
  TrendingUp, BarChart2, ChevronLeft, ChevronRight
} from 'lucide-react';

/* ── Animated Counter ── */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ── Testimonials ── */
const testimonials = [
  { name: 'ريم العنزي', major: 'هندسة البرمجيات — السنة الثالثة', quote: 'وجدت مرشداً في هندسة البرمجيات خلال دقيقتين. الجلسة كانت أوضح من محاضرة كاملة.', stars: 5, avatar: 'ر' },
  { name: 'خالد المطيري', major: 'علوم الحاسب — السنة الرابعة', quote: 'حصلت على شهادة تفوق بعد 30 جلسة — الآن أضعها في سيرتي الذاتية مع ثقة.', stars: 5, avatar: 'خ' },
  { name: 'منيرة الشهراني', major: 'نظم المعلومات — السنة الثانية', quote: 'المكتبة تحتوي على كل ما تحتاجه. المرشدون هنا يفهمون بالضبط ما تحتاجه.', stars: 5, avatar: 'م' },
];

const steps = [
  { n: '01', icon: <GraduationCap size={20} />, title: 'سجّل حسابك', desc: 'بريدك الجامعي فقط — 30 ثانية', color: '#0d9488', bg: 'linear-gradient(135deg,#0d9488,#0f9f94)' },
  { n: '02', icon: <Users size={20} />, title: 'اختر مرشدك', desc: 'فلتر بالمادة والتقييم والنوع', color: '#7c3aed', bg: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
  { n: '03', icon: <Calendar size={20} />, title: 'احجز الجلسة', desc: 'حضوري أو أونلاين في أي وقت', color: '#0891b2', bg: 'linear-gradient(135deg,#0891b2,#0e7490)' },
  { n: '04', icon: <Star size={20} />, title: 'قيّم وتعلّم', desc: 'نقاط فورية للمرشد عند كل تقييم', color: '#d97706', bg: 'linear-gradient(135deg,#d97706,#b45309)' },
];

const features = [
  {
    icon: <BookOpen size={22} />,
    title: 'مكتبة رقمية دائمة',
    desc: 'ملخصات، فيديوهات، وبنوك أسئلة لكل مادة — مرتبة حسب التخصص والفصل.',
    stat: '312+ ملف',
    color: '#0d9488',
    tags: ['ملخصات', 'بنك أسئلة', 'فيديوهات'],
    large: true,
  },
  {
    icon: <Calendar size={22} />,
    title: 'حجز ذكي في ثوانٍ',
    desc: 'ابحث بالمادة واحجز حضورياً أو أونلاين بضغطة واحدة.',
    stat: '89 مرشد متاح',
    color: '#0891b2',
    large: false,
  },
  {
    icon: <Award size={22} />,
    title: 'شهادات تلقائية',
    desc: 'PDF رسمية تُصدر أوتوماتيكياً فور استيفاء الشروط.',
    stat: '156 شهادة',
    color: '#d97706',
    large: false,
  },
  {
    icon: <Trophy size={22} />,
    title: 'نقاط وتحديات',
    desc: 'نظام تحفيز بنقاط وشارات ولوحة شرف أسبوعية.',
    stat: 'لوحة أسبوعية',
    color: '#7c3aed',
    large: false,
  },
  {
    icon: <BarChart2 size={22} />,
    title: 'تحليلات إدارية',
    desc: 'مؤشرات أداء لحظية وتقارير شاملة للإدارة.',
    stat: '1,247+ طالب',
    color: '#059669',
    large: false,
  },
  {
    icon: <MessageCircle size={22} />,
    title: 'غرف دردشة حية',
    desc: 'غرف مناقشة لكل مادة مع المرشدين والطلاب.',
    stat: 'نقاشات مباشرة',
    color: '#6366f1',
    large: false,
  },
];

export default function LandingPage() {
  const [activeTest, setActiveTest] = useState(0);
  const students  = useCounter(1247, 2000);
  const mentors   = useCounter(89,   1600);
  const sessions  = useCounter(3420, 2200);
  const files     = useCounter(312,  1800);

  useEffect(() => {
    const t = setInterval(() => setActiveTest(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#f8fffe' }} dir="rtl">

      {/* ════════════════════════ HEADER ════════════════════════ */}
      <header className="sticky top-0 z-50"
        style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(13,148,136,0.10)', boxShadow: '0 1px 12px rgba(13,148,136,0.06)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl overflow-hidden"
              style={{ width: 48, height: 48, background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.14)', padding: 4 }}>
              <img src="/Zumra/PSAULOGO.png" alt="PSAU" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
            </div>
            <div>
              <div className="text-lg font-black leading-none" style={{ color: '#0d9488' }}>زُمرة</div>
              <div className="text-[10px] leading-none mt-0.5" style={{ color: 'rgba(13,40,37,0.40)' }}>جامعة الأمير سطام</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {[['الميزات', '#features'], ['كيف تعمل', '#steps'], ['الآراء', '#reviews']].map(([label, href]) => (
              <a key={href} href={href}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ color: 'rgba(13,40,37,0.55)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.06)'; (e.currentTarget as HTMLElement).style.color = '#0d2825'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(13,40,37,0.55)'; }}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 font-medium"
              style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.18)', color: '#059669' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              89 مرشد متاح الآن
            </span>
          </div>
        </div>
      </header>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #041d15 0%, #062a1e 40%, #0a3d2e 75%, #0d4a38 100%)', minHeight: '86vh', display: 'flex', flexDirection: 'column' }}>

        {/* Dot texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(93,184,158,0.10) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.7 }} />

        {/* Glow orbs */}
        <div className="absolute pointer-events-none"
          style={{ top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 65%)' }} />
        <div className="absolute pointer-events-none"
          style={{ bottom: '-15%', left: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(93,184,158,0.12) 0%, transparent 65%)' }} />

        <div className="relative flex-1 flex items-center">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Text */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 mb-7 text-xs font-semibold animate-slide-up"
                  style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(12px)', color: 'rgba(255,255,255,0.88)' }}>
                  <img src="/Zumra/PSAULOGO.png" alt="PSAU"
                    style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.90 }} />
                  <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.25)' }} />
                  <span>منصة الإرشاد الأكاديمي بالأقران · PSAU</span>
                </div>

                <h1 className="font-black text-white leading-none animate-slide-up delay-100"
                  style={{ fontSize: 'clamp(60px, 10vw, 96px)', textShadow: '0 4px 40px rgba(0,0,0,0.15)', letterSpacing: '-3px', marginBottom: 16 }}>
                  زُمرة
                </h1>

                <p className="text-xl font-semibold mb-3 animate-slide-up delay-200"
                  style={{ color: 'rgba(255,255,255,0.88)' }}>
                  اجمع، أرشد، وابقى أثراً
                </p>

                <p className="text-base leading-relaxed mb-10 max-w-lg animate-slide-up delay-300"
                  style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.8 }}>
                  بيئة رقمية تحوّل معرفة المتميزين إلى إرث أكاديمي. تنظّم الجلسات، تحفظ الملخصات،
                  وتكافئ المرشدين بشهادات رسمية فور استحقاقها.
                </p>

                <div className="flex flex-wrap gap-3 animate-slide-up delay-400">
                  <Link to="/auth"
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-base transition-all hover:scale-[1.03] active:scale-95"
                    style={{ background: '#ffffff', color: '#0d9488', boxShadow: '0 8px 28px rgba(0,0,0,0.16)' }}>
                    <Flame size={17} className="text-orange-500" />
                    ابدأ رحلتك الآن
                    <ArrowLeft size={15} style={{ marginRight: 2 }} />
                  </Link>
                  <Link to="/auth"
                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-base text-white transition-all hover:scale-[1.03]"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)' }}>
                    <Shield size={15} />
                    لوحة الإدارة
                  </Link>
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-3 mt-8 animate-slide-up delay-500">
                  <div className="flex -space-x-2 space-x-reverse">
                    {['أ','ن','م','خ'].map((l, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-black text-white"
                        style={{ background: ['#0d9488','#0891b2','#7c3aed','#d97706'][i] }}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    انضم إلى <span className="font-bold text-white">1,247+</span> طالب ومرشد نشيط
                  </p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="hidden lg:block relative h-80">
                {/* Card 1 */}
                <div className="absolute top-0 right-0 w-64 rounded-2xl p-4 animate-float"
                  style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.22)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white"
                      style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>أ</div>
                    <div>
                      <p className="text-white text-xs font-bold">أحمد الدوسري</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>تراكيب البيانات</p>
                    </div>
                    <div className="mr-auto flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium"
                      style={{ background: 'rgba(52,211,153,0.18)', color: '#6ee7b7' }}>
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />جارية
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
                    <div className="h-full rounded-full" style={{ width: '65%', background: 'linear-gradient(90deg,#34d399,#10b981)' }} />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>65%</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>35 دقيقة متبقية</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="absolute top-28 left-0 w-52 rounded-2xl p-4 animate-float-slow"
                  style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.22)' }}>
                  <p className="text-xs mb-2 font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>تقييم جديد ✨</p>
                  <div className="flex gap-0.5 mb-1.5">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
                  </div>
                  <p className="text-white text-xs font-semibold">"شرح رائع وصبور جداً"</p>
                </div>

                {/* Card 3 */}
                <div className="absolute bottom-0 right-8 w-56 rounded-2xl p-4 animate-float-fast"
                  style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.22)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>هذا الفصل</p>
                    <TrendingUp size={13} style={{ color: '#34d399' }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[['38', 'جلسة'], ['127', 'طالب'], ['4.9', 'تقييم']].map(([v, l]) => (
                      <div key={l}>
                        <p className="text-white font-black text-base">{v}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: 56, marginTop: 'auto', color: '#f8fffe' }}>
          <path d="M0,35 C480,70 960,0 1440,35 L1440,70 L0,70 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ════════════════════════ STATS ════════════════════════ */}
      <section className="py-12" style={{ background: '#ffffff' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: students, suffix: '+', label: 'طالب مستفيد', icon: <Users size={18} />, color: '#0d9488', bg: 'rgba(13,148,136,0.08)' },
              { value: mentors, suffix: '', label: 'مرشد نشيط', icon: <GraduationCap size={18} />, color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
              { value: sessions, suffix: '+', label: 'جلسة مكتملة', icon: <Calendar size={18} />, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
              { value: files, suffix: '+', label: 'ملف في المكتبة', icon: <BookOpen size={18} />, color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5 text-center transition-all hover:-translate-y-1"
                style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.10)', boxShadow: '0 2px 14px rgba(13,148,136,0.06)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <div className="text-3xl font-black tabular-nums" style={{ color: '#0d2825', letterSpacing: '-1px' }}>
                  {s.value.toLocaleString('ar-EG')}{s.suffix}
                </div>
                <div className="text-xs mt-1 font-medium" style={{ color: 'rgba(13,40,37,0.48)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ FEATURES ════════════════════════ */}
      <section id="features" className="py-24" style={{ background: '#f0f9ff' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(13,148,136,0.07)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.15)', letterSpacing: '0.12em' }}>
              المنصة
            </span>
            <h2 className="text-4xl sm:text-5xl font-black" style={{ color: '#0d2825', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              كل ما تحتاجه في مكان واحد
            </h2>
            <p className="mt-4 text-lg max-w-lg mx-auto" style={{ color: 'rgba(13,40,37,0.52)', lineHeight: 1.7 }}>
              منظومة متكاملة تجمع الإرشاد والمكتبة والتحفيز والتوثيق الأكاديمي
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-3 gap-5">

            {/* Large card */}
            <div className="md:col-span-2 md:row-span-2 rounded-3xl p-8 relative overflow-hidden group transition-all hover:-translate-y-1"
              style={{ background: 'linear-gradient(145deg, #0c7669 0%, #0d9488 55%, #0a85a0 100%)', boxShadow: '0 8px 40px rgba(13,148,136,0.22)', minHeight: 300 }}>
              <div className="absolute inset-0 pointer-events-none opacity-50"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(10,133,160,0.45) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(255,255,255,0.18)' }}>
                  <BookOpen size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">مكتبة رقمية دائمة</h3>
                <p className="text-base leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.75 }}>
                  ملخصات، فيديوهات، وبنوك أسئلة لكل مادة — مرتبة حسب التخصص والفصل والمستوى.
                  محفوظة إلى الأبد ومتاحة للجميع مجاناً.
                </p>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-4xl font-black text-white">312+</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>ملف محمّل هذا الفصل</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['ملخصات', 'بنك أسئلة', 'فيديوهات'].map(t => (
                    <div key={t} className="text-center py-2.5 rounded-xl text-xs font-semibold text-white"
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)' }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Small cards */}
            {[
              { icon: <Calendar size={20} />, title: 'حجز ذكي في ثوانٍ', desc: 'ابحث بالمادة واحجز حضورياً أو أونلاين.', stat: '89 مرشد متاح', color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
              { icon: <Award size={20} />, title: 'شهادات تلقائية', desc: 'PDF رسمية تُصدر فور استيفاء الشروط.', stat: '156 شهادة صدرت', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
              { icon: <Trophy size={20} />, title: 'نقاط وتحديات', desc: 'تحفيز بشارات ولوحة شرف أسبوعية.', stat: 'لوحة أسبوعية', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
              { icon: <BarChart2 size={20} />, title: 'تحليلات إدارية', desc: 'مؤشرات أداء فورية وتقارير شاملة.', stat: '1,247+ طالب', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
            ].map((f, i) => (
              <div key={i} className="rounded-3xl p-6 transition-all hover:-translate-y-1 group"
                style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.10)', boxShadow: '0 2px 16px rgba(13,148,136,0.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-bold mb-1.5" style={{ color: '#0d2825', fontSize: 15 }}>{f.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(13,40,37,0.52)', lineHeight: 1.65 }}>{f.desc}</p>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full inline-block"
                  style={{ background: f.bg, color: f.color }}>{f.stat}</span>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ════════════════════════ HOW IT WORKS ════════════════════════ */}
      <section id="steps" className="py-24" style={{ background: '#ffffff' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(13,148,136,0.07)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.15)', letterSpacing: '0.12em' }}>
              الخطوات
            </span>
            <h2 className="text-4xl font-black" style={{ color: '#0d2825', letterSpacing: '-1px' }}>كيف تعمل زمرة؟</h2>
            <p className="mt-4 text-base" style={{ color: 'rgba(13,40,37,0.50)' }}>أربع خطوات بسيطة وتكون جزءاً من المجتمع</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={i} className="relative rounded-2xl p-6 transition-all hover:-translate-y-2"
                style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.10)', boxShadow: '0 2px 14px rgba(13,148,136,0.06)' }}>

                {/* Connector */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-0 w-full h-px z-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, rgba(13,148,136,0.18), rgba(13,148,136,0.04))' }} />
                )}

                <div className="relative z-10">
                  {/* Step number */}
                  <div className="text-6xl font-black leading-none mb-5"
                    style={{ color: `${s.color}12`, letterSpacing: '-3px', fontVariantNumeric: 'tabular-nums' }}>
                    {s.n}
                  </div>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: s.bg, color: '#fff' }}>
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-[#0d2825] mb-1.5" style={{ fontSize: 15 }}>{s.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(13,40,37,0.52)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ PROBLEM / SOLUTION ════════════════════════ */}
      <section className="py-24" style={{ background: '#faf5ff' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-black" style={{ color: '#0d2825', letterSpacing: '-1px' }}>لماذا زمرة؟</h2>
            <p className="mt-4 text-base" style={{ color: 'rgba(13,40,37,0.50)' }}>تحوّل تحديات التعلم إلى فرص حقيقية</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Problem */}
            <div className="rounded-3xl p-8"
              style={{ background: '#fff9f9', border: '1.5px solid rgba(239,68,68,0.15)' }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-black mb-6" style={{ color: '#0d2825' }}>المشكلة اليوم</h3>
              <div className="space-y-4">
                {[
                  'شروحات رائعة تختفي في واتساب مغلق',
                  'لا طريقة سريعة لإيجاد المرشد الأنسب',
                  'الشهادات تتأخر وتُحبط المرشدين المتميزين',
                  'الإدارة تعمل بدون بيانات حقيقية',
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>✗</div>
                    <span className="text-sm leading-relaxed" style={{ color: 'rgba(13,40,37,0.60)', lineHeight: 1.7 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="rounded-3xl p-8 relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #0c7669, #0a85a0)', boxShadow: '0 8px 40px rgba(13,148,136,0.22)' }}>
              <div className="absolute inset-0 pointer-events-none opacity-40"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(255,255,255,0.18)' }}>
                  <CheckCircle size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-6">الحل مع زمرة</h3>
                <div className="space-y-4">
                  {[
                    'مكتبة رقمية دائمة لكل محتوى أكاديمي',
                    'بحث ذكي وحجز فوري في أقل من دقيقة',
                    'شهادات PDF تلقائية عند استحقاقها',
                    'لوحة إدارة بإحصائيات ومؤشرات لحظية',
                  ].map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-emerald-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════ WHO BENEFITS ════════════════════════ */}
      <section className="py-24" style={{ background: '#fff7ed' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(13,148,136,0.07)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.15)', letterSpacing: '0.12em' }}>
              الفئات المستهدفة
            </span>
            <h2 className="text-4xl font-black" style={{ color: '#0d2825', letterSpacing: '-1px' }}>من يستفيد؟</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'الطالب الباحث', gradient: 'linear-gradient(135deg,#0d9488,#0891b2)', items: ['احجز جلسة مع أفضل المرشدين', 'تصفّح مكتبة ملخصات ثرية', 'تقييم فوري وشفاف'], icon: <GraduationCap size={20} /> },
              { title: 'الطالب المرشد', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)', items: ['احصل على شهادات رسمية تلقائية', 'ابنِ سيرتك الأكاديمية', 'نقاط وشارات ولوحة شرف'], icon: <Brain size={20} /> },
              { title: 'إدارة الكلية', gradient: 'linear-gradient(135deg,#d97706,#b45309)', items: ['تتبّع أداء الإرشاد لحظياً', 'تقارير وإحصائيات شاملة', 'قرارات مبنية على بيانات'], icon: <Shield size={20} /> },
            ].map((card, i) => (
              <div key={i} className="rounded-3xl overflow-hidden transition-all hover:-translate-y-2"
                style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.10)', boxShadow: '0 4px 20px rgba(13,148,136,0.07)' }}>
                <div className="p-5 flex items-center gap-3" style={{ background: card.gradient }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                    style={{ background: 'rgba(255,255,255,0.18)' }}>
                    {card.icon}
                  </div>
                  <h3 className="font-black text-white" style={{ fontSize: 15 }}>{card.title}</h3>
                </div>
                <div className="p-6 space-y-3.5">
                  {card.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(13,40,37,0.65)' }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(13,148,136,0.09)', color: '#0d9488' }}>
                        <CheckCircle size={11} />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ TESTIMONIALS ════════════════════════ */}
      <section id="reviews" className="py-24" style={{ background: '#f0fdf4' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(13,148,136,0.07)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.15)', letterSpacing: '0.12em' }}>
              آراء المستخدمين
            </span>
            <h2 className="text-4xl font-black" style={{ color: '#0d2825', letterSpacing: '-1px' }}>ماذا يقولون؟</h2>
          </div>

          <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.10)', boxShadow: '0 4px 24px rgba(13,148,136,0.08)' }}>

            {/* Decorative quote */}
            <div className="absolute top-4 right-8 font-serif opacity-[0.04] select-none"
              style={{ fontSize: 120, color: '#0d9488', lineHeight: 1 }}>"</div>

            {testimonials.map((t, i) => (
              <div key={i} className={`transition-all duration-500 ${i === activeTest ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <div className="flex gap-1 mb-5">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={17} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xl sm:text-2xl font-semibold leading-relaxed mb-8"
                  style={{ color: '#0d2825', lineHeight: 1.65 }}>
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-base"
                    style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#0d2825' }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.48)' }}>{t.major}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTest(i)}
                  className="h-2 rounded-full transition-all"
                  style={{ width: i === activeTest ? 24 : 8, background: i === activeTest ? '#0d9488' : 'rgba(13,148,136,0.18)' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ CTA ════════════════════════ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #0c7669 0%, #0d9488 50%, #0a85a0 100%)', boxShadow: '0 20px 60px rgba(13,148,136,0.28)' }}>
            <div className="absolute inset-0 pointer-events-none opacity-40"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <Flame size={13} className="text-amber-300" />
                انضم مجاناً اليوم
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-1.5px' }}>
                جاهز لتبدأ رحلتك؟
              </h2>
              <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.72)' }}>
                انضم إلى 1,247+ طالب يستخدمون زمرة كل فصل
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/library"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                  <BookOpen size={16} />
                  تصفّح المكتبة
                </Link>
                <Link to="/honor-board"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                  <Trophy size={16} />
                  لوحة الشرف
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer className="py-10" style={{ background: '#0d2825', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-3">
              <img src="/Zumra/PSAULOGO.png" alt="PSAU" style={{ height: 34, width: 'auto' }} />
              <div>
                <div className="font-black text-sm leading-none" style={{ color: '#2dd4bf' }}>زُمرة</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>جامعة الأمير سطام بن عبدالعزيز</div>
              </div>
            </div>

            <p className="text-xs text-center order-last sm:order-none" style={{ color: 'rgba(255,255,255,0.32)' }}>
              © 2025 منصة زمرة · جميع الحقوق محفوظة
            </p>

            <div className="flex items-center gap-5">
              {[['الميزات', '#features'], ['كيف تعمل', '#steps'], ['تسجيل الدخول', '/auth']].map(([label, href]) => (
                href.startsWith('/') ? (
                  <Link key={href} to={href} className="text-xs font-medium transition-colors hover:opacity-80"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {label}
                  </Link>
                ) : (
                  <a key={href} href={href} className="text-xs font-medium transition-colors hover:opacity-80"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
