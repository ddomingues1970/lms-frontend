import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from './api.config';
import { Course, CourseCreate, CourseUpdate } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private readonly base = `${API_BASE}/api/courses`;

  constructor(private http: HttpClient) {}

  list(): Observable<Course[]> {
    return this.http.get<Course[]>(this.base);
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.base}/${id}`);
  }

  create(payload: CourseCreate): Observable<Course> {
    return this.http.post<Course>(this.base, payload);
  }

  update(id: number, payload: CourseUpdate): Observable<Course> {
    return this.http.put<Course>(`${this.base}/${id}`, payload);
  }

  patch(id: number, partial: Partial<CourseUpdate>): Observable<Course> {
    return this.http.patch<Course>(`${this.base}/${id}`, partial);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
