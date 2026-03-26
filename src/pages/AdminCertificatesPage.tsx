import React, { useState, useMemo } from 'react';
import { Award, Search, Star, Users, Clock, X, Printer } from 'lucide-react';
import { printCertificate } from '../utils/certificatePrinter';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
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

/* ── Full certificate preview card ── */
function CertificatePreview({ cert }: { cert: typeof MOCK_CERTIFICATES[0] }) {
  const cfg = CERT_CONFIG[cert.type];
  return (
    <div className="relative overflow-hidden rounded-3xl w-full"
      style={{
        background: 'linear-gradient(180deg, #041d15 0%, #062a1e 25%, #0a3d2e 60%, #0d4a38 100%)',
        border: `1px solid ${cfg.accentColor}40`,
        boxShadow: `0 32px 80px rgba(4,29,21,0.70), 0 0 0 1px ${cfg.accentColor}18`,
      }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, ${cfg.accentColor}18 1px, transparent 1px)`,
        backgroundSize: '18px 18px', opacity: 0.65,
      }} />
      <div style={{ position: 'absolute', top: '-70px', right: '-70px', width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${cfg.accentColor}28, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${cfg.accentColor}20, transparent 70%)`, pointerEvents: 'none' }} />

      <div className="relative z-10 px-8 pt-7 pb-8 text-center">
        {/* University logos */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src="/Zumra/PSAULOGO.png" alt="PSAU"
            style={{ height: 34, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.75 }} />
          <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.18)' }} />
          <img src="/Zumra/Logo.jfif" alt="زمرة"
            style={{ height: 34, width: 34, borderRadius: 8, objectFit: 'contain', border: `1.5px solid ${cfg.accentColor}50` }} />
        </div>

        {/* زمرة calligraphy */}
        <div className="mb-5">
          <p className="text-4xl font-black" style={{
            color: cfg.accentColor,
            textShadow: `0 0 28px ${cfg.accentColor}70`,
            fontFamily: "'Forma DJR Arabic Display','Cairo',serif",
            letterSpacing: '-1px', lineHeight: 1.1,
          }}>زُمرة</p>
        </div>

        {/* Ornamental divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,transparent,${cfg.accentColor}55)` }} />
          <span style={{ color: cfg.accentColor, fontSize: 12, opacity: 0.75 }}>✦</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${cfg.accentColor}55,transparent)` }} />
        </div>

        {/* Certificate type */}
        <p className="text-xs font-bold mb-3" style={{ color: `${cfg.accentColor}cc`, letterSpacing: '0.20em' }}>
          {cfg.label}
        </p>

        {/* Intro line */}
        <p className="text-sm leading-loose mb-3" style={{ color: 'rgba(255,255,255,0.72)' }}>
          يسرنا أن نتقدم بأسمى آيات التهنئة والتقدير إلى
        </p>

        {/* RECIPIENT NAME */}
        <div className="mb-3 py-3 px-5 rounded-2xl"
          style={{ background: `${cfg.accentColor}14`, border: `1px solid ${cfg.accentColor}38` }}>
          <p className="text-2xl font-black" style={{ color: '#ffffff', textShadow: '0 2px 14px rgba(0,0,0,0.45)', lineHeight: 1.35 }}>
            {cert.mentorName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.52)' }}>{cert.college}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.42)' }}>{cert.major}</p>
        </div>

        <p className="text-sm leading-loose mb-5" style={{ color: 'rgba(255,255,255,0.72)' }}>
          {cfg.subtitle}
          <br />
          <span style={{ color: 'rgba(255,255,255,0.50)', fontSize: 12 }}>
            سائلاً الله أن يتقبل منه صالح الأعمال ويعيده علينا بالخير واليمن والبركات
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,transparent,${cfg.accentColor}40)` }} />
          <span style={{ color: cfg.accentColor, fontSize: 12, opacity: 0.50 }}>✦</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg,${cfg.accentColor}40,transparent)` }} />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-5">
          <div className="text-center">
            <p className="text-xl font-black" style={{ color: cfg.accentColor }}>{cert.sessionsCount}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>جلسة</p>
          </div>
          <div className="w-px h-8" style={{ background: `${cfg.accentColor}30` }} />
          <div className="text-center">
            <p className="text-xl font-black" style={{ color: cfg.accentColor }}>{cert.totalStudents}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>طالب</p>
          </div>
          <div className="w-px h-8" style={{ background: `${cfg.accentColor}30` }} />
          <div className="text-center">
            <p className="text-xl font-black" style={{ color: cfg.accentColor }}>{cert.averageRating}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>تقييم ☆</p>
          </div>
        </div>

        <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>العام الدراسي: {cert.academicYear}</p>
        <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{cert.issuedBy}</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>تاريخ الإصدار: {cert.issuedAt}</p>

        <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${cfg.accentColor}25` }}>
          <div className="w-24 mx-auto border-b mb-1.5" style={{ borderColor: `${cfg.accentColor}50` }} />
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{cert.issuedBy}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Row card ── */
function CertRow({ cert, onClick }: { cert: typeof MOCK_CERTIFICATES[0]; onClick: () => void }) {
  const cfg = CERT_CONFIG[cert.type];
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5"
      style={{
        background: 'linear-gradient(135deg,#062a1e 0%,#0a3d2e 100%)',
        border: `1px solid ${cfg.accentColor}28`,
        boxShadow: `0 2px 12px rgba(6,42,30,0.20)`,
      }}
      onClick={onClick}
    >
      <Avatar name={cert.mentorName} className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-white truncate">{cert.mentorName}</p>
        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.48)' }}>{cert.major} • {cert.college}</p>
      </div>
      <span className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0"
        style={{ background: `${cfg.accentColor}20`, color: cfg.accentColor, border: `1px solid ${cfg.accentColor}40` }}>
        {cfg.badge} {cfg.label}
      </span>
      <div className="hidden md:flex items-center gap-4 text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }}>
        <span className="flex items-center gap-1"><Clock size={11} />{cert.sessionsCount}</span>
        <span className="flex items-center gap-1"><Users size={11} />{cert.totalStudents}</span>
        <span className="flex items-center gap-1"><Star size={11} className="fill-amber-300 text-amber-300" />{cert.averageRating}</span>
      </div>
      <span className="hidden lg:block text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{cert.issuedAt}</span>
    </div>
  );
}

/* ── Page ── */
export default function AdminCertificatesPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'outstanding' | 'excellence' | 'appreciation'>('all');
  const [selected, setSelected] = useState<typeof MOCK_CERTIFICATES[0] | null>(null);

  const filtered = useMemo(() => {
    return MOCK_CERTIFICATES.filter(c => {
      const matchType = filterType === 'all' || c.type === filterType;
      const matchSearch = !search || c.mentorName.includes(search) || c.major.includes(search);
      return matchType && matchSearch;
    });
  }, [search, filterType]);

  const counts = {
    all: MOCK_CERTIFICATES.length,
    outstanding: MOCK_CERTIFICATES.filter(c => c.type === 'outstanding').length,
    excellence: MOCK_CERTIFICATES.filter(c => c.type === 'excellence').length,
    appreciation: MOCK_CERTIFICATES.filter(c => c.type === 'appreciation').length,
  };

  return (
    <Layout>
      {/* Header */}
      <div className="rounded-3xl mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#041d15 0%,#062a1e 40%,#0a3d2e 100%)', padding: '28px 28px 22px' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(93,184,158,0.14) 1px, transparent 1px)',
          backgroundSize: '18px 18px', opacity: 0.7,
        }} />
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(93,184,158,0.20), transparent 70%)', pointerEvents: 'none' }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(93,184,158,0.18)', border: '1px solid rgba(93,184,158,0.35)' }}>
            <Award size={24} style={{ color: '#5db89e' }} />
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>لوحة الإدارة</p>
            <h1 className="text-2xl font-black text-white">إدارة الشهادات</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
              {counts.all} شهادة صادرة — {counts.outstanding} تميز · {counts.excellence} تفوق · {counts.appreciation} تقدير
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {([
          { type: 'outstanding',  color: '#f0c040', label: 'تميز استثنائي', count: counts.outstanding },
          { type: 'excellence',   color: '#5db89e', label: 'تفوق',          count: counts.excellence  },
          { type: 'appreciation', color: '#8dd4be', label: 'شكر وتقدير',   count: counts.appreciation},
        ] as const).map(s => (
          <div key={s.type} className="rounded-2xl p-4 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#062a1e,#0a3d2e)', border: `1px solid ${s.color}30` }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${s.color}22, transparent 70%)`, pointerEvents: 'none' }} />
            <p className="text-3xl font-black relative z-10" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs mt-1 relative z-10" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(13,40,37,0.40)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ابحث باسم المرشد أو التخصص..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2">
              <X size={13} style={{ color: 'rgba(13,40,37,0.35)' }} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl flex-shrink-0"
          style={{ background: 'rgba(13,148,136,0.07)', border: '1px solid rgba(13,148,136,0.12)' }}>
          {([
            { key: 'all',          label: 'الكل' },
            { key: 'outstanding',  label: '🥇 تميز' },
            { key: 'excellence',   label: '🥈 تفوق' },
            { key: 'appreciation', label: '🥉 تقدير' },
          ] as const).map(f => (
            <button key={f.key} onClick={() => setFilterType(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={filterType === f.key
                ? { background: '#0a3d2e', color: '#5db89e', boxShadow: '0 2px 8px rgba(6,42,30,0.30)' }
                : { color: 'rgba(13,40,37,0.55)' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Award size={48} className="mx-auto mb-3" style={{ color: 'rgba(13,40,37,0.20)' }} />
          <p className="text-sm font-medium" style={{ color: 'rgba(13,40,37,0.45)' }}>لا توجد نتائج</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(cert => (
            <CertRow key={cert.id} cert={cert} onClick={() => setSelected(cert)} />
          ))}
        </div>
      )}

      {/* Full certificate modal */}
      {selected && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 overflow-y-auto"
          style={{ background: 'rgba(4,29,21,0.75)', backdropFilter: 'blur(10px)' }}
          onClick={() => setSelected(null)}>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <CertificatePreview cert={selected} />
              <div className="flex gap-2 mt-3">
                <button onClick={() => setSelected(null)}
                  className="py-3 px-4 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(13,148,136,0.16)', color: 'rgba(13,40,37,0.70)' }}>
                  إغلاق
                </button>
                <button
                  onClick={() => printCertificate(selected)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white hover:brightness-110 transition-all"
                  style={{ background: 'linear-gradient(135deg,#062a1e,#0d9488)' }}>
                  <Printer size={15} /> طباعة / حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
