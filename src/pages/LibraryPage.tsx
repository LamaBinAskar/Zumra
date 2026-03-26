import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Upload, Download, Eye, Star, X, BookOpen, Brain, FileQuestion, Trash2, Check, FileDown, LogIn, Sparkles, CheckCircle2, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import type { LibraryItem } from '../types';
import LibraryDetailsModal from '../components/LibraryDetailsModal';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { SUBJECTS_BY_MAJOR, ACADEMIC_LEVELS } from '../mockData';
import type { LibraryItemType } from '../types';
import { getAIContent } from '../data/aiContent';
import SummaryModal from '../components/SummaryModal';
import QuizModal from '../components/QuizModal';
import Avatar from '../components/Avatar';
import { generateLibraryItemPDF } from '../utils/reportGenerator';

const TYPE_LABELS: Record<LibraryItemType, string> = {
  summary: 'ملخص',
  video: 'فيديو',
  questions: 'بنك أسئلة',
  notes: 'ملاحظات',
  slides: 'شرائح',
};
const TYPE_COLORS: Record<LibraryItemType, { bg: string; color: string }> = {
  summary:   { bg: 'rgba(13,148,136,0.10)',  color: '#0d9488' },
  video:     { bg: 'rgba(37,168,157,0.10)',  color: '#0891b2' },
  questions: { bg: 'rgba(96,165,250,0.10)',  color: '#60a5fa' },
  notes:     { bg: 'rgba(217,119,6,0.10)',   color: '#d97706' },
  slides:    { bg: 'rgba(124,58,237,0.10)',  color: '#7c3aed' },
};

/* ── Upload modal ──────────────────────────────────────────── */
interface UploadModalProps { onClose: () => void; onUpload: (data: any) => void; }

