import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, BookOpen, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

// Brand colors extracted from Logo.jfif (group of people in teal greens)
const BRAND = {
  darkest:  '#1f4d3e',   // darkest back figures
  dark:     '#2a5c4e',   // dark green
  mid:      '#3d8a6e',   // medium teal-green
  bright:   '#5db89e',   // bright teal
  light:    '#8dd4be',   // light mint
  lightest: '#b8e8d8',   // very light mint
  bg:       '#f0faf7',   // page background
  white:    '#ffffff',
};

const ROLE_OPTIONS: {
  role: UserRole; label: string; desc: string;
  icon: React.ReactNode; color: string;
}[] = [
  { role: 'student', label: 'طالب',         desc: 'أبحث عن دعم أكاديمي وملخصات',   icon: <GraduationCap size={20} />, color: BRAND.mid    },
  { role: 'mentor',  label: 'مرشد طلابي',   desc: 'أشارك معرفتي وأرشد زملائي',     icon: <BookOpen      size={20} />, color: BRAND.dark   },
  { role: 'admin',   label: 'إدارة الكلية', desc: 'أتابع وأدير برنامج الإرشاد',    icon: <Shield        size={20} />, color: BRAND.darkest},
];

export default function AuthPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const ROLE_EMAILS: Record<UserRole, string> = {
    student: 'student@uni.edu.sa',
    mentor:  'studenthelper.name@uni.edu.sa',
    admin:   'admin.name@uni.edu.sa',
  };

  const [selectedRole,   setSelectedRole]   = useState<UserRole>('student');
  const [email,          setEmail]          = useState(ROLE_EMAILS['student']);
  const [password,       setPassword]       = useState('123456');
  const [showPassword,   setShowPassword]   = useState(false);
  const [error,          setError]          = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('يرجى ملء جميع الحقول'); return; }
    setError('');
    await login(email, password, selectedRole);
    if (selectedRole === 'admin')        navigate('/admin');
    else if (selectedRole === 'mentor')  navigate('/mentor');
    else                                 navigate('/student');
  }

  const activeColor = ROLE_OPTIONS.find(r => r.role === selectedRole)?.color ?? BRAND.mid;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(160deg, ${BRAND.bg} 0%, #e2f5ee 50%, #d0ede3 100%)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative background shapes */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{
          position:'absolute', top:'-8%', right:'-6%',
          width:420, height:420, borderRadius:'50%',
          background:`radial-gradient(circle, ${BRAND.lightest}88 0%, transparent 70%)`,
        }} />
        <div style={{
          position:'absolute', bottom:'-10%', left:'-4%',
          width:350, height:350, borderRadius:'50%',
          background:`radial-gradient(circle, ${BRAND.light}66 0%, transparent 70%)`,
        }} />
        <div style={{
          position:'absolute', top:'30%', left:'2%',
          width:180, height:180, borderRadius:'50%',
          background:`radial-gradient(circle, ${BRAND.lightest}44 0%, transparent 70%)`,
        }} />
      </div>

      {/* ─── Two-column layout ─── */}
      <div className="w-full max-w-4xl relative z-10 flex items-stretch gap-0 rounded-3xl overflow-hidden shadow-2xl animate-scale-in"
        style={{ boxShadow: `0 32px 80px rgba(30,78,62,0.18), 0 8px 24px rgba(30,78,62,0.10)` }}>

        {/* LEFT — branding panel */}
        <div
          className="hidden md:flex flex-col items-center justify-center p-10 flex-1"
          style={{
            background: `linear-gradient(160deg, ${BRAND.darkest} 0%, ${BRAND.dark} 40%, ${BRAND.mid} 100%)`,
            minWidth: 300,
          }}
        >
          {/* Logo.jfif — the group-of-people image */}
          <div style={{
            background: 'rgba(255,255,255,0.12)', borderRadius: 24, padding: 20,
            backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)',
            marginBottom: 28,
          }}>
            <img
              src="/Zumra/Logo.jfif"
              alt="مجتمع زمرة"
              style={{
                width: 160, height: 160, objectFit: 'contain', borderRadius: 12,
                filter: 'brightness(1.05) saturate(0.9)',
              }}
            />
          </div>

          <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 900, marginBottom: 8, textAlign:'center' }}>
            زُمرة
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13, textAlign: 'center', lineHeight: 1.7, maxWidth: 220 }}>
            منصة الإرشاد الأكاديمي في جامعة الأمير سطام بن عبدالعزيز
          </p>

          {/* PSAU logo */}
          <div style={{
            marginTop: 32, paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.15)',
            width: '100%', textAlign: 'center',
          }}>
            <img
              src="/Zumra/PSAULOGO.png"
              alt="جامعة الأمير سطام"
              style={{ height: 52, width:'auto', maxWidth:'100%', objectFit:'contain', filter:'brightness(0) invert(1)', opacity: 0.80, display:'block', margin:'0 auto' }}
            />
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, marginTop:6, textAlign:'center' }}>
              Prince Sattam bin Abdulaziz University
            </p>
          </div>
        </div>

        {/* RIGHT — login form */}
        <div className="flex-1 p-8 flex flex-col justify-center"
          style={{ background: BRAND.white, minWidth: 0 }}>

          {/* Mobile logo (shown only on small screens) */}
          <div className="md:hidden flex items-center gap-3 justify-center mb-6">
            <img src="/Zumra/Logo.jfif" alt="زمرة"
              style={{ height: 52, width: 52, borderRadius: 12, objectFit: 'contain', border: `2px solid ${BRAND.light}` }} />
            <img src="/Zumra/PSAULOGO.png" alt="PSAU"
              style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
          </div>

          <div className="mb-6">
            <h1 style={{ color: BRAND.darkest, fontSize: 22, fontWeight: 900, marginBottom: 4 }}>
              مرحباً بك 👋
            </h1>
            <p style={{ color: 'rgba(31,77,62,0.55)', fontSize: 13 }}>
              سجّل دخولك بحساب جامعتك للمتابعة
            </p>
          </div>

          {/* Demo notice */}
          <div className="rounded-xl p-3 mb-5 text-sm text-center"
            style={{ background: `${BRAND.lightest}88`, border: `1px solid ${BRAND.light}`, color: BRAND.dark }}>
            🚀 <strong>وضع العرض التجريبي</strong> — اختر دورك وسجّل الدخول
          </div>

          {/* Role selection */}
          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider"
              style={{ color: 'rgba(31,77,62,0.50)' }}>أنا...</label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map(r => {
                const isSelected = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => { setSelectedRole(r.role); setEmail(ROLE_EMAILS[r.role]); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right"
                    style={isSelected ? {
                      background: `${r.color}14`,
                      border: `1.5px solid ${r.color}55`,
                      boxShadow: `0 2px 12px ${r.color}22`,
                    } : {
                      background: BRAND.bg,
                      border: `1px solid rgba(45,150,120,0.14)`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={isSelected
                        ? { background: `${r.color}20`, color: r.color }
                        : { background: 'rgba(45,150,120,0.07)', color: 'rgba(31,77,62,0.45)' }}>
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: isSelected ? r.color : BRAND.darkest }}>{r.label}</p>
                      <p className="text-xs" style={{ color: 'rgba(31,77,62,0.45)' }}>{r.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: r.color }}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email & Password */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(31,77,62,0.65)' }}>
                البريد الجامعي
              </label>
              <div className="relative">
                <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: BRAND.bright }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="example@uni.edu.sa" dir="ltr"
                  className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ background: BRAND.bg, border: `1px solid ${BRAND.light}`, color: BRAND.darkest }}
                  onFocus={e => (e.target.style.border = `1.5px solid ${BRAND.mid}`)}
                  onBlur={e =>  (e.target.style.border = `1px solid ${BRAND.light}`)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(31,77,62,0.65)' }}>
                كلمة المرور
              </label>
              <div className="relative">
                <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: BRAND.bright }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pr-9 pl-10 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ background: BRAND.bg, border: `1px solid ${BRAND.light}`, color: BRAND.darkest }}
                  onFocus={e => (e.target.style.border = `1.5px solid ${BRAND.mid}`)}
                  onBlur={e =>  (e.target.style.border = `1px solid ${BRAND.light}`)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: BRAND.bright }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm rounded-xl px-3 py-2"
                style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.20)', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all mt-1 disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${activeColor}, ${BRAND.bright})`,
                boxShadow: `0 4px 18px ${activeColor}44`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 26px ${activeColor}55`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 18px ${activeColor}44`; }}
            >
              {isLoading
                ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />جاري الدخول...</span>
                : 'تسجيل الدخول →'}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: 'rgba(31,77,62,0.35)' }}>
            تسجيل الدخول يعني موافقتك على شروط الاستخدام وسياسة الخصوصية
          </p>
        </div>
      </div>
    </div>
  );
}
