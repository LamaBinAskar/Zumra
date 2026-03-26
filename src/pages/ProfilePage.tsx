import React, { useState } from 'react';
import { User, Mail, BookOpen, GraduationCap, Building2, ShieldCheck, Save, Edit2, X } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '../components/Avatar';

const ROLE_LABELS: Record<string, string> = {
  student: 'طالب',
  mentor:  'مرشد أكاديمي',
  admin:   'مسؤول النظام',
};

const ROLE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  student: { bg: 'rgba(13,148,136,0.10)', color: '#0d9488',  border: 'rgba(13,148,136,0.25)' },
  mentor:  { bg: 'rgba(124,58,237,0.10)', color: '#7c3aed',  border: 'rgba(124,58,237,0.25)' },
  admin:   { bg: 'rgba(217,119,6,0.10)',  color: '#d97706',  border: 'rgba(217,119,6,0.25)'  },
};

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [editing, setEditing]   = useState(false);
  const [saved,   setSaved]     = useState(false);

  const [form, setForm] = useState({
    name:    currentUser?.name    ?? '',
    email:   currentUser?.email   ?? '',
    college: currentUser?.college ?? '',
    major:   currentUser?.major   ?? '',
  });

  if (!currentUser) return null;

  const roleStyle = ROLE_COLORS[currentUser.role] ?? ROLE_COLORS.student;

  function handleSave() {
    /* In a real app this would call an API. For the demo we just show feedback. */
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleCancel() {
    setForm({
      name:    currentUser?.name    ?? '',
      email:   currentUser?.email   ?? '',
      college: currentUser?.college ?? '',
      major:   currentUser?.major   ?? '',
    });
    setEditing(false);
  }

  return (
    <Layout>
      {/* Header banner */}
      <div className="rounded-3xl mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d2825 0%, #0f4a42 50%, #0d9488 100%)', padding: '28px 28px 22px' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.14) 1px, transparent 1px)',
          backgroundSize: '18px 18px', opacity: 0.7,
        }} />
        <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)', pointerEvents: 'none' }} />

        <div className="relative z-10 flex items-center gap-4">
          <Avatar name={currentUser.name} className="w-16 h-16 rounded-2xl flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black text-white">{currentUser.name}</h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                style={{ background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}` }}>
                {ROLE_LABELS[currentUser.role]}
              </span>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>{currentUser.email}</p>
          </div>
        </div>
      </div>

      {/* Save success toast */}
      {saved && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(5,150,105,0.10)', border: '1px solid rgba(5,150,105,0.25)', color: '#059669' }}>
          <ShieldCheck size={16} /> تم حفظ المعلومات بنجاح
        </div>
      )}

      {/* Info card */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)', boxShadow: '0 2px 16px rgba(13,148,136,0.07)' }}>

        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: '#fafffe' }}>
          <div className="flex items-center gap-2">
            <User size={16} style={{ color: '#0d9488' }} />
            <span className="font-bold text-sm" style={{ color: '#0d2825' }}>المعلومات الشخصية</span>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:brightness-95"
              style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.18)' }}>
              <Edit2 size={13} /> تعديل
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{ background: 'rgba(220,38,38,0.07)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.18)' }}>
                <X size={13} /> إلغاء
              </button>
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }}>
                <Save size={13} /> حفظ
              </button>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="p-6 grid sm:grid-cols-2 gap-5">

          {/* Name */}
          <Field
            icon={<User size={15} />}
            label="الاسم الكامل"
            value={form.name}
            editing={editing}
            onChange={v => setForm(f => ({ ...f, name: v }))}
          />

          {/* Email */}
          <Field
            icon={<Mail size={15} />}
            label="البريد الجامعي"
            value={form.email}
            editing={editing}
            onChange={v => setForm(f => ({ ...f, email: v }))}
          />

          {/* College */}
          <Field
            icon={<Building2 size={15} />}
            label="الكلية"
            value={form.college}
            editing={editing}
            onChange={v => setForm(f => ({ ...f, college: v }))}
          />

          {/* Major */}
          <Field
            icon={<BookOpen size={15} />}
            label="التخصص"
            value={form.major}
            editing={editing}
            onChange={v => setForm(f => ({ ...f, major: v }))}
          />

          {/* Role — read only */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.50)' }}>
              <ShieldCheck size={15} style={{ color: '#0d9488' }} /> الدور
            </label>
            <div className="px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5"
              style={{ background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}` }}>
              {ROLE_LABELS[currentUser.role]}
            </div>
          </div>

          {/* Year (if student/mentor) */}
          {'year' in currentUser && currentUser.year > 0 && (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.50)' }}>
                <GraduationCap size={15} style={{ color: '#0d9488' }} /> المستوى الدراسي
              </label>
              <div className="px-4 py-2.5 rounded-xl text-sm"
                style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.14)', color: '#0d2825' }}>
                المستوى {currentUser.year}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Joined date */}
      {'joinedAt' in currentUser && currentUser.joinedAt && (
        <p className="mt-4 text-center text-xs" style={{ color: 'rgba(13,40,37,0.35)' }}>
          انضممت بتاريخ {currentUser.joinedAt}
        </p>
      )}
    </Layout>
  );
}

/* ── Reusable field ── */
function Field({
  icon, label, value, editing, onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: 'rgba(13,40,37,0.50)' }}>
        <span style={{ color: '#0d9488' }}>{icon}</span> {label}
      </label>
      {editing ? (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.28)', color: '#0d2825' }}
          dir="auto"
        />
      ) : (
        <div className="px-4 py-2.5 rounded-xl text-sm"
          style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.12)', color: '#0d2825' }}>
          {value || <span style={{ color: 'rgba(13,40,37,0.30)' }}>—</span>}
        </div>
      )}
    </div>
  );
}
