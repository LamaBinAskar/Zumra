import React from 'react';
import { X, Download, Eye, Info, Calendar, User, Star, FileDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { LibraryItem } from '../types';

const TYPE_LABELS: Record<string, string> = {
  summary: 'ملخص',
  video: 'فيديو',
  questions: 'بنك أسئلة',
  notes: 'ملاحظات',
  slides: 'شرائح',
};
const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  summary:   { bg: 'rgba(13,148,136,0.10)',  color: '#0d9488' },
  video:     { bg: 'rgba(37,168,157,0.10)',  color: '#0891b2' },
  questions: { bg: 'rgba(96,165,250,0.10)',  color: '#60a5fa' },
  notes:     { bg: 'rgba(217,119,6,0.10)',   color: '#d97706' },
  slides:    { bg: 'rgba(124,58,237,0.10)',  color: '#7c3aed' },
};

interface Props {
  item: LibraryItem & { fileName?: string; fileSize?: number };
  isAdmin: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onPreviewSummary?: () => void;
}

export default function LibraryDetailsModal({ item, isAdmin, onClose, onApprove, onReject, onPreviewSummary }: Props) {
  const tc = TYPE_COLORS[item.type] ?? { bg: 'rgba(13,148,136,0.10)', color: '#0d9488' };
  const hasFile = item.fileUrl && item.fileUrl !== '#';
  const isPending = item.approvalStatus === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,40,37,0.55)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ background: '#fff', border: '1px solid rgba(13,148,136,0.18)', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#0d2825,#0f4a42)', borderBottom: '1px solid rgba(13,148,136,0.20)' }}>
          <div className="flex items-center gap-2">
            <Info size={16} className="text-teal-300" />
            <span className="text-white font-bold text-sm">تفاصيل المحتوى</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={17} className="text-white/70" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Type + status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: tc.bg, color: tc.color }}>
              {TYPE_LABELS[item.type] ?? item.type}
            </span>
            {isPending && (
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(217,119,6,0.12)', color: '#d97706', border: '1px solid rgba(217,119,6,0.25)' }}>
                ⏳ قيد المراجعة
              </span>
            )}
            {item.approvalStatus === 'approved' && (
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(5,150,105,0.10)', color: '#059669', border: '1px solid rgba(5,150,105,0.22)' }}>
                ✅ معتمد
              </span>
            )}
          </div>

          {/* Title + description */}
          <div>
            <h2 className="font-black text-lg leading-snug" style={{ color: '#0d2825' }}>{item.title}</h2>
            {item.description && (
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'rgba(13,40,37,0.60)' }}>{item.description}</p>
            )}
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'المادة',           value: item.subject },
              { label: 'الفصل',            value: item.semester },
              { label: 'المستوى',          value: item.level ? `المستوى ${item.level}` : 'كل المستويات' },
              { label: 'السنة الأكاديمية', value: item.academicYear },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3"
                style={{ background: 'rgba(13,148,136,0.05)', border: '1px solid rgba(13,148,136,0.10)' }}>
                <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'rgba(13,40,37,0.45)' }}>{label}</p>
                <p className="text-xs font-bold" style={{ color: '#0d2825' }}>{value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Uploader */}
          <div className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: 'rgba(13,148,136,0.05)', border: '1px solid rgba(13,148,136,0.10)' }}>
            <User size={15} style={{ color: '#0d9488', flexShrink: 0 }} />
            <div>
              <p className="text-[10px]" style={{ color: 'rgba(13,40,37,0.45)' }}>رُفع بواسطة</p>
              <p className="text-sm font-bold" style={{ color: '#0d2825' }}>{item.uploadedByName}</p>
            </div>
            <div className="mr-auto flex items-center gap-1.5">
              <Calendar size={13} style={{ color: 'rgba(13,40,37,0.35)' }} />
              <span className="text-xs" style={{ color: 'rgba(13,40,37,0.50)' }}>{item.uploadedAt}</span>
            </div>
          </div>

          {/* ── FILE DOWNLOAD ── */}
          {hasFile && (
            <div className="rounded-xl p-4 space-y-2"
              style={{ background: 'rgba(14,116,144,0.06)', border: '2px solid rgba(14,116,144,0.22)' }}>
              <p className="text-xs font-bold" style={{ color: '#0e7490' }}>📎 الملف المرفق</p>
              {item.fileName && (
                <div className="flex items-center gap-2">
                  <FileDown size={14} style={{ color: '#0e7490' }} />
                  <p className="text-xs flex-1 truncate" style={{ color: 'rgba(13,40,37,0.65)' }}>
                    {item.fileName}
                    {item.fileSize ? ` (${(item.fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}
                  </p>
                </div>
              )}
              <a
                href={item.fileUrl}
                download={item.fileName ?? item.title}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#0d2825,#0e7490)', color: '#fff' }}>
                <Download size={15} />
                تحميل الملف واستعراضه
              </a>
            </div>
          )}

          {/* Summary text preview */}
          {item.summaryContent && (
            <div className="rounded-xl p-3 space-y-2"
              style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.12)' }}>
              <p className="text-xs font-bold" style={{ color: '#0d9488' }}>📝 محتوى الملخص</p>
              <p className="text-xs leading-relaxed line-clamp-5" style={{ color: 'rgba(13,40,37,0.65)' }}>
                {item.summaryContent}
              </p>
              {onPreviewSummary && (
                <button onClick={onPreviewSummary}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors hover:brightness-110"
                  style={{ background: 'rgba(13,148,136,0.10)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.18)' }}>
                  <Eye size={12} /> استعراض الملخص كاملاً
                </button>
              )}
            </div>
          )}

          {/* No file */}
          {!hasFile && !item.summaryContent && (
            <p className="text-xs text-center py-3 rounded-xl"
              style={{ background: 'rgba(13,40,37,0.04)', color: 'rgba(13,40,37,0.40)', border: '1px dashed rgba(13,40,37,0.15)' }}>
              لا يوجد ملف مرفق
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-4 pt-1">
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(13,40,37,0.50)' }}>
              <Eye size={12} /> {item.views} مشاهدة
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(13,40,37,0.50)' }}>
              <Download size={12} /> {item.downloads} تحميل
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-500">
              <Star size={12} className="fill-amber-400" /> {item.rating}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(13,148,136,0.10)' }}>
          {isAdmin && isPending && onApprove && onReject ? (
            <>
              <button onClick={() => { onReject(); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110"
                style={{ background: 'rgba(220,38,38,0.10)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.22)' }}>
                <ThumbsDown size={14} /> رفض
              </button>
              <button onClick={() => { onApprove(); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#059669,#0d9488)' }}>
                <ThumbsUp size={14} /> موافقة
              </button>
            </>
          ) : (
            <button onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(13,148,136,0.07)', color: 'rgba(13,40,37,0.65)', border: '1px solid rgba(13,148,136,0.14)' }}>
              إغلاق
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
