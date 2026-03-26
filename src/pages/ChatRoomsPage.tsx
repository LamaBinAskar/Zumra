import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Search, Hash, Users, Clock, Pin, MessageCircle, ChevronLeft } from 'lucide-react';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { useApp, type ChatMessage } from '../contexts/AppContext';
import { SUBJECTS_BY_MAJOR } from '../mockData';

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
interface ChatRoom {
  subject: string;
  major: string;
  description: string;
  pinned?: string;
  members: number;
}

/* SEED DATA — messages now live in AppContext; kept here as unused reference */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _SEED_UNUSED: Record<string, ChatMessage[]> = {
  'برمجة الحاسب 1': [
    { id: 'm1', authorId: 's5', authorName: 'سلطان العتيبي', authorRole: 'student', text: 'هل شرح الدكتور تعليمة الـ while قبل الـ for في المحاضرة الأخيرة؟', timestamp: new Date(Date.now() - 3600000 * 5), reactions: [{ emoji: '؟', count: 3, reacted: false }] },
    { id: 'm2', authorId: 's9', authorName: 'ريم الشهري', authorRole: 'student', text: 'نعم، شرحها أول ثم انتقل للـ for وقال إنها أكثر استخداماً للمصفوفات', timestamp: new Date(Date.now() - 3600000 * 4.8), reactions: [{ emoji: '👍', count: 5, reacted: false }] },
    { id: 'm3', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'نصيحة: تدرّب على المصفوفات مع حلقات متداخلة، هذا يظهر كثيراً في الاختبارات! 🔥', timestamp: new Date(Date.now() - 3600000 * 4), pinned: true, reactions: [{ emoji: '🙏', count: 8, reacted: false }, { emoji: '🔥', count: 4, reacted: false }] },
    { id: 'm4', authorId: 's12', authorName: 'فارس المطيري', authorRole: 'student', text: 'في الواجب الثاني، السؤال الثالث — هل المطلوب طباعة المثلث بعلامة * أو بأرقام؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [] },
    { id: 'm5', authorId: 's9', authorName: 'ريم الشهري', authorRole: 'student', text: 'بعلامة * حسب ما قرأت في ملف المتطلبات', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '✅', count: 2, reacted: false }] },
    { id: 'm6', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'صح ريم، ومهم تضيف شرطاً للتحقق من أن n أكبر من صفر وإلا يطلع خطأ منطقي في الاختبار', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '💡', count: 6, reacted: false }] },
    { id: 'm7', authorId: 's5', authorName: 'سلطان العتيبي', authorRole: 'student', text: 'يا شباب، ترا المحاضرة القادمة عن الدوال العودية (Recursion)، من حل أمثلة عليها قبل؟', timestamp: new Date(Date.now() - 3600000 * 1.5), reactions: [{ emoji: '🙋', count: 3, reacted: false }] },
    { id: 'm8', authorId: 's13', authorName: 'لمى الحربي', authorRole: 'student', text: 'أنا جربت حساب المضروب (Factorial) بـ recursion، بس مفهومتش كيف يرجع Stack تبعه، تقدر تشرح يا أحمد؟', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🤔', count: 7, reacted: false }] },
    { id: 'm9', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'كل استدعاء للدالة يحفظ حالته في الـ Call Stack. fact(3) تستدعي fact(2) وتنتظر، fact(2) تستدعي fact(1)، و fact(1) تُرجع 1، ثم تُكمل من الأسفل للأعلى 3×2×1=6. اتخيل أبراج متراكبة تُطوى من الأعلى 📚', timestamp: new Date(Date.now() - 1800000), pinned: true, reactions: [{ emoji: '🤩', count: 11, reacted: false }, { emoji: '🙏', count: 9, reacted: false }] },
    { id: 'm10', authorId: 's13', authorName: 'لمى الحربي', authorRole: 'student', text: 'الآن وضحت 100%! ما أحلى التشبيه، شكراً يا أحمد 🙌', timestamp: new Date(Date.now() - 900000), reactions: [{ emoji: '❤️', count: 5, reacted: false }] },
  ],
  'تراكيب البيانات': [
    { id: 'n1', authorId: 's3', authorName: 'نورة القحطاني', authorRole: 'student', text: 'متى نستخدم Stack مقارنةً بـ Queue؟ لا أفهم الفرق العملي', timestamp: new Date(Date.now() - 7200000 * 2), reactions: [{ emoji: '🤔', count: 6, reacted: false }] },
    { id: 'n2', authorId: 'm2', authorName: 'سارة العمري', authorRole: 'mentor', text: 'Stack = LIFO — مثاله التراجع في المتصفح (زر Back). Queue = FIFO — مثاله طابور الطباعة. الفرق في ترتيب الإدخال والإخراج 💡', timestamp: new Date(Date.now() - 7200000 * 1.9), pinned: true, reactions: [{ emoji: '✅', count: 11, reacted: false }, { emoji: '🙏', count: 7, reacted: false }] },
    { id: 'n3', authorId: 's7', authorName: 'خالد الرشيد', authorRole: 'student', text: 'هل سيجي في الاختبار مقارنة بين Linked List و Array؟', timestamp: new Date(Date.now() - 7200000 * 1), reactions: [{ emoji: '🙋', count: 4, reacted: false }] },
    { id: 'n4', authorId: 's3', authorName: 'نورة القحطاني', authorRole: 'student', text: 'على الأغلب نعم، في كل الاختبارات السابقة من بنك الأسئلة', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '😬', count: 3, reacted: false }] },
    { id: 'n5', authorId: 'm2', authorName: 'سارة العمري', authorRole: 'mentor', text: 'أنصحكم بحفظ الجدول التالي: Array = وصول عشوائي O(1) + حجم ثابت. Linked List = إدراج/حذف O(1) + حجم ديناميكي. اكتبوه على ورقة قبل الاختبار 📝', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '💯', count: 14, reacted: false }] },
    { id: 'n6', authorId: 's15', authorName: 'عمر البلوي', authorRole: 'student', text: 'ما الفرق بين Doubly Linked List و Singly Linked List؟ الدكتور شرحها بسرعة ما استوعبت', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🤷', count: 5, reacted: false }] },
    { id: 'n7', authorId: 'm2', authorName: 'سارة العمري', authorRole: 'mentor', text: 'Singly: كل عقدة تشير للتالي فقط ← ← ←. Doubly: كل عقدة تشير للتالي والسابق ⇄. فائدة Doubly: التنقل في الاتجاهين وحذف عقدة بسهولة. عيبها: استهلاك ذاكرة أكبر.', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🎯', count: 9, reacted: false }, { emoji: '🙏', count: 6, reacted: false }] },
    { id: 'n8', authorId: 's7', authorName: 'خالد الرشيد', authorRole: 'student', text: 'ترا غداً الاختبار الجزئي 😱 مين يذاكر معي الليلة على الـ Trees؟', timestamp: new Date(Date.now() - 1800000), reactions: [{ emoji: '😱', count: 8, reacted: false }, { emoji: '✋', count: 3, reacted: false }] },
  ],
  'نظم التشغيل': [
    { id: 'o1', authorId: 's8', authorName: 'عبدالعزيز الحربي', authorRole: 'student', text: 'الدكتور قال سيكون في الاختبار سؤال عن Deadlock — هل شرح الـ 4 شروط؟', timestamp: new Date(Date.now() - 5400000 * 2), reactions: [] },
    { id: 'o2', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'نعم، الأربعة: Mutual Exclusion، Hold and Wait، No Preemption، Circular Wait. احفظهم بالاختصار: MH-NC 🧠', timestamp: new Date(Date.now() - 5400000 * 1.9), pinned: true, reactions: [{ emoji: '🙏', count: 9, reacted: false }] },
    { id: 'o3', authorId: 's11', authorName: 'لمى السبيعي', authorRole: 'student', text: 'هل هناك ملخص يغطي الفصول 1-4 في المكتبة؟', timestamp: new Date(Date.now() - 5400000 * 1.2), reactions: [{ emoji: '🔍', count: 2, reacted: false }] },
    { id: 'o4', authorId: 's8', authorName: 'عبدالعزيز الحربي', authorRole: 'student', text: 'رفعت ملخص للفصول 1-3 أمس في المكتبة، ابحث عنه باسم "ملخص نظم التشغيل 446" 📂', timestamp: new Date(Date.now() - 5400000), reactions: [{ emoji: '❤️', count: 14, reacted: false }] },
    { id: 'o5', authorId: 's16', authorName: 'ساره الدوسري', authorRole: 'student', text: 'الجدولة (Scheduling) ما فهمتها، الفرق بين FCFS و SJF و Round Robin ؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '😰', count: 7, reacted: false }] },
    { id: 'o6', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'FCFS = أول من يجي أول من يُخدم (بسيط لكن ليس عادلاً). SJF = أقصر مهمة تُكمل أولاً (مثالي لكن قد يُجوّع العمليات الطويلة). Round Robin = كل عملية تأخذ نفس الوقت بالتناوب (متوازن وعادل). ✅', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '💎', count: 12, reacted: false }, { emoji: '🙏', count: 8, reacted: false }] },
    { id: 'o7', authorId: 's16', authorName: 'ساره الدوسري', authorRole: 'student', text: 'وضح كثيراً! سؤال ثاني: متى يختار نظام التشغيل SJF على FCFS؟', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🤓', count: 4, reacted: false }] },
    { id: 'o8', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'عندما يكون الهدف تقليل متوسط وقت الانتظار (Average Waiting Time). SJF يعطي أقل متوسط انتظار نظرياً. لكن عملياً نحتاج نعرف وقت كل عملية مسبقاً وهذا صعب!', timestamp: new Date(Date.now() - 3600000 * 1.5), reactions: [{ emoji: '🎯', count: 6, reacted: false }] },
    { id: 'o9', authorId: 's11', authorName: 'لمى السبيعي', authorRole: 'student', text: 'شكراً يا محمد، أنت تشرح أفضل من الكتاب 😂💪', timestamp: new Date(Date.now() - 1200000), reactions: [{ emoji: '😄', count: 16, reacted: false }] },
  ],
  'الخوارزميات وتراكيب البيانات': [
    { id: 'p1', authorId: 's4', authorName: 'هند الزهراني', authorRole: 'student', text: 'Big O notation — مين يشرح الفرق بين O(n log n) و O(n²) بمثال؟', timestamp: new Date(Date.now() - 4800000 * 2), reactions: [{ emoji: '😅', count: 5, reacted: false }] },
    { id: 'p2', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'تخيّل ترتيب 1000 كتاب: O(n²) = تقارن كل كتاب مع الباقين = 1,000,000 عملية. O(n log n) = Merge Sort = ~10,000 عملية فقط! فرق ضخم عند البيانات الكبيرة 📊', timestamp: new Date(Date.now() - 4800000 * 1.9), pinned: true, reactions: [{ emoji: '🤯', count: 12, reacted: false }, { emoji: '✅', count: 8, reacted: false }] },
    { id: 'p3', authorId: 's4', authorName: 'هند الزهراني', authorRole: 'student', text: 'مثال رائع! وضّح كثيراً، شكراً 🙏', timestamp: new Date(Date.now() - 4800000), reactions: [{ emoji: '😊', count: 3, reacted: false }] },
    { id: 'p4', authorId: 's17', authorName: 'بدر الشمري', authorRole: 'student', text: 'ما أفضل خوارزمية للبحث في قائمة مرتبة؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [] },
    { id: 'p5', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'Binary Search بلا شك! O(log n) مقارنةً بـ Linear Search O(n). فكرتها: قسّم القائمة لنصفين، إذا العنصر أصغر من المنتصف ابحث في النصف الأيسر، وإلا في الأيمن. وكرر حتى تجده 🎯', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '💡', count: 10, reacted: false }] },
    { id: 'p6', authorId: 's4', authorName: 'هند الزهراني', authorRole: 'student', text: 'والـ Hash Table؟ ما أفضل للبحث؟', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🤔', count: 4, reacted: false }] },
    { id: 'p7', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'Hash Table تعطيك O(1) للبحث في المتوسط — أسرع! لكنها تستهلك ذاكرة أكبر وقد تحدث Collisions. القاعدة: إذا الذاكرة مهمة → Binary Search. إذا السرعة مهمة → Hash Table ⚡', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🏆', count: 9, reacted: false }, { emoji: '📌', count: 5, reacted: false }] },
    { id: 'p8', authorId: 's17', authorName: 'بدر الشمري', authorRole: 'student', text: 'وضّحتوا كل شي! يستاهل تثبّت هذي الرسالة 😄', timestamp: new Date(Date.now() - 1800000), reactions: [{ emoji: '❤️', count: 7, reacted: false }] },
  ],
  'هياكل البيانات': [
    { id: 'q1', authorId: 's18', authorName: 'منى القرني', authorRole: 'student', text: 'سؤال: الشجرة الثنائية (Binary Tree) متى تكون محيطة بكاملها (Full vs Complete vs Perfect)؟ مربّكة عليّ', timestamp: new Date(Date.now() - 3600000 * 6), reactions: [{ emoji: '😵', count: 6, reacted: false }] },
    { id: 'q2', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'فروقها: Full = كل عقدة لها 0 أو 2 أبناء. Complete = كل الصفوف ممتلئة عدا الأخير (يُملأ من اليسار). Perfect = كل الصفوف ممتلئة تماماً. ابحثي عن صورة لها وسترين الفرق مباشرة! 🌳', timestamp: new Date(Date.now() - 3600000 * 5.5), pinned: true, reactions: [{ emoji: '🙏', count: 13, reacted: false }, { emoji: '💯', count: 8, reacted: false }] },
    { id: 'q3', authorId: 's18', authorName: 'منى القرني', authorRole: 'student', text: 'الآن واضح 100%! وما الفرق بين BST و Heap؟', timestamp: new Date(Date.now() - 3600000 * 5), reactions: [{ emoji: '🤔', count: 3, reacted: false }] },
    { id: 'q4', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'BST: للبحث السريع — أصغر من الجذر يسار، أكبر يمين. Heap: للحصول على الأكبر/الأصغر بسرعة — الجذر دائماً أقصى قيمة (Max Heap) أو أدنى قيمة (Min Heap). أهم فرق: BST للبحث، Heap لاستخراج الحد الأقصى/الأدنى ⚖️', timestamp: new Date(Date.now() - 3600000 * 4.5), reactions: [{ emoji: '💎', count: 10, reacted: false }] },
    { id: 'q5', authorId: 's19', authorName: 'تركي الرويلي', authorRole: 'student', text: 'يا شباب، في المشروع الأخير، هل نستخدم AVL Tree أو Red-Black Tree للفرز؟', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🙋', count: 5, reacted: false }] },
    { id: 'q6', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'للمشاريع الدراسية AVL أسهل تطبيقاً وفهماً. Red-Black تُستخدم في المكتبات الاحترافية (std::map في C++). لمشروعكم AVL كافية ويفضلها الدكتور عادةً ✅', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🎯', count: 8, reacted: false }] },
    { id: 'q7', authorId: 's18', authorName: 'منى القرني', authorRole: 'student', text: 'شكراً يا ناصر، بجد تشرح بطريقة سهلة جداً 🌟 لو تقدر تحجز جلسة مذاكرة قبل الاختبار يكون ممتاز', timestamp: new Date(Date.now() - 900000), reactions: [{ emoji: '❤️', count: 11, reacted: false }] },
  ],
  'قواعد البيانات': [
    { id: 'r1', authorId: 's20', authorName: 'نوف العجمي', authorRole: 'student', text: 'متى نستخدم JOIN وما أنواعها؟ أنا أخلط بين INNER و OUTER دائماً', timestamp: new Date(Date.now() - 3600000 * 4), reactions: [{ emoji: '😅', count: 7, reacted: false }] },
    { id: 'r2', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'INNER JOIN: فقط الصفوف المتطابقة في الجدولين. LEFT JOIN: كل صفوف الجدول الأيسر + المتطابق من الأيمن (والباقي NULL). RIGHT JOIN: العكس. FULL OUTER: الكل سواء تطابق أو لا. الأكثر استخداماً: INNER و LEFT 💻', timestamp: new Date(Date.now() - 3600000 * 3.5), pinned: true, reactions: [{ emoji: '💯', count: 15, reacted: false }, { emoji: '🙏', count: 10, reacted: false }] },
    { id: 'r3', authorId: 's21', authorName: 'ماجد الزهراني', authorRole: 'student', text: 'شرح ممتاز! وما الفرق بين WHERE و HAVING في SQL؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '🤓', count: 4, reacted: false }] },
    { id: 'r4', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'WHERE = يُصفّي الصفوف قبل التجميع. HAVING = يُصفّي بعد GROUP BY. مثال: WHERE salary > 5000 (قبل) vs HAVING COUNT(*) > 10 (بعد التجميع). الفرق: WHERE على الصفوف الخام، HAVING على النتائج المجمّعة 📊', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '🤩', count: 9, reacted: false }] },
    { id: 'r5', authorId: 's20', authorName: 'نوف العجمي', authorRole: 'student', text: 'أخيراً فهمت! سؤال أخير: ما الفرق بين Primary Key و Foreign Key؟', timestamp: new Date(Date.now() - 3600000 * 1.5), reactions: [] },
    { id: 'r6', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'Primary Key: معرّف فريد لكل سجل في الجدول (لا يتكرر، لا يكون NULL). Foreign Key: مفتاح يُشير لـ Primary Key في جدول آخر لربط الجداول معاً. مثال: جدول الطلاب (PK: student_id) + جدول الجلسات (FK: student_id) 🔗', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '📌', count: 7, reacted: false }, { emoji: '🙏', count: 5, reacted: false }] },
  ],
};

