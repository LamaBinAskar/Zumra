import React, { useState } from 'react';
import { Award, Star, Users, Clock, Printer } from 'lucide-react';
import { printCertificate } from '../utils/certificatePrinter';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_CERTIFICATES } from '../mockData';

const CERT_CONFIG = {
  outstanding: {
    label: 'شهادة تميز استثنائي',
    badge: '🥇',
    accentColor: '#f0c040',
    subtitle: 'تقديراً لجهوده الاستثنائية في خدمة الإرشاد الأكاديمي',
  },
  excellence: {
    label: 'شهادة تفوق',
    badge: '🥈',
    accentColor: '#5db89e',
    subtitle: 'تقديراً لتميزه في خدمة الإرشاد الأكاديمي',
  },
  appreciation: {
    label: 'شهادة شكر وتقدير',
    badge: '🥉',
    accentColor: '#8dd4be',
    subtitle: 'شكراً وتقديراً على مشاركته في برنامج الإرشاد',
  },
};

/* ── Islamic arch SVG ── */
function IslamicArch({ color }: { color: string }) {
  return (
    <div className="relative flex justify-center" style={{ height: 210, marginBottom: -8 }}>
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 220, height: 160,
        background: `radial-gradient(ellipse at 50% 90%, ${color}55 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />
      <svg width="210" height="210" viewBox="0 0 210 210" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="archGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="beamFade" x1="105" y1="175" x2="105" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color} stopOpacity="0.55"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.04"/>
          </linearGradient>
        </defs>
        <path d="M18 210 L18 105 Q18 18 105 18 Q192 18 192 105 L192 210 Z"
          fill="none" stroke={color} strokeWidth="1.8" opacity="0.50" filter="url(#archGlow)" />
        <path d="M32 210 L32 110 Q32 36 105 36 Q178 36 178 110 L178 210 Z"
          fill={`${color}06`} stroke={color} strokeWidth="1.2" opacity="0.42" />
        <path d="M82 36 Q105 10 128 36" fill="none" stroke={color} strokeWidth="1.5" opacity="0.65" />
        {[0,1,2,3,4,5].map(i => (
          <rect key={`l${i}`} x="20" y={52 + i * 26} width="9" height="9" rx="1"
            transform={`rotate(45 24.5 ${56.5 + i * 26})`} fill={color} opacity="0.30" />
        ))}
        {[0,1,2,3,4,5].map(i => (
          <rect key={`r${i}`} x="181" y={52 + i * 26} width="9" height="9" rx="1"
            transform={`rotate(45 185.5 ${56.5 + i * 26})`} fill={color} opacity="0.30" />
        ))}
        {[-1,0,1].map(dx => (
          <circle key={`t${dx}`} cx={105 + dx * 14} cy={44} r="1.8" fill={color} opacity="0.28" />
        ))}
        <g filter="url(#archGlow)">
          <path d="M105 75 Q130 75 130 100 Q130 125 105 125 Q120 119 120 100 Q120 81 105 75 Z"
            fill={color} opacity="0.90" />
          <polygon
            points="140,82 141.5,87 147,87 142.5,90 144,95 140,92 136,95 137.5,90 133,87 138.5,87"
            fill={color} opacity="0.45" transform="scale(0.55) translate(116 75)" />
        </g>
        <path d="M105 178 L38 210 L172 210 Z" fill="url(#beamFade)" />
        <circle cx="105" cy="185" r="2.2" fill={color} opacity="0.35" />
        <circle cx="105" cy="196" r="1.4" fill={color} opacity="0.20" />
      </svg>
    </div>
  );
}

/* ── Small card in the grid ── */
function CertificateCard({ cert, onClick }: { cert: typeof MOCK_CERTIFICATES[0]; onClick: () => void }) {
  const cfg = CERT_CONFIG[cert.type];
  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: 'linear-gradient(160deg, #062a1e 0%, #0a3d2e 45%, #0d4a38 100%)',
        border: `1px solid ${cfg.accentColor}38`,
        boxShadow: `0 4px 24px rgba(6,42,30,0.30)`,
      }}
      onClick={onClick}
    >
      <div style={{
        position:'absolute', top:'-40px', right:'-40px', width:120, height:120, borderRadius:'50%',
        background:`radial-gradient(circle, ${cfg.accentColor}22, transparent 70%)`,
        pointerEvents:'none',
      }} />
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`radial-gradient(circle, ${cfg.accentColor}15 1px, transparent 1px)`,
        backgroundSize:'18px 18px', opacity:0.55,
      }} />
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-4">
          <span className="text-2xl">{cfg.badge}</span>
          <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
            style={{ background:`${cfg.accentColor}20`, color:cfg.accentColor, border:`1px solid ${cfg.accentColor}40` }}>
            {cfg.label}
          </span>
        </div>
        <h3 className="text-lg font-black mb-0.5" style={{ color:'#ffffff' }}>{cert.mentorName}</h3>
        <p className="text-xs mb-3" style={{ color:'rgba(255,255,255,0.50)' }}>{cert.college} • {cert.major}</p>
        <div className="flex gap-3 text-xs mb-4" style={{ color:'rgba(255,255,255,0.55)' }}>
          <span className="flex items-center gap-1"><Clock size={11}/>{cert.sessionsCount} جلسة</span>
          <span className="flex items-center gap-1"><Users size={11}/>{cert.totalStudents} طالب</span>
          <span className="flex items-center gap-1"><Star size={11} className="fill-amber-300 text-amber-300"/>{cert.averageRating}</span>
        </div>
        <div className="pt-3" style={{ borderTop:`1px solid ${cfg.accentColor}22` }}>
          <span className="text-xs" style={{ color:'rgba(255,255,255,0.35)' }}>{cert.issuedAt}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Full certificate preview ── */
function CertificatePreview({ cert }: { cert: typeof MOCK_CERTIFICATES[0] }) {
  const cfg = CERT_CONFIG[cert.type];
  return (
    <div className="relative overflow-hidden rounded-3xl w-full"
      style={{
        background:'linear-gradient(180deg, #041d15 0%, #062a1e 25%, #0a3d2e 60%, #0d4a38 100%)',
        border:`1px solid ${cfg.accentColor}40`,
        boxShadow:`0 32px 80px rgba(4,29,21,0.70), 0 0 0 1px ${cfg.accentColor}18`,
      }}>
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`radial-gradient(circle, ${cfg.accentColor}18 1px, transparent 1px)`,
        backgroundSize:'18px 18px', opacity:0.65,
      }} />
      <div style={{
        position:'absolute', top:'-70px', right:'-70px', width:220, height:220, borderRadius:'50%',
        background:`radial-gradient(circle, ${cfg.accentColor}28, transparent 70%)`,
        pointerEvents:'none',
      }} />
      <div style={{
        position:'absolute', bottom:'-50px', left:'-50px', width:160, height:160, borderRadius:'50%',
        background:`radial-gradient(circle, ${cfg.accentColor}20, transparent 70%)`,
        pointerEvents:'none',
      }} />
      <div className="relative z-10 px-8 pt-7 pb-8 text-center">
        {/* University logos */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <img src="/Zumra/PSAULOGO.png" alt="PSAU"
            style={{ height:34, width:'auto', filter:'brightness(0) invert(1)', opacity:0.75 }} />
          <div style={{ width:1, height:26, background:'rgba(255,255,255,0.18)' }} />
          <img src="/Zumra/Logo.jfif" alt="زمرة"
            style={{ height:34, width:34, borderRadius:8, objectFit:'contain', border:`1.5px solid ${cfg.accentColor}50` }} />
        </div>

        {/* زمرة calligraphy */}
        <div className="mb-5">
          <p className="text-4xl font-black" style={{
            color: cfg.accentColor,
            textShadow:`0 0 28px ${cfg.accentColor}70`,
            fontFamily:"'Forma DJR Arabic Display','Cairo',serif",
            letterSpacing:'-1px', lineHeight:1.1,
          }}>زُمرة</p>
        </div>

        {/* Ornamental divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,transparent,${cfg.accentColor}55)` }} />
          <span style={{ color:cfg.accentColor, fontSize:12, opacity:0.75 }}>✦</span>
          <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,${cfg.accentColor}55,transparent)` }} />
        </div>

        {/* Certificate type badge */}
        <p className="text-xs font-bold tracking-widest mb-3"
          style={{ color:`${cfg.accentColor}cc`, letterSpacing:'0.20em' }}>
          {cfg.label}
        </p>

        {/* Intro line */}
        <p className="text-sm leading-loose mb-3" style={{ color:'rgba(255,255,255,0.72)' }}>
          يسرنا أن نتقدم بأسمى آيات التهنئة والتقدير إلى
        </p>

        {/* RECIPIENT NAME */}
        <div className="mb-3 py-3 px-5 rounded-2xl"
          style={{ background:`${cfg.accentColor}14`, border:`1px solid ${cfg.accentColor}38` }}>
          <p className="text-2xl font-black" style={{ color:'#ffffff', textShadow:'0 2px 14px rgba(0,0,0,0.45)', lineHeight:1.35 }}>
            {cert.mentorName}
          </p>
          <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.52)' }}>{cert.college}</p>
          <p className="text-xs" style={{ color:'rgba(255,255,255,0.42)' }}>{cert.major}</p>
        </div>

        {/* Achievement line */}
        <p className="text-sm leading-loose mb-5" style={{ color:'rgba(255,255,255,0.72)' }}>
          {cfg.subtitle}
          <br/>
          <span style={{ color:'rgba(255,255,255,0.55)', fontSize:12 }}>
            وذلك لما أبداه من تفانٍ في تقديم المساعدة لزملائه وإرشادهم أكاديمياً،
            وتطوّعه بسخاء وقته وجهده في خدمة مجتمعه الجامعي.
            <br/>مع تمنياتنا له بالتوفيق والنجاح في مسيرته العلمية والمهنية.
          </span>
        </p>

        {/* Ornamental divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,transparent,${cfg.accentColor}40)` }} />
          <span style={{ color:cfg.accentColor, fontSize:12, opacity:0.50 }}>✦</span>
          <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg,${cfg.accentColor}40,transparent)` }} />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-5">
          <div className="text-center">
            <p className="text-xl font-black" style={{ color:cfg.accentColor }}>{cert.sessionsCount}</p>
            <p className="text-xs" style={{ color:'rgba(255,255,255,0.45)' }}>جلسة</p>
          </div>
          <div className="w-px h-8" style={{ background:`${cfg.accentColor}30` }} />
          <div className="text-center">
            <p className="text-xl font-black" style={{ color:cfg.accentColor }}>{cert.totalStudents}</p>
            <p className="text-xs" style={{ color:'rgba(255,255,255,0.45)' }}>طالب</p>
          </div>
          <div className="w-px h-8" style={{ background:`${cfg.accentColor}30` }} />
          <div className="text-center">
            <p className="text-xl font-black" style={{ color:cfg.accentColor }}>{cert.averageRating}</p>
            <p className="text-xs" style={{ color:'rgba(255,255,255,0.45)' }}>تقييم ☆</p>
          </div>
        </div>

        {/* Meta */}
        <p className="text-xs mb-0.5" style={{ color:'rgba(255,255,255,0.38)' }}>العام الدراسي: {cert.academicYear}</p>
        <p className="text-xs mb-0.5" style={{ color:'rgba(255,255,255,0.38)' }}>{cert.issuedBy}</p>
        <p className="text-xs" style={{ color:'rgba(255,255,255,0.28)' }}>تاريخ الإصدار: {cert.issuedAt}</p>

        {/* Signature */}
        <div className="mt-5 pt-4" style={{ borderTop:`1px solid ${cfg.accentColor}25` }}>
          <div className="w-24 mx-auto border-b mb-1.5" style={{ borderColor:`${cfg.accentColor}55` }} />
          <p className="text-xs font-medium" style={{ color:'rgba(255,255,255,0.45)' }}>{cert.issuedBy}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function CertificatesPage() {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState<typeof MOCK_CERTIFICATES[0] | null>(null);

  const myCerts = currentUser?.role === 'admin'
    ? MOCK_CERTIFICATES
    : MOCK_CERTIFICATES.filter(c => c.mentorId === currentUser?.id);

  return (
    <Layout>
      {/* Page header */}
      <div className="rounded-3xl mb-6 relative overflow-hidden"
        style={{ background:'linear-gradient(160deg,#041d15 0%,#062a1e 40%,#0a3d2e 100%)', padding:'28px 28px 22px' }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'radial-gradient(circle, rgba(93,184,158,0.14) 1px, transparent 1px)',
          backgroundSize:'18px 18px', opacity:0.7,
        }} />
        <div style={{
          position:'absolute', top:'-50px', right:'-50px', width:180, height:180, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(93,184,158,0.20), transparent 70%)',
          pointerEvents:'none',
        }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background:'rgba(93,184,158,0.18)', border:'1px solid rgba(93,184,158,0.35)' }}>
            <Award size={24} style={{ color:'#5db89e' }} />
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color:'rgba(255,255,255,0.50)' }}>منصة زمرة</p>
            <h1 className="text-2xl font-black text-white">
              {currentUser?.role === 'admin' ? 'إدارة الشهادات' : 'شهاداتي'}
            </h1>
            <p className="text-sm mt-0.5" style={{ color:'rgba(255,255,255,0.60)' }}>
              {currentUser?.role === 'admin'
                ? `${myCerts.length} شهادة صادرة حتى الآن`
                : 'شهاداتك الرسمية المُصدرة تلقائياً بناءً على أدائك'}
            </p>
          </div>
        </div>
      </div>

      {myCerts.length === 0 ? (
        <div className="text-center py-20">
          <Award size={64} className="mx-auto mb-4" style={{ color:'rgba(13,40,37,0.20)' }} />
          <h3 className="text-lg font-bold text-[#0d2825] mb-2">لا توجد شهادات بعد</h3>
          <p className="text-sm" style={{ color:'rgba(13,40,37,0.50)' }}>أكمل 5 جلسات إرشادية للحصول على أولى شهاداتك</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {myCerts.map(cert => (
              <CertificateCard key={cert.id} cert={cert} onClick={() => setSelected(cert)} />
            ))}
          </div>
          {currentUser?.role === 'admin' && (
            <button className="w-full py-4 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 hover:border-[rgba(13,148,136,0.30)] hover:text-[#0d9488]"
              style={{ border:'2px dashed rgba(13,148,136,0.18)', color:'rgba(13,40,37,0.45)' }}>
              <Award size={20}/> إصدار شهادة يدوي
            </button>
          )}
        </>
      )}

      {/* Full certificate modal */}
      {selected && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 overflow-y-auto"
          style={{ background:'rgba(4,29,21,0.75)', backdropFilter:'blur(10px)' }}
          onClick={() => setSelected(null)}>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="max-w-sm w-full rounded-3xl" onClick={e => e.stopPropagation()}>
              <CertificatePreview cert={selected} />
              <div className="flex gap-2 mt-3">
                <button onClick={() => setSelected(null)}
                  className="py-3 px-4 rounded-xl text-sm font-medium transition-all"
                  style={{ background:'rgba(255,255,255,0.90)', border:'1px solid rgba(13,148,136,0.16)', color:'rgba(13,40,37,0.70)' }}>
                  إغلاق
                </button>
                <button
                  onClick={() => printCertificate(selected)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white hover:brightness-110 transition-all"
                  style={{ background:'linear-gradient(135deg,#062a1e,#0d9488)' }}>
                  <Printer size={15}/> طباعة / حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
