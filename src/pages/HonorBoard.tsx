import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, Users, BookOpen, Medal, Sparkles, LogIn } from 'lucide-react';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_MENTORS } from '../mockData';

const BADGE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  bronze:   { bg: 'rgba(180,83,9,0.08)',    color: '#b45309', border: 'rgba(180,83,9,0.18)'    },
  silver:   { bg: 'rgba(100,116,139,0.08)', color: '#475569', border: 'rgba(100,116,139,0.18)' },
  gold:     { bg: 'rgba(217,119,6,0.10)',   color: '#d97706', border: 'rgba(217,119,6,0.20)'   },
  platinum: { bg: 'rgba(13,148,136,0.10)',  color: '#0d9488', border: 'rgba(13,148,136,0.20)'  },
};

const CARD_BASE = { background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)', boxShadow: '0 2px 10px rgba(13,148,136,0.06)' };

/* Decorative star row */
function StarRow({ count, color, filled = true }: { count: number; color: string; filled?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-0.5 mt-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={10} style={{ color, fill: filled ? color : 'none' }} />
      ))}
    </div>
  );
}

/* Crown SVG for 1st place */
function Crown({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 20" width={40} height={25} xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,20 8,4 16,14 24,0 32,20" fill={color} opacity="0.9" />
      <rect x="0" y="18" width="32" height="3" rx="1.5" fill={color} />
      <circle cx="0" cy="20" r="2.5" fill={color} />
      <circle cx="16" cy="14" r="2.5" fill={color} />
      <circle cx="32" cy="20" r="2.5" fill={color} />
    </svg>
  );
}

/* Floating sparkle dots */
function Sparkle({ style }: { style: React.CSSProperties }) {
  return <div className="absolute w-1.5 h-1.5 rounded-full animate-pulse" style={style} />;
}

