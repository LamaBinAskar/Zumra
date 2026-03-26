import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, Users, Award, BookOpen, Clock, TrendingUp,
  ArrowLeft, CheckCircle, Upload, ChevronLeft, Download,
  Video, Link2, Calendar, Plus, X, Check, ExternalLink, Trash2,
  FileText, AlertCircle, CheckCircle2, XCircle, Clock3, ChevronDown
} from 'lucide-react';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { MOCK_CERTIFICATES } from '../mockData';
import { generateMentorReport } from '../utils/reportGenerator';
import type { Mentor, LibraryItem, LibraryItemType, Certificate } from '../types';

const CARD = { background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)', boxShadow: '0 4px 20px rgba(13,148,136,0.08)' };
const CARD_INNER = { background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.09)' };

interface Meeting {
  id: string;
  title: string;
  description: string;
  platform: 'zoom' | 'teams' | 'meet' | 'other';
  link: string;
  date: string;
  time: string;
  createdAt: string;
}

const PLATFORM_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  zoom:  { label: 'Zoom',         color: '#60a5fa', icon: '🎥' },
  teams: { label: 'MS Teams',     color: '#7c6cf1', icon: '💼' },
  meet:  { label: 'Google Meet',  color: '#059669', icon: '📹' },
  other: { label: 'رابط آخر',    color: '#0d9488', icon: '🔗' },
};

