// ── Report Generator — HTML + window.print() approach ──────────────────────
// Uses browser's native rendering so Arabic text, Unicode, and all fonts work.

const TODAY_EN = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const TODAY_AR = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

function baseCSS(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Cairo','Segoe UI',Tahoma,Arial,sans-serif;background:#f4f9f8;color:#0d2825;font-size:13px;}
    .no-print{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:10px 20px;background:#0d2825;position:sticky;top:0;z-index:99;}
    .btn{padding:7px 16px;border-radius:8px;border:none;cursor:pointer;font-weight:700;font-size:13px;font-family:inherit;}
    .btn-primary{background:#0d9488;color:#fff;}
    .btn-secondary{background:rgba(255,255,255,0.15);color:#fff;}
    .report{max-width:860px;margin:0 auto;padding:20px 24px 40px;}
    .header{background:linear-gradient(135deg,#0d9488 0%,#0891b2 100%);border-radius:16px;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;color:#fff;}
    .header-logo{width:48px;height:48px;background:rgba(0,0,0,0.20);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;flex-shrink:0;}
    .header-title{font-size:20px;font-weight:900;margin-bottom:2px;}
    .header-sub{font-size:12px;opacity:0.75;}
    .header-date{font-size:11px;opacity:0.65;text-align:left;}
    .section{margin-bottom:20px;}
    .section-title{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:#0d9488;background:#f0f9f8;border-right:4px solid #0d9488;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;}
    .stats-grid{display:grid;gap:10px;margin-bottom:4px;}
    .stat-box{background:#fff;border:1px solid rgba(13,148,136,0.15);border-radius:12px;padding:14px 10px;text-align:center;}
    .stat-value{font-size:22px;font-weight:900;line-height:1;}
    .stat-label{font-size:11px;color:rgba(13,40,37,0.55);margin-top:4px;}
    .card{background:#fff;border:1px solid rgba(13,148,136,0.14);border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 2px 8px rgba(13,148,136,0.07);}
    .profile-name{font-size:18px;font-weight:900;color:#0d2825;margin-bottom:4px;}
    .profile-sub{font-size:12px;color:rgba(13,40,37,0.55);}
    table{width:100%;border-collapse:collapse;font-size:12px;}
    thead tr{background:#0d9488;}
    th{padding:9px 10px;text-align:right;font-weight:700;color:#fff;font-size:11px;}
    td{padding:8px 10px;border-bottom:1px solid rgba(13,148,136,0.09);color:#0d2825;}
    tbody tr:nth-child(even){background:rgba(13,148,136,0.03);}
    tbody tr:hover{background:#f0f9f8;}
    .summary-box{background:linear-gradient(135deg,#f0f9f8,#e6f4f2);border:1px solid rgba(13,148,136,0.20);border-radius:12px;padding:14px 16px;}
    .summary-line{font-size:12px;line-height:1.8;color:#0d2825;}
    .summary-line.highlight{color:#0d9488;font-weight:700;}
    .badge-grid{display:flex;flex-wrap:wrap;gap:8px;}
    .badge{background:rgba(13,148,136,0.10);color:#0d9488;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600;}
    .chip{display:inline-block;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;}
    .footer{text-align:center;color:rgba(13,40,37,0.40);font-size:11px;padding:16px;border-top:1px solid rgba(13,148,136,0.12);margin-top:24px;}
    .gap-high{color:#dc2626;font-weight:700;}
    .gap-mid{color:#d97706;font-weight:700;}
    .gap-low{color:#059669;font-weight:700;}
    @media print{
      .no-print{display:none!important;}
      body{background:#fff;}
      .header{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      thead tr{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    }
  `;
}

function openReport(html: string) {
  const w = window.open('', '_blank', 'width=960,height=800');
  if (!w) {
    alert('Please allow popups in your browser to view the report.');
    return;
  }
  w.document.write(html);
  w.document.close();
  // Let the page load fonts, then auto-print
  w.onload = () => setTimeout(() => { w.focus(); }, 300);
}

function toolbar(filename: string): string {
  return `
    <div class="no-print">
      <span style="color:rgba(255,255,255,0.55);font-size:12px;margin-left:auto;">${filename}</span>
      <button class="btn btn-secondary" onclick="window.close()">✕ إغلاق</button>
      <button class="btn btn-primary" onclick="window.print()">🖨 طباعة / حفظ PDF</button>
    </div>`;
}

// ────────────────────────────────────────────────────────────────────────────
// 1. ADMIN REPORT
// ────────────────────────────────────────────────────────────────────────────
export function generateAdminReport(data: {
  totalStudents: number;
  totalMentors: number;
  totalSessions: number;
  totalCertificates: number;
  totalLibraryItems: number;
  activeSessionsToday: number;
  topMentors: { name: string; sessions: number; rating: number }[];
  popularSubjects: { name: string; count: number }[];
  monthlyActivity: { month: string; sessions: number; uploads: number }[];
}) {
  const sorted = [...data.popularSubjects].sort((a, b) => b.count - a.count);
  const top5 = sorted.slice(0, 5);
  const total = sorted.reduce((s, x) => s + x.count, 0) || 1;
  const avgMPSubject = data.totalMentors / Math.max(data.popularSubjects.length, 1);

  const statsGrid = [
    { label: 'الطلاب المسجلون', value: data.totalStudents, color: '#0d9488' },
    { label: 'المرشدون النشطون', value: data.totalMentors, color: '#0891b2' },
    { label: 'إجمالي الجلسات', value: data.totalSessions, color: '#059669' },
    { label: 'الشهادات الصادرة', value: data.totalCertificates, color: '#d97706' },
    { label: 'ملفات المكتبة', value: data.totalLibraryItems, color: '#7c3aed' },
    { label: 'نشطة اليوم', value: data.activeSessionsToday, color: '#ea580c' },
  ].map(s => `
    <div class="stat-box">
      <div class="stat-value" style="color:${s.color}">${s.value.toLocaleString()}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');

  const mentorRows = data.topMentors.map((m, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="font-weight:600">${m.name}</td>
      <td style="text-align:center">${m.sessions}</td>
      <td style="text-align:center;color:#d97706;font-weight:700">★ ${m.rating}</td>
    </tr>`).join('');

  const monthRows = data.monthlyActivity.map(m => `
    <tr>
      <td>${m.month}</td>
      <td style="text-align:center">${m.sessions}</td>
      <td style="text-align:center">${m.uploads}</td>
    </tr>`).join('');

  const gapRows = top5.map(s => {
    const share = ((s.count / total) * 100).toFixed(1);
    const demand = s.count / Math.max(avgMPSubject, 1);
    const [gapLabel, gapClass] = demand > 3
      ? ['عالٍ جداً 🔴', 'gap-high']
      : demand > 2
      ? ['عالٍ 🟠', 'gap-mid']
      : demand > 1
      ? ['متوسط 🟡', 'gap-mid']
      : ['منخفض 🟢', 'gap-low'];
    return `<tr>
      <td style="font-weight:600">${s.name}</td>
      <td style="text-align:center">${s.count}</td>
      <td style="text-align:center">${share}%</td>
      <td style="text-align:center"><span class="${gapClass}">${gapLabel}</span></td>
    </tr>`;
  }).join('');

  const subjectRows = sorted.slice(0, 15).map(s => `
    <tr>
      <td>${s.name}</td>
      <td style="text-align:center">${s.count}</td>
      <td style="text-align:center">${((s.count / total) * 100).toFixed(1)}%</td>
    </tr>`).join('');

  const recs = [
    `توظيف مرشدين إضافيين في: ${top5[0]?.name ?? '—'} و ${top5[1]?.name ?? '—'} (أعلى طلب)`,
    `تكثيف الجلسات الجماعية لتغطية الطلب المرتفع في المواد التقنية`,
    `مراجعة جودة محتوى المكتبة للمواد ذات الفجوة العالية`,
    `استقطاب مرشدين جدد (الهدف: ${Math.ceil(data.totalMentors * 1.2)} مرشداً)`,
  ].map((r, i) => `<div class="summary-line${i === 0 ? ' highlight' : ''}">• ${r}</div>`).join('');

  const sessionGrowthRate = data.monthlyActivity.length >= 2
    ? data.monthlyActivity[data.monthlyActivity.length - 1].sessions - data.monthlyActivity[data.monthlyActivity.length - 2].sessions
    : 0;
  const certRatio = data.totalSessions > 0 ? Math.round((data.totalCertificates / data.totalSessions) * 100) : 0;

  const futureSuggestions = [
    { icon: '👥', text: `استهداف تسجيل ${Math.ceil(data.totalStudents * 1.25).toLocaleString()} طالباً في الفصل القادم (+25%)`, priority: 'high' },
    { icon: '🏫', text: `فتح تخصصات إرشاد جديدة في المواد ذات الطلب العالي: ${top5.slice(0,2).map(s=>s.name).join('، ')}`, priority: 'high' },
    { icon: '📈', text: sessionGrowthRate >= 0 ? `الاستمرار في نمو الجلسات — المعدل الحالي إيجابي (+${sessionGrowthRate} جلسة)` : `معالجة انخفاض الجلسات (${sessionGrowthRate}) بحملة تفعيل للمنصة`, priority: sessionGrowthRate >= 0 ? 'medium' : 'high' },
    { icon: '🏅', text: certRatio < 30 ? `رفع معدل إصدار الشهادات (حالياً ${certRatio}%) بتحديد معايير واضحة للتأهل` : `الحفاظ على معدل إصدار الشهادات الجيد (${certRatio}%)`, priority: certRatio < 30 ? 'medium' : 'low' },
    { icon: '📚', text: `إضافة ${Math.ceil(data.totalLibraryItems * 0.3)} محتوى تعليمي جديد للمكتبة الرقمية في الفصل القادم`, priority: 'medium' },
    { icon: '⭐', text: `إطلاق برنامج تقدير للمرشدين المتميزين وتوفير حوافز لأعلى تقييمات`, priority: 'low' },
    { icon: '🤝', text: `تنظيم يوم مفتوح أو معرض إرشادي لزيادة وعي الطلاب بالمنصة`, priority: 'low' },
  ];

  const futureHTML = futureSuggestions.map(s => {
    const color = s.priority === 'high' ? '#dc2626' : s.priority === 'medium' ? '#d97706' : '#059669';
    const label = s.priority === 'high' ? 'عاجل' : s.priority === 'medium' ? 'مهم' : 'مقترح';
    return `<div class="summary-line" style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid rgba(13,148,136,0.08)">
      <span style="font-size:15px;flex-shrink:0">${s.icon}</span>
      <span style="flex:1">${s.text}</span>
      <span class="chip" style="background:${color}18;color:${color};border:1px solid ${color}30;flex-shrink:0">${label}</span>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>Zumra - Admin Report</title>
<style>${baseCSS()}</style></head>
<body>
${toolbar('Admin-Report')}
<div class="report">
  <div class="header">
    <div class="header-logo">Z</div>
    <div style="flex:1;padding:0 16px">
      <div class="header-title">تقرير لوحة التحكم الإدارية</div>
      <div class="header-sub">منصة زمرة — Administrative Dashboard Report</div>
    </div>
    <div class="header-date">${TODAY_AR}<br>${TODAY_EN}</div>
  </div>

  <div class="section">
    <div class="section-title">📊 إحصائيات المنصة</div>
    <div class="stats-grid" style="grid-template-columns:repeat(6,1fr)">${statsGrid}</div>
  </div>

  <div class="section">
    <div class="section-title">🏆 أداء أفضل المرشدين</div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr><th>#</th><th>اسم المرشد</th><th style="text-align:center">الجلسات</th><th style="text-align:center">التقييم</th></tr></thead>
        <tbody>${mentorRows}</tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <div class="section-title">📅 النشاط الشهري</div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr><th>الشهر</th><th style="text-align:center">الجلسات</th><th style="text-align:center">المحتوى المرفوع</th></tr></thead>
        <tbody>${monthRows}</tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🔍 تحليل الفجوات التعليمية</div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr><th>المادة</th><th style="text-align:center">عدد الطلبات</th><th style="text-align:center">النسبة</th><th style="text-align:center">مستوى الفجوة</th></tr></thead>
        <tbody>${gapRows}</tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <div class="section-title">💡 التوصيات الاستراتيجية</div>
    <div class="summary-box">${recs}</div>
  </div>

  <div class="section">
    <div class="section-title">📚 جميع المواد حسب الطلب</div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr><th>المادة</th><th style="text-align:center">عدد الطلبات</th><th style="text-align:center">النسبة</th></tr></thead>
        <tbody>${subjectRows}</tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🚀 اقتراحات للفصل القادم</div>
    <div class="summary-box" style="padding:12px 16px">${futureHTML}</div>
  </div>

  <div class="footer">Zumra — Academic Mentoring Platform | Prince Sattam bin Abdulaziz University</div>
</div>
</body></html>`;
  openReport(html);
}

// ────────────────────────────────────────────────────────────────────────────
// 2. MENTOR REPORT
// ────────────────────────────────────────────────────────────────────────────
export function generateMentorReport(data: {
  name: string;
  college: string;
  major: string;
  subjects: string[];
  rating: number;
  totalSessions: number;
  totalStudents: number;
  points: number;
  available: boolean;
  sessions: { date: string; studentName: string; subject: string; topic: string; status: string; duration: number }[];
  certificates: { type: string; sessionsCount: number; averageRating: number; issuedAt: string }[];
  libraryItems: { title: string; subject: string; type: string; downloads: number }[];
}) {
  const statsGrid = [
    { label: 'إجمالي الجلسات', value: String(data.totalSessions), color: '#059669' },
    { label: 'الطلاب المُرشَدون', value: String(data.totalStudents), color: '#0891b2' },
    { label: 'متوسط التقييم', value: `★ ${data.rating}`, color: '#d97706' },
    { label: 'النقاط المكتسبة', value: String(data.points), color: '#0d9488' },
    { label: 'الحالة', value: data.available ? 'متاح ✓' : 'غير متاح', color: data.available ? '#059669' : '#dc2626' },
  ].map(s => `
    <div class="stat-box">
      <div class="stat-value" style="color:${s.color}">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');

  const STATUS_AR: Record<string, string> = {
    completed: 'مكتملة ✓', confirmed: 'مؤكدة', pending: 'معلقة', cancelled: 'ملغاة',
  };

  const sessionRows = data.sessions.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.studentName}</td>
      <td>${s.subject}</td>
      <td>${s.topic}</td>
      <td style="text-align:center">${s.duration} د</td>
      <td style="text-align:center;font-weight:600">${STATUS_AR[s.status] ?? s.status}</td>
    </tr>`).join('');

  const CERT_LABELS: Record<string, string> = {
    outstanding: 'شهادة تميز استثنائي',
    excellence: 'شهادة تفوق',
    appreciation: 'شهادة شكر وتقدير',
  };

  const certRows = data.certificates.map(c => `
    <tr>
      <td style="font-weight:600">${CERT_LABELS[c.type] ?? c.type}</td>
      <td style="text-align:center">${c.sessionsCount}</td>
      <td style="text-align:center;color:#d97706;font-weight:700">★ ${c.averageRating}</td>
      <td>${c.issuedAt}</td>
    </tr>`).join('');

  const libRows = data.libraryItems.map(l => `
    <tr>
      <td>${l.title}</td>
      <td>${l.subject}</td>
      <td><span class="chip" style="background:rgba(13,148,136,0.10);color:#0d9488">${l.type}</span></td>
      <td style="text-align:center;font-weight:700;color:#0d9488">${l.downloads}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>Zumra - Mentor Report - ${data.name}</title>
<style>${baseCSS()}</style></head>
<body>
${toolbar(`Mentor-${data.name}`)}
<div class="report">
  <div class="header">
    <div class="header-logo">Z</div>
    <div style="flex:1;padding:0 16px">
      <div class="header-title">تقرير أداء المرشد</div>
      <div class="header-sub">Mentor Performance Report — منصة زمرة</div>
    </div>
    <div class="header-date">${TODAY_AR}<br>${TODAY_EN}</div>
  </div>

  <div class="card">
    <div class="profile-name">${data.name}</div>
    <div class="profile-sub">${data.college} &nbsp;|&nbsp; ${data.major}</div>
    <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px">
      ${data.subjects.slice(0, 5).map(s => `<span class="badge">${s}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">📊 إحصائيات الأداء</div>
    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">${statsGrid}</div>
  </div>

  ${data.sessions.length > 0 ? `
  <div class="section">
    <div class="section-title">📅 سجل الجلسات (${data.sessions.length})</div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr><th>التاريخ</th><th>الطالب</th><th>المادة</th><th>الموضوع</th><th style="text-align:center">المدة</th><th style="text-align:center">الحالة</th></tr></thead>
        <tbody>${sessionRows}</tbody>
      </table>
    </div>
  </div>` : ''}

  ${data.certificates.length > 0 ? `
  <div class="section">
    <div class="section-title">🏅 الشهادات (${data.certificates.length})</div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr><th>نوع الشهادة</th><th style="text-align:center">الجلسات</th><th style="text-align:center">التقييم</th><th>التاريخ</th></tr></thead>
        <tbody>${certRows}</tbody>
      </table>
    </div>
  </div>` : ''}

  ${data.libraryItems.length > 0 ? `
  <div class="section">
    <div class="section-title">📚 المحتوى المرفوع (${data.libraryItems.length})</div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr><th>العنوان</th><th>المادة</th><th style="text-align:center">النوع</th><th style="text-align:center">التحميلات</th></tr></thead>
        <tbody>${libRows}</tbody>
      </table>
    </div>
  </div>` : ''}

  <div class="section">
    <div class="section-title">🚀 اقتراحات لتطوير أدائك</div>
    <div class="summary-box" style="padding:12px 16px">
      ${(() => {
        const suggestions = [];
        if (data.rating < 4.0) suggestions.push({ icon: '⭐', text: 'التركيز على تحسين جودة الجلسات — استهدف تقييماً فوق 4.0 بالاستفسار من الطلاب عن ملاحظاتهم', priority: 'high' });
        else if (data.rating >= 4.5) suggestions.push({ icon: '🏆', text: `تقييمك ممتاز (★ ${data.rating}) — تقدّم لبرنامج المرشدين المميزين في المنصة`, priority: 'low' });
        else suggestions.push({ icon: '📈', text: `تقييمك جيد (★ ${data.rating}) — زيادة التفاعل مع الطلاب سيرفعه للمستوى الممتاز`, priority: 'medium' });

        if (data.totalSessions < 10) suggestions.push({ icon: '📅', text: 'زيادة عدد الجلسات — حاول الوصول لـ 10 جلسات للحصول على شهادة التقدير الأولى', priority: 'high' });
        else if (data.totalSessions < 25) suggestions.push({ icon: '📅', text: `${25 - data.totalSessions} جلسة تفصلك عن شهادة التفوق — استمر في الجدولة المنتظمة`, priority: 'medium' });
        else suggestions.push({ icon: '🎯', text: `أنجزت ${data.totalSessions} جلسة — استهدف ${Math.ceil(data.totalSessions * 1.3)} جلسة في الفصل القادم`, priority: 'low' });

        if (data.libraryItems.length === 0) suggestions.push({ icon: '📚', text: 'لم ترفع محتوى بعد — ابدأ برفع ملخص أو بنك أسئلة لزيادة نقاطك وإفادة الطلاب', priority: 'high' });
        else if (data.libraryItems.length < 5) suggestions.push({ icon: '📚', text: `لديك ${data.libraryItems.length} محتوى — الهدف 5+ ملفات لزيادة تأثيرك في المنصة`, priority: 'medium' });

        if (!data.available) suggestions.push({ icon: '🟢', text: 'حالتك "غير متاح" — فعّل الإتاحة لاستقبال حجوزات جديدة من الطلاب', priority: 'high' });

        suggestions.push({ icon: '🤝', text: `تنويع المواد المُدرَّسة — حالياً ${data.subjects.length} مادة، إضافة مادة جديدة يوسّع قاعدة طلابك`, priority: 'medium' });
        suggestions.push({ icon: '💬', text: 'طلب تغذية راجعة من الطلاب بعد كل جلسة لتحسين أسلوب الإرشاد المستمر', priority: 'low' });

        return suggestions.map(s => {
          const color = s.priority === 'high' ? '#dc2626' : s.priority === 'medium' ? '#d97706' : '#059669';
          const label = s.priority === 'high' ? 'عاجل' : s.priority === 'medium' ? 'مهم' : 'مقترح';
          return `<div class="summary-line" style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid rgba(13,148,136,0.08)">
            <span style="font-size:15px;flex-shrink:0">${s.icon}</span>
            <span style="flex:1">${s.text}</span>
            <span class="chip" style="background:${color}18;color:${color};border:1px solid ${color}30;flex-shrink:0">${label}</span>
          </div>`;
        }).join('');
      })()}
    </div>
  </div>

  <div class="footer">Zumra — Academic Mentoring Platform | Prince Sattam bin Abdulaziz University</div>
</div>
</body></html>`;
  openReport(html);
}

// ────────────────────────────────────────────────────────────────────────────
// 3. STUDENT REPORT
// ────────────────────────────────────────────────────────────────────────────
export function generateStudentReport(data: {
  name: string;
  college: string;
  major: string;
  year: number;
  points: number;
  badges: { name: string; type: string }[];
  sessions: { date: string; mentorName: string; subject: string; topic: string; status: string; duration: number; rating?: number }[];
  libraryItems: { title: string; subject: string; type: string; uploadedByName: string }[];
}) {
  const completedSessions = data.sessions.filter(s => s.status === 'completed');
  const cancelledSessions = data.sessions.filter(s => s.status === 'cancelled');
  const totalHours = Math.round(completedSessions.reduce((a, s) => a + s.duration, 0) / 60 * 10) / 10;
  const avgRatingNum = completedSessions.filter(s => s.rating).length
    ? completedSessions.filter(s => s.rating).reduce((a, s) => a + (s.rating ?? 0), 0) / completedSessions.filter(s => s.rating).length
    : 0;
  const avgRating = avgRatingNum ? `★ ${avgRatingNum.toFixed(1)}` : '—';
  const completionRate = data.sessions.length
    ? ((completedSessions.length / data.sessions.length) * 100).toFixed(0) : '0';
  const subjectsCovered = [...new Set(completedSessions.map(s => s.subject))];

  const statsGrid = [
    { label: 'الجلسات المكتملة', value: String(completedSessions.length), color: '#059669' },
    { label: 'إجمالي الجلسات', value: String(data.sessions.length), color: '#0891b2' },
    { label: 'ساعات التعلم', value: `${totalHours}h`, color: '#0d9488' },
    { label: 'النقاط المكتسبة', value: String(data.points), color: '#d97706' },
    { label: 'متوسط التقييم', value: avgRating, color: '#d97706' },
  ].map(s => `
    <div class="stat-box">
      <div class="stat-value" style="color:${s.color}">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');

  const STATUS_AR: Record<string, string> = {
    completed: 'مكتملة ✓', confirmed: 'مؤكدة', pending: 'معلقة', cancelled: 'ملغاة',
  };
  const STATUS_COLOR: Record<string, string> = {
    completed: '#059669', confirmed: '#0d9488', pending: '#d97706', cancelled: '#dc2626',
  };

  const sessionRows = data.sessions.map(s => `
    <tr>
      <td>${s.date}</td>
      <td style="font-weight:600">${s.mentorName}</td>
      <td>${s.subject}</td>
      <td>${s.topic}</td>
      <td style="text-align:center">${s.duration} د</td>
      <td style="text-align:center;font-weight:600;color:${STATUS_COLOR[s.status] ?? '#0d2825'}">${STATUS_AR[s.status] ?? s.status}</td>
      <td style="text-align:center;color:#d97706">${s.rating ? `★ ${s.rating}` : '—'}</td>
    </tr>`).join('');

  const recMsg = Number(completionRate) >= 75
    ? 'أداء ممتاز — استمر في نفس الوتيرة!'
    : Number(completionRate) >= 50
    ? 'أداء جيد — زيادة عدد الجلسات ستُسرّع تقدمك'
    : 'يُنصح بجدولة جلسات منتظمة لتحسين الأداء الأكاديمي';

  const badgesHTML = data.badges.length
    ? `<div class="badge-grid">${data.badges.map(b => `<span class="badge">${b.name}</span>`).join('')}</div>`
    : '<p style="color:rgba(13,40,37,0.45);font-size:12px">لا توجد شارات بعد</p>';

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>Zumra - Student Report - ${data.name}</title>
<style>${baseCSS()}</style></head>
<body>
${toolbar(`Student-${data.name}`)}
<div class="report">
  <div class="header">
    <div class="header-logo">Z</div>
    <div style="flex:1;padding:0 16px">
      <div class="header-title">تقرير التقدم الأكاديمي</div>
      <div class="header-sub">Academic Progress Report — منصة زمرة</div>
    </div>
    <div class="header-date">${TODAY_AR}<br>${TODAY_EN}</div>
  </div>

  <div class="card">
    <div class="profile-name">${data.name}</div>
    <div class="profile-sub">${data.college} &nbsp;|&nbsp; ${data.major}</div>
    <div class="profile-sub" style="margin-top:4px">المستوى الدراسي: ${data.year} &nbsp;|&nbsp; تاريخ التقرير: ${TODAY_AR}</div>
  </div>

  <div class="section">
    <div class="section-title">📊 الإحصائيات الأكاديمية</div>
    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">${statsGrid}</div>
  </div>

  ${data.sessions.length > 0 ? `
  <div class="section">
    <div class="section-title">📅 سجل جلسات الإرشاد الأكاديمي (${data.sessions.length})</div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr><th>التاريخ</th><th>المرشد</th><th>المادة</th><th>الموضوع</th><th style="text-align:center">المدة</th><th style="text-align:center">الحالة</th><th style="text-align:center">التقييم</th></tr></thead>
        <tbody>${sessionRows}</tbody>
      </table>
    </div>
  </div>` : ''}

  <div class="section">
    <div class="section-title">📈 ملخص التقدم الدراسي</div>
    <div class="summary-box">
      <div class="summary-line">نسبة إتمام الجلسات: <strong>${completionRate}%</strong> &nbsp;|&nbsp; الجلسات الملغاة: <strong>${cancelledSessions.length}</strong> &nbsp;|&nbsp; الشارات: <strong>${data.badges.length}</strong></div>
      ${subjectsCovered.length > 0 ? `<div class="summary-line">المواد التي تمت مراجعتها: ${subjectsCovered.join(' · ')}</div>` : ''}
      <div class="summary-line highlight" style="margin-top:6px">💡 ${recMsg}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🏅 الشارات المكتسبة (${data.badges.length})</div>
    <div class="card">${badgesHTML}</div>
  </div>

  <div class="section">
    <div class="section-title">🚀 اقتراحات لتحسين مسيرتك الأكاديمية</div>
    <div class="summary-box" style="padding:12px 16px">
      ${(() => {
        const suggestions = [];
        const cr = Number(completionRate);

        if (cr < 50) suggestions.push({ icon: '📅', text: 'جدوِل جلسات أسبوعية منتظمة — الاستمرارية هي مفتاح التقدم الأكاديمي', priority: 'high' });
        else if (cr < 75) suggestions.push({ icon: '📅', text: `نسبة الإتمام ${completionRate}% — حاول تقليل الإلغاءات للوصول لـ 75% أو أكثر`, priority: 'medium' });
        else suggestions.push({ icon: '🎉', text: `نسبة إتمام ممتازة ${completionRate}% — استمر في هذا الانتظام الرائع!`, priority: 'low' });

        if (completedSessions.length < 5) suggestions.push({ icon: '🎯', text: 'أكمل 5 جلسات للحصول على أول شارة إنجاز وابدأ رحلتك الأكاديمية', priority: 'high' });
        else if (completedSessions.length < 10) suggestions.push({ icon: '🎯', text: `${10 - completedSessions.length} جلسات تفصلك عن مستوى جديد — واصل التقدم!`, priority: 'medium' });

        if (subjectsCovered.length < 2) suggestions.push({ icon: '📖', text: 'استكشف مواد جديدة — التنوع في الإرشاد يُثري فهمك ويفتح آفاقاً أوسع', priority: 'medium' });
        else suggestions.push({ icon: '📖', text: `غطّيت ${subjectsCovered.length} مادة — جرّب إضافة مادة تحديّة جديدة في الفصل القادم`, priority: 'low' });

        if (data.badges.length === 0) suggestions.push({ icon: '🏅', text: 'لا شارات بعد — أكمل جلستك القادمة لتبدأ في جمع الإنجازات', priority: 'high' });
        else suggestions.push({ icon: '🏅', text: `لديك ${data.badges.length} شارة — تابع تحقيق المزيد لترتفع في لوحة الشرف`, priority: 'low' });

        if (data.libraryItems.length === 0) suggestions.push({ icon: '📚', text: 'استفد من المكتبة الرقمية — هناك ملخصات وبنوك أسئلة قد تساعدك في مراجعاتك', priority: 'medium' });

        suggestions.push({ icon: '💬', text: 'قيّم مرشديك بعد كل جلسة — تغذيتك الراجعة تساعدهم على تحسين الإرشاد', priority: 'low' });
        suggestions.push({ icon: '👥', text: 'انضم إلى غرف النقاش في المنصة لتبادل الخبرات مع زملائك', priority: 'low' });

        return suggestions.map(s => {
          const color = s.priority === 'high' ? '#dc2626' : s.priority === 'medium' ? '#d97706' : '#059669';
          const label = s.priority === 'high' ? 'ضروري' : s.priority === 'medium' ? 'مهم' : 'مقترح';
          return `<div class="summary-line" style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid rgba(13,148,136,0.08)">
            <span style="font-size:15px;flex-shrink:0">${s.icon}</span>
            <span style="flex:1">${s.text}</span>
            <span class="chip" style="background:${color}18;color:${color};border:1px solid ${color}30;flex-shrink:0">${label}</span>
          </div>`;
        }).join('');
      })()}
    </div>
  </div>

  <div class="footer">Zumra — Academic Mentoring Platform | Prince Sattam bin Abdulaziz University</div>
</div>
</body></html>`;
  openReport(html);
}

// ────────────────────────────────────────────────────────────────────────────
// 4. LIBRARY ITEM PDF
// ────────────────────────────────────────────────────────────────────────────
export function generateLibraryItemPDF(item: {
  title: string;
  description: string;
  subject: string;
  courseName?: string;
  semester: string;
  academicYear?: string;
  type: string;
  uploadedByName: string;
  uploadedAt: string;
  college?: string;
  downloads: number;
  views: number;
  rating: number;
  tags?: string[];
  approvalStatus?: string;
  summaryContent?: string;
}) {
  const TYPE_LABELS: Record<string, string> = {
    summary: 'ملخص', video: 'فيديو', questions: 'بنك أسئلة', notes: 'ملاحظات', slides: 'شرائح',
  };
  const TYPE_COLORS: Record<string, string> = {
    summary: '#0d9488', video: '#0891b2', questions: '#60a5fa', notes: '#d97706', slides: '#7c3aed',
  };
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;
  const typeColor = TYPE_COLORS[item.type] ?? '#0d9488';
  const tagsHTML = item.tags && item.tags.length > 0
    ? `<div class="badge-grid">${item.tags.map(t => `<span class="badge">#${t}</span>`).join('')}</div>`
    : '';
  const statusBadge = item.approvalStatus === 'pending'
    ? `<span class="chip" style="background:rgba(217,119,6,0.12);color:#d97706;border:1px solid rgba(217,119,6,0.25)">⏳ قيد المراجعة</span>`
    : `<span class="chip" style="background:rgba(5,150,105,0.12);color:#059669;border:1px solid rgba(5,150,105,0.25)">✓ موافق عليه</span>`;

  const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head>
<meta charset="UTF-8"/>
<title>${item.title}</title>
<style>${baseCSS()}
  .item-type-strip{background:${typeColor};color:#fff;padding:8px 20px;border-radius:10px;font-weight:700;font-size:13px;display:inline-block;margin-bottom:16px;}
  .meta-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;}
  .meta-cell{flex:1;min-width:140px;background:#f8fdfc;border:1px solid rgba(13,148,136,0.13);border-radius:10px;padding:10px 14px;}
  .meta-cell .label{font-size:10px;color:rgba(13,40,37,0.50);margin-bottom:3px;font-weight:600;}
  .meta-cell .value{font-size:13px;font-weight:700;color:#0d2825;}
  .desc-box{background:#f4f9f8;border:1px solid rgba(13,148,136,0.15);border-radius:12px;padding:16px;line-height:1.9;font-size:13px;color:#0d2825;}
  .stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
</style>
</head><body>
${toolbar(item.title)}
<div class="report">

  <div class="header">
    <div>
      <div class="header-title">📄 ${item.title}</div>
      <div class="header-sub">${item.subject} · ${typeLabel} · ${item.semester}</div>
    </div>
    <div style="text-align:left">
      <div style="margin-bottom:6px">${statusBadge}</div>
      <div class="header-date">${TODAY_AR}</div>
    </div>
  </div>

  <div><span class="item-type-strip">${typeLabel}</span></div>

  <div class="meta-row">
    <div class="meta-cell"><div class="label">المادة</div><div class="value">${item.subject}</div></div>
    <div class="meta-cell"><div class="label">الفصل الدراسي</div><div class="value">${item.semester}</div></div>
    ${item.college ? `<div class="meta-cell"><div class="label">الكلية</div><div class="value">${item.college}</div></div>` : ''}
    ${item.courseName ? `<div class="meta-cell"><div class="label">المقرر</div><div class="value">${item.courseName}</div></div>` : ''}
    <div class="meta-cell"><div class="label">رُفع بواسطة</div><div class="value">${item.uploadedByName}</div></div>
    <div class="meta-cell"><div class="label">تاريخ الرفع</div><div class="value">${item.uploadedAt}</div></div>
    ${item.academicYear ? `<div class="meta-cell"><div class="label">العام الدراسي</div><div class="value">${item.academicYear}</div></div>` : ''}
  </div>

  ${item.description ? `
  <div class="section">
    <div class="section-title">📝 وصف المحتوى</div>
    <div class="desc-box">${item.description}</div>
  </div>` : ''}

  ${item.summaryContent ? `
  <div class="section">
    <div class="section-title">📄 محتوى الملخص</div>
    <div class="card" style="line-height:2;font-size:13px;color:#0d2825;white-space:pre-wrap;">${item.summaryContent}</div>
  </div>` : ''}

  <div class="section">
    <div class="section-title">📊 إحصائيات المحتوى</div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-value" style="color:#0d9488">${item.downloads}</div><div class="stat-label">تحميل</div></div>
      <div class="stat-box"><div class="stat-value" style="color:#0891b2">${item.views}</div><div class="stat-label">مشاهدة</div></div>
      <div class="stat-box"><div class="stat-value" style="color:#d97706">★ ${item.rating > 0 ? item.rating.toFixed(1) : '—'}</div><div class="stat-label">تقييم</div></div>
    </div>
  </div>

  ${item.tags && item.tags.length > 0 ? `
  <div class="section">
    <div class="section-title">🏷 الكلمات المفتاحية</div>
    <div class="card">${tagsHTML}</div>
  </div>` : ''}

  <div class="section">
    <div class="section-title">🚀 اقتراحات لتحسين هذا المحتوى</div>
    <div class="summary-box" style="padding:12px 16px">
      ${(() => {
        const suggestions = [];

        if (item.downloads < 10) suggestions.push({ icon: '📢', text: 'شارك الرابط مع زملائك في المقرر لزيادة التحميلات والوصول لجمهور أوسع', priority: 'high' });
        else if (item.downloads < 50) suggestions.push({ icon: '📢', text: `${item.downloads} تحميل — انشر في غرف النقاش لزيادة انتشار المحتوى`, priority: 'medium' });
        else suggestions.push({ icon: '🎉', text: `${item.downloads} تحميل — محتوى شائع! فكّر في رفع نسخة محدّثة أو محتوى تكميلي`, priority: 'low' });

        if (item.rating > 0 && item.rating < 3.5) suggestions.push({ icon: '✏️', text: 'التقييم منخفض — راجع المحتوى وحدّثه بناءً على ملاحظات الطلاب لتحسين الجودة', priority: 'high' });
        else if (item.rating >= 4.5) suggestions.push({ icon: '⭐', text: `تقييم ممتاز (★ ${item.rating.toFixed(1)}) — هذا المحتوى مرشّح للتمييز في المكتبة، تواصل مع الإدارة`, priority: 'low' });
        else if (item.rating > 0) suggestions.push({ icon: '📝', text: `تقييم جيد (★ ${item.rating.toFixed(1)}) — إضافة أمثلة وتمارين تطبيقية ستزيده قيمةً`, priority: 'medium' });

        if (!item.tags || item.tags.length < 3) suggestions.push({ icon: '🏷', text: 'أضف كلمات مفتاحية أكثر (على الأقل 3-5) لتسهيل اكتشاف المحتوى في البحث', priority: 'medium' });

        if (item.views > 0 && item.downloads / item.views < 0.3) suggestions.push({ icon: '💡', text: 'نسبة التحميل من المشاهدة منخفضة — حسّن وصف المحتوى ليكون أكثر جاذبية', priority: 'medium' });

        suggestions.push({ icon: '📁', text: `ارفع محتوى تكميلياً لمادة ${item.subject} — السلاسل التعليمية تحصل على تحميلات أعلى`, priority: 'medium' });
        suggestions.push({ icon: '🔄', text: 'راجع المحتوى بداية كل فصل دراسي للتأكد من تطابقه مع المنهج الحالي', priority: 'low' });

        return suggestions.map(s => {
          const color = s.priority === 'high' ? '#dc2626' : s.priority === 'medium' ? '#d97706' : '#059669';
          const label = s.priority === 'high' ? 'ضروري' : s.priority === 'medium' ? 'مهم' : 'مقترح';
          return `<div class="summary-line" style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid rgba(13,148,136,0.08)">
            <span style="font-size:15px;flex-shrink:0">${s.icon}</span>
            <span style="flex:1">${s.text}</span>
            <span class="chip" style="background:${color}18;color:${color};border:1px solid ${color}30;flex-shrink:0">${label}</span>
          </div>`;
        }).join('');
      })()}
    </div>
  </div>

  <div class="footer">Zumra — Academic Mentoring Platform | Prince Sattam bin Abdulaziz University</div>
</div>
</body></html>`;
  openReport(html);
}
