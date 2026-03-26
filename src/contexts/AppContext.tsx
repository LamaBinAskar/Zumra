import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { LibraryItem, Session, Notification, Mentor } from '../types';
import { MOCK_LIBRARY, MOCK_SESSIONS, MOCK_NOTIFICATIONS, MOCK_MENTORS } from '../mockData';

/* ── Chat message type (shared so admin can delete) ── */
export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'mentor';
  text: string;
  timestamp: Date;
  pinned?: boolean;
  reactions: { emoji: string; count: number; reacted: boolean }[];
}

/* ── Seed chat data ── */
const CHAT_SEED: Record<string, ChatMessage[]> = {
  'برمجة الحاسب 1': [
    { id: 'm1', authorId: 's5', authorName: 'سلطان العتيبي', authorRole: 'student', text: 'هل شرح الدكتور تعليمة الـ while قبل الـ for في المحاضرة الأخيرة؟', timestamp: new Date(Date.now() - 3600000 * 5), reactions: [{ emoji: '؟', count: 3, reacted: false }] },
    { id: 'm2', authorId: 's9', authorName: 'ريم الشهري', authorRole: 'student', text: 'نعم، شرحها أول ثم انتقل للـ for وقال إنها أكثر استخداماً للمصفوفات', timestamp: new Date(Date.now() - 3600000 * 4.8), reactions: [{ emoji: '👍', count: 5, reacted: false }] },
    { id: 'm3', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'نصيحة: تدرّب على المصفوفات مع حلقات متداخلة، هذا يظهر كثيراً في الاختبارات! 🔥', timestamp: new Date(Date.now() - 3600000 * 4), pinned: true, reactions: [{ emoji: '🙏', count: 8, reacted: false }, { emoji: '🔥', count: 4, reacted: false }] },
    { id: 'm4', authorId: 's12', authorName: 'فارس المطيري', authorRole: 'student', text: 'في الواجب الثاني، السؤال الثالث — هل المطلوب طباعة المثلث بعلامة * أو بأرقام؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [] },
    { id: 'm5', authorId: 's9', authorName: 'ريم الشهري', authorRole: 'student', text: 'بعلامة * حسب ما قرأت في ملف المتطلبات', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '✅', count: 2, reacted: false }] },
    { id: 'm6', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'صح ريم، ومهم تضيف شرطاً للتحقق من أن n أكبر من صفر وإلا يطلع خطأ منطقي في الاختبار', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '💡', count: 6, reacted: false }] },
    { id: 'm7', authorId: 's5', authorName: 'سلطان العتيبي', authorRole: 'student', text: 'يا شباب، ترا المحاضرة القادمة عن الدوال العودية (Recursion)، من حل أمثلة عليها قبل؟', timestamp: new Date(Date.now() - 3600000 * 1.5), reactions: [{ emoji: '🙋', count: 3, reacted: false }] },
    { id: 'm8', authorId: 's13', authorName: 'لمى الحربي', authorRole: 'student', text: 'أنا جربت حساب المضروب (Factorial) بـ recursion، بس مفهومتش كيف يرجع Stack تبعه', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🤔', count: 7, reacted: false }] },
    { id: 'm9', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'كل استدعاء للدالة يحفظ حالته في الـ Call Stack. fact(3) تستدعي fact(2)، fact(2) تستدعي fact(1)، ثم تُكمل من الأسفل للأعلى 3×2×1=6 📚', timestamp: new Date(Date.now() - 1800000), pinned: true, reactions: [{ emoji: '🤩', count: 11, reacted: false }, { emoji: '🙏', count: 9, reacted: false }] },
    { id: 'm10', authorId: 's13', authorName: 'لمى الحربي', authorRole: 'student', text: 'الآن وضحت 100%! شكراً يا أحمد 🙌', timestamp: new Date(Date.now() - 900000), reactions: [{ emoji: '❤️', count: 5, reacted: false }] },
  ],
  'تراكيب البيانات': [
    { id: 'n1', authorId: 's3', authorName: 'نورة القحطاني', authorRole: 'student', text: 'متى نستخدم Stack مقارنةً بـ Queue؟ لا أفهم الفرق العملي', timestamp: new Date(Date.now() - 7200000 * 2), reactions: [{ emoji: '🤔', count: 6, reacted: false }] },
    { id: 'n2', authorId: 'm2', authorName: 'سارة العمري', authorRole: 'mentor', text: 'Stack = LIFO — مثاله التراجع في المتصفح. Queue = FIFO — مثاله طابور الطباعة 💡', timestamp: new Date(Date.now() - 7200000 * 1.9), pinned: true, reactions: [{ emoji: '✅', count: 11, reacted: false }] },
    { id: 'n3', authorId: 's7', authorName: 'خالد الرشيد', authorRole: 'student', text: 'هل سيجي في الاختبار مقارنة بين Linked List و Array؟', timestamp: new Date(Date.now() - 7200000), reactions: [{ emoji: '🙋', count: 4, reacted: false }] },
    { id: 'n4', authorId: 'm2', authorName: 'سارة العمري', authorRole: 'mentor', text: 'Array = وصول عشوائي O(1) + حجم ثابت. Linked List = إدراج/حذف O(1) + حجم ديناميكي 📝', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '💯', count: 14, reacted: false }] },
    { id: 'n5', authorId: 's15', authorName: 'عمر البلوي', authorRole: 'student', text: 'ما الفرق بين Doubly و Singly Linked List؟ الدكتور شرحها بسرعة', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🤷', count: 5, reacted: false }] },
    { id: 'n6', authorId: 'm2', authorName: 'سارة العمري', authorRole: 'mentor', text: 'Singly: كل عقدة تشير للتالي ←. Doubly: تشير للتالي والسابق ⇄. Doubly أسهل للحذف لكن تستهلك ذاكرة أكثر.', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🎯', count: 9, reacted: false }] },
    { id: 'n7', authorId: 's7', authorName: 'خالد الرشيد', authorRole: 'student', text: 'غداً الاختبار الجزئي 😱 مين يذاكر معي الليلة؟', timestamp: new Date(Date.now() - 1800000), reactions: [{ emoji: '😱', count: 8, reacted: false }, { emoji: '✋', count: 3, reacted: false }] },
  ],
  'نظم التشغيل': [
    { id: 'o1', authorId: 's8', authorName: 'عبدالعزيز الحربي', authorRole: 'student', text: 'الدكتور قال سيكون في الاختبار سؤال عن Deadlock — هل شرح الـ 4 شروط؟', timestamp: new Date(Date.now() - 5400000 * 2), reactions: [] },
    { id: 'o2', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'الأربعة: Mutual Exclusion، Hold and Wait، No Preemption، Circular Wait. احفظهم بـ MH-NC 🧠', timestamp: new Date(Date.now() - 5400000 * 1.9), pinned: true, reactions: [{ emoji: '🙏', count: 9, reacted: false }] },
    { id: 'o3', authorId: 's11', authorName: 'لمى السبيعي', authorRole: 'student', text: 'هل هناك ملخص يغطي الفصول 1-4 في المكتبة؟', timestamp: new Date(Date.now() - 5400000 * 1.2), reactions: [{ emoji: '🔍', count: 2, reacted: false }] },
    { id: 'o4', authorId: 's8', authorName: 'عبدالعزيز الحربي', authorRole: 'student', text: 'رفعت ملخص للفصول 1-3 أمس في المكتبة، ابحث عنه باسم "ملخص نظم التشغيل 446" 📂', timestamp: new Date(Date.now() - 5400000), reactions: [{ emoji: '❤️', count: 14, reacted: false }] },
    { id: 'o5', authorId: 's16', authorName: 'ساره الدوسري', authorRole: 'student', text: 'الجدولة (Scheduling) ما فهمتها، الفرق بين FCFS و SJF و Round Robin؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '😰', count: 7, reacted: false }] },
    { id: 'o6', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'FCFS = أول من يجي أول من يُخدم. SJF = أقصر مهمة أولاً. Round Robin = كل عملية تأخذ نفس الوقت بالتناوب ✅', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '💎', count: 12, reacted: false }] },
    { id: 'o7', authorId: 's16', authorName: 'ساره الدوسري', authorRole: 'student', text: 'شكراً يا محمد، أنت تشرح أفضل من الكتاب 😂💪', timestamp: new Date(Date.now() - 1200000), reactions: [{ emoji: '😄', count: 16, reacted: false }] },
  ],
  'الخوارزميات وتراكيب البيانات': [
    { id: 'p1', authorId: 's4', authorName: 'هند الزهراني', authorRole: 'student', text: 'Big O notation — مين يشرح الفرق بين O(n log n) و O(n²)؟', timestamp: new Date(Date.now() - 4800000 * 2), reactions: [{ emoji: '😅', count: 5, reacted: false }] },
    { id: 'p2', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'تخيّل ترتيب 1000 كتاب: O(n²) = مليون عملية. O(n log n) = Merge Sort ≈ 10,000 عملية فقط! 📊', timestamp: new Date(Date.now() - 4800000 * 1.9), pinned: true, reactions: [{ emoji: '🤯', count: 12, reacted: false }] },
    { id: 'p3', authorId: 's17', authorName: 'بدر الشمري', authorRole: 'student', text: 'ما أفضل خوارزمية للبحث في قائمة مرتبة؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [] },
    { id: 'p4', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'Binary Search بلا شك! O(log n). فكرتها: قسّم لنصفين وابحث في النصف المناسب حتى تجده 🎯', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '💡', count: 10, reacted: false }] },
    { id: 'p5', authorId: 's4', authorName: 'هند الزهراني', authorRole: 'student', text: 'والـ Hash Table؟ ما أفضل للبحث منها؟', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🤔', count: 4, reacted: false }] },
    { id: 'p6', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'Hash Table = O(1) للبحث — أسرع! لكن تستهلك ذاكرة أكبر وقد تحدث Collisions ⚡', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🏆', count: 9, reacted: false }] },
  ],
  'هياكل البيانات': [
    { id: 'q1', authorId: 's18', authorName: 'منى القرني', authorRole: 'student', text: 'الشجرة الثنائية متى تكون Full vs Complete vs Perfect؟ مربّكة عليّ', timestamp: new Date(Date.now() - 3600000 * 6), reactions: [{ emoji: '😵', count: 6, reacted: false }] },
    { id: 'q2', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'Full = كل عقدة 0 أو 2 أبناء. Complete = الصفوف ممتلئة عدا الأخير. Perfect = كلها ممتلئة تماماً 🌳', timestamp: new Date(Date.now() - 3600000 * 5.5), pinned: true, reactions: [{ emoji: '🙏', count: 13, reacted: false }] },
    { id: 'q3', authorId: 's18', authorName: 'منى القرني', authorRole: 'student', text: 'وما الفرق بين BST و Heap؟', timestamp: new Date(Date.now() - 3600000 * 5), reactions: [{ emoji: '🤔', count: 3, reacted: false }] },
    { id: 'q4', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'BST للبحث السريع. Heap لاستخراج الأكبر/الأصغر. BST = O(log n) للبحث، Heap = O(1) للقيمة القصوى ⚖️', timestamp: new Date(Date.now() - 3600000 * 4.5), reactions: [{ emoji: '💎', count: 10, reacted: false }] },
    { id: 'q5', authorId: 's19', authorName: 'تركي الرويلي', authorRole: 'student', text: 'في المشروع، هل نستخدم AVL Tree أو Red-Black Tree؟', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🙋', count: 5, reacted: false }] },
    { id: 'q6', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'AVL أسهل تطبيقاً للمشاريع الدراسية، والدكتور يفضلها عادةً ✅', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🎯', count: 8, reacted: false }] },
    { id: 'q7', authorId: 's18', authorName: 'منى القرني', authorRole: 'student', text: 'شكراً يا ناصر! لو تقدر تحجز جلسة مذاكرة قبل الاختبار يكون ممتاز 🌟', timestamp: new Date(Date.now() - 900000), reactions: [{ emoji: '❤️', count: 11, reacted: false }] },
  ],
  'قواعد البيانات': [
    { id: 'r1', authorId: 's20', authorName: 'نوف العجمي', authorRole: 'student', text: 'متى نستخدم JOIN وما أنواعها؟ أخلط بين INNER و OUTER دائماً', timestamp: new Date(Date.now() - 3600000 * 4), reactions: [{ emoji: '😅', count: 7, reacted: false }] },
    { id: 'r2', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'INNER = الصفوف المتطابقة فقط. LEFT = كل الأيسر + المتطابق من الأيمن. FULL OUTER = الكل. الأكثر استخداماً: INNER و LEFT 💻', timestamp: new Date(Date.now() - 3600000 * 3.5), pinned: true, reactions: [{ emoji: '💯', count: 15, reacted: false }] },
    { id: 'r3', authorId: 's21', authorName: 'ماجد الزهراني', authorRole: 'student', text: 'ما الفرق بين WHERE و HAVING في SQL؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '🤓', count: 4, reacted: false }] },
    { id: 'r4', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'WHERE يُصفّي قبل التجميع. HAVING يُصفّي بعد GROUP BY. WHERE على الصفوف الخام، HAVING على النتائج المجمّعة 📊', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '🤩', count: 9, reacted: false }] },
    { id: 'r5', authorId: 's20', authorName: 'نوف العجمي', authorRole: 'student', text: 'ما الفرق بين Primary Key و Foreign Key؟', timestamp: new Date(Date.now() - 3600000 * 1.5), reactions: [] },
    { id: 'r6', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'Primary Key: معرّف فريد لكل سجل (لا يتكرر). Foreign Key: يُشير لـ PK في جدول آخر لربط الجداول 🔗', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '📌', count: 7, reacted: false }] },
    { id: 'r7', authorId: 's21', authorName: 'ماجد الزهراني', authorRole: 'student', text: 'هل يجب أن نُعيد تطبيع (Normalize) قاعدة البيانات لمشروع الفصل؟', timestamp: new Date(Date.now() - 2400000), reactions: [{ emoji: '🤔', count: 5, reacted: false }] },
    { id: 'r8', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'نعم، الدكتور يطلب 3NF على الأقل. تأكدوا من إزالة التبعيات الجزئية والمتعدية. بدّلوا الصف المتكرر بجدول مستقل وربطوا بـ FK 🏗️', timestamp: new Date(Date.now() - 2000000), reactions: [{ emoji: '💡', count: 8, reacted: false }] },
    { id: 'r9', authorId: 's20', authorName: 'نوف العجمي', authorRole: 'student', text: 'ما أفضل برنامج لرسم ERD للمشروع؟', timestamp: new Date(Date.now() - 1200000), reactions: [{ emoji: '🎨', count: 4, reacted: false }] },
    { id: 'r10', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'draw.io مجاني وسهل وممتاز لـ ERD. أو dbdiagram.io للمشاريع الاحترافية. كلاهما يصدّر صورة جاهزة للتقرير 🖼️', timestamp: new Date(Date.now() - 600000), reactions: [{ emoji: '🙏', count: 11, reacted: false }, { emoji: '⭐', count: 6, reacted: false }] },
  ],
  'شبكات الحاسب': [
    { id: 's1', authorId: 's22', authorName: 'ريان الحربي', authorRole: 'student', text: 'ما الفرق بين TCP و UDP؟ متى نستخدم كل واحد؟', timestamp: new Date(Date.now() - 3600000 * 8), reactions: [{ emoji: '🤔', count: 8, reacted: false }] },
    { id: 's2', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'TCP = موثوق + مرتّب + بطيء نسبياً (مثال: تحميل ملف). UDP = سريع + غير موثوق + بدون تأكيد (مثال: بث الفيديو المباشر). إذا الدقة أهم → TCP. إذا السرعة أهم → UDP ⚡', timestamp: new Date(Date.now() - 3600000 * 7.5), pinned: true, reactions: [{ emoji: '💯', count: 14, reacted: false }, { emoji: '🙏', count: 9, reacted: false }] },
    { id: 's3', authorId: 's23', authorName: 'أميرة الشمري', authorRole: 'student', text: 'طيب ما معنى الـ 3-Way Handshake في TCP؟', timestamp: new Date(Date.now() - 3600000 * 7), reactions: [{ emoji: '🤓', count: 5, reacted: false }] },
    { id: 's4', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'هي عملية بناء الاتصال: 1) SYN: العميل يطلب الاتصال. 2) SYN-ACK: السيرفر يوافق. 3) ACK: العميل يؤكد. مثل التحية: "السلام عليكم" → "وعليكم السلام" → "أهلاً" 😄', timestamp: new Date(Date.now() - 3600000 * 6.5), reactions: [{ emoji: '🤩', count: 12, reacted: false }] },
    { id: 's5', authorId: 's22', authorName: 'ريان الحربي', authorRole: 'student', text: 'كم عدد طبقات نموذج OSI وما وظيفة كل طبقة؟', timestamp: new Date(Date.now() - 3600000 * 5), reactions: [{ emoji: '😅', count: 7, reacted: false }] },
    { id: 's6', authorId: 'm2', authorName: 'سارة العمري', authorRole: 'mentor', text: '7 طبقات من الأسفل: 1-Physical (كابلات) 2-Data Link (MAC) 3-Network (IP/Routing) 4-Transport (TCP/UDP) 5-Session 6-Presentation (تشفير) 7-Application (HTTP/FTP). احفظها بجملة: Please Do Not Throw Sausage Pizza Away 🍕', timestamp: new Date(Date.now() - 3600000 * 4.5), pinned: true, reactions: [{ emoji: '😂', count: 18, reacted: false }, { emoji: '💡', count: 13, reacted: false }] },
    { id: 's7', authorId: 's23', authorName: 'أميرة الشمري', authorRole: 'student', text: 'أحسن جملة! ما نسيتها 😂 سؤال: ما الفرق بين IP و MAC Address؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '😄', count: 6, reacted: false }] },
    { id: 's8', authorId: 'm1', authorName: 'أحمد الدوسري', authorRole: 'mentor', text: 'MAC = عنوان الجهاز الفيزيائي (ثابت، مثل رقم الهوية). IP = عنوان الشبكة (متغير، مثل العنوان البريدي). MAC في الطبقة الثانية، IP في الثالثة. ARP يُترجم IP → MAC 🔍', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🎯', count: 10, reacted: false }] },
    { id: 's9', authorId: 's22', authorName: 'ريان الحربي', authorRole: 'student', text: 'الاختبار بكرة عن الـ Subnetting، في نصائح؟', timestamp: new Date(Date.now() - 1800000), reactions: [{ emoji: '😱', count: 9, reacted: false }] },
    { id: 's10', authorId: 'm2', authorName: 'سارة العمري', authorRole: 'mentor', text: 'Subnetting: احفظ قيم الـ Subnet Mask الشائعة: /24=255.255.255.0 (254 host)، /25=128 host، /26=62 host. الصيغة السريعة: عدد الـ hosts = 2^(32-prefix) - 2. تدرّب على 10 أمثلة الليلة وستحل الاختبار بسهولة 🧮', timestamp: new Date(Date.now() - 900000), reactions: [{ emoji: '🙏', count: 15, reacted: false }, { emoji: '💪', count: 7, reacted: false }] },
  ],
  'هندسة البرمجيات': [
    { id: 'e1', authorId: 's24', authorName: 'دانة المطيري', authorRole: 'student', text: 'ما الفرق بين Agile و Waterfall؟ الدكتور يسأل عنهم كثيراً', timestamp: new Date(Date.now() - 3600000 * 10), reactions: [{ emoji: '🤔', count: 6, reacted: false }] },
    { id: 'e2', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'Waterfall = خطي تسلسلي (التحليل→التصميم→التطوير→الاختبار→النشر) مناسب للمتطلبات الثابتة. Agile = دوري تكراري (Sprints قصيرة) مناسب للمتطلبات المتغيرة. المشاريع الكبيرة الحكومية غالباً Waterfall، الشركات الناشئة تفضل Agile 🔄', timestamp: new Date(Date.now() - 3600000 * 9.5), pinned: true, reactions: [{ emoji: '💯', count: 13, reacted: false }] },
    { id: 'e3', authorId: 's25', authorName: 'فيصل الرشيد', authorRole: 'student', text: 'في مشروع الفريق، من يكتب الـ Use Cases؟ كلنا أو شخص واحد؟', timestamp: new Date(Date.now() - 3600000 * 8), reactions: [{ emoji: '🙋', count: 4, reacted: false }] },
    { id: 'e4', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'المحلل (Business Analyst) يكتبها بالتنسيق مع الفريق. في المشاريع الدراسية وزّعوا: كل عضو يكتب Use Cases للجزء الذي طوّره. ثم المحرر يوحّد الأسلوب. الأهم: كل Use Case يحتوي Actor + Precondition + Main Flow + Alternative Flow 📋', timestamp: new Date(Date.now() - 3600000 * 7.5), reactions: [{ emoji: '✅', count: 9, reacted: false }] },
    { id: 'e5', authorId: 's24', authorName: 'دانة المطيري', authorRole: 'student', text: 'ما الـ Design Patterns الأكثر شيوعاً في الاختبار؟', timestamp: new Date(Date.now() - 3600000 * 5), reactions: [{ emoji: '🎯', count: 8, reacted: false }] },
    { id: 'e6', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'الثلاثة الأساسية: Singleton (نسخة واحدة فقط)، Observer (إشعار عند التغيير)، Factory (إنشاء كائنات بدون تحديد النوع). اعرف UML Diagram لكل منها + مثال تطبيقي واحد ✨', timestamp: new Date(Date.now() - 3600000 * 4.5), reactions: [{ emoji: '🤩', count: 11, reacted: false }] },
    { id: 'e7', authorId: 's25', authorName: 'فيصل الرشيد', authorRole: 'student', text: 'ما الفرق بين Black Box و White Box Testing؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '🤔', count: 5, reacted: false }] },
    { id: 'e8', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'Black Box: تختبر المخرجات بدون معرفة الكود الداخلي (المختبر لا يعرف كيف يعمل). White Box: تختبر المسارات الداخلية وتغطية الكود (المختبر يرى الكود). في الواقع: Black Box للـ Functional Testing، White Box للـ Unit Testing 🧪', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '💡', count: 8, reacted: false }] },
    { id: 'e9', authorId: 's24', authorName: 'دانة المطيري', authorRole: 'student', text: 'جلسة مراجعة قبل الاختبار؟ يا محمد ويا يوسف ترتبون؟ 🙏', timestamp: new Date(Date.now() - 1500000), reactions: [{ emoji: '✋', count: 14, reacted: false }, { emoji: '❤️', count: 8, reacted: false }] },
    { id: 'e10', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'بالتأكيد! سأفتح جلسة الخميس الساعة 7 مساءً على المنصة. حاضرون؟ 📅', timestamp: new Date(Date.now() - 900000), reactions: [{ emoji: '🙌', count: 17, reacted: false }, { emoji: '✅', count: 12, reacted: false }] },
  ],
  'الذكاء الاصطناعي': [
    { id: 'ai1', authorId: 's26', authorName: 'ليلى العمري', authorRole: 'student', text: 'ما الفرق بين Machine Learning و Deep Learning؟', timestamp: new Date(Date.now() - 3600000 * 6), reactions: [{ emoji: '🤖', count: 9, reacted: false }] },
    { id: 'ai2', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'ML = خوارزميات تتعلم من البيانات (Decision Tree, SVM, Random Forest). Deep Learning = فرع من ML يستخدم شبكات عصبية عميقة (CNN, RNN, Transformers). DL أقوى لكن يحتاج بيانات أكثر وحوسبة أعلى 🧠', timestamp: new Date(Date.now() - 3600000 * 5.5), pinned: true, reactions: [{ emoji: '🤩', count: 16, reacted: false }, { emoji: '🙏', count: 11, reacted: false }] },
    { id: 'ai3', authorId: 's27', authorName: 'ابراهيم القحطاني', authorRole: 'student', text: 'ما الفرق بين Supervised و Unsupervised Learning؟', timestamp: new Date(Date.now() - 3600000 * 5), reactions: [{ emoji: '🤔', count: 7, reacted: false }] },
    { id: 'ai4', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'Supervised: البيانات مُصنّفة (input + label) مثل: صور مُعلّمة بـ "قطة/كلب". Unsupervised: بلا تصنيف مسبق، يكتشف النموذج الأنماط بنفسه مثل تجميع العملاء (Clustering). Reinforcement: التعلم بالمكافأة والعقاب مثل ألعاب الفيديو 🎮', timestamp: new Date(Date.now() - 3600000 * 4.5), reactions: [{ emoji: '💎', count: 13, reacted: false }] },
    { id: 'ai5', authorId: 's26', authorName: 'ليلى العمري', authorRole: 'student', text: 'كيف نتجنب Overfitting في النموذج؟', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '😰', count: 8, reacted: false }] },
    { id: 'ai6', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'طرق تجنب Overfitting: 1) Dropout (إسقاط نيورونات عشوائياً). 2) Regularization L1/L2. 3) Early Stopping. 4) Cross-Validation. 5) زيادة بيانات التدريب (Data Augmentation). الأكثر استخداماً في Keras: Dropout(0.5) 🛡️', timestamp: new Date(Date.now() - 3600000 * 2.5), reactions: [{ emoji: '💡', count: 14, reacted: false }] },
    { id: 'ai7', authorId: 's27', authorName: 'ابراهيم القحطاني', authorRole: 'student', text: 'لمشروعنا، هل نستخدم PyTorch أو TensorFlow؟', timestamp: new Date(Date.now() - 3600000 * 2), reactions: [{ emoji: '🙋', count: 6, reacted: false }] },
    { id: 'ai8', authorId: 'm5', authorName: 'ناصر المالكي', authorRole: 'mentor', text: 'للمبتدئين: TensorFlow + Keras أسهل وأكثر موارد. للبحث: PyTorch أمرن. الدكتور يقبل كليهما. نصيحتي: ابدأوا بـ Google Colab مجاناً — GPU مجاني + لا تثبيت 🚀', timestamp: new Date(Date.now() - 3600000), reactions: [{ emoji: '🔥', count: 15, reacted: false }, { emoji: '🙌', count: 10, reacted: false }] },
    { id: 'ai9', authorId: 's26', authorName: 'ليلى العمري', authorRole: 'student', text: 'وين نلاقي datasets جاهزة للمشروع؟', timestamp: new Date(Date.now() - 1800000), reactions: [{ emoji: '🔍', count: 7, reacted: false }] },
    { id: 'ai10', authorId: 'm6', authorName: 'عهود السالم', authorRole: 'mentor', text: 'أفضل المصادر: Kaggle (الأفضل + منافسات)، UCI ML Repository، Hugging Face Datasets، Google Dataset Search. للبيانات العربية: KACST Corpus أو CAMeL Arabic NLP 🌐', timestamp: new Date(Date.now() - 900000), reactions: [{ emoji: '⭐', count: 18, reacted: false }, { emoji: '🙏', count: 12, reacted: false }] },
  ],
  'حساب التفاضل والتكامل': [
    { id: 'c1', authorId: 's28', authorName: 'وليد السبيعي', authorRole: 'student', text: 'هل ستجي مسائل الـ Integration by Parts في اختبار منتصف الفصل؟', timestamp: new Date(Date.now() - 3600000 * 9), reactions: [{ emoji: '😬', count: 7, reacted: false }] },
    { id: 'c2', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'نعم، هي من أهم المحاور. القاعدة: ∫u dv = uv - ∫v du. لاختيار u تذكّر قاعدة LIATE: Logarithm → Inverse trig → Algebraic → Trigonometric → Exponential. اختر u من أعلى القائمة 📐', timestamp: new Date(Date.now() - 3600000 * 8.5), pinned: true, reactions: [{ emoji: '💯', count: 11, reacted: false }, { emoji: '🙏', count: 8, reacted: false }] },
    { id: 'c3', authorId: 's29', authorName: 'حنان الغامدي', authorRole: 'student', text: 'ما الفرق بين المشتق والتفاضل؟ أربكتني معادلة المماس', timestamp: new Date(Date.now() - 3600000 * 7), reactions: [{ emoji: '😵', count: 9, reacted: false }] },
    { id: 'c4', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'المشتق f\'(x) = معدل التغيير عند نقطة. التفاضل dy = f\'(x)·dx = تقريب للتغيير الفعلي. معادلة المماس: y - y₀ = f\'(x₀)·(x - x₀). ببساطة: المشتق ميل المماس في نقطة ما 📈', timestamp: new Date(Date.now() - 3600000 * 6.5), reactions: [{ emoji: '💡', count: 10, reacted: false }] },
    { id: 'c5', authorId: 's28', authorName: 'وليد السبيعي', authorRole: 'student', text: 'كيف أعرف متى أستخدم قاعدة السلسلة (Chain Rule)؟', timestamp: new Date(Date.now() - 3600000 * 4), reactions: [{ emoji: '🤔', count: 6, reacted: false }] },
    { id: 'c6', authorId: 'm3', authorName: 'محمد العسيري', authorRole: 'mentor', text: 'استخدم Chain Rule عندما تجد دالة داخل دالة: d/dx[f(g(x))] = f\'(g(x)) · g\'(x). مثال: d/dx[sin(x²)] = cos(x²) · 2x. كلما رأيت "دالة مركّبة" → Chain Rule! 🔗', timestamp: new Date(Date.now() - 3600000 * 3), reactions: [{ emoji: '🎯', count: 9, reacted: false }] },
    { id: 'c7', authorId: 's29', authorName: 'حنان الغامدي', authorRole: 'student', text: 'شكراً كثيراً، اشتريت كتاب حل المسائل، تنصحوا به؟', timestamp: new Date(Date.now() - 1800000), reactions: [{ emoji: '📚', count: 4, reacted: false }] },
    { id: 'c8', authorId: 'm4', authorName: 'يوسف الغامدي', authorRole: 'mentor', text: 'كتاب Stewart Calculus هو المرجع الأساسي. للتمارين الإضافية: موقع Paul\'s Online Math Notes مجاني ومرتّب جداً. والأفضل: حل 5 مسائل يومياً وستتحسن بسرعة ✏️', timestamp: new Date(Date.now() - 900000), reactions: [{ emoji: '❤️', count: 13, reacted: false }, { emoji: '👍', count: 8, reacted: false }] },
  ],
};

