import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from './api.config';

@Injectable({ providedIn: 'root' })
export class EnrollmentsService {
  private base = `${API_BASE}/enrollments`;

  constructor(private http: HttpClient) {}

  /** Cria uma matrícula */
  enroll(studentId: number, courseId: number): Observable<void> {
    return this.http.post<void>(this.base, { studentId, courseId });
  }

  /** (opcional) lista por estudante, caso você use em algum lugar */
  listByStudent(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/student/${studentId}`);
  }
}
