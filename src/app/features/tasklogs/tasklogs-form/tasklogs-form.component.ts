import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { TaskLogsService } from '../../../core/services/tasklogs.service';
import { TaskLog } from '../../../core/models/tasklog.model';

@Component({
  standalone: true,
  selector: 'app-tasklogs-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasklogs-form.component.html',
  styleUrls: ['./tasklogs-form.component.scss']
})
export class TasklogsFormComponent implements OnInit {
  taskLogForm: FormGroup;
  taskLogId: number | null = null;
  loading = false;

  constructor(
    private taskLogsService: TaskLogsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.taskLogForm = this.fb.group({
      studentId: [null, [Validators.required, Validators.min(1)]],
      courseId:  [null, [Validators.required, Validators.min(1)]],
      categoryId: [null, Validators.required],
      timestamp: ['', Validators.required],
      description: ['', Validators.required],
      minutesSpent: [30, [Validators.required, Validators.min(30)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.taskLogId = idParam ? Number(idParam) : null;

    if (this.taskLogId) {
      this.loading = true;
      this.taskLogsService.getById(this.taskLogId).subscribe({
        next: (log: TaskLog) => {
          this.loading = false;
          this.taskLogForm.patchValue({
            studentId: log.studentId,
            courseId: log.courseId,
            categoryId: log.categoryId,
            timestamp: log.timestamp,
            description: log.description,
            minutesSpent: log.minutesSpent
          });
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          console.error('Erro ao carregar o log:', err);
          alert(err?.error?.message ?? 'Falha ao carregar o log.');
        }
      });
    }
  }

  submit(): void {
    if (this.taskLogForm.invalid) return;
    this.loading = true;

    const payload: TaskLog = this.taskLogForm.value;

    const obs = this.taskLogId
      ? this.taskLogsService.update(this.taskLogId, payload)
      : this.taskLogsService.create(payload);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tasklogs-list']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('Erro ao salvar log:', err);
        alert(err?.error?.message ?? 'Falha ao salvar log.');
      }
    });
  }
}
