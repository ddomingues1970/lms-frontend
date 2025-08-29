export interface TaskLog {
  id?: number;
  studentId: number;
  courseId: number;
  categoryId: number;
  timestamp: string; // ISO
  description: string;
  minutesSpent: number;
}