interface AppContextType {
  libraryItems: LibraryItem[];
  sessions: Session[];
  notifications: Notification[];
  unreadCount: number;
  mentors: Mentor[];
  chatMessages: Record<string, ChatMessage[]>;
  favoriteMentorIds: string[];
  addLibraryItem: (item: LibraryItem) => void;
  bookSession: (session: Session) => void;
  cancelSession: (id: string) => void;
  confirmSession: (id: string) => void;
  rateSession: (id: string, rating: number, feedback: string) => void;
  markNotificationsRead: () => void;
  addNotification: (n: Notification) => void;
  addMentor: (m: Mentor) => void;
  deleteMentor: (id: string) => void;
  approveLibraryItem: (id: string) => void;
  rejectLibraryItem: (id: string, reason?: string) => void;
  deleteLibraryItem: (id: string) => void;
  deleteChatMessage: (subject: string, messageId: string) => void;
  addChatMessage: (subject: string, msg: ChatMessage) => void;
  reactToChatMessage: (subject: string, messageId: string, emoji: string) => void;
  toggleFavoriteMentor: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const LIBRARY_STORAGE_KEY = 'zumra_library_items_v2';

function loadLibraryItems(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LibraryItem[];
  } catch { /* ignore */ }
  return MOCK_LIBRARY;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(loadLibraryItems);
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(CHAT_SEED);
  const [favoriteMentorIds, setFavoriteMentorIds] = useState<string[]>([]);

