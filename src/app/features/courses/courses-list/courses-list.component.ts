import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CoursesService } from '../../../core/services/courses.service';
import { EnrollmentsService } from '../../../core/services/enrollments.service';
import { Course } from '../../../core/models/course.model';

@Component({
  standalone: true,
  selector: 'app-courses-list',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section style="padding:16px">
      <h2>Cursos</h2>

      <div style="margin-bottom:12px; display:flex; gap:12px; align-items:center;">
        <a routerLink="/courses/new">+ Novo curso</a>

        <div style="margin-left:auto">
          <label>
            <strong>Student ID:</strong>
            <input type="number" [(ngModel)]="studentId" min="1" style="width:120px; margin-left:8px;" />
          </label>
          <small *ngIf="!studentId" style="margin-left:8px; color:#666">Informe o ID do estudante para matricular.</small>
        </div>
      </div>

      <div *ngIf="loading">Carregando...</div>
      <div *ngIf="error" style="color:#c00">Erro: {{ error }}</div>

      <table *ngIf="!loading && !error" border="1" cellpadding="8" cellspacing="0" style="min-width:800px">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Início</th>
            <th>Fim</th>
            <th style="width:240px">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of courses">
            <td>{{ c.name }}</td>
            <td>{{ c.description }}</td>
            <td>{{ c.startDate }}</td>
            <td>{{ c.endDate }}</td>
            <td>
              <a [routerLink]="['/courses', c.id, 'edit']">Editar</a>
              <button (click)="remove(c)" style="margin-left:6px">Excluir</button>
              <button
                (click)="enroll(c)"
                [disabled]="!studentId || enrolling[c.id]"
                style="margin-left:6px"
                title="Matricular estudante no curso"
              >
                {{ enrolling[c.id] ? 'Matriculando...' : 'Matricular' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  error: string | null = null;

  // ID do estudante para criar a matrícula
  studentId: number | null = null;

  // loading por curso na ação de matrícula
  enrolling: Record<number, boolean> = {};

  constructor(
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  private fetch(): void {
    this.loading = true;
    this.coursesService.list().subscribe({
      next: (data) => { this.courses = data; this.loading = false; },
      error: (err) => { this.error = err?.message ?? 'Falha ao carregar cursos.'; this.loading = false; }
    });
  }

  remove(c: Course): void {
    if (!confirm(`Excluir o curso "${c.name}"?`)) return;
    this.coursesService.remove(c.id).subscribe({
      next: () => this.fetch(),
      error: (err) => alert(err?.error?.message ?? 'Falha ao excluir.')
    });
  }

  enroll(c: Course): void {
    if (!this.studentId) { alert('Informe o Student ID.'); return; }
    this.enrolling[c.id] = true;

    this.enrollmentsService.enroll(this.studentId, c.id).subscribe({
      next: () => {
        this.enrolling[c.id] = false;
        alert(`Matrícula criada para o estudante ${this.studentId} no curso "${c.name}".`);
      },
      error: (err) => {
        this.enrolling[c.id] = false;
        const status = err?.status;
        if (status === 409) {
          alert('Estudante já matriculado neste curso.');
        } else if (status === 422) {
          alert('Regra violada: o estudante já possui 3 matrículas ativas.');
        } else if (status === 404) {
          alert(err?.error?.message ?? 'Estudante ou curso não encontrado.');
        } else {
          alert('Falha ao matricular. Tente novamente.');
        }
      }
    });
  }
}