/* Default empty room — context is now source of truth */
function getMessages(subject: string, chatMessages: Record<string, ChatMessage[]>): ChatMessage[] {
  return chatMessages[subject] ?? [];
}

/* ═══════════════════════════════════════
   BUILD ROOMS FROM mockData subjects
═══════════════════════════════════════ */
function buildRooms(): ChatRoom[] {
  const rooms: ChatRoom[] = [];
  for (const [major, subjects] of Object.entries(SUBJECTS_BY_MAJOR)) {
    for (const subject of subjects) {
      rooms.push({
        subject,
        major,
        description: `غرفة نقاش مادة ${subject}`,
        members: Math.floor(Math.random() * 40) + 5,
      });
    }
  }
  return rooms;
}

const ALL_ROOMS = buildRooms();

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function timeAgo(date: Date): string {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `${Math.round(diff / 60)} د`;
  if (diff < 86400) return `${Math.round(diff / 3600)} س`;
  return `${Math.round(diff / 86400)} ي`;
}

/* ═══════════════════════════════════════
   MESSAGE BUBBLE
═══════════════════════════════════════ */
function MessageBubble({
  msg,
  isMine,
  onReact,
}: {
  msg: ChatMessage;
  isMine: boolean;
  onReact: (msgId: string, emoji: string) => void;
}) {
  const [showReactPicker, setShowReactPicker] = useState(false);
  const QUICK_REACTIONS = ['+1', 'قلب', 'حار', 'تساؤل', 'صح', 'شكراً'];

  return (
    <div className={`flex gap-2.5 group ${isMine ? 'flex-row-reverse' : ''} ${msg.pinned ? 'relative' : ''}`}>
      {/* Avatar */}
      {!isMine && (
        <div className="flex-shrink-0 mt-1">
          <Avatar
            name={msg.authorName}
            className={`w-8 h-8 rounded-full text-xs ${msg.authorRole === 'mentor' ? 'ring-2 ring-[#0d9488]' : ''}`}
          />
        </div>
      )}

      <div className={`flex flex-col max-w-[72%] ${isMine ? 'items-end' : 'items-start'}`}>
        {/* Name + time */}
        {!isMine && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold" style={{ color: msg.authorRole === 'mentor' ? '#0d9488' : 'rgba(13,40,37,0.80)' }}>
              {msg.authorName}
            </span>
            {msg.authorRole === 'mentor' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(13,148,136,0.12)', color: '#0d9488' }}>مرشد</span>
            )}
            <span className="text-[11px]" style={{ color: 'rgba(13,40,37,0.45)' }}>{timeAgo(msg.timestamp)}</span>
          </div>
        )}
        {isMine && (
          <span className="text-[11px] mb-1" style={{ color: 'rgba(13,40,37,0.45)' }}>{timeAgo(msg.timestamp)}</span>
        )}

        {/* Pinned indicator */}
        {msg.pinned && (
          <div className="flex items-center gap-1 text-[10px] mb-1 font-medium" style={{ color: '#d97706' }}>
            <Pin size={10} />
            مثبّت
          </div>
        )}

        {/* Bubble */}
        <div
          className="relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm"
          style={isMine
            ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff', borderRadius: '18px 4px 18px 18px' }
            : msg.authorRole === 'mentor'
            ? { background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.18)', color: '#0d2825', borderRadius: '4px 18px 18px 18px' }
            : msg.pinned
            ? { background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.18)', color: '#0d2825', borderRadius: '4px 18px 18px 18px' }
            : { background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.12)', color: '#0d2825', borderRadius: '4px 18px 18px 18px' }}
        >
          {msg.text}

          {/* Quick react button on hover */}
          <button
            onClick={() => setShowReactPicker(v => !v)}
            className={`absolute -bottom-3 ${isMine ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm`}
            style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.16)', color: '#0d9488' }}
          >
            +
          </button>

          {/* Reaction picker */}
          {showReactPicker && (
            <div className={`absolute ${isMine ? 'left-0' : 'right-0'} -bottom-10 z-10 flex gap-1 rounded-full px-2 py-1 shadow-lg`}
              style={{ background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)' }}>
              {QUICK_REACTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => { onReact(msg.id, e); setShowReactPicker(false); }}
                  className="text-base hover:scale-125 transition-transform"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {msg.reactions.filter(r => r.count > 0).map(r => (
              <button
                key={r.emoji}
                onClick={() => onReact(msg.id, r.emoji)}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all"
                style={r.reacted
                  ? { background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.22)', color: '#0d9488' }
                  : { background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.12)', color: 'rgba(13,40,37,0.65)' }}
              >
                {r.emoji} <span className="font-medium">{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function ChatRoomsPage() {
  const { currentUser } = useAuth();
  const { chatMessages, addChatMessage, reactToChatMessage } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const majors = useMemo(() => Object.keys(SUBJECTS_BY_MAJOR), []);

  const filteredRooms = useMemo(() => {
    return ALL_ROOMS.filter(r => {
      const matchSearch = !search || r.subject.includes(search);
      const matchMajor = selectedMajor === 'all' || r.major === selectedMajor;
      return matchSearch && matchMajor;
    });
  }, [search, selectedMajor]);

  // Group by major
  const grouped = useMemo(() => {
    const map: Record<string, ChatRoom[]> = {};
    for (const r of filteredRooms) {
      if (!map[r.major]) map[r.major] = [];
      map[r.major].push(r);
    }
    return map;
  }, [filteredRooms]);

  // Load messages for current room from context
  const roomMessages = useMemo(() => {
    if (!selectedSubject) return [];
    return getMessages(selectedSubject, chatMessages);
  }, [selectedSubject, chatMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  function openRoom(subject: string) {
    setSelectedSubject(subject);
    setMobileShowChat(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  }

  function sendMessage() {
    if (!input.trim() || !selectedSubject || !currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role as 'student' | 'mentor',
      text: input.trim(),
      timestamp: new Date(),
      reactions: [],
    };
    addChatMessage(selectedSubject, newMsg);
    setInput('');
  }

  function toggleReaction(msgId: string, emoji: string) {
    if (!selectedSubject) return;
    reactToChatMessage(selectedSubject, msgId, emoji);
  }

  const currentRoom = ALL_ROOMS.find(r => r.subject === selectedSubject);

  return (
    <Layout wide>
      <div className="flex gap-0 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 120px)', background: '#ffffff', border: '1px solid rgba(13,148,136,0.14)', boxShadow: '0 4px 20px rgba(13,148,136,0.08)' }}>

        {/* ── SIDEBAR ─────────────────────────────── */}
        <div className={`${mobileShowChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 flex-shrink-0`}
          style={{ borderLeft: '1px solid rgba(13,148,136,0.10)' }}>
          {/* Sidebar header */}
          <div className="p-4" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Hash size={18} className="text-white" />
              <h2 className="text-white font-black text-base">غرف الدردشة</h2>
              <span className="text-xs px-2 py-0.5 rounded-full mr-auto"
                style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
                {ALL_ROOMS.length} غرفة
              </span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.65)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن مادة..."
                className="w-full pr-9 pl-3 py-2 rounded-lg text-xs focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.20)' }}
              />
            </div>
          </div>

          {/* Major filter */}
          <div className="flex gap-1 p-3 overflow-x-auto flex-shrink-0" style={{ borderBottom: '1px solid rgba(13,148,136,0.10)' }}>
            <button
              onClick={() => setSelectedMajor('all')}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
              style={selectedMajor === 'all'
                ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }
                : { background: 'rgba(13,148,136,0.08)', color: 'rgba(13,40,37,0.60)', border: '1px solid rgba(13,148,136,0.12)' }}>
              الكل
            </button>
            {majors.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMajor(m)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                style={selectedMajor === m
                  ? { background: 'linear-gradient(135deg,#0d9488,#0891b2)', color: '#fff' }
                  : { background: 'rgba(13,148,136,0.08)', color: 'rgba(13,40,37,0.60)', border: '1px solid rgba(13,148,136,0.12)' }}
              >{m}</button>
            ))}
          </div>

          {/* Room list */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(grouped).map(([major, rooms]) => (
              <div key={major}>
                <div className="px-4 py-2 sticky top-0 z-10" style={{ background: '#f7fcfb', borderBottom: '1px solid rgba(13,148,136,0.08)' }}>
                  <span className="text-xs font-black uppercase tracking-wide" style={{ color: 'rgba(13,40,37,0.45)' }}>{major}</span>
                </div>
                {rooms.map(room => {
                  const msgs = getMessages(room.subject, chatMessages);
                  const lastMsg = msgs[msgs.length - 1];
                  const isActive = selectedSubject === room.subject;
                  return (
                    <button
                      key={room.subject}
                      onClick={() => openRoom(room.subject)}
                      className="w-full flex items-start gap-3 px-4 py-3 transition-colors text-right"
                      style={{
                        background: isActive ? 'rgba(13,148,136,0.08)' : 'transparent',
                        borderRight: isActive ? '3px solid #0d9488' : '3px solid transparent',
                      }}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: isActive ? '#0d9488' : 'rgba(13,148,136,0.08)',
                          color: isActive ? '#fff' : 'rgba(13,40,37,0.50)',
                        }}>
                        <Hash size={16} />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold truncate" style={{ color: isActive ? '#0d9488' : '#0d2825' }}>
                            {room.subject}
                          </p>
                          {lastMsg && (
                            <span className="text-[10px] flex-shrink-0" style={{ color: 'rgba(13,40,37,0.40)' }}>{timeAgo(lastMsg.timestamp)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users size={10} className="flex-shrink-0" style={{ color: 'rgba(13,40,37,0.40)' }} />
                          <span className="text-[11px]" style={{ color: 'rgba(13,40,37,0.40)' }}>{room.members}</span>
                          {lastMsg && (
                            <p className="text-[11px] truncate mr-1" style={{ color: 'rgba(13,40,37,0.40)' }}>{lastMsg.authorName.split(' ')[0]}: {lastMsg.text}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
            {filteredRooms.length === 0 && (
              <div className="py-12 text-center text-sm" style={{ color: 'rgba(13,40,37,0.45)' }}>
                لا توجد غرف مطابقة
              </div>
            )}
          </div>
        </div>

        {/* ── CHAT AREA ────────────────────────────── */}
        <div className={`${!mobileShowChat && selectedSubject === null ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0`}>
          {!selectedSubject ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(13,148,136,0.10)' }}>
                <MessageCircle size={36} style={{ color: '#0d9488' }} />
              </div>
              <h3 className="text-xl font-black text-[#0d2825] mb-2">اختر غرفة للبدء</h3>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'rgba(13,40,37,0.50)' }}>
                اختر مادة من القائمة على اليسار للانضمام إلى نقاش الطلاب والمرشدين
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(13,148,136,0.10)', background: '#ffffff' }}>
                <button
                  onClick={() => { setMobileShowChat(false); }}
                  className="md:hidden p-1.5 rounded-lg transition-colors"
                  style={{ color: 'rgba(13,40,37,0.50)' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(13,148,136,0.10)' }}>
                  <Hash size={18} style={{ color: '#0d9488' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#0d2825] text-sm truncate">{selectedSubject}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>
                      <Users size={11} />
                      {currentRoom?.members ?? 0} عضو
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(13,40,37,0.45)' }}>
                      <MessageCircle size={11} />
                      {roomMessages.length} رسالة
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#059669' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#059669' }} />
                      نشط الآن
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                  style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.16)' }}>
                  {currentRoom?.major}
                </span>
              </div>

              {/* Pinned message */}
              {roomMessages.find(m => m.pinned) && (
                <div className="flex items-start gap-2.5 px-5 py-2.5 flex-shrink-0"
                  style={{ background: 'rgba(217,119,6,0.06)', borderBottom: '1px solid rgba(217,119,6,0.14)' }}>
                  <Pin size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#d97706' }} />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold block mb-0.5" style={{ color: '#d97706' }}>رسالة مثبّتة</span>
                    <p className="text-xs truncate" style={{ color: 'rgba(13,40,37,0.75)' }}>
                      {roomMessages.find(m => m.pinned)?.text}
                    </p>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ background: '#f7fcfb' }}>
                {roomMessages.length === 0 ? (
                  <div className="py-16 text-center">
                    <MessageCircle size={40} className="mx-auto mb-3" style={{ color: 'rgba(13,40,37,0.25)' }} />
                    <p className="font-semibold text-sm" style={{ color: 'rgba(13,40,37,0.55)' }}>كن أول من يبدأ النقاش في هذه الغرفة!</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(13,40,37,0.40)' }}>اطرح سؤالك أو شارك بملاحظة مفيدة</p>
                  </div>
                ) : (
                  roomMessages.map(msg => (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isMine={msg.authorId === currentUser?.id}
                      onReact={toggleReaction}
                    />
                  ))
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(13,148,136,0.10)', background: '#ffffff' }}>
                <div className="flex items-center gap-2 rounded-2xl px-4 py-2 transition-all"
                  style={{ background: '#f7fcfb', border: '1px solid rgba(13,148,136,0.16)' }}>
                  <Avatar name={currentUser?.name ?? '؟'} className="w-7 h-7 rounded-full text-[10px] flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder={`اكتب رسالتك في غرفة ${selectedSubject}...`}
                    className="flex-1 bg-transparent text-sm focus:outline-none text-right"
                    style={{ color: '#0d2825' }}
                    dir="rtl"
                  />
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs hidden sm:block" style={{ color: 'rgba(13,40,37,0.35)' }}>Enter للإرسال</span>
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      className="w-9 h-9 text-white rounded-xl flex items-center justify-center transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                      style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] mt-1.5 text-center" style={{ color: 'rgba(13,40,37,0.40)' }}>
                  كن محترماً ومفيداً — هذه الغرفة للنقاش الأكاديمي
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
