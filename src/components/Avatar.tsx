import React from 'react';

const FEMALE_NAMES_SET = new Set([
  'ريم', 'لين', 'دانا', 'منى', 'رنا', 'شذى', 'دعاء', 'وفاء',
  'هند', 'أمل', 'لمى', 'سلوى', 'نهى', 'إيمان', 'إيناس',
  'سارة', 'فاطمة', 'نورة', 'مريم', 'رهف', 'جود', 'لجين', 'رغد',
  'تالا', 'غلا', 'شيماء', 'أسماء', 'حصة', 'موضي', 'وجدان',
  'رانيا', 'دانيا', 'هناء', 'سناء', 'أميرة', 'نادية', 'سمية',
  'حنان', 'أريج', 'بسمة', 'ثريا', 'جميلة', 'خديجة',
  'ربيعة', 'رحمة', 'زينب', 'سلمى', 'صفاء', 'ضحى', 'عائشة',
  'فرح', 'قمر', 'كوثر', 'لانا', 'ليلى', 'ماجدة', 'ملاك',
  'نجلاء', 'نسرين', 'هبة', 'هيفاء', 'وردة', 'يسرى',
  'أفنان', 'إلهام', 'ابتسام', 'أحلام', 'إشراق', 'بتول',
  'حلا', 'خلود', 'ديمة', 'ريهام', 'زهراء', 'شروق',
  'طيبة', 'عزيزة', 'فوزية', 'لمياء', 'مضاوي',
  'نوف', 'هديل', 'يمنى', 'أبرار', 'إسراء',
  'بدور', 'تهاني', 'جواهر', 'حفصة', 'دلال',
  'ربى', 'زهرة', 'سحر', 'شهد', 'صبا',
  'غادة', 'فدوى', 'لولوة', 'مي',
  'نبيلة', 'هالة', 'ورود', 'يارا',
]);

function isFemale(name: string): boolean {
  const first = name.trim().split(/\s+/)[0];
  if (!first) return false;
  if (first.endsWith('ة')) return true;
  if (first.endsWith('ى')) return true;
  if (first.endsWith('اء')) return true;
  if (first.endsWith('ياء')) return true;
  return FEMALE_NAMES_SET.has(first);
}

/* ─────────────────────────────────────────────
   Modern Male icon — clean minimal silhouette
───────────────────────────────────────────── */
function MaleIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="20" cy="14" r="7" fill="white" fillOpacity="0.95" />
      {/* Body — smooth shoulder arc */}
      <path
        d="M6 38 C6 28.5 12.3 23 20 23 C27.7 23 34 28.5 34 38"
        fill="white" fillOpacity="0.92"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Modern Female icon — hijab silhouette
───────────────────────────────────────────── */
function FemaleIcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hijab dome — semi-transparent so background colour shows through */}
      <path
        d="M20 4 C10 4 6 12 6 20 C6 23.5 7.5 26.5 10 28.5 L30 28.5 C32.5 26.5 34 23.5 34 20 C34 12 30 4 20 4Z"
        fill="white" fillOpacity="0.32"
      />
      {/* Face oval — solid white, clearly visible inside the dome */}
      <ellipse cx="20" cy="18.5" rx="6" ry="6.5" fill="white" fillOpacity="0.97" />
      {/* Hijab chin/neck drape flowing to shoulders */}
      <path
        d="M10 28 C10 32 14.5 34 20 34 C25.5 34 30 32 30 28"
        fill="white" fillOpacity="0.42"
      />
      {/* Body / shoulders */}
      <path
        d="M7 40 C7 31 13.5 27.5 20 27.5 C26.5 27.5 33 31 33 40"
        fill="white" fillOpacity="0.92"
      />
    </svg>
  );
}

interface AvatarProps {
  name: string;
  className?: string;
}

export default function Avatar({ name, className = '' }: AvatarProps) {
  const female = isFemale(name);

  /* Female → warm rose-magenta  |  Male → deep teal-blue */
  const bg = female
    ? 'linear-gradient(145deg, #c2185b 0%, #880e4f 100%)'
    : 'linear-gradient(145deg, #0277bd 0%, #01579b 100%)';

  /* Derive icon size from Tailwind w-* class */
  const m = className.match(/\bw-(\d+)\b/);
  const px = m ? parseInt(m[1]) * 4 : 40;           // Tailwind: w-10 = 40px
  const iconPx = Math.max(16, Math.round(px * 0.82)); // icon is ~82% of container

  return (
    <div
      className={`${className} flex items-center justify-center flex-shrink-0 select-none overflow-hidden`}
      style={{ background: bg }}
      aria-label={name}
      title={name}
    >
      {female ? <FemaleIcon s={iconPx} /> : <MaleIcon s={iconPx} />}
    </div>
  );
}
