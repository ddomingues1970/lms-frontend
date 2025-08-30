import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskLog } from '../models/tasklog.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskLogsService {
  private base = `${environment.apiBaseUrl}/task-logs`;

  constructor(private http: HttpClient) {}

  // Busca todos os logs de um estudante
  listByStudent(studentId: number): Observable<TaskLog[]> {
    return this.http.get<TaskLog[]>(`${this.base}/student/${studentId}`);
  }

  // Busca um log pelo ID (para edição)
  getById(id: number): Observable<TaskLog> {
    return this.http.get<TaskLog>(`${this.base}/${id}`);
  }

  // Cria um log
  create(payload: TaskLog): Observable<TaskLog> {
    return this.http.post<TaskLog>(this.base, payload);
  }

  // Atualiza um log
  update(id: number, payload: Partial<TaskLog>): Observable<TaskLog> {
    return this.http.put<TaskLog>(`${this.base}/${id}`, payload);
  }

  // Remove um log
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