export default function HonorBoard() {
  const { currentUser } = useAuth();
  const [sortBy, setSortBy] = useState<'points' | 'sessions' | 'rating'>('points');
  const [filter, setFilter] = useState('all');

  const sorted = [...MOCK_MENTORS].sort((a, b) => {
    if (sortBy === 'sessions') return b.totalSessions - a.totalSessions;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.points - a.points;
  });

  const colleges = ['all', ...Array.from(new Set(MOCK_MENTORS.map(m => m.college)))];
  const filtered = filter === 'all' ? sorted : sorted.filter(m => m.college === filter);

  return (
    <Layout>
      {/* Guest banner */}
      {!currentUser && (
        <div className="rounded-2xl px-5 py-3 mb-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: 'linear-gradient(135deg,#0d2825,#0f4a42)', border: '1px solid rgba(13,148,136,0.3)' }}>
          <div className="flex items-center gap-3">
            <Sparkles size={18} style={{ color: '#0d9488' }} />
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
              أنت تتصفح كـ <strong style={{ color: '#0d9488' }}>ضيف</strong> — سجّل حساباً لتنضم لسباق المرشدين وتكسب نقاطك
            </span>
          </div>
          <Link to="/auth"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
            <LogIn size={15} />
            تسجيل الدخول
          </Link>
        </div>
      )}

      {/* ══ HERO HEADER ══ */}
      <div className="relative text-center mb-12 py-8 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d2825 0%, #0f4a42 60%, #0d9488 100%)' }}>

        {/* Background sparkles */}
        <Sparkle style={{ top: '15%', left: '8%',  background: '#fbbf24', opacity: 0.6 }} />
        <Sparkle style={{ top: '30%', left: '20%', background: '#f59e0b', opacity: 0.4 }} />
        <Sparkle style={{ top: '60%', left: '12%', background: '#fbbf24', opacity: 0.5 }} />
        <Sparkle style={{ top: '20%', right: '10%', background: '#fbbf24', opacity: 0.7 }} />
        <Sparkle style={{ top: '50%', right: '18%', background: '#f59e0b', opacity: 0.4 }} />
        <Sparkle style={{ top: '70%', right: '8%',  background: '#fbbf24', opacity: 0.5 }} />
        <Sparkle style={{ top: '10%', left: '50%', background: '#22d3ee', opacity: 0.3 }} />
        <Sparkle style={{ top: '80%', left: '40%', background: '#22d3ee', opacity: 0.3 }} />

        {/* Stars top decoration */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[14, 10, 18, 10, 14].map((s, i) => (
            <Star key={i} size={s} className="text-amber-400 fill-amber-400" style={{ opacity: i === 2 ? 1 : 0.55 }} />
          ))}
        </div>

        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'rgba(217,119,6,0.25)', border: '2px solid rgba(217,119,6,0.50)' }}>
          <Trophy size={28} className="text-amber-400" />
        </div>

        <h1 className="text-3xl font-black text-white mb-1">لوحة الشرف</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
          تكريم المرشدين المتميزين بناءً على جهودهم وتأثيرهم
        </p>

        {/* Bottom star row */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Star key={i} size={i === 3 ? 16 : i === 2 || i === 4 ? 12 : 8}
              className="text-amber-400 fill-amber-400"
              style={{ opacity: i === 3 ? 1 : i === 2 || i === 4 ? 0.7 : 0.35 }} />
          ))}
        </div>
      </div>

      {/* ══ TOP 3 PODIUM ══ */}
      <div className="relative mb-12">
        {/* Background glow */}
        <div className="absolute inset-0 rounded-3xl opacity-30"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(217,119,6,0.15), transparent 60%)' }} />

        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto relative">

          {/* ── 2nd Place ── */}
          <div className="flex flex-col items-center pt-10">
            {filtered[1] && (
              <div className="text-center w-full">
                <StarRow count={2} color="#94a3b8" />
                <div className="relative inline-block mt-2">
                  <div className="absolute -inset-1 rounded-2xl opacity-30 blur-sm"
                    style={{ background: '#94a3b8' }} />
                  <div style={{ border: '3px solid #94a3b8', borderRadius: 16, position: 'relative' }}>
                    <Avatar name={filtered[1].name} className="w-16 h-16 rounded-2xl text-2xl" />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg,#64748b,#94a3b8)' }}>2</span>
                </div>
                <p className="font-bold text-[#0d2825] text-sm mt-4 truncate px-1">{filtered[1].name.split(' ')[0]}</p>
                <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>{filtered[1].points} نقطة</p>
                {/* Podium block */}
                <div className="mt-3 h-20 rounded-t-2xl w-full relative overflow-hidden"
                  style={{ background: 'linear-gradient(to top, #64748b, #94a3b8)' }}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 11px)' }} />
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <Medal size={16} className="text-white mx-auto opacity-60" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── 1st Place ── */}
          <div className="flex flex-col items-center">
            {filtered[0] && (
              <div className="text-center w-full">
                {/* Crown */}
                <div className="flex justify-center mb-1">
                  <Crown color="#d97706" />
                </div>
                <StarRow count={3} color="#f59e0b" />
                <div className="relative inline-block mt-2">
                  <div className="absolute -inset-2 rounded-2xl opacity-40 blur-md"
                    style={{ background: '#d97706' }} />
                  <div style={{ border: '4px solid #d97706', borderRadius: 18, position: 'relative',
                    boxShadow: '0 0 20px rgba(217,119,6,0.35)' }}>
                    <Avatar name={filtered[0].name} className="w-20 h-20 rounded-2xl text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', boxShadow: '0 2px 8px rgba(217,119,6,0.5)' }}>
                    <Star size={12} className="text-white fill-white" />
                  </div>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full text-white text-sm font-black flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)' }}>1</span>
                </div>
                <p className="font-black text-[#0d2825] mt-5 truncate px-1">{filtered[0].name.split(' ')[0]}</p>
                <p className="text-sm font-bold" style={{ color: '#d97706' }}>{filtered[0].points} نقطة</p>
                {/* Podium block */}
                <div className="mt-3 h-28 rounded-t-2xl w-full relative overflow-hidden"
                  style={{ background: 'linear-gradient(to top, #b45309, #d97706, #f59e0b)' }}>
                  <div className="absolute inset-0 opacity-25"
                    style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 11px)' }} />
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <Trophy size={18} className="text-white mx-auto opacity-70" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── 3rd Place ── */}
          <div className="flex flex-col items-center pt-14">
            {filtered[2] && (
              <div className="text-center w-full">
                <StarRow count={1} color="#22d3ee" />
                <div className="relative inline-block mt-2">
                  <div className="absolute -inset-1 rounded-xl opacity-25 blur-sm"
                    style={{ background: '#22d3ee' }} />
                  <div style={{ border: '3px solid #22d3ee', borderRadius: 14, position: 'relative' }}>
                    <Avatar name={filtered[2].name} className="w-14 h-14 rounded-xl text-xl" />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shadow"
                    style={{ background: 'linear-gradient(135deg,#0e7490,#22d3ee)' }}>3</span>
                </div>
                <p className="font-bold text-[#0d2825] text-sm mt-4 truncate px-1">{filtered[2].name.split(' ')[0]}</p>
                <p className="text-xs font-medium" style={{ color: '#22d3ee' }}>{filtered[2].points} نقطة</p>
                {/* Podium block */}
                <div className="mt-3 h-14 rounded-t-2xl w-full relative overflow-hidden"
                  style={{ background: 'linear-gradient(to top, #0e7490, #22d3ee)' }}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 11px)' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Base platform */}
        <div className="max-w-2xl mx-auto h-4 rounded-b-2xl"
          style={{ background: 'linear-gradient(90deg, #64748b, #d97706, #22d3ee)', opacity: 0.5 }} />
      </div>

      {/* ══ CONTROLS ══ */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(13,148,136,0.07)' }}>
          {[
            ['points', 'النقاط'],
            ['sessions', 'الجلسات'],
            ['rating', 'التقييم'],
          ].map(([val, label]) => (
            <button key={val} onClick={() => setSortBy(val as any)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={sortBy === val
                ? { background: '#ffffff', color: '#0d9488', boxShadow: '0 1px 4px rgba(13,148,136,0.12)' }
                : { color: 'rgba(13,40,37,0.55)' }}>
              {label}
            </button>
          ))}
        </div>

        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm focus:outline-none"
          style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}>
          {colleges.map(c => <option key={c} value={c} style={{ background: '#ffffff', color: '#0d2825' }}>{c === 'all' ? 'كل الكليات' : c}</option>)}
        </select>
      </div>

      {/* ══ FULL LEADERBOARD ══ */}
      <div className="space-y-2.5">
        {filtered.map((mentor, index) => {
          const isTop3 = index < 3;
          const topStyle = index === 0
            ? { background: 'linear-gradient(135deg, rgba(217,119,6,0.06), rgba(251,191,36,0.04))', border: '1px solid rgba(217,119,6,0.22)' }
            : index === 1
            ? { background: 'rgba(148,163,184,0.07)', border: '1px solid rgba(148,163,184,0.22)' }
            : { background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.22)' };

          const rankColor = index === 0 ? '#d97706' : index === 1 ? '#94a3b8' : index === 2 ? '#22d3ee' : 'rgba(13,40,37,0.28)';

          return (
            <div key={mentor.id}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5"
              style={isTop3 ? topStyle : CARD_BASE}>

              {/* Rank */}
              <div className="w-9 flex-shrink-0 text-center">
                {index < 3 ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-black text-lg leading-none" style={{ color: rankColor }}>{index + 1}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 3 - index }).map((_, i) => (
                        <Star key={i} size={7} style={{ color: rankColor, fill: rankColor }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="font-bold text-base" style={{ color: 'rgba(13,40,37,0.28)' }}>{index + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <div style={{ border: `2px solid ${rankColor}`, borderRadius: 12 }}>
                <Avatar name={mentor.name} className="w-12 h-12 rounded-xl" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[#0d2825]">{mentor.name}</h3>
                  {mentor.badges.slice(0, 2).map(b => {
                    const bc = BADGE_COLORS[b.type] ?? BADGE_COLORS.bronze;
                    return (
                      <span key={b.id} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: bc.bg, color: bc.color, border: `1px solid ${bc.border}` }}>
                        {b.icon} {b.name}
                      </span>
                    );
                  })}
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(13,40,37,0.55)' }}>
                  {mentor.college} • {mentor.major}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {mentor.subjects.slice(0, 3).map(s => (
                    <span key={s} className="text-xs rounded-full px-2 py-0.5"
                      style={{ background: 'rgba(13,148,136,0.08)', color: 'rgba(13,40,37,0.65)' }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-5 flex-shrink-0 text-sm">
                <div className="text-center">
                  <div className="flex items-center gap-1 font-black" style={{ color: '#d97706' }}>
                    <Trophy size={14} /> {mentor.points}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>نقطة</div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="flex items-center gap-1 font-bold" style={{ color: '#60a5fa' }}>
                    <Users size={12} /> {mentor.totalSessions}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>جلسة</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star size={12} className="fill-amber-400" /> {mentor.rating}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>تقييم</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══ BADGES LEGEND ══ */}
      <div className="mt-10 rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d2825 0%, #0f4a42 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Decorative stars */}
        <div className="absolute top-4 right-6 flex gap-1.5">
          {[6, 10, 6].map((s, i) => <Star key={i} size={s} className="text-amber-400 fill-amber-400 opacity-40" />)}
        </div>
        <div className="absolute bottom-4 left-6 flex gap-1.5">
          {[6, 8, 6].map((s, i) => <Star key={i} size={s} className="text-amber-400 fill-amber-400 opacity-25" />)}
        </div>

        <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
          <Sparkles size={18} className="text-amber-400" />
          مستويات الشارات
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { type: 'bronze',   label: 'برونزية',  desc: '5–20 جلسة',   icon: '🥉', stars: 1 },
            { type: 'silver',   label: 'فضية',     desc: '21–50 جلسة',  icon: '🥈', stars: 2 },
            { type: 'gold',     label: 'ذهبية',    desc: '51–100 جلسة', icon: '🥇', stars: 3 },
            { type: 'platinum', label: 'بلاتينية', desc: '+100 جلسة',   icon: '💎', stars: 4 },
          ].map(b => {
            const bc = BADGE_COLORS[b.type];
            return (
              <div key={b.type} className="p-4 rounded-2xl text-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${bc.border}` }}>
                <div className="text-2xl mb-1">{b.icon}</div>
                <p className="font-bold text-sm" style={{ color: bc.color }}>{b.label}</p>
                <div className="flex justify-center gap-0.5 my-1">
                  {Array.from({ length: b.stars }).map((_, i) => (
                    <Star key={i} size={9} style={{ color: bc.color, fill: bc.color }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </Layout>
  );
}
