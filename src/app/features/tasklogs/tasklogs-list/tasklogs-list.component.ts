import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { TaskLogsService } from '../../../core/services/tasklogs.service';
import { TaskLog } from '../../../core/models/tasklog.model';

@Component({
  selector: 'app-tasklogs-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tasklogs-list.component.html',
  styleUrls: ['./tasklogs-list.component.scss']
})
export class TasklogsListComponent implements OnInit {
  taskLogs: TaskLog[] = [];
  studentId: number | null = null;
  loading = false;

  constructor(
    private taskLogsService: TaskLogsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Tenta pegar da rota: /tasklogs-list/:studentId ou /tasklogs-list/:id
    const idFromParam =
      this.route.snapshot.paramMap.get('studentId') ??
      this.route.snapshot.paramMap.get('id');

    if (idFromParam) {
      this.studentId = +idFromParam;
    } else {
      // Fallback opcional: tenta localStorage (caso login tenha salvo)
      const cached = localStorage.getItem('studentId');
      this.studentId = cached ? +cached : null;
    }

    if (this.studentId) {
      this.loadTaskLogs();
    } else {
      console.error('StudentId não encontrado para carregar TaskLogs.');
    }
  }

  loadTaskLogs(): void {
    if (!this.studentId) return;
    this.loading = true;

    this.taskLogsService.listByStudent(this.studentId).subscribe({
      next: (data: TaskLog[]) => {
        this.taskLogs = data ?? [];
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar TaskLogs:', err.message);
        this.loading = false;
      }
    });
  }

  newLog(): void {
    this.router.navigate(['/tasklogs-form']);
  }

  editLog(id: number): void {
    this.router.navigate(['/tasklogs-form', id]);
  }

  deleteLog(id: number): void {
    const ok = window.confirm('Tem certeza que deseja remover este log?');
    if (!ok) return;

    this.taskLogsService.delete(id).subscribe({
      next: () => this.loadTaskLogs(),
      error: (err: HttpErrorResponse) =>
        console.error('Erro ao remover o log:', err.message)
    });
  }
}