function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    majorGroup: '',
    semester: 'الفصل الأول',
    level: '',
    type: 'summary' as LibraryItemType,
  });
  const [file, setFile] = useState<File | null>(null);
  const [summaryContent, setSummaryContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isSummaryType = form.type === 'summary';
  // Summary: needs text content (file optional). Other types: file required
  const canSubmit = !!form.title && !!form.subject && (isSummaryType ? !!summaryContent.trim() : !!file);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setUploading(true);

    let fileUrl = '#';
    if (file) {
      // Convert file to base64 data URL so it persists and is downloadable
      fileUrl = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    }

    onUpload({
      ...form,
      fileUrl,
      fileName: file?.name,
      fileSize: file?.size,
      summaryContent: isSummaryType ? summaryContent.trim() : undefined,
    });
    setUploading(false);
    onClose();
  }

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 z-50 overflow-y-auto"
      style={{ background: 'rgba(13,40,37,0.50)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4">
      <div
        className="rounded-3xl shadow-2xl w-full max-w-md flex flex-col"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(13,148,136,0.16)',
          maxHeight: 'calc(100vh - 96px)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Fixed header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: 'linear-gradient(135deg,#0d9488,#0891b2)', borderRadius: '24px 24px 0 0' }}>
          <div className="flex items-center gap-2">
            <Upload size={17} className="text-white" />
            <h3 className="text-base font-bold text-white">رفع محتوى جديد</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/20"
            style={{ color: 'rgba(255,255,255,0.80)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>عنوان المحتوى *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
              placeholder="مثال: ملخص هياكل البيانات الشامل" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>التخصص *</label>
              <select
                value={form.majorGroup}
                onChange={e => setForm(f => ({ ...f, majorGroup: e.target.value, subject: '' }))}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
                required>
                <option value="" style={{ background: '#ffffff', color: '#0d2825' }}>اختر التخصص</option>
                {Object.keys(SUBJECTS_BY_MAJOR).map(g => <option key={g} value={g} style={{ background: '#ffffff', color: '#0d2825' }}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>المادة *</label>
              <select
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
                required disabled={!form.majorGroup}>
                <option value="" style={{ background: '#ffffff', color: '#0d2825' }}>{form.majorGroup ? 'اختر المادة' : '— اختر التخصص —'}</option>
                {(SUBJECTS_BY_MAJOR[form.majorGroup] ?? []).map(s => <option key={s} value={s} style={{ background: '#ffffff', color: '#0d2825' }}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>المستوى الدراسي</label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}>
                <option value="" style={{ background: '#ffffff', color: '#0d2825' }}>كل المستويات</option>
                {ACADEMIC_LEVELS.map(l => (
                  <option key={l.value} value={l.value} style={{ background: '#ffffff', color: '#0d2825' }}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>الفصل الدراسي</label>
              <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}>
                <option style={{ background: '#ffffff', color: '#0d2825' }}>الفصل الأول</option>
                <option style={{ background: '#ffffff', color: '#0d2825' }}>الفصل الثاني</option>
                <option style={{ background: '#ffffff', color: '#0d2825' }}>الفصل الصيفي</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>نوع المحتوى</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(TYPE_LABELS) as [LibraryItemType, string][]).map(([k, v]) => (
                <button key={k} type="button" onClick={() => setForm(f => ({ ...f, type: k }))}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={form.type === k
                    ? { background: '#0d9488', color: '#fff' }
                    : { background: 'rgba(13,148,136,0.07)', color: 'rgba(13,40,37,0.65)', border: '1px solid rgba(13,148,136,0.14)' }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>وصف مختصر</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2} className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
              placeholder="ما الذي يغطيه هذا المحتوى؟" />
          </div>

          {/* File picker — always shown */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>
              {isSummaryType ? 'ملف مرفق (اختياري)' : <>الملف <span style={{ color: '#dc2626' }}>*</span></>}
              {file && <span style={{ color: '#059669' }}> ✓ تم الاختيار</span>}
            </label>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.png,.jpg,.jpeg,.zip"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
            />
            <div
              className="rounded-xl p-4 text-center cursor-pointer transition-all"
              style={{
                border: `2px dashed ${file ? 'rgba(5,150,105,0.40)' : 'rgba(13,148,136,0.22)'}`,
                background: file ? 'rgba(5,150,105,0.05)' : 'rgba(13,148,136,0.03)',
              }}
              onClick={() => fileRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <BookOpen size={18} style={{ color: '#059669' }} />
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: '#059669' }}>{file.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.45)' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB — انقر لتغيير الملف
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={22} className="mx-auto mb-1.5" style={{ color: 'rgba(13,40,37,0.35)' }} />
                  <p className="text-sm" style={{ color: 'rgba(13,40,37,0.60)' }}>
                    اسحب الملف هنا أو{' '}
                    <span style={{ color: '#0d9488' }} className="underline font-semibold">انقر للاختيار من جهازك</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(13,40,37,0.40)' }}>PDF, DOCX, PPTX, MP4 — حد 50MB</p>
                </>
              )}
            </div>
          </div>

          {/* Summary text area — only for summary type */}
          {isSummaryType && (
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(13,40,37,0.70)' }}>
                محتوى الملخص <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={summaryContent}
                onChange={e => setSummaryContent(e.target.value)}
                rows={6}
                placeholder="اكتب محتوى الملخص هنا — يمكن للطلاب تحميله كـ PDF لاحقاً..."
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none"
                style={{ background: '#f7fcfb', border: `1px solid ${summaryContent.trim() ? 'rgba(13,148,136,0.35)' : 'rgba(13,148,136,0.16)'}`, color: '#0d2825', lineHeight: '1.7' }}
              />
              {summaryContent.trim() && (
                <p className="text-xs mt-1" style={{ color: '#059669' }}>✓ {summaryContent.trim().split(/\s+/).length} كلمة</p>
              )}
            </div>
          )}
        </form>

        {/* Fixed footer buttons */}
        <div className="flex gap-3 px-5 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(13,148,136,0.10)' }}>
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(13,148,136,0.06)]"
            style={{ border: '1px solid rgba(13,148,136,0.16)', color: 'rgba(13,40,37,0.65)' }}>
            إلغاء
          </button>
          <button
            onClick={handleSubmit as any}
            disabled={!canSubmit || uploading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
            {uploading ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                </svg>
                جاري الرفع...
              </>
            ) : 'رفع المحتوى'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function LibraryPage() {
  const { currentUser } = useAuth();
  const { libraryItems, addLibraryItem, deleteLibraryItem, approveLibraryItem, rejectLibraryItem } = useApp();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [majorFilter, setMajorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<LibraryItemType | 'all'>('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'date'>('downloads');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedId, setUploadedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [detailItem, setDetailItem] = useState<LibraryItem | null>(null);

  // AI modal state
  const [summaryItem, setSummaryItem] = useState<{ subject: string; title: string; summaryContent?: string } | null>(null);
  const [quizItem, setQuizItem] = useState<{ subject: string; title: string } | null>(null);

  const subjectsForMajor = useMemo(
    () => majorFilter === 'all' ? [] : (SUBJECTS_BY_MAJOR[majorFilter] ?? []),
    [majorFilter]
  );

  // My uploads — all statuses
  const myUploads = useMemo(() =>
    libraryItems.filter(i => i.uploadedById === currentUser?.id),
    [libraryItems, currentUser]
  );

  const filtered = useMemo(() => {
    // Show approved + pending items (exclude only rejected)
    let items = libraryItems.filter(i => i.approvalStatus !== 'rejected');
    if (search) items = items.filter(i =>
      i.title.includes(search) || i.subject.includes(search) || i.description.includes(search)
    );
    if (majorFilter !== 'all') items = items.filter(i => subjectsForMajor.includes(i.subject));
    if (typeFilter !== 'all') items = items.filter(i => i.type === typeFilter);
    if (semesterFilter !== 'all') items = items.filter(i => i.semester === semesterFilter);
    return [...items].sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
  }, [libraryItems, search, majorFilter, subjectsForMajor, typeFilter, semesterFilter, sortBy]);

  function handleUpload(data: any) {
    const newId = `l-${Date.now()}`;
    addLibraryItem({
      id: newId,
      ...data,
      courseName: data.courseName || '',
      academicYear: '2024-2025',
      fileUrl: data.fileUrl || '#',
      summaryContent: data.summaryContent || undefined,
      uploadedById: currentUser?.id ?? 'u1',
      uploadedByName: currentUser?.name ?? '',
      uploadedAt: new Date().toISOString().split('T')[0],
      downloads: 0,
      views: 0,
      rating: 0,
      ratingsCount: 0,
      tags: [],
      college: currentUser?.college ?? '',
      approvalStatus: currentUser?.role === 'admin' ? 'approved' : 'pending',
    });
    setUploadedId(newId);
    setTimeout(() => setUploadedId(null), 5000);
  }

  // Build AIContent from raw summary text so SummaryModal can display it
  function buildAIContentFromText(text: string): import('../data/aiContent').AIContent {
    const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const intro = lines[0] || text;
    const points = lines.slice(1).filter(l => l.length > 8);
    return {
      summary: {
        intro,
        points: points.length > 0 ? points : [text],
        keyTerms: [],
        examTips: [],
      },
      quiz: [],
    };
  }

  return (
    <Layout>
      {/* Guest banner */}
      {!currentUser && (
        <div className="rounded-2xl px-5 py-3 mb-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: 'linear-gradient(135deg,#0d2825,#0f4a42)', border: '1px solid rgba(13,148,136,0.3)' }}>
          <div className="flex items-center gap-3">
            <Sparkles size={18} style={{ color: '#0d9488' }} />
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
              أنت تتصفح كـ <strong style={{ color: '#0d9488' }}>ضيف</strong> — سجّل حساباً للتحميل ورفع الملفات والمزيد
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
      {/* Upload success toast */}
      {uploadedId && (
        <div className="rounded-2xl px-5 py-3 mb-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg,#0d2825,#0f4a42)', border: '1px solid rgba(13,148,136,0.40)' }}>
          <CheckCircle2 size={20} style={{ color: '#0d9488', flexShrink: 0 }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#ffffff' }}>تم الرفع بنجاح ✅</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
              {currentUser?.role === 'admin' ? 'تمت إضافة المحتوى للمكتبة مباشرةً.' : 'المحتوى قيد المراجعة من الإدارة وسيظهر بعد الموافقة.'}
            </p>
          </div>
        </div>
      )}

      {/* Dark header banner */}
      <div className="rounded-3xl p-6 mb-6 relative overflow-hidden flex flex-wrap items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #0d2825 0%, #0f4a42 50%, #0d9488 100%)' }}>
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)', transform: 'translate(-20%, -30%)' }} />
        <div className="relative">
          <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>منصة زمرة</p>
          <h1 className="text-2xl font-black text-white mb-1">المكتبة الرقمية</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{libraryItems.filter(i => i.approvalStatus !== 'rejected').length} ملف محفوظ للأجيال القادمة</p>
        </div>
        {(currentUser?.role === 'mentor' || currentUser?.role === 'admin') && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.30)', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
          >
            <Upload size={18} />
            رفع محتوى جديد
          </button>
        )}
      </div>

      {/* Tab switcher — mentor/admin only */}
      {(currentUser?.role === 'mentor' || currentUser?.role === 'admin') && (
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab('all')}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={activeTab === 'all'
              ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }
              : { background: '#fff', border: '1px solid rgba(13,148,136,0.18)', color: 'rgba(13,40,37,0.60)' }}>
            جميع الملفات
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            style={activeTab === 'mine'
              ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }
              : { background: '#fff', border: '1px solid rgba(13,148,136,0.18)', color: 'rgba(13,40,37,0.60)' }}>
            تم الرفع
            {myUploads.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: activeTab === 'mine' ? 'rgba(255,255,255,0.25)' : 'rgba(13,148,136,0.12)', color: activeTab === 'mine' ? '#fff' : '#0d9488' }}>
                {myUploads.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── My Uploads tab ── */}
      {activeTab === 'mine' && (currentUser?.role === 'mentor' || currentUser?.role === 'admin') && (
        <div className="mb-8">
          {myUploads.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(13,148,136,0.10)' }}>
              <Upload size={40} className="mx-auto mb-3" style={{ color: 'rgba(13,40,37,0.20)' }} />
              <p className="text-sm" style={{ color: 'rgba(13,40,37,0.45)' }}>لم ترفع أي محتوى بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myUploads.map(item => {
                const statusMap = {
                  approved:  { label: 'تمت الموافقة ✅', bg: 'rgba(5,150,105,0.10)', color: '#059669', border: 'rgba(5,150,105,0.25)' },
                  pending:   { label: 'قيد المراجعة ⏳', bg: 'rgba(217,119,6,0.10)', color: '#d97706', border: 'rgba(217,119,6,0.25)' },
                  rejected:  { label: 'مرفوض ❌', bg: 'rgba(220,38,38,0.08)', color: '#dc2626', border: 'rgba(220,38,38,0.22)' },
                };
                const st = statusMap[item.approvalStatus ?? 'approved'];
                const tc = TYPE_COLORS[item.type];
                return (
                  <div key={item.id} className="rounded-2xl p-4 flex items-center gap-4 flex-wrap"
                    style={{ background: '#fff', border: `1px solid ${st.border}`, boxShadow: '0 2px 10px rgba(13,148,136,0.06)' }}>
                    {/* Type badge */}
                    <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                      style={{ background: tc.bg, color: tc.color }}>
                      {TYPE_LABELS[item.type]}
                    </span>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: '#0d2825' }}>{item.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(13,40,37,0.50)' }}>{item.subject} · {item.uploadedAt}</p>
                    </div>
                    {/* Status badge */}
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                      style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                      {st.label}
                    </span>
                    {/* Details button */}
                    <button
                      onClick={() => setDetailItem(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all hover:brightness-110"
                      style={{ background: 'rgba(13,148,136,0.10)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.20)' }}>
                      <Info size={12} /> تفاصيل
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Filters + Grid — only in "all" tab */}
      {activeTab === 'all' && (<>
      <div className="rounded-2xl p-4 mb-6" style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)', boxShadow: '0 2px 10px rgba(13,148,136,0.06)' }}>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(13,40,37,0.40)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث في المكتبة..."
              className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setTypeFilter('all')}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={typeFilter === 'all'
                ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }
                : { background: 'rgba(13,148,136,0.07)', color: 'rgba(13,40,37,0.60)', border: '1px solid rgba(13,148,136,0.12)' }}>
              الكل
            </button>
            {(Object.keys(TYPE_LABELS) as LibraryItemType[]).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                style={typeFilter === t
                  ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }
                  : { background: 'rgba(13,148,136,0.07)', color: 'rgba(13,40,37,0.60)', border: '1px solid rgba(13,148,136,0.12)' }}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          <select
            value={majorFilter}
            onChange={e => setMajorFilter(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-xs focus:outline-none"
            style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
          >
            <option value="all" style={{ background: '#ffffff', color: '#0d2825' }}>كل التخصصات</option>
            {Object.keys(SUBJECTS_BY_MAJOR).map(g => <option key={g} value={g} style={{ background: '#ffffff', color: '#0d2825' }}>{g}</option>)}
          </select>
          <select
            value={semesterFilter}
            onChange={e => setSemesterFilter(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-xs focus:outline-none"
            style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
          >
            <option value="all" style={{ background: '#ffffff', color: '#0d2825' }}>كل الفصول</option>
            <option value="الفصل الأول" style={{ background: '#ffffff', color: '#0d2825' }}>الفصل الأول</option>
            <option value="الفصل الثاني" style={{ background: '#ffffff', color: '#0d2825' }}>الفصل الثاني</option>
            <option value="الفصل الصيفي" style={{ background: '#ffffff', color: '#0d2825' }}>الفصل الصيفي</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="rounded-xl px-3 py-2.5 text-xs focus:outline-none"
            style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)', color: '#0d2825' }}
          >
            <option value="downloads" style={{ background: '#ffffff', color: '#0d2825' }}>الأكثر تحميلاً</option>
            <option value="rating" style={{ background: '#ffffff', color: '#0d2825' }}>الأعلى تقييماً</option>
            <option value="date" style={{ background: '#ffffff', color: '#0d2825' }}>الأحدث</option>
          </select>
        </div>
      </div>


      {/* Results count */}
      <p className="text-sm mb-4" style={{ color: 'rgba(13,40,37,0.55)' }}>{filtered.length} نتيجة</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'rgba(13,40,37,0.25)' }} />
          <p style={{ color: 'rgba(13,40,37,0.45)' }}>لا توجد نتائج مطابقة</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, idx) => {
            const tc = TYPE_COLORS[item.type];
            const hasFile = item.fileUrl && item.fileUrl !== '#';
            const canDownload = hasFile || !!item.summaryContent;
            return (
              <div
                key={item.id}
                className="rounded-2xl transition-all duration-300 overflow-hidden group flex flex-col relative"
                style={{
                  background: '#ffffff',
                  border: item.approvalStatus === 'pending'
                    ? '1px solid rgba(217,119,6,0.35)'
                    : '1px solid rgba(13,148,136,0.14)',
                  boxShadow: '0 4px 20px rgba(13,148,136,0.07)',
                  animationDelay: `${idx * 50}ms`,
                  animation: 'fadeSlideUp 0.4s ease both',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(13,148,136,0.16)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(13,148,136,0.07)'; }}
              >
                {/* Just-uploaded badge */}
                {item.id === uploadedId && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)' }}>
                    <CheckCircle2 size={10} /> تم الرفع
                  </div>
                )}
                {/* Pending badge */}
                {item.approvalStatus === 'pending' && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(217,119,6,0.12)', color: '#d97706', border: '1px solid rgba(217,119,6,0.25)' }}>
                    ⏳ قيد المراجعة
                  </div>
                )}

                {/* Type badge strip */}
                <div className="px-4 py-2 text-xs font-bold flex items-center gap-2"
                  style={{ background: tc.bg, color: tc.color }}>
                  {TYPE_LABELS[item.type]}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-[#0d2825] text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'rgba(13,40,37,0.55)' }}>{item.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs rounded-full px-2 py-0.5 truncate max-w-[120px]"
                      style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.14)' }}>
                      {item.subject}
                    </span>
                    <span className="text-xs flex-shrink-0" style={{ color: 'rgba(13,40,37,0.45)' }}>{item.semester}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'rgba(13,40,37,0.50)' }}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye size={11} />{item.views}</span>
                      <span className="flex items-center gap-1"><Download size={11} />{item.downloads}</span>
                      <span className="flex items-center gap-1 text-amber-500"><Star size={11} className="fill-amber-400" />{item.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
                    <Avatar name={item.uploadedByName} className="w-5 h-5 rounded-full text-[9px]" />
                    <span className="text-xs truncate" style={{ color: 'rgba(13,40,37,0.55)' }}>{item.uploadedByName}</span>
                  </div>

                  {/* Details button */}
                  <button
                    onClick={() => setDetailItem(item)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.14)' }}>
                    <Info size={13} /> تفاصيل
                  </button>

                  {/* Download button */}
                  {hasFile ? (
                    <a
                      href={item.fileUrl}
                      download={(item as any).fileName ?? item.title}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.14)' }}>
                      📎 تحميل الملف المرفق
                    </a>
                  ) : (
                    <button
                      onClick={() => item.summaryContent && generateLibraryItemPDF(item)}
                      disabled={!item.summaryContent}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={item.summaryContent
                        ? { background: 'rgba(13,148,136,0.08)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.14)', cursor: 'pointer' }
                        : { background: 'rgba(13,40,37,0.04)', color: 'rgba(13,40,37,0.28)', border: '1px solid rgba(13,40,37,0.08)', cursor: 'not-allowed' }}>
                      <FileDown size={13} />
                      {item.summaryContent ? 'تحميل PDF' : 'لا يوجد ملف'}
                    </button>
                  )}

                  {/* AI buttons */}
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSummaryItem({ subject: item.subject, title: item.title, summaryContent: item.summaryContent })}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors hover:brightness-105"
                      style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.14)' }}
                    >
                      <Brain size={13} />
                      لخص لي
                    </button>
                    <button
                      onClick={() => setQuizItem({ subject: item.subject, title: item.title })}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors hover:brightness-105"
                      style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.14)' }}
                    >
                      <FileQuestion size={13} />
                      اختبر نفسك
                    </button>
                  </div>

                  {/* Admin: pending item actions */}
                  {currentUser?.role === 'admin' && item.approvalStatus === 'pending' && (
                    <div className="mt-2 rounded-xl p-2.5 space-y-2"
                      style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.18)' }}>
                      <p className="text-[10px] font-bold" style={{ color: '#d97706' }}>⏳ بانتظار مراجعتك</p>
                      {/* Full details button */}
                      <button
                        onClick={() => setDetailItem(item)}
                        className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[10px] font-bold transition-colors hover:brightness-110"
                        style={{ background: 'linear-gradient(135deg,#0d2825,#0f4a42)', color: '#fff' }}>
                        <Info size={11} /> عرض التفاصيل الكاملة وتحميل الملف
                      </button>
                      {/* Preview / download actual file */}
                      {(item.fileUrl && item.fileUrl !== '#') ? (
                        <div className="space-y-1">
                          {(item as any).fileName && (
                            <p className="text-[10px] text-center" style={{ color: 'rgba(13,40,37,0.45)' }}>
                              📎 {(item as any).fileName}
                              {(item as any).fileSize ? ` — ${((item as any).fileSize / 1024 / 1024).toFixed(2)} MB` : ''}
                            </p>
                          )}
                          <a
                            href={item.fileUrl}
                            download={(item as any).fileName ?? item.title}
                            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[10px] font-semibold transition-colors hover:brightness-110"
                            style={{ background: 'rgba(14,116,144,0.12)', color: '#0e7490', border: '1px solid rgba(14,116,144,0.22)' }}>
                            <Download size={11} /> تحميل الملف واستعراضه
                          </a>
                        </div>
                      ) : null}
                      {item.summaryContent ? (
                        <button
                          onClick={() => setSummaryItem({ subject: item.subject, title: item.title, summaryContent: item.summaryContent })}
                          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[10px] font-semibold transition-colors hover:brightness-110"
                          style={{ background: 'rgba(14,116,144,0.12)', color: '#0e7490', border: '1px solid rgba(14,116,144,0.22)' }}>
                          <Eye size={11} /> استعراض محتوى الملخص
                        </button>
                      ) : null}
                      {(!item.fileUrl || item.fileUrl === '#') && !item.summaryContent && (
                        <p className="text-[10px] text-center py-1" style={{ color: 'rgba(13,40,37,0.40)' }}>لا يوجد ملف مرفق</p>
                      )}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => approveLibraryItem(item.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110"
                          style={{ background: 'rgba(5,150,105,0.15)', color: '#059669', border: '1px solid rgba(5,150,105,0.25)' }}>
                          <ThumbsUp size={10} /> موافقة
                        </button>
                        <button
                          onClick={() => rejectLibraryItem(item.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110"
                          style={{ background: 'rgba(220,38,38,0.10)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.20)' }}>
                          <ThumbsDown size={10} /> رفض
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Admin delete button */}
                  {currentUser?.role === 'admin' && (
                    <div className="mt-2">
                      {deleteConfirm === item.id ? (
                        <div className="flex items-center gap-2 p-2 rounded-xl animate-slide-up"
                          style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)' }}>
                          <p className="text-[10px] flex-1 font-medium" style={{ color: '#dc2626' }}>حذف هذا المحتوى نهائياً؟</p>
                          <button
                            onClick={() => { deleteLibraryItem(item.id); setDeleteConfirm(null); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110"
                            style={{ background: 'rgba(220,38,38,0.15)', color: '#dc2626' }}>
                            <Check size={11} /> نعم
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                            style={{ color: 'rgba(13,40,37,0.50)', background: 'rgba(13,40,37,0.06)' }}>
                            <X size={11} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors hover:brightness-105"
                          style={{ background: 'rgba(220,38,38,0.06)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.15)' }}>
                          <Trash2 size={13} />
                          حذف المحتوى
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </>)}

      {/* Modals */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}

      {detailItem && (
        <LibraryDetailsModal
          item={detailItem as any}
          isAdmin={currentUser?.role === 'admin'}
          onClose={() => setDetailItem(null)}
          onApprove={() => { approveLibraryItem(detailItem.id); setDetailItem(null); }}
          onReject={() => { rejectLibraryItem(detailItem.id); setDetailItem(null); }}
          onPreviewSummary={detailItem.summaryContent
            ? () => { setSummaryItem({ subject: detailItem.subject, title: detailItem.title, summaryContent: detailItem.summaryContent }); setDetailItem(null); }
            : undefined}
        />
      )}

      {summaryItem && (
        <SummaryModal
          subject={summaryItem.subject}
          title={summaryItem.title}
          content={summaryItem.summaryContent
            ? buildAIContentFromText(summaryItem.summaryContent)
            : getAIContent(summaryItem.subject)}
          onClose={() => setSummaryItem(null)}
        />
      )}

      {quizItem && (
        <QuizModal
          subject={quizItem.subject}
          title={quizItem.title}
          content={getAIContent(quizItem.subject)}
          onClose={() => setQuizItem(null)}
        />
      )}
    </Layout>
  );
}
