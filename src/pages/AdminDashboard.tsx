import React, { useState } from 'react';
import {
  Users, BookOpen, Award, TrendingUp, Calendar,
  BarChart2, Activity, Star, ArrowUpRight, Download,
  Plus, Trash2, X, Check, UserPlus, Mail, BookMarked,
  CheckCircle2, XCircle, Clock, MessageSquare, Hash, AlertCircle, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import { useApp } from '../contexts/AppContext';
import LibraryDetailsModal from '../components/LibraryDetailsModal';
import type { LibraryItem } from '../types';
import { MOCK_ADMIN_STATS, MOCK_CERTIFICATES, UNIVERSITY_NAME, COLLEGE_NAME, MAJORS } from '../mockData';
import { generateAdminReport } from '../utils/reportGenerator';
import type { Mentor } from '../types';

const CARD = {
  background: '#ffffff',
  border: '1px solid rgba(13,148,136,0.14)',
  boxShadow: '0 4px 20px rgba(13,148,136,0.08)',
};
const CARD_INNER = { background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.09)' };
const CHART_COLORS = ['#0d9488', '#0891b2', '#22d3ee', '#059669', '#7c3aed'];
const CHART_STYLE = { background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(13,148,136,0.10)', borderRadius: 12, fontSize: 12 };

const EMPTY_FORM = {
  name: '', email: '', major: MAJORS[0], subjects: '', bio: '',
  available: true, sessionTypes: ['online'] as ('online' | 'in-person')[],
};

function StatCard({ icon, value, label, sub, accent, trend }: {
  icon: React.ReactNode; value: string | number; label: string;
  sub?: string; accent: string; trend?: number;
}) {
  return (
    <div className="rounded-2xl p-5 transition-all overflow-hidden relative"
      style={{ ...CARD, borderTop: `3px solid ${accent}` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}14`, color: accent }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-semibold" style={{ background: 'rgba(5,150,105,0.09)', color: '#059669' }}>
            <ArrowUpRight size={11} />{trend}%
          </div>
        )}
      </div>
      <div className="text-2xl font-black" style={{ color: '#0d2825', letterSpacing: '-0.5px' }}>{typeof value === 'number' ? value.toLocaleString('ar') : value}</div>
      <div className="text-sm font-semibold mt-1" style={{ color: accent }}>{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.42)' }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const stats = MOCK_ADMIN_STATS;
  const { mentors, addMentor, deleteMentor, libraryItems, approveLibraryItem, rejectLibraryItem, deleteLibraryItem, chatMessages, deleteChatMessage } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'mentors' | 'manage' | 'content' | 'chats'>('overview');
  const [chatRoomFilter, setChatRoomFilter] = useState('');
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<LibraryItem | null>(null);
  const [rejectingItem, setRejectingItem] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteLibConfirm, setDeleteLibConfirm] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleAddMentor() {
    if (!form.name.trim() || !form.email.trim()) return;
    const newMentor: Mentor = {
      id: `m-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      role: 'mentor',
      university: UNIVERSITY_NAME,
      college: COLLEGE_NAME,
      major: form.major,
      year: 5,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}&backgroundColor=c0aede`,
      points: 0,
      badges: [],
      joinedAt: new Date().toISOString().split('T')[0],
      subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
      bio: form.bio.trim(),
      rating: 0,
      totalSessions: 0,
      totalStudents: 0,
      available: form.available,
      sessionTypes: form.sessionTypes,
    };
    addMentor(newMentor);
    setForm(EMPTY_FORM);
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <Layout wide>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <p className="text-sm font-medium" style={{ color: 'rgba(13,40,37,0.50)' }}>إحصائيات فورية عن أداء برنامج الإرشاد الأكاديمي</p>
        <button
          onClick={() => generateAdminReport({
            totalStudents: stats.totalStudents,
            totalMentors: mentors.length,
            totalSessions: stats.totalSessions,
            totalCertificates: stats.totalCertificates,
            totalLibraryItems: stats.totalLibraryItems,
            activeSessionsToday: stats.activeSessionsToday,
            topMentors: stats.topMentors,
            popularSubjects: stats.popularSubjects,
            monthlyActivity: stats.monthlyActivity,
          })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff', boxShadow: '0 4px 14px rgba(13,148,136,0.25)' }}>
          <Download size={16} />
          تصدير التقرير PDF
        </button>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl"
          style={{ background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.25)', color: '#059669', backdropFilter: 'blur(16px)' }}>
          <Check size={15} /> تمت إضافة المرشد بنجاح
        </div>
      )}

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard icon={<Users size={18} />}    value={stats.totalStudents}        label="طالب"    sub="مسجل في المنصة"   accent="#0d9488" trend={12} />
        <StatCard icon={<Users size={18} />}    value={mentors.length}             label="مرشد"    sub="نشط هذا الفصل"    accent="#0891b2" trend={8}  />
        <StatCard icon={<Calendar size={18} />} value={stats.totalSessions}        label="جلسة"    sub="إجمالي الجلسات"   accent="#059669" trend={23} />
        <StatCard icon={<BookOpen size={18} />} value={stats.totalLibraryItems}    label="ملف"     sub="في المكتبة"        accent="#d97706" trend={15} />
        <StatCard icon={<Award size={18} />}    value={stats.totalCertificates}    label="شهادة"   sub="صادرة تلقائياً"   accent="#7c3aed" trend={18} />
        <StatCard icon={<Activity size={18} />} value={stats.activeSessionsToday}  label="اليوم"   sub="جلسة نشطة"         accent="#ea580c" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl p-1 w-fit mb-6" style={{ background: 'rgba(13,148,136,0.07)' }}>
        {[
          ['overview', 'النظرة العامة'],
          ['mentors', 'أداء المرشدين'],
          ['manage', 'إدارة المرشدين'],
          ['content', `المحتوى المعلق (${libraryItems.filter(l => l.approvalStatus === 'pending').length})`],
          ['chats', 'إدارة الدردشات'],
        ].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all`}
            style={activeTab === tab
              ? { background: '#ffffff', color: '#0d9488', boxShadow: '0 1px 4px rgba(13,148,136,0.12)' }
              : { color: 'rgba(13,40,37,0.50)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl p-6" style={CARD}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-[#0d2825]">النشاط الشهري</h2>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0d9488] inline-block" />جلسات</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#d97706] inline-block" />محتوى</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,148,136,0.08)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(13,40,37,0.45)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'rgba(13,40,37,0.45)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_STYLE} labelStyle={{ color: '#0d2825' }} itemStyle={{ color: '#0d2825' }} />
                  <Bar dataKey="sessions" fill="#0d9488" radius={[4, 4, 0, 0]} name="جلسات" />
                  <Bar dataKey="uploads"  fill="#d97706" radius={[4, 4, 0, 0]} name="محتوى" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={CARD}>
              <h2 className="text-sm font-semibold text-[#0d2825] mb-6">المواد الأكثر طلباً</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stats.popularSubjects.slice(0, 5)} dataKey="count" nameKey="name"
                    cx="50%" cy="50%" outerRadius={75}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'rgba(13,148,136,0.30)' }}>
                    {stats.popularSubjects.slice(0, 5).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_STYLE} itemStyle={{ color: '#0d2825' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={CARD}>
            <h2 className="text-sm font-semibold text-[#0d2825] mb-6 flex items-center gap-2">
              <TrendingUp size={15} style={{ color: '#0d9488' }} />
              اتجاه نمو الجلسات
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={stats.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,148,136,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(13,40,37,0.45)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(13,40,37,0.45)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_STYLE} itemStyle={{ color: '#0d2825' }} />
                <Line type="monotone" dataKey="sessions" stroke="#0d9488" strokeWidth={2.5}
                  dot={{ fill: '#0d9488', r: 4 }} name="جلسات" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl overflow-hidden" style={CARD}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
              <h2 className="text-sm font-semibold text-[#0d2825]">إحصائيات الكليات</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
                    <th className="text-right py-3 px-6 label-section">الكلية</th>
                    <th className="text-center py-3 px-4 label-section">الطلاب</th>
                    <th className="text-center py-3 px-4 label-section">المرشدون</th>
                    <th className="text-center py-3 px-4 label-section">نسبة الإرشاد</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.collegeStats.map((c, i) => (
                    <tr key={i} className="transition-colors hover:bg-[rgba(13,148,136,0.03)]" style={{ borderBottom: '1px solid rgba(13,148,136,0.06)' }}>
                      <td className="py-3 px-6 font-medium text-[#0d2825]">{c.college}</td>
                      <td className="py-3 px-4 text-center" style={{ color: 'rgba(13,40,37,0.65)' }}>{c.students}</td>
                      <td className="py-3 px-4 text-center" style={{ color: 'rgba(13,40,37,0.65)' }}>{c.mentors}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(13,148,136,0.10)' }}>
                            <div className="h-full rounded-full bg-[#0d9488]"
                              style={{ width: `${Math.min((c.mentors / c.students * 100), 100).toFixed(0)}%` }} />
                          </div>
                          <span className="text-xs" style={{ color: 'rgba(13,40,37,0.50)' }}>{(c.mentors / c.students * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── MENTORS PERFORMANCE TAB ─── */}
      {activeTab === 'mentors' && (
        <div className="rounded-2xl overflow-hidden" style={CARD}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
            <h2 className="text-sm font-semibold text-[#0d2825]">أداء المرشدين</h2>
            <span className="text-xs" style={{ color: 'rgba(13,40,37,0.40)' }}>{stats.topMentors.length} مرشد</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(13,148,136,0.03)', borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
                  <th className="text-right py-4 px-6 label-section">المرشد</th>
                  <th className="text-center py-4 px-4 label-section">الجلسات</th>
                  <th className="text-center py-4 px-4 label-section">التقييم</th>
                  <th className="text-center py-4 px-4 label-section">شريط الأداء</th>
                </tr>
              </thead>
              <tbody>
                {stats.topMentors.map((m, i) => (
                  <tr key={m.id} className="transition-colors hover:bg-[rgba(13,148,136,0.03)]" style={{ borderBottom: '1px solid rgba(13,148,136,0.06)' }}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black w-5" style={{ color: i === 0 ? '#fbbf24' : 'rgba(13,40,37,0.30)' }}>{i + 1}</span>
                        <p className="font-semibold" style={{ color: 'rgba(13,40,37,0.90)' }}>{m.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold" style={{ color: 'rgba(13,40,37,0.85)' }}>{m.sessions}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold" style={{ color: 'rgba(13,40,37,0.85)' }}>{m.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(13,148,136,0.10)' }}>
                          <div className="h-full rounded-full bg-[#0d9488]"
                            style={{ width: `${(m.sessions / stats.topMentors[0].sessions) * 100}%` }} />
                        </div>
                        <span className="text-xs w-8" style={{ color: 'rgba(13,40,37,0.45)' }}>{m.sessions}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MANAGE MENTORS TAB ─── */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0d2825]">قائمة المرشدين</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.40)' }}>{mentors.length} مرشد مسجل</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff', boxShadow: '0 4px 14px rgba(13,148,136,0.30)' }}>
              <UserPlus size={15} /> إضافة مرشد
            </button>
          </div>

          {/* Mentors grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.map(m => (
              <div key={m.id} className="rounded-2xl p-5 relative group transition-all" style={CARD}>
                {/* Delete button */}
                {deleteConfirm === m.id ? (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <button onClick={() => { deleteMentor(m.id); setDeleteConfirm(null); }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.25)' }}>
                      تأكيد الحذف
                    </button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{ background: 'rgba(13,148,136,0.06)', color: 'rgba(13,40,37,0.50)' }}>
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(m.id)}
                    className="absolute top-3 left-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.16)' }}>
                    <Trash2 size={13} />
                  </button>
                )}

                {/* Mentor info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={m.name} className="w-11 h-11 rounded-2xl border border-[rgba(13,148,136,0.14)] text-sm flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#0d2825] truncate">{m.name}</p>
                    <p className="text-xs mt-0.5 truncate flex items-center gap-1" style={{ color: 'rgba(13,40,37,0.45)' }}>
                      <Mail size={10} /> {m.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(13,148,136,0.10)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.18)' }}>
                    {m.major}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium`}
                    style={{
                      background: m.available ? 'rgba(5,150,105,0.10)' : 'rgba(13,40,37,0.05)',
                      color: m.available ? '#059669' : 'rgba(13,40,37,0.35)',
                      border: `1px solid ${m.available ? 'rgba(5,150,105,0.18)' : 'rgba(13,40,37,0.10)'}`,
                    }}>
                    {m.available ? '● متاح' : '○ غير متاح'}
                  </span>
                </div>

                {m.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {m.subjects.slice(0, 3).map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(13,148,136,0.06)', color: 'rgba(13,40,37,0.55)' }}>
                        {s}
                      </span>
                    ))}
                    {m.subjects.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(13,148,136,0.06)', color: 'rgba(13,40,37,0.35)' }}>
                        +{m.subjects.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(13,148,136,0.10)' }}>
                  <div className="text-center flex-1">
                    <p className="text-xs font-black text-[#0d2825]">{m.totalSessions}</p>
                    <p className="text-xs" style={{ color: 'rgba(13,40,37,0.40)', fontSize: 10 }}>جلسة</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs font-black text-[#0d2825]">{m.totalStudents}</p>
                    <p className="text-xs" style={{ color: 'rgba(13,40,37,0.40)', fontSize: 10 }}>طالب</p>
                  </div>
                  <div className="text-center flex-1">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <p className="text-xs font-black text-amber-400">{m.rating || '—'}</p>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(13,40,37,0.40)', fontSize: 10 }}>تقييم</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CONTENT APPROVAL TAB ─── */}
      {activeTab === 'content' && (() => {
        const pending   = libraryItems.filter(l => l.approvalStatus === 'pending');
        const approved  = libraryItems.filter(l => l.approvalStatus === 'approved' || !l.approvalStatus);
        const rejected  = libraryItems.filter(l => l.approvalStatus === 'rejected');
        return (
          <div className="space-y-4">
            {/* Summary chips */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'بانتظار المراجعة', count: pending.length,  bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.18)',  color: '#d97706' },
                { label: 'موافق عليه',       count: approved.length, bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.18)', color: '#059669' },
                { label: 'مرفوض',            count: rejected.length, bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.18)', color: '#dc2626' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.count}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(13,40,37,0.65)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pending list */}
            {pending.length === 0 ? (
              <div className="rounded-2xl p-10 text-center" style={CARD}>
                <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: 'rgba(5,150,105,0.40)' }} />
                <p className="font-semibold text-sm" style={{ color: 'rgba(13,40,37,0.50)' }}>لا يوجد محتوى معلق — كل شيء مراجَع ✓</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={CARD}>
                <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
                  <AlertCircle size={15} style={{ color: '#d97706' }} />
                  <h2 className="text-sm font-semibold text-[#0d2825]">المحتوى بانتظار الموافقة</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full mr-1 font-bold" style={{ background: 'rgba(217,119,6,0.12)', color: '#d97706' }}>
                    {pending.length}
                  </span>
                </div>
                <div className="divide-y divide-[rgba(13,148,136,0.08)]">
                  {pending.map(item => {
                    const isExpanded = expandedItem === item.id;
                    const isRejecting = rejectingItem === item.id;
                    return (
                      <div key={item.id}>
                        {/* Main row */}
                        <div className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(13,148,136,0.02)] transition-colors">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488' }}>
                            <FileText size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-[#0d2825] truncate">{item.title}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs" style={{ color: 'rgba(13,40,37,0.50)' }}>{item.subject}</span>
                              <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488' }}>{item.type}</span>
                              <span className="text-xs" style={{ color: 'rgba(13,40,37,0.40)' }}>بقلم: {item.uploadedByName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Details modal */}
                            <button onClick={() => setDetailItem(item)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                              style={{ background: 'linear-gradient(135deg,#0d2825,#0f4a42)', color: '#fff' }}>
                              <AlertCircle size={12} /> التفاصيل والملف
                            </button>
                            <button onClick={() => approveLibraryItem(item.id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                              style={{ background: 'rgba(5,150,105,0.10)', color: '#059669', border: '1px solid rgba(5,150,105,0.20)' }}>
                              <CheckCircle2 size={13} /> موافقة
                            </button>
                            <button onClick={() => { setRejectingItem(isRejecting ? null : item.id); setRejectReason(''); }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                              style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)' }}>
                              <XCircle size={13} /> رفض
                            </button>
                            {deleteLibConfirm === item.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => { deleteLibraryItem(item.id); setDeleteLibConfirm(null); }}
                                  className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
                                  style={{ background: 'rgba(220,38,38,0.18)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.30)' }}>
                                  <Check size={13} /> تأكيد
                                </button>
                                <button onClick={() => setDeleteLibConfirm(null)}
                                  className="px-2.5 py-2 rounded-xl text-xs font-medium transition-all"
                                  style={{ color: 'rgba(13,40,37,0.50)' }}>
                                  <X size={13} />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteLibConfirm(item.id)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                                style={{ background: 'rgba(127,29,29,0.07)', color: '#7f1d1d', border: '1px solid rgba(127,29,29,0.15)' }}>
                                <Trash2 size={13} /> حذف
                              </button>
                            )}
                          </div>
                        </div>


                        {/* Rejection reason panel */}
                        {isRejecting && (
                          <div className="px-6 pb-4 animate-slide-up">
                            <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)' }}>
                              <div className="flex items-center gap-2 mb-1">
                                <XCircle size={14} style={{ color: '#dc2626' }} />
                                <h4 className="text-xs font-bold" style={{ color: '#dc2626' }}>سبب الرفض (اختياري — سيُرسل للمرشد)</h4>
                              </div>
                              <textarea
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="مثال: المحتوى لا يتوافق مع معايير المنصة أو يحتاج تحسينات..."
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                                style={{ background: '#fff', border: '1px solid rgba(220,38,38,0.25)', color: '#0d2825' }}
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    rejectLibraryItem(item.id, rejectReason.trim() || undefined);
                                    setRejectingItem(null);
                                    setRejectReason('');
                                  }}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                                  style={{ background: 'rgba(220,38,38,0.12)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)' }}>
                                  <XCircle size={13} /> تأكيد الرفض
                                </button>
                                <button
                                  onClick={() => { setRejectingItem(null); setRejectReason(''); }}
                                  className="text-xs px-4 py-2 rounded-xl font-medium transition-all"
                                  style={{ color: 'rgba(13,40,37,0.50)' }}>
                                  إلغاء
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All approved content table */}
            {approved.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={CARD}>
                <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
                  <h2 className="text-sm font-semibold text-[#0d2825]">المحتوى الموافق عليه ({approved.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(13,148,136,0.03)', borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
                        <th className="text-right py-3 px-6 label-section">العنوان</th>
                        <th className="text-center py-3 px-4 label-section">المادة</th>
                        <th className="text-center py-3 px-4 label-section">المرشد</th>
                        <th className="text-center py-3 px-4 label-section">التحميلات</th>
                        <th className="text-center py-3 px-4 label-section">حذف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approved.slice(0, 10).map(item => (
                        <tr key={item.id} className="transition-colors hover:bg-[rgba(13,148,136,0.02)]" style={{ borderBottom: '1px solid rgba(13,148,136,0.06)' }}>
                          <td className="py-3 px-6 font-medium text-[#0d2825]">{item.title}</td>
                          <td className="py-3 px-4 text-center text-xs" style={{ color: 'rgba(13,40,37,0.65)' }}>{item.subject}</td>
                          <td className="py-3 px-4 text-center text-xs" style={{ color: 'rgba(13,40,37,0.65)' }}>{item.uploadedByName}</td>
                          <td className="py-3 px-4 text-center font-bold" style={{ color: '#0d9488' }}>{item.downloads}</td>
                          <td className="py-3 px-4 text-center">
                            {deleteLibConfirm === item.id ? (
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={() => { deleteLibraryItem(item.id); setDeleteLibConfirm(null); }}
                                  className="px-2 py-1 rounded-lg text-xs font-bold transition-all hover:brightness-110"
                                  style={{ background: 'rgba(220,38,38,0.15)', color: '#dc2626' }}>
                                  <Check size={12} />
                                </button>
                                <button onClick={() => setDeleteLibConfirm(null)}
                                  className="px-2 py-1 rounded-lg text-xs transition-all"
                                  style={{ color: 'rgba(13,40,37,0.45)' }}>
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteLibConfirm(item.id)}
                                className="p-1.5 rounded-lg transition-all hover:brightness-110"
                                style={{ background: 'rgba(220,38,38,0.07)', color: '#dc2626' }}>
                                <Trash2 size={13} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── CHATS MANAGEMENT TAB ─── */}
      {activeTab === 'chats' && (() => {
        const rooms = Object.keys(chatMessages).filter(r =>
          !chatRoomFilter || r.includes(chatRoomFilter)
        );
        const roomMsgs = selectedChatRoom ? (chatMessages[selectedChatRoom] ?? []) : [];
        return (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Room list */}
            <div className="rounded-2xl overflow-hidden" style={CARD}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
                <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Hash size={14} /> غرف الدردشة
                </h2>
                <input value={chatRoomFilter} onChange={e => setChatRoomFilter(e.target.value)}
                  placeholder="ابحث عن غرفة..."
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.22)' }} />
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {rooms.length === 0 ? (
                  <p className="text-center py-8 text-sm" style={{ color: 'rgba(13,40,37,0.40)' }}>لا توجد غرف</p>
                ) : rooms.map(room => {
                  const msgs = chatMessages[room] ?? [];
                  const isActive = selectedChatRoom === room;
                  return (
                    <button key={room} onClick={() => setSelectedChatRoom(room)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-right transition-colors"
                      style={{
                        background: isActive ? 'rgba(13,148,136,0.08)' : 'transparent',
                        borderRight: isActive ? '3px solid #0d9488' : '3px solid transparent',
                        borderBottom: '1px solid rgba(13,148,136,0.07)',
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: isActive ? '#0d9488' : 'rgba(13,148,136,0.08)', color: isActive ? '#fff' : '#0d9488' }}>
                        <Hash size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0d2825] truncate">{room}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.45)' }}>{msgs.length} رسالة</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Messages panel */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={CARD}>
              {!selectedChatRoom ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <MessageSquare size={40} className="mb-3" style={{ color: 'rgba(13,40,37,0.20)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'rgba(13,40,37,0.45)' }}>اختر غرفة لعرض رسائلها</p>
                </div>
              ) : (
                <>
                  <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: 'rgba(13,148,136,0.03)' }}>
                    <Hash size={16} style={{ color: '#0d9488' }} />
                    <h3 className="font-bold text-sm text-[#0d2825] flex-1">{selectedChatRoom}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.16)' }}>
                      {roomMsgs.length} رسالة
                    </span>
                  </div>
                  <div className="overflow-y-auto p-4 space-y-2" style={{ maxHeight: '55vh' }}>
                    {roomMsgs.length === 0 ? (
                      <p className="text-center py-8 text-sm" style={{ color: 'rgba(13,40,37,0.40)' }}>لا توجد رسائل في هذه الغرفة</p>
                    ) : roomMsgs.map(msg => (
                      <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl group transition-colors hover:bg-[rgba(220,38,38,0.03)]"
                        style={{ border: '1px solid rgba(13,148,136,0.08)' }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold" style={{ color: msg.authorRole === 'mentor' ? '#0d9488' : 'rgba(13,40,37,0.80)' }}>
                              {msg.authorName}
                            </span>
                            {msg.authorRole === 'mentor' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                style={{ background: 'rgba(13,148,136,0.10)', color: '#0d9488' }}>مرشد</span>
                            )}
                            <span className="text-[11px]" style={{ color: 'rgba(13,40,37,0.40)' }}>
                              {new Date(msg.timestamp).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-[#0d2825] leading-relaxed">{msg.text}</p>
                        </div>
                        <button onClick={() => deleteChatMessage(selectedChatRoom, msg.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          style={{ background: 'rgba(220,38,38,0.10)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)' }}
                          title="حذف الرسالة">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* ─── ADD MENTOR MODAL ─── */}
      {showModal && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 overflow-y-auto"
          style={{ background: 'rgba(13,40,37,0.40)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowModal(false)}>
          <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl shadow-2xl flex flex-col"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(13,148,136,0.16)',
            }}
            onClick={e => e.stopPropagation()}>

            {/* Fixed header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: 'linear-gradient(135deg,#0d9488,#0891b2)', borderRadius: '24px 24px 0 0' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.20)' }}>
                  <UserPlus size={17} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">إضافة مرشد جديد</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>سيُضاف المرشد فوراً للقائمة</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
                style={{ color: 'rgba(255,255,255,0.80)' }}>
                <X size={16} />
              </button>
            </div>

            {/* Form body */}
            <div className="px-6 py-5 space-y-4">
              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.70)' }}>الاسم الكامل *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="أحمد محمد..."
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.70)' }}>البريد الإلكتروني *</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="mentor@psau.edu.sa" dir="ltr"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
                </div>
              </div>

              {/* Major */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.70)' }}>التخصص</label>
                <select value={form.major} onChange={e => setForm(f => ({ ...f, major: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}>
                  {MAJORS.map(m => <option key={m} value={m} style={{ background: '#ffffff', color: '#0d2825' }}>{m}</option>)}
                </select>
              </div>

              {/* Subjects */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.70)' }}>
                  المواد التي يدرّسها <span style={{ color: 'rgba(13,40,37,0.35)' }}>(افصل بفاصلة)</span>
                </label>
                <input value={form.subjects} onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))}
                  placeholder="البرمجة، قواعد البيانات، الخوارزميات"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(13,40,37,0.70)' }}>نبذة تعريفية</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="اكتب نبذة مختصرة عن المرشد..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }} />
              </div>

              {/* Options row */}
              <div className="flex items-center gap-4">
                {/* Available toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                    className="rounded-full transition-all relative cursor-pointer"
                    style={{ background: form.available ? '#0d9488' : 'rgba(13,148,136,0.15)', width: 38, height: 22 }}>
                    <div className="absolute top-0.5 rounded-full bg-white transition-all w-4 h-4"
                      style={{ right: form.available ? 3 : undefined, left: form.available ? undefined : 3 }} />
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(13,40,37,0.60)' }}>متاح للجلسات</span>
                </label>

                {/* Session types */}
                <div className="flex items-center gap-2">
                  {(['online', 'in-person'] as const).map(t => (
                    <button key={t} onClick={() => setForm(f => ({
                      ...f,
                      sessionTypes: f.sessionTypes.includes(t)
                        ? f.sessionTypes.filter(x => x !== t)
                        : [...f.sessionTypes, t]
                    }))}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{
                        background: form.sessionTypes.includes(t) ? 'rgba(13,148,136,0.12)' : 'rgba(13,148,136,0.04)',
                        color: form.sessionTypes.includes(t) ? '#0d9488' : 'rgba(13,40,37,0.40)',
                        border: `1px solid ${form.sessionTypes.includes(t) ? 'rgba(13,148,136,0.22)' : 'rgba(13,148,136,0.10)'}`,
                      }}>
                      {t === 'online' ? '🎥 أونلاين' : '🏫 حضوري'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(13,148,136,0.10)' }}>
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(13,148,136,0.06)]"
                style={{ color: 'rgba(13,40,37,0.55)' }}>
                إلغاء
              </button>
              <button onClick={handleAddMentor}
                disabled={!form.name.trim() || !form.email.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff', boxShadow: '0 4px 14px rgba(13,148,136,0.25)' }}>
                <Plus size={14} /> إضافة المرشد
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
      {/* Library details modal */}
      {detailItem && (
        <LibraryDetailsModal
          item={detailItem as any}
          isAdmin={true}
          onClose={() => setDetailItem(null)}
          onApprove={() => { approveLibraryItem(detailItem.id); setDetailItem(null); }}
          onReject={() => { rejectLibraryItem(detailItem.id); setDetailItem(null); }}
        />
      )}
    </Layout>
  );
}
