import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from './api.config';
import { Student } from '../models/student.model';

// Tipos de entrada (não incluem 'id')
export interface StudentCreate {
  firstName: string;
  lastName: string;
  birthDate: string; // 'YYYY-MM-DD' (ISO)
  email: string;
  phone: string;
}

export interface StudentUpdate extends StudentCreate {}

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private readonly base = `${API_BASE}/api/students`;

  constructor(private http: HttpClient) {}

  /** Lista todos os estudantes */
  list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.base);
  }

  /** Busca por ID */
  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.base}/${id}`);
  }

  /** Cria um novo estudante */
  create(payload: StudentCreate): Observable<Student> {
    return this.http.post<Student>(this.base, payload);
  }

}  
