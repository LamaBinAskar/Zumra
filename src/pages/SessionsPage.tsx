import React, { useState, useMemo } from 'react';
import { Clock, Video, MapPin, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const CARD = { background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)', borderRadius: 20, boxShadow: '0 4px 20px rgba(13,148,136,0.08)' };

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  confirmed: { label: 'مؤكدة',           color: '#059669', bg: 'rgba(5,150,105,0.09)',   border: 'rgba(5,150,105,0.18)',   icon: <CheckCircle size={13} /> },
  pending:   { label: 'بانتظار التأكيد', color: '#d97706', bg: 'rgba(217,119,6,0.09)',   border: 'rgba(217,119,6,0.18)',   icon: <AlertCircle size={13} /> },
  completed: { label: 'مكتملة',          color: '#0d9488', bg: 'rgba(13,148,136,0.08)',  border: 'rgba(13,148,136,0.16)',  icon: <CheckCircle size={13} /> },
  cancelled: { label: 'ملغاة',           color: '#dc2626', bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.16)',   icon: <XCircle size={13} /> },
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl leading-none transition-colors">
          <span style={{ color: n <= (hover || value) ? '#fbbf24' : 'rgba(13,40,37,0.15)' }}>&#9733;</span>
        </button>
      ))}
    </div>
  );
}

