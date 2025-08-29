// Status retornado pelo backend
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELED';

// Para criar matrícula (POST)
export interface EnrollmentCreate {
  studentId: number;
  courseId: number;
}

// Para usar no app (após mapear a resposta da API)
export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  status: EnrollmentStatus;
  enrollmentDate: string; // 'YYYY-MM-DD'
}