  // Persist library items to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(libraryItems)); } catch { /* ignore */ }
  }, [libraryItems]);

  const toggleFavoriteMentor = useCallback((id: string) => {
    setFavoriteMentorIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const addLibraryItem = useCallback((item: LibraryItem) => {
    setLibraryItems(prev => [item, ...prev]);
  }, []);

  const approveLibraryItem = useCallback((id: string) => {
    setLibraryItems(prev => prev.map(l => l.id === id ? { ...l, approvalStatus: 'approved' as const } : l));
  }, []);

  const rejectLibraryItem = useCallback((id: string, reason?: string) => {
    setLibraryItems(prev => prev.map(l => l.id === id ? { ...l, approvalStatus: 'rejected' as const, rejectionReason: reason } : l));
  }, []);

  const deleteLibraryItem = useCallback((id: string) => {
    setLibraryItems(prev => prev.filter(l => l.id !== id));
  }, []);

  const deleteChatMessage = useCallback((subject: string, messageId: string) => {
    setChatMessages(prev => ({
      ...prev,
      [subject]: (prev[subject] ?? []).filter(m => m.id !== messageId),
    }));
  }, []);

  const addChatMessage = useCallback((subject: string, msg: ChatMessage) => {
    setChatMessages(prev => ({
      ...prev,
      [subject]: [...(prev[subject] ?? []), msg],
    }));
  }, []);

  const reactToChatMessage = useCallback((subject: string, messageId: string, emoji: string) => {
    setChatMessages(prev => {
      const roomMsgs = prev[subject] ?? [];
      return {
        ...prev,
        [subject]: roomMsgs.map(msg => {
          if (msg.id !== messageId) return msg;
          const existing = msg.reactions.find(r => r.emoji === emoji);
          if (existing) {
            return {
              ...msg,
              reactions: msg.reactions
                .map(r => r.emoji === emoji
                  ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                  : r)
                .filter(r => r.count > 0),
            };
          }
          return { ...msg, reactions: [...msg.reactions, { emoji, count: 1, reacted: true }] };
        }),
      };
    });
  }, []);

  const bookSession = useCallback((session: Session) => {
    setSessions(prev => [session, ...prev]);
    const notif: Notification = {
      id: `n-${Date.now()}`,
      userId: session.studentId,
      title: 'طلب حجز جلسة',
      message: `تم إرسال طلب جلسة مع ${session.mentorName} في ${session.subject}`,
      type: 'session',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((n: Notification) => {
    setNotifications(prev => [n, ...prev]);
  }, []);

  const cancelSession = useCallback((id: string) => {
    setSessions(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'cancelled' as const } : s
    ));
  }, []);

  const confirmSession = useCallback((id: string) => {
    setSessions(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'confirmed' as const } : s
    ));
  }, []);

  const rateSession = useCallback((id: string, rating: number, feedback: string) => {
    setSessions(prev => prev.map(s =>
      s.id === id ? { ...s, rating, feedback, status: 'completed' as const } : s
    ));
  }, []);

  const addMentor = useCallback((m: Mentor) => {
    setMentors(prev => [m, ...prev]);
  }, []);

  const deleteMentor = useCallback((id: string) => {
    setMentors(prev => prev.filter(m => m.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      libraryItems, sessions, notifications, unreadCount, mentors, chatMessages, favoriteMentorIds,
      addLibraryItem, bookSession, cancelSession, confirmSession, rateSession,
      markNotificationsRead, addNotification, addMentor, deleteMentor,
      approveLibraryItem, rejectLibraryItem, deleteLibraryItem, deleteChatMessage, addChatMessage, reactToChatMessage,
      toggleFavoriteMentor,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