export default function SessionsPage() {
  const { currentUser } = useAuth();
  const { sessions, cancelSession, confirmSession, rateSession } = useApp();

  const [activeTab,     setActiveTab]     = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [localRating,   setLocalRating]   = useState<Record<string, number>>({});
  const [localFeedback, setLocalFeedback] = useState<Record<string, string>>({});
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [submitted,     setSubmitted]     = useState<Record<string, boolean>>({});

  const mySessions = sessions.filter(s =>
    s.studentId === currentUser?.id || s.mentorId === currentUser?.id
  );

  const filtered = useMemo(() => {
    if (activeTab === 'upcoming')  return mySessions.filter(s => s.status === 'confirmed' || s.status === 'pending');
    if (activeTab === 'completed') return mySessions.filter(s => s.status === 'completed');
    return mySessions;
  }, [mySessions, activeTab]);

  const upcomingCount  = mySessions.filter(s => s.status === 'confirmed' || s.status === 'pending').length;
  const completedCount = mySessions.filter(s => s.status === 'completed').length;

  function handleRate(sessionId: string) {
    const r = localRating[sessionId];
    if (!r) return;
    rateSession(sessionId, r, localFeedback[sessionId] ?? '');
    setSubmitted(prev => ({ ...prev, [sessionId]: true }));
  }

  return (
    <Layout>
      <style>{`
        @keyframes floatOrbA {
          0%, 100% { transform: translate(25%, -25%) scale(1);    opacity: 0.13; }
          50%       { transform: translate(25%, -18%) scale(1.18); opacity: 0.22; }
        }
        @keyframes floatOrbB {
          0%, 100% { transform: translate(-20%, 30%) scale(1);    opacity: 0.09; }
          50%       { transform: translate(-20%, 22%) scale(1.12); opacity: 0.16; }
        }
        @keyframes sessionIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerLine {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .session-card {
          animation: sessionIn 0.38s ease both;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .session-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 10px 36px rgba(13,148,136,0.16) !important;
        }
        .session-card:nth-child(2) { animation-delay: 0.06s; }
        .session-card:nth-child(3) { animation-delay: 0.12s; }
        .session-card:nth-child(4) { animation-delay: 0.18s; }
        .session-card:nth-child(5) { animation-delay: 0.24s; }
      `}</style>

      {/* Dark header banner */}
      <div className="rounded-3xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d2825 0%, #0f4a42 50%, #0d9488 100%)' }}>
        {/* Animated orbs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)', animation: 'floatOrbA 5s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)', animation: 'floatOrbB 6.5s ease-in-out infinite' }} />
        <div className="relative">
          <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>منصة زمرة</p>
          <h1 className="text-2xl font-black text-white mb-1">جلساتي</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{mySessions.length} جلسة إجمالاً</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl p-1 w-fit mb-6" style={{ background: 'rgba(13,148,136,0.07)' }}>
        {([
          ['upcoming',  `القادمة (${upcomingCount})`],
          ['completed', `المكتملة (${completedCount})`],
          ['all', 'الكل'],
        ] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all`}
            style={activeTab === tab
              ? { background: '#ffffff', color: '#0d9488', boxShadow: '0 1px 4px rgba(13,148,136,0.12)' }
              : { color: 'rgba(13,40,37,0.50)' }}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Calendar size={48} className="mx-auto mb-4" style={{ color: 'rgba(13,40,37,0.20)' }} />
          <p className="text-sm" style={{ color: 'rgba(13,40,37,0.45)' }}>لا توجد جلسات في هذا القسم</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const conf      = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.pending;
            const isStudent = s.studentId === currentUser?.id;
            const isMentor  = s.mentorId  === currentUser?.id;
            const otherName = isStudent ? s.mentorName : s.studentName;
            const otherRole = isStudent ? 'المرشد' : 'الطالب';
            const isActive  = s.status === 'confirmed' || s.status === 'pending';

            return (
              <div key={s.id} className="p-5 session-card" style={CARD}>
                <div className="flex flex-wrap items-start gap-4">
                  {/* Type icon */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: s.type === 'online' ? 'rgba(96,165,250,0.10)' : 'rgba(5,150,105,0.10)' }}>
                    {s.type === 'online' ? '💻' : '📍'}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title + status badge */}
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <div>
                        <h3 className="font-bold text-[#0d2825]">{s.topic}</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.50)' }}>{s.subject}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0"
                        style={{ background: conf.bg, border: `1px solid ${conf.border}`, color: conf.color }}>
                        {conf.icon} {conf.label}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mt-2 text-xs" style={{ color: 'rgba(13,40,37,0.50)' }}>
                      <span><span style={{ color: 'rgba(13,40,37,0.70)' }}>{otherRole}:</span> {otherName}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {s.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {s.startTime} · {s.duration} دقيقة</span>
                      <span className="flex items-center gap-1">
                        {s.type === 'online'
                          ? <><Video size={11} /> عن بُعد</>
                          : <><MapPin size={11} /> {s.location ?? 'حضوري'}</>}
                      </span>
                    </div>

                    {/* ── Active session actions ── */}
                    {isActive && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {/* Mentor: confirm pending */}
                        {isMentor && s.status === 'pending' && (
                          <button onClick={() => confirmSession(s.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                            style={{ background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff' }}>
                            <CheckCircle size={13} /> تأكيد الجلسة
                          </button>
                        )}

                        {/* Online join link */}
                        {s.type === 'online' && s.meetingLink && (
                          <a href={s.meetingLink} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                            style={{ background: 'rgba(96,165,250,0.10)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.20)' }}>
                            <Video size={13} /> انضم للجلسة
                          </a>
                        )}

                        {/* Cancel with confirm step */}
                        {cancelConfirm === s.id ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => { cancelSession(s.id); setCancelConfirm(null); }}
                              className="px-3 py-2 rounded-xl text-xs font-semibold"
                              style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)' }}>
                              تأكيد الإلغاء
                            </button>
                            <button onClick={() => setCancelConfirm(null)}
                              className="px-3 py-2 rounded-xl text-xs"
                              style={{ background: 'rgba(13,148,136,0.06)', color: 'rgba(13,40,37,0.50)' }}>
                              لا
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setCancelConfirm(s.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all"
                            style={{ background: 'rgba(13,148,136,0.05)', color: 'rgba(13,40,37,0.55)', border: '1px solid rgba(13,148,136,0.12)' }}>
                            <XCircle size={13} /> إلغاء الجلسة
                          </button>
                        )}
                      </div>
                    )}

                    {/* ── Student rates completed session ── */}
                    {s.status === 'completed' && isStudent && (
                      <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.10)' }}>
                        {s.rating || submitted[s.id] ? (
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(n => (
                                <span key={n} className="text-lg" style={{ color: n <= (s.rating ?? localRating[s.id] ?? 0) ? '#fbbf24' : 'rgba(13,40,37,0.15)' }}>&#9733;</span>
                              ))}
                            </div>
                            <p className="text-xs" style={{ color: '#059669' }}>شكراً على تقييمك ✓</p>
                            {s.feedback && <p className="text-xs italic" style={{ color: 'rgba(13,40,37,0.45)' }}>"{s.feedback}"</p>}
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-semibold mb-2.5" style={{ color: 'rgba(13,40,37,0.75)' }}>قيّم هذه الجلسة</p>
                            <StarRating value={localRating[s.id] ?? 0} onChange={v => setLocalRating(r => ({ ...r, [s.id]: v }))} />
                            <textarea
                              value={localFeedback[s.id] ?? ''}
                              onChange={e => setLocalFeedback(f => ({ ...f, [s.id]: e.target.value }))}
                              placeholder="اكتب رأيك عن الجلسة (اختياري)..."
                              rows={2}
                              className="mt-2.5 w-full px-3 py-2 rounded-xl text-xs outline-none resize-none"
                              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
                            />
                            <button
                              onClick={() => handleRate(s.id)}
                              disabled={!localRating[s.id]}
                              className="mt-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 hover:brightness-110"
                              style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }}>
                              إرسال التقييم &#9733;
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Mentor sees student rating ── */}
                    {s.status === 'completed' && !isStudent && s.rating && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <p className="text-xs" style={{ color: 'rgba(13,40,37,0.55)' }}>تقييم الطالب:</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} style={{ color: n <= s.rating! ? '#fbbf24' : 'rgba(13,40,37,0.15)' }}>&#9733;</span>
                          ))}
                        </div>
                        {s.feedback && <p className="text-xs italic" style={{ color: 'rgba(13,40,37,0.45)' }}>"{s.feedback}"</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
