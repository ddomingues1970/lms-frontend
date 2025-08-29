import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, Validators, FormGroup,
  AbstractControl, ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../core/services/courses.service';
import { Course, CourseUpdate } from '../../../core/models/course.model';

/** Validador: endDate >= startDate */
function dateOrderValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value as string | null;
  const end   = group.get('endDate')?.value as string | null;
  if (!start || !end) return null;
  return new Date(end) >= new Date(start) ? null : { dateOrder: true };
}

/** Validador: endDate <= startDate + 6 meses */
function withinSixMonthsValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value as string | null;
  const end   = group.get('endDate')?.value as string | null;
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  const six = new Date(s); six.setMonth(six.getMonth() + 6);
  return e <= six ? null : { sixMonthsLimit: true };
}

@Component({
  standalone: true,
  selector: 'app-courses-edit',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section style="padding:16px;max-width:720px;margin:auto">
      <h2>Editar Curso</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label style="grid-column:1 / -1">
            <span>Nome *</span>
            <input formControlName="name" type="text" />
            <small class="err" *ngIf="touched('name') && form.get('name')?.hasError('required')">
              Obrigatório.
            </small>
          </label>

          <label style="grid-column:1 / -1">
            <span>Descrição *</span>
            <textarea formControlName="description" rows="3"></textarea>
            <small class="err" *ngIf="touched('description') && form.get('description')?.hasError('required')">
              Obrigatório.
            </small>
          </label>

          <label>
            <span>Início *</span>
            <input formControlName="startDate" type="date" />
            <small class="err" *ngIf="touched('startDate') && form.get('startDate')?.hasError('required')">
              Obrigatório.
            </small>
          </label>

          <label>
            <span>Fim *</span>
            <input formControlName="endDate" type="date" />
            <small class="err" *ngIf="touched('endDate') && form.get('endDate')?.hasError('required')">
              Obrigatório.
            </small>
          </label>
        </div>

        <div style="margin-top:8px;color:#c00" *ngIf="form.errors?.['dateOrder']">
          A data de término deve ser posterior ou igual à data de início.
        </div>
        <div style="margin-top:8px;color:#c00" *ngIf="form.errors?.['sixMonthsLimit']">
          O curso deve terminar em até 6 meses após a data de início.
        </div>

        <div style="margin-top:16px;display:flex;gap:12px">
          <button type="submit" [disabled]="form.invalid || loading">Salvar</button>
          <button type="button" (click)="cancel()" [disabled]="loading">Cancelar</button>
        </div>

        <div *ngIf="error" style="margin-top:12px;color:#c00">{{ error }}</div>
        <div *ngIf="loading" style="margin-top:12px">Salvando...</div>
      </form>
    </section>
  `,
  styles: [`
    input, textarea { width:100%; padding:8px; box-sizing:border-box; }
    label { display:flex; flex-direction:column; gap:4px }
    .err { color:#c00 }
    button { padding:8px 12px }
  `]
})
export class CoursesEditComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  private id!: number;

  constructor(
    private fb: FormBuilder,
    private service: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
      },
      { validators: [dateOrderValidator, withinSixMonthsValidator] }
    );
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.service.getById(this.id).subscribe({
      next: (c: Course) => {
        this.form.patchValue({
          name: c.name,
          description: c.description,
          startDate: c.startDate,
          endDate: c.endDate,
        });
        this.loading = false;
      },
      error: () => { this.error = 'Falha ao carregar curso.'; this.loading = false; }
    });
  }

  touched(name: string): boolean {
    const c = this.form.get(name);
    return !!c && (c.touched || c.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = this.form.value as CourseUpdate;
    this.loading = true; this.error = null;

    this.service.update(this.id, payload).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/courses']); },
      error: (err) => {
        this.loading = false;
        if (err?.status === 409) this.error = 'Nome do curso já existe.';
        else if (err?.status === 400) this.error = 'Dados inválidos.';
        else this.error = 'Falha ao salvar. Tente novamente.';
      }
    });
  }

  cancel(): void { this.router.navigate(['/courses']); }
}
