import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from './api.config';
import { Student } from '../models/student.model';

// 🔹 Exporta o tipo que o componente espera importar daqui
export type StudentCreate = Omit<Student, 'id'>;

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private base = `${API_BASE}/students`;

  constructor(private http: HttpClient) {}

  list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.base);
  }

  get(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.base}/${id}`);
  }

  create(payload: StudentCreate): Observable<Student> {
    return this.http.post<Student>(this.base, payload);
  }

  update(id: number, payload: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.base}/${id}`, payload);
  }
}
