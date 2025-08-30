import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TaskLogsService } from '../../../core/services/tasklogs.service';
import { TaskLog } from '../../../core/models/tasklog.model';

@Component({
  selector: 'app-tasklogs-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tasklogs-form.component.html', // <-- arquivo certo do form
  styleUrls: ['./tasklogs-form.component.scss']
})
export class TasklogsFormComponent implements OnInit { // <-- nome de classe correto
  taskLogForm: FormGroup;
  taskLogId: number | null = null;

  constructor(
    private taskLogsService: TaskLogsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.taskLogForm = this.fb.group({
      categoryId: ['', Validators.required],
      timestamp: ['', Validators.required],
      description: ['', Validators.required],
      minutesSpent: ['', [Validators.required, Validators.min(30)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.taskLogId = idParam ? +idParam : null;

    if (this.taskLogId) {
      this.loadTaskLog();
    }
  }

  // Carrega o log de tarefa para edição via GET /task-logs/{id}
  loadTaskLog(): void {
    if (!this.taskLogId) return;

    this.taskLogsService.getById(this.taskLogId).subscribe({
      next: (log: TaskLog) => {
        this.taskLogForm.patchValue({
          categoryId: log.categoryId,
          timestamp: log.timestamp,
          description: log.description,
          minutesSpent: log.minutesSpent
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar o log da tarefa:', err.message);
      }
    });
  }

  // Submete o formulário para criar ou atualizar o log de tarefa
  submit(): void {
    if (this.taskLogForm.invalid) return;

    const taskLog: TaskLog = this.taskLogForm.value;

    if (this.taskLogId) {
      this.taskLogsService.update(this.taskLogId, taskLog).subscribe({
        next: () => this.router.navigate(['/tasklogs-list']),
        error: (err: HttpErrorResponse) =>
          console.error('Erro ao atualizar o log de tarefa:', err.message)
      });
    } else {
      this.taskLogsService.create(taskLog).subscribe({
        next: () => this.router.navigate(['/tasklogs-list']),
        error: (err: HttpErrorResponse) =>
          console.error('Erro ao criar o log de tarefa:', err.message)
      });
    }
  }
}
