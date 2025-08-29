import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_BASE } from './api.config';
import { Enrollment, EnrollmentStatus } from '../models/enrollment.model';

// Formato que pode vir do backend (entidade com objetos aninhados)
type ApiEnrollmentEntity = {
  id: number;
  student?: { id: number };
  course?: { id: number };
  status?: EnrollmentStatus;
  enrollmentDate?: string;
  // fallback caso venha "flat"
  studentId?: number;
  courseId?: number;
};

@Injectable({ providedIn: 'root' })
export class EnrollmentsService {
  private readonly base = `${API_BASE}/api/enrollments`;

  constructor(private http: HttpClient) {}

  /** Matricula estudante no curso (POST /api/enrollments) */
  enroll(studentId: number, courseId: number): Observable<Enrollment> {
    const body = { studentId, courseId }; // <- JSON no body (não query params)
    return this.http.post<ApiEnrollmentEntity>(this.base, body).pipe(
      map(this.mapEnrollment)
    );
  }

  /** Lista as matrículas de um estudante (GET /api/enrollments/student/{id}) */
  listByStudent(studentId: number): Observable<Enrollment[]> {
    return this.http
      .get<ApiEnrollmentEntity[]>(`${this.base}/student/${studentId}`)
      .pipe(map(list => list.map(this.mapEnrollment)));
  }

  /** Converte a resposta da API para o modelo do app */
  private mapEnrollment = (e: ApiEnrollmentEntity): Enrollment => ({
    id: e.id,
    studentId: e.student?.id ?? e.studentId!,
    courseId: e.course?.id ?? e.courseId!,
    status: (e.status ?? 'ACTIVE') as EnrollmentStatus,
    enrollmentDate: (e.enrollmentDate ?? new Date().toISOString().slice(0, 10)),
  });
}
