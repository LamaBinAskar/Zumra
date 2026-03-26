import React, { useState, useMemo } from 'react';
import { Search, Star, Clock, Users, MapPin, Video, X, CheckCircle, Heart } from 'lucide-react';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { MOCK_MENTORS, SUBJECTS_BY_MAJOR, MAJORS, getLevelLabel } from '../mockData';
import type { Mentor, Session } from '../types';

interface BookingModalProps {
  mentor: Mentor;
  onClose: () => void;
  onBook: (session: Session) => void;
  studentId: string;
  studentName: string;
}

function BookingModal({ mentor, onClose, onBook, studentId, studentName }: BookingModalProps) {
  const [form, setForm] = useState({
    subject: mentor.subjects[0] ?? '',
    topic: '',
    date: '',
    startTime: '10:00',
    duration: 60,
    type: 'online' as 'online' | 'in-person',
    notes: '',
  });
  const [booked, setBooked] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.topic) return;
    const session: Session = {
      id: `s-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      studentId,
      studentName,
      subject: form.subject,
      topic: form.topic,
      date: form.date,
      startTime: form.startTime,
      duration: form.duration,
      type: form.type,
      status: 'pending',
      notes: form.notes,
    };
    onBook(session);
    setBooked(true);
  }

  if (booked) {
    return (
      <div className="fixed top-16 inset-x-0 bottom-0 bg-[rgba(13,40,37,0.40)] flex items-center justify-center z-50 p-4 overflow-y-auto" style={{ backdropFilter: 'blur(8px)' }}>
        <div className="rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center" style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.16)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(5,150,105,0.10)' }}>
            <CheckCircle size={32} style={{ color: '#059669' }} />
          </div>
          <h3 className="text-xl font-black text-[#0d2825] mb-2">تم إرسال طلب الجلسة!</h3>
          <p className="text-sm mb-2" style={{ color: 'rgba(13,40,37,0.55)' }}>
            سيتم إشعارك بتأكيد الجلسة مع <strong style={{ color: '#0d2825' }}>{mentor.name}</strong>
          </p>
          <p className="text-xs mb-6" style={{ color: 'rgba(13,40,37,0.45)' }}>ستصلك رسالة تأكيد على بريدك الجامعي</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-white hover:brightness-110 transition-all"
            style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
            ممتاز!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 bg-[rgba(13,40,37,0.40)] flex items-center justify-center z-50 p-4 overflow-y-auto" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.16)' }}>
        <div className="flex items-center justify-between p-6 sticky top-0 rounded-t-3xl"
          style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: '#ffffff' }}>
          <h3 className="text-lg font-bold text-[#0d2825]">حجز جلسة مع {mentor.name}</h3>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors hover:bg-[rgba(13,148,136,0.06)]"
            style={{ color: 'rgba(13,40,37,0.50)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mentor mini-profile */}
        <div className="p-6" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: '#f7fcfb' }}>
          <div className="flex items-center gap-3">
            <Avatar name={mentor.name} className="w-12 h-12 rounded-xl text-lg" />
            <div>
              <p className="font-bold text-[#0d2825]">{mentor.name}</p>
              <div className="flex items-center gap-3 text-xs mt-1" style={{ color: 'rgba(13,40,37,0.55)' }}>
                <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{mentor.rating}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{mentor.totalSessions} جلسة</span>
                <span className="flex items-center gap-1"><Users size={11} />{mentor.totalStudents} طالب</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.70)' }}>المادة</label>
            <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}>
              {mentor.subjects.map(s => <option key={s} value={s} style={{ background: '#ffffff', color: '#0d2825' }}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.70)' }}>موضوع الجلسة *</label>
            <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
              placeholder="مثال: شرح الأشجار الثنائية" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.70)' }}>التاريخ *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.70)' }}>الوقت</label>
              <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.70)' }}>المدة</label>
            <div className="flex gap-2">
              {[30, 45, 60, 90].map(d => (
                <button key={d} type="button"
                  onClick={() => setForm(f => ({ ...f, duration: d }))}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={form.duration === d
                    ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }
                    : { background: 'rgba(13,148,136,0.07)', color: 'rgba(13,40,37,0.65)', border: '1px solid rgba(13,148,136,0.12)' }}>
                  {d} دقيقة
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.70)' }}>نوع الجلسة</label>
            <div className="flex gap-3">
              {(['online', 'in-person'] as const).filter(t => mentor.sessionTypes.includes(t)).map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                  style={form.type === t
                    ? { border: '2px solid #0d9488', background: 'rgba(13,148,136,0.08)', color: '#0d9488' }
                    : { border: '1px solid rgba(13,148,136,0.16)', color: 'rgba(13,40,37,0.60)', background: '#f7fcfb' }}>
                  {t === 'online' ? <><Video size={16} />عن بُعد</> : <><MapPin size={16} />حضوري</>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.70)' }}>ملاحظات (اختياري)</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2} className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none"
              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
              placeholder="أي تفاصيل إضافية للمرشد..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(13,148,136,0.06)]"
              style={{ border: '1px solid rgba(13,148,136,0.16)', color: 'rgba(13,40,37,0.65)' }}>
              إلغاء
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:brightness-110 transition-all"
              style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
              إرسال طلب الحجز
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { currentUser } = useAuth();
  const { bookSession, favoriteMentorIds, toggleFavoriteMentor } = useApp();
  const [search, setSearch] = useState('');
  const [majorFilter, setMajorFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'online' | 'in-person'>('all');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  // المواد المتاحة بناءً على التخصص المختار
  const availableSubjects = useMemo(() => {
    if (majorFilter === 'all') return Object.values(SUBJECTS_BY_MAJOR).flat();
    return SUBJECTS_BY_MAJOR[majorFilter] ?? [];
  }, [majorFilter]);

  const filtered = useMemo(() => {
    let mentors = MOCK_MENTORS;
    if (search) mentors = mentors.filter(m =>
      m.name.includes(search) || m.subjects.some(s => s.includes(search)) || m.bio.includes(search)
    );
    if (majorFilter !== 'all') mentors = mentors.filter(m => m.major === majorFilter);
    if (subjectFilter !== 'all') mentors = mentors.filter(m => m.subjects.includes(subjectFilter));
    if (typeFilter !== 'all') mentors = mentors.filter(m => m.sessionTypes.includes(typeFilter));
    return [...mentors].sort((a, b) => b.rating - a.rating);
  }, [search, majorFilter, subjectFilter, typeFilter]);

  return (
    <Layout>
      {/* Dark header banner */}
      <div className="rounded-3xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d2825 0%, #0f4a42 50%, #0d9488 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)', transform: 'translate(20%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #0d9488, transparent)', transform: 'translate(-20%, 30%)' }} />
        <div className="relative">
          <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>منصة زمرة</p>
          <h1 className="text-2xl font-black text-white mb-1">ابحث عن مرشد</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>اختر المرشد المناسب لمادتك وجدولك</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4 mb-6" style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)', boxShadow: '0 2px 10px rgba(13,148,136,0.06)' }}>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(13,40,37,0.40)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو المادة..."
              className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
          </div>

          {/* فلتر التخصص */}
          <select
            value={majorFilter}
            onChange={e => { setMajorFilter(e.target.value); setSubjectFilter('all'); }}
            className="rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
          >
            <option value="all" style={{ background: '#ffffff', color: '#0d2825' }}>كل التخصصات</option>
            {MAJORS.map(m => <option key={m} value={m} style={{ background: '#ffffff', color: '#0d2825' }}>{m}</option>)}
          </select>

          {/* فلتر المادة — مُجمَّع حسب التخصص */}
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
          >
            <option value="all" style={{ background: '#ffffff', color: '#0d2825' }}>كل المواد</option>
            {majorFilter === 'all'
              ? Object.entries(SUBJECTS_BY_MAJOR).map(([group, subjects]) => (
                  <optgroup key={group} label={group}>
                    {subjects.map(s => <option key={s} value={s} style={{ background: '#ffffff', color: '#0d2825' }}>{s}</option>)}
                  </optgroup>
                ))
              : availableSubjects.map(s => <option key={s} value={s} style={{ background: '#ffffff', color: '#0d2825' }}>{s}</option>)
            }
          </select>

          <div className="flex gap-1">
            {[['all', 'الكل'], ['online', 'عن بُعد'], ['in-person', 'حضوري']].map(([val, label]) => (
              <button key={val}
                onClick={() => setTypeFilter(val as any)}
                className="px-3 py-2.5 rounded-xl text-xs font-medium transition-colors"
                style={typeFilter === val
                  ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }
                  : { background: 'rgba(13,148,136,0.07)', color: 'rgba(13,40,37,0.60)', border: '1px solid rgba(13,148,136,0.12)' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: 'rgba(13,40,37,0.55)' }}>{filtered.length} مرشد متاح</p>

      {/* Mentors grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((mentor, idx) => (
          <div key={mentor.id}
            className="group rounded-2xl hover:-translate-y-1.5 transition-all overflow-hidden relative"
            style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)', boxShadow: '0 4px 20px rgba(13,148,136,0.08)' }}>

            {/* Top gradient bar */}
            <div className="h-1.5 w-full" style={{ background: mentor.available ? 'linear-gradient(90deg, #0d9488, #22d3ee)' : 'rgba(13,148,136,0.15)' }} />

            {/* "Most active" badge */}
            {idx === 0 && (
              <div className="absolute top-4 left-16 text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm z-10"
                style={{ background: '#d97706' }}>
                الأكثر نشاطاً
              </div>
            )}

            {/* Favorite heart button */}
            <button
              onClick={e => { e.stopPropagation(); toggleFavoriteMentor(mentor.id); }}
              className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={favoriteMentorIds.includes(mentor.id)
                ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.30)' }
                : { background: 'rgba(13,148,136,0.07)', border: '1px solid rgba(13,148,136,0.14)' }}
              title={favoriteMentorIds.includes(mentor.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}>
              <Heart
                size={14}
                className={favoriteMentorIds.includes(mentor.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
            </button>

            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="relative flex-shrink-0">
                  <Avatar name={mentor.name} className="w-14 h-14 rounded-xl text-xl border-2 border-[rgba(13,148,136,0.12)] group-hover:border-[rgba(13,148,136,0.25)] transition-colors" />
                  {/* Pulsing dot for availability */}
                  {mentor.available && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full animate-pulse-ring"
                      style={{ background: '#059669' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-4">
                  <h3 className="font-black text-[#0d2825] text-sm leading-tight truncate">{mentor.name}</h3>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(13,40,37,0.55)' }}>{mentor.major}</p>
                  <p className="text-xs font-medium" style={{ color: '#0d9488' }}>{getLevelLabel(mentor.year)}</p>
                </div>
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                  <div className="flex items-center gap-0.5">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black" style={{ color: 'rgba(13,40,37,0.90)' }}>{mentor.rating}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={mentor.available
                      ? { background: 'rgba(5,150,105,0.10)', color: '#059669', border: '1px solid rgba(5,150,105,0.18)' }
                      : { background: 'rgba(13,148,136,0.06)', color: 'rgba(13,40,37,0.40)', border: '1px solid rgba(13,148,136,0.10)' }}>
                    {mentor.available ? 'متاح' : 'مشغول'}
                  </span>
                </div>
              </div>

              <p className="text-xs mb-3 line-clamp-2 leading-relaxed" style={{ color: 'rgba(13,40,37,0.55)' }}>{mentor.bio}</p>

              {/* Subjects — colored chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {mentor.subjects.slice(0, 3).map((s, si) => {
                  const chipColors = [
                    { bg: 'rgba(13,148,136,0.08)', color: '#0d9488', border: 'rgba(13,148,136,0.16)' },
                    { bg: 'rgba(37,168,157,0.08)', color: '#0891b2', border: 'rgba(37,168,157,0.16)' },
                    { bg: 'rgba(54,191,180,0.08)', color: '#22d3ee', border: 'rgba(54,191,180,0.16)' },
                  ];
                  const c = chipColors[si % 3];
                  return (
                    <span key={s} className="text-xs rounded-full px-2.5 py-0.5 font-medium"
                      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{s}</span>
                  );
                })}
                {mentor.subjects.length > 3 && (
                  <span className="text-xs rounded-full px-2.5 py-0.5" style={{ background: 'rgba(13,148,136,0.05)', color: 'rgba(13,40,37,0.50)' }}>+{mentor.subjects.length - 3} أخرى</span>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mb-4 text-xs pt-3"
                style={{ borderTop: '1px solid rgba(13,148,136,0.10)', color: 'rgba(13,40,37,0.50)' }}>
                <span className="flex items-center gap-1"><Users size={11} />{mentor.totalStudents} طالب</span>
                <span className="flex items-center gap-1"><Clock size={11} />{mentor.totalSessions} جلسة</span>
                {mentor.sessionTypes.includes('online') && <span className="flex items-center gap-1"><Video size={11} />أونلاين</span>}
                {mentor.sessionTypes.includes('in-person') && <span className="flex items-center gap-1"><MapPin size={11} />حضوري</span>}
              </div>

              <button
                disabled={!mentor.available}
                onClick={() => setSelectedMentor(mentor)}
                className="w-full py-3 rounded-xl text-sm font-black transition-all"
                style={mentor.available
                  ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff', boxShadow: '0 4px 14px rgba(13,148,136,0.20)' }
                  : { background: 'rgba(13,148,136,0.08)', color: 'rgba(13,40,37,0.35)', cursor: 'not-allowed' }}>
                {mentor.available ? 'احجز جلسة الآن' : 'غير متاح حالياً'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto mb-4" style={{ color: 'rgba(13,40,37,0.25)' }} />
          <p style={{ color: 'rgba(13,40,37,0.45)' }}>لا توجد مرشدون يطابقون بحثك</p>
        </div>
      )}

      {selectedMentor && (
        <BookingModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onBook={(session) => { bookSession(session); }}
          studentId={currentUser?.id ?? 'u1'}
          studentName={currentUser?.name ?? ''}
        />
      )}
    </Layout>
  );
}
