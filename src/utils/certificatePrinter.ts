// ── Certificate Printer + Email Sender ───────────────────────────────────────
// Print: opens a styled print window using the browser's native print dialog
// Email: opens the default email client pre-addressed to binaska.lama@gmail.com

const CERT_EMAIL = 'binaskar.lama@gmail.com';

const TYPE_AR: Record<string, string> = {
  outstanding:  'شهادة تميز استثنائي',
  excellence:   'شهادة تفوق',
  appreciation: 'شهادة شكر وتقدير',
};
const TYPE_EN: Record<string, string> = {
  outstanding:  'Certificate of Outstanding Excellence',
  excellence:   'Certificate of Excellence',
  appreciation: 'Certificate of Appreciation',
};
const ACCENT: Record<string, string> = {
  outstanding:  '#c8960c',
  excellence:   '#3a9c80',
  appreciation: '#5baa94',
};

export interface CertData {
  mentorName: string;
  college: string;
  major: string;
  type: 'outstanding' | 'excellence' | 'appreciation';
  sessionsCount: number;
  totalStudents: number;
  averageRating: number;
  issuedAt: string;
  academicYear: string;
  issuedBy: string;
}

/* ────────────────────────────────────────────
   Print certificate in a new window
──────────────────────────────────────────── */
export function printCertificate(cert: CertData): void {
  const accent = ACCENT[cert.type] ?? '#3a9c80';
  const label  = TYPE_AR[cert.type]  ?? cert.type;

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <title>شهادة زمرة — ${cert.mentorName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{
      font-family:'Cairo','Segoe UI',Arial,sans-serif;
      background:#f0f4f0;
      display:flex; align-items:center; justify-content:center;
      min-height:100vh; padding:24px;
    }
    .no-print{
      position:fixed; top:0; left:0; right:0;
      background:#0d2825; color:#fff;
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 20px; z-index:999; font-family:'Cairo',sans-serif;
    }
    .no-print .title{font-size:14px; font-weight:700;}
    .no-print .actions{display:flex; gap:10px;}
    .btn{padding:7px 18px;border-radius:8px;border:none;cursor:pointer;font-weight:700;font-size:13px;font-family:'Cairo',sans-serif;}
    .btn-print{background:${accent};color:#fff;}
    .btn-close{background:rgba(255,255,255,0.12);color:#fff;}
    .cert{
      background:linear-gradient(170deg,#041d15 0%,#062a1e 30%,#0a3d2e 65%,#0d4a38 100%);
      border:2px solid ${accent}55;
      border-radius:24px;
      width:700px; max-width:100%;
      padding:56px 60px;
      text-align:center;
      box-shadow:0 24px 80px rgba(0,0,0,0.45);
      margin-top:56px;
      position:relative;
      overflow:hidden;
    }
    .cert::before{
      content:'';
      position:absolute; inset:0;
      background-image:radial-gradient(circle,${accent}18 1px,transparent 1px);
      background-size:20px 20px;
      opacity:.55;
      pointer-events:none;
    }
    .cert::after{
      content:'';
      position:absolute; top:-80px; right:-80px;
      width:260px; height:260px; border-radius:50%;
      background:radial-gradient(circle,${accent}28,transparent 70%);
      pointer-events:none;
    }
    .logo-row{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:28px;position:relative;z-index:1;}
    .logo-row img{height:46px;width:auto;filter:brightness(0) invert(1);opacity:.80;}
    .divider-v{width:1px;height:32px;background:rgba(255,255,255,0.20);}
    .zumra-title{
      font-size:54px; font-weight:900; color:${accent};
      text-shadow:0 0 32px ${accent}70;
      letter-spacing:-2px; line-height:1; margin-bottom:20px;
      position:relative; z-index:1;
    }
    .ornament{display:flex;align-items:center;gap:12px;margin:0 auto 20px;max-width:320px;position:relative;z-index:1;}
    .ornament .line{flex:1;height:1px;background:linear-gradient(90deg,transparent,${accent}60);}
    .ornament .star{color:${accent};font-size:14px;opacity:.75;}
    .cert-type{
      font-size:12px; font-weight:700; letter-spacing:.22em;
      color:${accent}cc; margin-bottom:14px; position:relative;z-index:1;
    }
    .intro{font-size:15px;color:rgba(255,255,255,.72);line-height:1.9;margin-bottom:14px;position:relative;z-index:1;}
    .name-box{
      background:${accent}14; border:1px solid ${accent}40;
      border-radius:16px; padding:16px 24px; margin-bottom:16px;
      position:relative;z-index:1;
    }
    .name{font-size:28px;font-weight:900;color:#fff;text-shadow:0 2px 16px rgba(0,0,0,.45);line-height:1.3;}
    .sub{font-size:12px;color:rgba(255,255,255,.50);margin-top:4px;}
    .achievement{font-size:14px;color:rgba(255,255,255,.72);line-height:1.9;margin-bottom:20px;position:relative;z-index:1;}
    .ornament2{display:flex;align-items:center;gap:12px;margin:0 auto 20px;max-width:300px;position:relative;z-index:1;}
    .ornament2 .line{flex:1;height:1px;background:linear-gradient(90deg,transparent,${accent}40);}
    .stats{display:flex;align-items:center;justify-content:center;gap:32px;margin-bottom:20px;position:relative;z-index:1;}
    .stat-item{text-align:center;}
    .stat-val{font-size:22px;font-weight:900;color:${accent};}
    .stat-lbl{font-size:11px;color:rgba(255,255,255,.45);}
    .sep{width:1px;height:36px;background:${accent}30;}
    .meta{font-size:11px;color:rgba(255,255,255,.38);line-height:1.8;margin-bottom:20px;position:relative;z-index:1;}
    .sig{margin-top:16px;padding-top:16px;border-top:1px solid ${accent}25;position:relative;z-index:1;}
    .sig-line{width:100px;margin:0 auto;border-bottom:1px solid ${accent}55;margin-bottom:6px;}
    .sig-name{font-size:11px;font-weight:600;color:rgba(255,255,255,.45);}
    @media print{
      .no-print{display:none!important;}
      body{background:#fff;margin:0;padding:0;}
      .cert{margin:0;border-radius:0;width:100%;box-shadow:none;height:100vh;}
      @page{size:A4 landscape;margin:0;}
    }
  </style>
</head>
<body>
  <div class="no-print">
    <span class="title">شهادة زمرة — ${cert.mentorName}</span>
    <div class="actions">
      <button class="btn btn-print" onclick="window.print()">🖨 طباعة الشهادة</button>
      <button class="btn btn-close" onclick="window.close()">✕ إغلاق</button>
    </div>
  </div>

  <div class="cert">
    <div class="logo-row">
      <img src="/Zumra/PSAULOGO.png" alt="PSAU"/>
      <div class="divider-v"></div>
      <img src="/Zumra/Logo.jfif" alt="زمرة" style="border-radius:8px;opacity:.75;"/>
    </div>

    <div class="zumra-title">زُمرة</div>

    <div class="ornament">
      <div class="line"></div>
      <span class="star">✦</span>
      <div class="line" style="transform:scaleX(-1)"></div>
    </div>

    <div class="cert-type">${label.toUpperCase()}</div>

    <p class="intro">يسرنا أن نتقدم بأسمى آيات التهنئة والتقدير إلى</p>

    <div class="name-box">
      <div class="name">${cert.mentorName}</div>
      <div class="sub">${cert.college} · ${cert.major}</div>
    </div>

    <p class="achievement">
      ${TYPE_AR[cert.type] === 'شهادة تميز استثنائي'
        ? 'تقديراً لجهوده الاستثنائية في خدمة الإرشاد الأكاديمي'
        : TYPE_AR[cert.type] === 'شهادة تفوق'
          ? 'تقديراً لتميزه في خدمة الإرشاد الأكاديمي'
          : 'شكراً وتقديراً على مشاركته في برنامج الإرشاد'}
      <br>
      <span style="font-size:12px;color:rgba(255,255,255,.50)">
        سائلاً الله أن يتقبل منه صالح الأعمال ويعيده علينا بالخير واليمن والبركات
      </span>
    </p>

    <div class="ornament2">
      <div class="line"></div>
      <span class="star" style="opacity:.5">✦</span>
      <div class="line" style="transform:scaleX(-1)"></div>
    </div>

    <div class="stats">
      <div class="stat-item">
        <div class="stat-val">${cert.sessionsCount}</div>
        <div class="stat-lbl">جلسة</div>
      </div>
      <div class="sep"></div>
      <div class="stat-item">
        <div class="stat-val">${cert.totalStudents}</div>
        <div class="stat-lbl">طالب</div>
      </div>
      <div class="sep"></div>
      <div class="stat-item">
        <div class="stat-val">${cert.averageRating}</div>
        <div class="stat-lbl">تقييم ☆</div>
      </div>
    </div>

    <div class="meta">
      العام الدراسي: ${cert.academicYear} &nbsp;|&nbsp; تاريخ الإصدار: ${cert.issuedAt}
      <br/>${cert.issuedBy}
    </div>

    <div class="sig">
      <div class="sig-line"></div>
      <div class="sig-name">${cert.issuedBy}</div>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=820,height=680');
  if (!win) { alert('يرجى السماح بالنوافذ المنبثقة لطباعة الشهادة'); return; }
  win.document.write(html);
  win.document.close();
}

/* ────────────────────────────────────────────
   Send certificate via mailto (opens email client)
──────────────────────────────────────────── */
export function emailCertificate(cert: CertData): void {
  const labelAr = TYPE_AR[cert.type]  ?? cert.type;
  const labelEn = TYPE_EN[cert.type]  ?? cert.type;

  const subject = encodeURIComponent(
    `منصة زمرة — ${labelAr} | ${cert.mentorName}`
  );

  const body = encodeURIComponent(
`بسم الله الرحمن الرحيم

${labelAr}
${labelEn}

──────────────────────────────
الاسم:       ${cert.mentorName}
الكلية:      ${cert.college}
التخصص:     ${cert.major}
نوع الشهادة: ${labelAr}
──────────────────────────────
عدد الجلسات:  ${cert.sessionsCount}
عدد الطلاب:   ${cert.totalStudents}
متوسط التقييم: ${cert.averageRating} / 5
──────────────────────────────
العام الدراسي: ${cert.academicYear}
تاريخ الإصدار: ${cert.issuedAt}
جهة الإصدار:   ${cert.issuedBy}
──────────────────────────────

يسرنا أن نتقدم بأسمى آيات التهنئة والتقدير تقديراً لجهوده في خدمة الإرشاد الأكاديمي.
سائلاً الله أن يتقبل منه صالح الأعمال ويعيده علينا بالخير واليمن والبركات.

منصة زمرة — جامعة الأمير سطام بن عبدالعزيز
Prince Sattam bin Abdulaziz University — Zumra Platform`
  );

  window.location.href = `mailto:${CERT_EMAIL}?subject=${subject}&body=${body}`;
}
