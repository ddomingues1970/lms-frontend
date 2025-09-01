import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from './api.config';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private base = `${API_BASE}/courses`;

  constructor(private http: HttpClient) {}

  list(): Observable<Course[]> {
    return this.http.get<Course[]>(this.base);
  }

  // Mantém o get tradicional
  get(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.base}/${id}`);
  }

  // 🔹 Novo alias para compatibilidade com o componente de edição
  getById(id: number): Observable<Course> {
    return this.get(id);
  }

  // 🔹 create aceita payload sem 'id' (ou qualquer shape compatível)
  create(payload: Omit<Course, 'id'> | any): Observable<Course> {
    return this.http.post<Course>(this.base, payload);
  }

  update(id: number, payload: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
