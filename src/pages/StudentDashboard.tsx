import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Calendar, Star, ArrowLeft,
  Clock, Award, Flame, Download, ArrowRight, Heart, Users,
} from 'lucide-react';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { MOCK_MENTORS } from '../mockData';
import { generateStudentReport } from '../utils/reportGenerator';
import type { User } from '../types';

const CARD: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(13,148,136,0.14)',
  borderRadius: 20,
  boxShadow: '0 4px 20px rgba(13,148,136,0.08), 0 1px 4px rgba(0,0,0,0.04)',
};

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  confirmed: { color: '#059669', background: 'rgba(5,150,105,0.10)', border: '1px solid rgba(5,150,105,0.20)' },
  pending:   { color: '#d97706', background: 'rgba(217,119,6,0.10)',  border: '1px solid rgba(217,119,6,0.20)'  },
  completed: { color: '#0d9488', background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.16)' },
};
const STATUS_LABEL: Record<string, string> = {
  confirmed: 'مؤكدة', pending: 'بانتظار', completed: 'مكتملة',
};

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { sessions, libraryItems, favoriteMentorIds, toggleFavoriteMentor } = useApp();

  const mySessions        = sessions.filter(s => s.studentId === currentUser?.id);
  const upcomingSessions  = mySessions.filter(s => s.status === 'confirmed' || s.status === 'pending');
  const completedSessions = mySessions.filter(s => s.status === 'completed');
  const nextSession       = upcomingSessions[0] ?? null;
  const favMentors        = MOCK_MENTORS.filter(m => favoriteMentorIds.includes(m.id));
  const displayMentors    = favMentors.length > 0 ? favMentors : MOCK_MENTORS.slice(0, 3);
  const streakDays        = 7;

  return (
    <Layout wide>

      {/* ══ HEADER ══ */}
      <div className="flex items-center justify-between mb-8 pt-2">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: '#0d9488' }}>
            أهلاً بعودتك، {currentUser?.name?.split(' ')[0]} 👋
          </p>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl"
              style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.14)' }}>
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-black text-amber-400">{currentUser?.points}</span>
              <span className="text-xs" style={{ color: 'rgba(13,40,37,0.40)' }}>نقطة</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl"
              style={{ background: 'rgba(251,113,20,0.07)', border: '1px solid rgba(251,113,20,0.14)' }}>
              <Flame size={12} className="text-orange-400" />
              <span className="text-sm font-black text-orange-400">{streakDays}</span>
              <span className="text-xs" style={{ color: 'rgba(13,40,37,0.40)' }}>يوم متواصل</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            const u = currentUser as User;
            generateStudentReport({
              name: u?.name ?? '',
              college: u?.college ?? '',
              major: u?.major ?? '',
              year: u?.year ?? 0,
              points: u?.points ?? 0,
              badges: (u?.badges ?? []).map(b => ({ name: b.name, type: b.type })),
              sessions: mySessions.map(s => ({
                date: s.date, mentorName: s.mentorName, subject: s.subject,
                topic: s.topic, status: s.status, duration: s.duration, rating: s.rating,
              })),
              libraryItems: libraryItems.slice(0, 5).map(l => ({
                title: l.title, subject: l.subject, type: l.type, uploadedByName: l.uploadedByName,
              })),
            });
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff', boxShadow: '0 4px 14px rgba(13,148,136,0.20)' }}>
          <Download size={14} /> تقريري PDF
        </button>
      </div>

      {/* ══ QUICK STATS ROW ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'جلساتي', value: mySessions.length, color: '#0d9488', bg: 'rgba(13,148,136,0.08)' },
          { label: 'مكتملة', value: completedSessions.length, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
          { label: 'قادمة', value: upcomingSessions.length, color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
          { label: 'شاراتي', value: currentUser?.badges?.length ?? 0, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.10)', boxShadow: '0 2px 10px rgba(13,148,136,0.05)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg, color: s.color }}>
              <span className="text-base font-black">{s.value}</span>
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgba(13,40,37,0.60)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ══ MAIN GRID ══ */}
      <div className="grid lg:grid-cols-5 gap-4">

        {/* ── LEFT (3/5) ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Next Session */}
          <div className="p-6" style={CARD}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-[#0d2825]">الجلسة القادمة</h2>
              <Link to="/sessions" className="text-xs font-medium flex items-center gap-1" style={{ color: '#0d9488' }}>
                عرض الجدول <ArrowLeft size={11} />
              </Link>
            </div>

            {!nextSession ? (
              <div className="text-center py-10 rounded-2xl" style={{ border: '1px dashed rgba(13,148,136,0.15)' }}>
                <Calendar size={32} className="mx-auto mb-3" style={{ color: 'rgba(13,40,37,0.20)' }} />
                <p className="text-sm mb-4" style={{ color: 'rgba(13,40,37,0.40)' }}>لا توجد جلسات قادمة</p>
                <Link to="/booking" className="btn-apple inline-flex items-center gap-1.5 text-xs">
                  <Calendar size={12} /> احجز جلسة الآن
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: nextSession.type === 'online' ? 'rgba(96,165,250,0.12)' : 'rgba(5,150,105,0.10)', color: nextSession.type === 'online' ? '#60a5fa' : '#059669', border: `1px solid ${nextSession.type === 'online' ? 'rgba(96,165,250,0.20)' : 'rgba(5,150,105,0.20)'}` }}>
                    {nextSession.type === 'online' ? '🎥 أونلاين' : '🏫 حضوري'}
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(13,40,37,0.40)' }}>
                    {nextSession.date} · {nextSession.startTime}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex-1 text-right">
                    <Avatar name={nextSession.mentorName ?? ''} className="w-14 h-14 rounded-2xl border border-[rgba(13,148,136,0.14)] text-base mr-auto mb-2" />
                    <p className="text-base font-bold text-[#0d2825]">{nextSession.mentorName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.40)' }}>المرشد</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,rgba(13,148,136,0.12),rgba(13,148,136,0.06))', border: '1.5px solid rgba(13,148,136,0.22)', color: '#0d9488', boxShadow: '0 2px 8px rgba(13,148,136,0.10)' }}>
                    <Users size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <Avatar name={currentUser?.name ?? ''} className="w-14 h-14 rounded-2xl border border-[rgba(13,148,136,0.14)] text-base ml-auto mb-2" />
                    <p className="text-base font-bold text-[#0d2825]">{currentUser?.name?.split(' ')[0]}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.40)' }}>أنت</p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.10)' }}>
                  <div>
                    <p className="text-sm font-semibold text-[#0d2825]">{nextSession.subject}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.40)' }}>{nextSession.duration} دقيقة</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium" style={STATUS_STYLE[nextSession.status]}>
                    {STATUS_LABEL[nextSession.status]}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* CTA Banner */}
          <div className="p-6 rounded-2xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 60%, #0d9488 100%)', border: '1px solid rgba(124,58,237,0.30)' }}>
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>لا تتأخر</p>
                <h3 className="text-lg font-black text-white">احجز جلستك القادمة</h3>
              </div>
              <Link to="/booking"
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.28)' }}>
                احجز الآن <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT (2/5) ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Favourite / Top Mentors */}
          <div className="p-5" style={CARD}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <p className="label-section">
                  {favMentors.length > 0 ? 'مرشدي المفضلون' : 'أبرز المرشدين'}
                </p>
                {favMentors.length > 0 && (
                  <Heart size={12} className="fill-red-500 text-red-500" />
                )}
              </div>
              <Link to="/booking" className="text-xs font-medium" style={{ color: '#0d9488' }}>
                {favMentors.length === 0 ? 'اختر مفضلة' : 'تعديل'}
              </Link>
            </div>

            {favMentors.length === 0 && (
              <p className="text-xs mb-3 leading-relaxed" style={{ color: 'rgba(13,40,37,0.45)' }}>
                اضغط ❤️ على أي مرشد في صفحة الحجز لإضافته هنا
              </p>
            )}

            <div className="space-y-3">
              {displayMentors.map((m, i) => (
                <div key={m.id} className="rounded-2xl p-3 transition-all"
                  style={{ background: 'rgba(13,148,136,0.03)', border: '1px solid rgba(13,148,136,0.09)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    {favMentors.length > 0
                      ? <Heart size={11} className="fill-red-400 text-red-400 flex-shrink-0" />
                      : <span className="text-xs w-4 text-center flex-shrink-0 font-bold"
                          style={{ color: i === 0 ? '#fbbf24' : 'rgba(13,40,37,0.30)' }}>{i + 1}</span>
                    }
                    <Avatar name={m.name} className="w-9 h-9 rounded-xl text-xs flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-[#0d2825] truncate font-semibold">
                          {m.name.split(' ').slice(0, 2).join(' ')}
                        </p>
                        {/* Availability badge */}
                        <span className="flex-shrink-0 flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={m.available
                            ? { background: 'rgba(5,150,105,0.10)', color: '#059669' }
                            : { background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
                          <span className="w-1.5 h-1.5 rounded-full"
                            style={{ background: m.available ? '#059669' : '#dc2626' }} />
                          {m.available ? 'متاح' : 'مشغول'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={9} className="fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-medium" style={{ color: 'rgba(13,40,37,0.55)' }}>{m.rating}</span>
                        <span className="text-[11px]" style={{ color: 'rgba(13,40,37,0.30)' }}>·</span>
                        <span className="text-[11px]" style={{ color: 'rgba(13,40,37,0.45)' }}>{m.totalSessions} جلسة</span>
                      </div>
                    </div>
                    <button onClick={() => toggleFavoriteMentor(m.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
                      style={{ background: favoriteMentorIds.includes(m.id) ? 'rgba(239,68,68,0.10)' : 'rgba(13,148,136,0.06)' }}>
                      <Heart size={10} className={favoriteMentorIds.includes(m.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                    </button>
                  </div>

                  {/* Subjects + book button */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex gap-1 flex-wrap">
                      {m.subjects.slice(0, 2).map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-md"
                          style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488' }}>
                          {s.length > 12 ? s.slice(0, 12) + '…' : s}
                        </span>
                      ))}
                    </div>
                    {m.available ? (
                      <Link to="/booking"
                        className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all hover:brightness-110"
                        style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }}>
                        احجز
                      </Link>
                    ) : (
                      <span className="flex-shrink-0 text-[10px] px-2 py-1 rounded-lg"
                        style={{ background: 'rgba(220,38,38,0.06)', color: 'rgba(220,38,38,0.70)' }}>
                        غير متاح حالياً
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Library shortcut */}
          <div className="p-5" style={CARD}>
            <div className="flex items-center justify-between mb-4">
              <p className="label-section">المكتبة</p>
              <Link to="/library" className="text-xs font-medium" style={{ color: '#0d9488' }}>عرض الكل</Link>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(8,145,178,0.06)', border: '1px solid rgba(8,145,178,0.12)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(8,145,178,0.12)', color: '#0891b2' }}>
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: '#0891b2' }}>{libraryItems.length}</p>
                <p className="text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>ملف متاح</p>
              </div>
            </div>
            <Link to="/library"
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-105"
              style={{ background: 'rgba(8,145,178,0.08)', color: '#0891b2', border: '1px solid rgba(8,145,178,0.16)' }}>
              <BookOpen size={14} /> تصفّح المكتبة
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}
