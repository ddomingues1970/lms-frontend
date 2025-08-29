import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, Validators, FormGroup, ValidationErrors, AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesService } from '../../../core/services/courses.service';
import { CourseCreate } from '../../../core/models/course.model';

/** Validador de grupo: endDate >= startDate */
function dateOrderValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value as string | null;
  const end   = group.get('endDate')?.value as string | null;
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  return e >= s ? null : { dateOrder: true };
}

/** Validador de grupo: endDate <= startDate + 6 meses */
function withinSixMonthsValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value as string | null;
  const end   = group.get('endDate')?.value as string | null;
  if (!start || !end) return null;

  const s = new Date(start);
  const e = new Date(end);

  const sixMonthsLater = new Date(s);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

  return e <= sixMonthsLater ? null : { sixMonthsLimit: true };
}

@Component({
  standalone: true,
  selector: 'app-courses-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section style="padding:16px;max-width:720px;margin:auto">
      <h2>Novo Curso</h2>

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
    input { width:100%; padding:8px; box-sizing:border-box; }
    label { display:flex; flex-direction:column; gap:4px }
    .err { color:#c00 }
    button { padding:8px 12px }
  `]
})
export class CoursesFormComponent {
  loading = false;
  error: string | null = null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CoursesService,
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

  touched(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!c && (c.touched || c.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value as CourseCreate;
    this.loading = true;
    this.error = null;

    this.service.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 409) {
          this.error = 'Nome do curso já existe.';
        } else if (err?.status === 400) {
          this.error = 'Dados inválidos. Verifique os campos.';
        } else {
          this.error = 'Falha ao salvar. Tente novamente.';
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/courses']);
  }
}
