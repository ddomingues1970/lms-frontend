import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../../../core/services/students.service';
import { Student } from '../../../core/models/student.model';

@Component({
  standalone: true,
  selector: 'app-students-list',
  imports: [CommonModule],
  template: `
    <section style="padding:16px">
      <h2>Students</h2>

      <div *ngIf="loading">Loading...</div>
      <div *ngIf="error" style="color:#c00">Erro: {{ error }}</div>

      <ul *ngIf="!loading && !error">
        <li *ngFor="let s of students">
          <strong>{{ s.firstName }} {{ s.lastName }}</strong>
          &nbsp;•&nbsp; {{ s.email }} &nbsp;•&nbsp; {{ s.phone }}
        </li>
      </ul>
    </section>
  `
})
export class StudentsListComponent implements OnInit {
  students: Student[] = [];
  loading = false;
  error: string | null = null;

  constructor(private studentsService: StudentsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.studentsService.list().subscribe({
      next: data => { this.students = data; this.loading = false; },
      error: err => { this.error = err?.message ?? 'Erro desconhecido'; this.loading = false; }
    });
  }
}
