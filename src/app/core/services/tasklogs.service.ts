import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from './api.config';
import { TaskLog } from '../models/tasklog.model';

@Injectable({ providedIn: 'root' })
export class TaskLogsService {
  private base = `${API_BASE}/task-logs`;

  constructor(private http: HttpClient) {}

  /** GET /api/task-logs/{id} */
  getById(id: number): Observable<TaskLog> {
    return this.http.get<TaskLog>(`${this.base}/${id}`);
  }

  /** GET /api/task-logs/student/{studentId} */
  listByStudent(studentId: number): Observable<TaskLog[]> {
    return this.http.get<TaskLog[]>(`${this.base}/student/${studentId}`);
  }

  /** POST /api/task-logs */
  create(payload: TaskLog): Observable<TaskLog> {
    return this.http.post<TaskLog>(this.base, payload);
  }

  /** PUT /api/task-logs/{id} */
  update(id: number, payload: Partial<TaskLog>): Observable<TaskLog> {
    return this.http.put<TaskLog>(`${this.base}/${id}`, payload);
  }

  /** DELETE /api/task-logs/{id} */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
