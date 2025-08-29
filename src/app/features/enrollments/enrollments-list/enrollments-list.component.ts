import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentsService } from '../../../core/services/enrollments.service';
import { Enrollment } from '../../../core/models/enrollment.model';

@Component({
  standalone: true,
  selector: 'app-enrollments-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollments-list.component.html',
  styleUrl: './enrollments-list.component.scss'
})
export class EnrollmentsListComponent {
  studentId: number | null = null;
  items: Enrollment[] = [];
  loading = false;
  error: string | null = null;

  constructor(private svc: EnrollmentsService) {}

  load(): void {
    if (!this.studentId) return;
    this.loading = true; this.error = null; this.items = [];
    this.svc.listByStudent(this.studentId).subscribe({
      next: (list) => { this.items = list; this.loading = false; },
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao carregar.';
        this.loading = false;
      },
    });
  }
}
