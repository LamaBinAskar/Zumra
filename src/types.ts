export type UserRole = 'student' | 'mentor' | 'admin';
export type SessionType = 'online' | 'in-person';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type LibraryItemType = 'summary' | 'video' | 'questions' | 'notes' | 'slides';
export type LibraryApprovalStatus = 'pending' | 'approved' | 'rejected';
export type BadgeType = 'bronze' | 'silver' | 'gold' | 'platinum';
export type CertificateType = 'appreciation' | 'excellence' | 'outstanding';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: BadgeType;
  earnedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university: string;
  college: string;
  major: string;
  year: number;
  avatar: string;
  points: number;
  badges: Badge[];
  joinedAt: string;
}

export interface Mentor extends User {
  role: 'mentor';
  subjects: string[];
  bio: string;
  rating: number;
  totalSessions: number;
  totalStudents: number;
  available: boolean;
  sessionTypes: SessionType[];
}

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  courseName: string;
  semester: string;
  academicYear: string;
  type: LibraryItemType;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedById: string;
  uploadedByName: string;
  uploadedAt: string;
  downloads: number;
  views: number;
  rating: number;
  ratingsCount: number;
  tags: string[];
  college: string;
  approvalStatus?: LibraryApprovalStatus; // undefined = approved (legacy items)
  rejectionReason?: string;
  summaryContent?: string; // written text for summary-type items
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  subject: string;
  topic: string;
  date: string;
  startTime: string;
  duration: number;
  type: SessionType;
  status: SessionStatus;
  rating?: number;
  feedback?: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export interface Certificate {
  id: string;
  mentorId: string;
  mentorName: string;
  college: string;
  major: string;
  type: CertificateType;
  issuedAt: string;
  sessionsCount: number;
  averageRating: number;
  totalStudents: number;
  issuedBy: string;
  academicYear: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'session' | 'certificate' | 'badge' | 'library' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AdminStats {
  totalStudents: number;
  totalMentors: number;
  totalSessions: number;
  totalLibraryItems: number;
  totalCertificates: number;
  activeSessionsToday: number;
  popularSubjects: { name: string; count: number }[];
  monthlyActivity: { month: string; sessions: number; uploads: number }[];
  topMentors: { id: string; name: string; sessions: number; rating: number }[];
  collegeStats: { college: string; students: number; mentors: number }[];
}