export default function MentorDashboard() {
  const { currentUser } = useAuth();
  const { sessions, libraryItems, addLibraryItem, confirmSession, cancelSession } = useApp();
  const mentor = currentUser as Mentor;

  const mySessions = sessions.filter(s => s.mentorId === currentUser?.id);
  const upcomingSessions = mySessions.filter(s => s.status === 'confirmed' || s.status === 'pending');
  const completedSessions = mySessions.filter(s => s.status === 'completed');
  const myCerts = MOCK_CERTIFICATES.filter(c => c.mentorId === currentUser?.id);
  const myLibraryItems = libraryItems.filter(l => l.uploadedById === currentUser?.id);

  const avgRating = completedSessions.filter(s => s.rating).length
    ? (completedSessions.filter(s => s.rating).reduce((a, s) => a + (s.rating ?? 0), 0) / completedSessions.filter(s => s.rating).length).toFixed(1)
    : mentor?.rating ?? '—';

  const certTypeLabel: Record<string, string> = {
    outstanding: 'شهادة تميز استثنائي',
    excellence: 'شهادة تفوق',
    appreciation: 'شهادة شكر وتقدير',
  };

  // Meeting state
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetingSaved, setMeetingSaved] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: '', description: '', platform: 'zoom' as Meeting['platform'],
    link: '', date: '', time: '',
  });

  // Upload state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadSaved, setUploadSaved] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '', description: '', subject: '', type: 'summary' as LibraryItemType,
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Certificate preview state
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  function handleUpload() {
    if (!uploadForm.title.trim() || !uploadForm.subject.trim()) return;
    const fileUrl = uploadFile ? uploadFile.name : '#';
    const newItem: LibraryItem = {
      id: `lib-${Date.now()}`,
      title: uploadForm.title.trim(),
      description: uploadForm.description.trim(),
      subject: uploadForm.subject.trim(),
      courseName: uploadForm.subject.trim(),
      semester: 'الفصل الثاني',
      academicYear: '1446',
      type: uploadForm.type,
      fileUrl,
      uploadedById: currentUser?.id ?? '',
      uploadedByName: currentUser?.name ?? '',
      uploadedAt: new Date().toISOString().split('T')[0],
      downloads: 0,
      views: 0,
      rating: 0,
      ratingsCount: 0,
      tags: [uploadForm.subject],
      college: mentor?.college ?? '',
      approvalStatus: 'pending',
    };
    addLibraryItem(newItem);
    setUploadForm({ title: '', description: '', subject: '', type: 'summary' });
    setUploadFile(null);
    setShowUploadForm(false);
    setUploadSaved(true);
    setTimeout(() => setUploadSaved(false), 3000);
  }

  function handleCreateMeeting() {
    if (!meetingForm.title.trim() || !meetingForm.link.trim()) return;
    const newMeeting: Meeting = {
      id: `mtg-${Date.now()}`,
      ...meetingForm,
      createdAt: new Date().toISOString(),
    };
    setMeetings(prev => [newMeeting, ...prev]);
    setMeetingForm({ title: '', description: '', platform: 'zoom', link: '', date: '', time: '' });
    setShowMeetingForm(false);
    setMeetingSaved(true);
    setTimeout(() => setMeetingSaved(false), 2500);
  }

  return (
    <Layout>
      {/* GREETING */}
      <div className="flex items-center gap-4 mb-8 pt-2">
        <Avatar name={mentor?.name ?? ''} className="w-12 h-12 rounded-2xl border border-[rgba(13,148,136,0.14)] text-lg flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[#0d2825] tracking-tight">
            أهلاً، {mentor?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm mt-0.5 truncate" style={{ color: 'rgba(13,40,37,0.50)' }}>
            {mentor?.college}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {mentor?.subjects?.slice(0, 3).map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(13,148,136,0.10)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.18)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-lg font-black text-amber-400">{mentor?.points}</span>
            <span className="text-xs" style={{ color: 'rgba(13,40,37,0.40)' }}>نقطة</span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={mentor?.available
            ? { background: 'rgba(5,150,105,0.10)', border: '1px solid rgba(5,150,105,0.18)', color: '#059669' }
            : { background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.12)', color: 'rgba(13,40,37,0.40)' }}>
            {mentor?.available ? '● متاح' : '● غير متاح'}
          </span>
          <button
            onClick={() => generateMentorReport({
              name: mentor?.name ?? '',
              college: mentor?.college ?? '',
              major: mentor?.major ?? '',
              subjects: mentor?.subjects ?? [],
              rating: mentor?.rating ?? 0,
              totalSessions: mentor?.totalSessions ?? 0,
              totalStudents: mentor?.totalStudents ?? 0,
              points: mentor?.points ?? 0,
              available: mentor?.available ?? false,
              sessions: mySessions.map(s => ({
                date: s.date, studentName: s.studentName, subject: s.subject,
                topic: s.topic, status: s.status, duration: s.duration,
              })),
              certificates: myCerts.map(c => ({
                type: c.type, sessionsCount: c.sessionsCount,
                averageRating: c.averageRating, issuedAt: c.issuedAt,
              })),
              libraryItems: myLibraryItems.map(l => ({
                title: l.title, subject: l.subject, type: l.type, downloads: l.downloads,
              })),
            })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }}>
            <Download size={12} /> تقريري PDF
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: <Users size={17} />,    value: mentor?.totalStudents ?? 0, label: 'طالب أرشدتهم',   accent: '#0d9488', bg: 'rgba(13,148,136,0.10)'  },
          { icon: <Clock size={17} />,    value: mentor?.totalSessions ?? 0, label: 'إجمالي الجلسات', accent: '#059669', bg: 'rgba(5,150,105,0.10)'   },
          { icon: <Star size={17} />,     value: avgRating,                  label: 'متوسط التقييم',  accent: '#d97706', bg: 'rgba(217,119,6,0.10)'   },
          { icon: <BookOpen size={17} />, value: myLibraryItems.length,      label: 'ملفات رفعتها',   accent: '#0891b2', bg: 'rgba(37,168,157,0.10)'  },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-5 transition-all" style={CARD}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-4" style={{ background: s.bg, color: s.accent }}>
              {s.icon}
            </div>
            <div className="text-2xl font-black mb-0.5" style={{ color: s.accent }}>{s.value}</div>
            <div className="label-section">{s.label}</div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">

          {/* Upcoming Sessions */}
          <div className="rounded-2xl p-6" style={CARD}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-[#0d2825]">الجلسات القادمة</h2>
              <Link to="/sessions" className="text-xs font-medium flex items-center gap-1" style={{ color: '#0d9488' }}>
                كل الجلسات <ArrowLeft size={11} />
              </Link>
            </div>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-10 rounded-xl" style={{ border: '1px dashed rgba(13,148,136,0.15)' }}>
                <Clock size={32} className="mx-auto mb-3" style={{ color: 'rgba(13,40,37,0.20)' }} />
                <p className="text-sm" style={{ color: 'rgba(13,40,37,0.40)' }}>لا توجد جلسات قادمة</p>
              </div>
            ) : (
              <div className="space-y-1">
                {upcomingSessions.map(s => (
                  <div key={s.id} className="flex items-center gap-4 px-3 py-3 rounded-xl" style={{ borderBottom: '1px solid rgba(13,148,136,0.08)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.type === 'online' ? 'rgba(96,165,250,0.10)' : 'rgba(5,150,105,0.10)' }}>
                      <BookOpen size={15} style={{ color: s.type === 'online' ? '#60a5fa' : '#059669' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0d2825] truncate">{s.topic}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(13,40,37,0.45)' }}>الطالب: {s.studentName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium" style={{ color: 'rgba(13,40,37,0.55)' }}>{s.date}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.40)' }}>{s.startTime} · {s.duration} د</p>
                    </div>
                    {s.status === 'pending' && (
                      <button onClick={() => confirmSession(s.id)}
                        className="text-xs flex-shrink-0 px-3 py-1.5 rounded-xl font-semibold transition-all hover:brightness-110"
                        style={{ background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff' }}>
                        تأكيد ✓
                      </button>
                    )}
                    {s.status === 'confirmed' && (
                      <button onClick={() => cancelSession(s.id)}
                        className="text-xs flex-shrink-0 px-3 py-1.5 rounded-xl font-medium transition-all"
                        style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)' }}>
                        إلغاء
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── MEETING CREATION CARD ── */}
          <div className="rounded-2xl p-6" style={CARD}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.10)', color: '#60a5fa' }}>
                  <Video size={17} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#0d2825]">الاجتماعات الافتراضية</h2>
                  <p className="text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>{meetings.length} اجتماع منشأ</p>
                </div>
              </div>
              <button onClick={() => setShowMeetingForm(!showMeetingForm)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: showMeetingForm ? 'rgba(220,38,38,0.08)' : 'rgba(96,165,250,0.10)', color: showMeetingForm ? '#dc2626' : '#60a5fa', border: `1px solid ${showMeetingForm ? 'rgba(220,38,38,0.18)' : 'rgba(96,165,250,0.18)'}` }}>
                {showMeetingForm ? <><X size={12} /> إلغاء</> : <><Plus size={12} /> إنشاء اجتماع</>}
              </button>
            </div>

            {/* Success toast */}
            {meetingSaved && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4 text-sm font-medium"
                style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.18)', color: '#059669' }}>
                <Check size={14} /> تم إنشاء الاجتماع بنجاح ✓
              </div>
            )}

            {/* Create form */}
            {showMeetingForm && (
              <div className="rounded-2xl p-4 mb-5 space-y-3" style={CARD_INNER}>
                {/* Title */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.65)' }}>عنوان الاجتماع *</label>
                  <input value={meetingForm.title} onChange={e => setMeetingForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="مثال: مراجعة البرمجة الكائنية"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.65)' }}>الوصف والشرح</label>
                  <textarea value={meetingForm.description} onChange={e => setMeetingForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="اشرح ما سيتم تناوله في هذا الاجتماع وما يحتاج الطالب معرفته قبل الحضور..."
                    rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
                </div>

                {/* Platform + Date + Time */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.65)' }}>المنصة</label>
                    <select value={meetingForm.platform} onChange={e => setMeetingForm(f => ({ ...f, platform: e.target.value as Meeting['platform'] }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}>
                      {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
                        <option key={k} value={k} style={{ background: '#ffffff', color: '#0d2825' }}>{v.icon} {v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.65)' }}>التاريخ</label>
                    <input type="date" value={meetingForm.date} onChange={e => setMeetingForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.65)' }}>الوقت</label>
                    <input type="time" value={meetingForm.time} onChange={e => setMeetingForm(f => ({ ...f, time: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
                  </div>
                </div>

                {/* Link */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.65)' }}>رابط الاجتماع *</label>
                  <input value={meetingForm.link} onChange={e => setMeetingForm(f => ({ ...f, link: e.target.value }))}
                    placeholder="https://zoom.us/j/..." dir="ltr"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
                </div>

                <button onClick={handleCreateMeeting}
                  disabled={!meetingForm.title.trim() || !meetingForm.link.trim()}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#60a5fa,#3b82f6)', color: '#fff', boxShadow: '0 4px 14px rgba(96,165,250,0.20)' }}>
                  <Video size={14} /> إنشاء الاجتماع
                </button>
              </div>
            )}

            {/* Meetings list */}
            {meetings.length === 0 && !showMeetingForm ? (
              <div className="text-center py-8 rounded-xl" style={{ border: '1px dashed rgba(13,148,136,0.14)' }}>
                <Video size={32} className="mx-auto mb-3" style={{ color: 'rgba(13,40,37,0.20)' }} />
                <p className="text-sm" style={{ color: 'rgba(13,40,37,0.40)' }}>لا توجد اجتماعات منشأة بعد</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(13,40,37,0.28)' }}>أنشئ اجتماعاً وشارك الرابط مع طلابك</p>
              </div>
            ) : (
              <div className="space-y-2">
                {meetings.map(m => {
                  const p = PLATFORM_LABELS[m.platform];
                  return (
                    <div key={m.id} className="rounded-xl p-4 group transition-all" style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.10)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                          style={{ background: `${p.color}12` }}>
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-[#0d2825] truncate">{m.title}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                              style={{ background: `${p.color}12`, color: p.color, border: `1px solid ${p.color}25` }}>
                              {p.label}
                            </span>
                          </div>
                          {m.description && (
                            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(13,40,37,0.50)' }}>{m.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {m.date && <span className="text-xs flex items-center gap-1" style={{ color: 'rgba(13,40,37,0.45)' }}><Calendar size={10} />{m.date}{m.time ? ` · ${m.time}` : ''}</span>}
                            <a href={m.link} target="_blank" rel="noopener noreferrer"
                              className="text-xs flex items-center gap-1 font-medium hover:underline"
                              style={{ color: p.color }}>
                              <ExternalLink size={10} /> انضم للاجتماع
                            </a>
                          </div>
                        </div>
                        <button onClick={() => setMeetings(prev => prev.filter(x => x.id !== m.id))}
                          className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>{/* end left col */}

        {/* SIDEBAR */}
        <div className="space-y-4">

          {/* Progress to next cert */}
          <div className="rounded-2xl p-5" style={CARD}>
            <p className="label-section mb-4">التقدم نحو الشهادة التالية</p>
            <div className="text-center mb-5">
              <div className="text-4xl font-black" style={{ color: '#0d9488' }}>{mentor?.totalSessions ?? 0}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(13,40,37,0.45)' }}>جلسة مكتملة</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'شهادة شكر', target: 10, color: '#60a5fa' },
                { label: 'شهادة تفوق', target: 50, color: '#0d9488' },
                { label: 'شهادة تميز', target: 100, color: '#d97706' },
              ].map(tier => {
                const s = mentor?.totalSessions ?? 0;
                const progress = Math.min((s / tier.target) * 100, 100);
                const done = s >= tier.target;
                return (
                  <div key={tier.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium" style={{ color: 'rgba(13,40,37,0.75)' }}>{tier.label}</span>
                      {done
                        ? <CheckCircle size={13} style={{ color: '#059669' }} />
                        : <span className="text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>{s}/{tier.target}</span>}
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(13,148,136,0.10)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${progress}%`, background: done ? '#059669' : tier.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl p-5" style={CARD}>
            <p className="label-section mb-3">إجراءات سريعة</p>
            <div className="space-y-0.5">
              {[
                { to: '/library',     label: 'رفع محتوى للمكتبة', color: '#0d9488', bg: 'rgba(13,148,136,0.10)'  },
                { to: '/sessions',    label: 'عرض جلساتي',        color: '#60a5fa', bg: 'rgba(96,165,250,0.10)'  },
                { to: '/honor-board', label: 'لوحة الشرف',        color: '#059669', bg: 'rgba(5,150,105,0.10)'   },
                { to: '/certificates',label: 'شهاداتي',           color: '#d97706', bg: 'rgba(217,119,6,0.10)'   },
              ].map(link => (
                <Link key={link.to} to={link.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[rgba(13,148,136,0.04)] group">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: link.bg }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: link.color }} />
                  </div>
                  <span className="text-sm transition-colors" style={{ color: 'rgba(13,40,37,0.65)' }}>{link.label}</span>
                  <ChevronLeft size={12} className="mr-auto opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: '#0d9488' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-2xl p-5" style={CARD}>
            <p className="label-section mb-3">شاراتي ({mentor?.badges?.length ?? 0})</p>
            {!mentor?.badges?.length ? (
              <p className="text-sm" style={{ color: 'rgba(13,40,37,0.40)' }}>لم تحصل على شارات بعد</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {mentor.badges.map(b => (
                  <div key={b.id} title={b.description} className="flex items-center gap-2 p-2.5 rounded-xl"
                    style={{ background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.14)' }}>
                    <span className="text-base">{b.icon}</span>
                    <span className="text-xs font-medium truncate" style={{ color: 'rgba(13,40,37,0.75)' }}>{b.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── CERTIFICATE PREVIEW MODAL ── */}
      {selectedCert && (() => {
        const certColors = {
          outstanding: { gradient: 'linear-gradient(135deg,#fbbf24,#d97706)', light: 'rgba(251,191,36,0.10)', border: '#fbbf2440', icon: '#d97706', label: 'Outstanding Certificate', labelAr: 'شهادة تميز استثنائي' },
          excellence:  { gradient: 'linear-gradient(135deg,#0d9488,#059669)',  light: 'rgba(13,148,136,0.10)', border: '#0d948840', icon: '#0d9488', label: 'Excellence Certificate',  labelAr: 'شهادة تفوق'              },
          appreciation:{ gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',  light: 'rgba(59,130,246,0.10)',  border: '#3b82f640', icon: '#3b82f6', label: 'Appreciation Certificate',labelAr: 'شهادة شكر وتقدير'         },
        };
        const cc = certColors[selectedCert.type as keyof typeof certColors] ?? certColors.appreciation;
        return (
          <div className="fixed top-16 inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedCert(null)}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in"
              onClick={e => e.stopPropagation()}>

              {/* Cert header */}
              <div className="px-6 py-8 text-center relative" style={{ background: cc.gradient }}>
                <button onClick={() => setSelectedCert(null)}
                  className="absolute top-4 left-4 text-white/70 hover:text-white">
                  <X size={18} />
                </button>
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
                  style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.40)' }}>
                  <Award size={32} className="text-white" />
                </div>
                <h2 className="text-lg font-black text-white mb-0.5">{cc.labelAr}</h2>
                <p className="text-white/70 text-sm">{cc.label}</p>
              </div>

              {/* Cert body */}
              <div className="px-6 py-5">
                {/* Decorative line */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px" style={{ background: `${cc.icon}30` }} />
                  <span className="text-xs font-semibold" style={{ color: cc.icon }}>Zumra Platform</span>
                  <div className="flex-1 h-px" style={{ background: `${cc.icon}30` }} />
                </div>

                <p className="text-center text-sm mb-1" style={{ color: 'rgba(13,40,37,0.50)' }}>This certificate is awarded to</p>
                <p className="text-center text-xl font-black text-[#0d2825] mb-4">{mentor?.name}</p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Sessions', value: String(selectedCert.sessionsCount), color: '#059669' },
                    { label: 'Avg Rating', value: `★ ${selectedCert.averageRating}`, color: '#d97706' },
                    { label: 'Students', value: String(selectedCert.totalStudents ?? mentor?.totalStudents ?? '—'), color: '#0891b2' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: cc.light, border: `1px solid ${cc.border}` }}>
                      <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.50)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between"
                  style={{ background: 'rgba(13,148,136,0.05)', border: '1px solid rgba(13,148,136,0.12)' }}>
                  <span className="text-xs" style={{ color: 'rgba(13,40,37,0.50)' }}>Issued on</span>
                  <span className="text-sm font-semibold text-[#0d2825]">{selectedCert.issuedAt}</span>
                </div>

                <p className="text-center text-xs mb-4" style={{ color: 'rgba(13,40,37,0.40)' }}>
                  Academic Year: {selectedCert.academicYear} · Issued by: {selectedCert.issuedBy}
                </p>

                <button onClick={() => setSelectedCert(null)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: cc.gradient }}>
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </Layout>
  );
}
