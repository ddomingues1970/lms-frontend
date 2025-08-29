import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api.config';
import { Observable } from 'rxjs';
import { TaskLog } from '../models/tasklog.model';

@Injectable({ providedIn: 'root' })
export class TaskLogsService {
  private base = `${API_BASE}/task-logs`;

  constructor(private http: HttpClient) {}

  listByStudent(studentId: number): Observable<TaskLog[]> {
    return this.http.get<TaskLog[]>(`${this.base}/student/${studentId}`);
  }

  create(payload: TaskLog): Observable<TaskLog> {
    return this.http.post<TaskLog>(this.base, payload);
  }

  update(id: number, payload: Partial<TaskLog>): Observable<TaskLog> {
    return this.http.put<TaskLog>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
