import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CoursesService } from '../../../core/services/courses.service';
import { EnrollmentsService } from '../../../core/services/enrollments.service';
import { Course } from '../../../core/models/course.model';

@Component({
  standalone: true,
  selector: 'app-courses-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
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
    private enrollmentsService: EnrollmentsService,
    private router: Router
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
    this.coursesService.remove(c.id!).subscribe({
      next: () => this.fetch(),
      error: (err) => alert(err?.error?.message ?? 'Falha ao excluir.')
    });
  }

  enroll(c: Course): void {
    if (!this.studentId) { alert('Informe o Student ID.'); return; }
    if (c.id == null) { alert('Curso inválido.'); return; }

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

  // ---- NOVO: lógica para exibir Logs e navegar ----
  isStudent(): boolean {
    return (localStorage.getItem('role') ?? '').toUpperCase() === 'STUDENT';
  }

  goToLogs(): void {
    // A lista de logs busca o studentId da rota ou do localStorage.
    // Como estamos usando só o role, navegamos sem id explícito.
    this.router.navigate(['/tasklogs-list']);
  }
}
