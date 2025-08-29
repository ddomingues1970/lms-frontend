import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService, StudentCreate } from '../../../core/services/students.service';

/** Validador: idade mínima (>= 16) */
function minAgeValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null; // yyyy-MM-dd
    if (!value) return null; // Validators.required cuida disso
    const [y, m, d] = value.split('-').map(Number);
    const birth = new Date(y, m - 1, d);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const mm = today.getMonth() - birth.getMonth();
    if (mm < 0 || (mm === 0 && today.getDate() < birth.getDate())) age--;

    return age >= min ? null : { minAge: { requiredAge: min, actualAge: age } };
  };
}

@Component({
  standalone: true,
  selector: 'app-students-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section style="padding:16px;max-width:720px;margin:auto">
      <h2>Novo Estudante</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <label>
            <span>Primeiro nome *</span>
            <input formControlName="firstName" type="text" />
            <small class="err" *ngIf="touched('firstName') && form.get('firstName')?.invalid">
              Obrigatório.
            </small>
          </label>

          <label>
            <span>Último nome *</span>
            <input formControlName="lastName" type="text" />
            <small class="err" *ngIf="touched('lastName') && form.get('lastName')?.invalid">
              Obrigatório.
            </small>
          </label>

          <label>
            <span>Data de nascimento *</span>
            <input formControlName="birthDate" type="date" />
            <small class="err" *ngIf="touched('birthDate') && form.get('birthDate')?.hasError('required')">
              Obrigatório.
            </small>
            <small class="err" *ngIf="touched('birthDate') && form.get('birthDate')?.hasError('minAge')">
              Idade mínima é 16 anos.
            </small>
          </label>

          <label>
            <span>E-mail *</span>
            <input formControlName="email" type="email" />
            <small class="err" *ngIf="touched('email') && form.get('email')?.hasError('required')">
              Obrigatório.
            </small>
            <small class="err" *ngIf="touched('email') && form.get('email')?.hasError('email')">
              E-mail inválido.
            </small>
          </label>

          <label style="grid-column:1 / -1">
            <span>Telefone *</span>
            <input formControlName="phone" type="text" />
            <small class="err" *ngIf="touched('phone') && form.get('phone')?.invalid">
              Obrigatório.
            </small>
          </label>
        </div>

        <div style="margin-top:16px;display:flex;gap:12px">
          <button type="submit" [disabled]="form.invalid || loading">Salvar</button>
          <button type="button" (click)="cancel()" [disabled]="loading">Cancelar</button>
        </div>

        <div *ngIf="error" style="margin-top:12px;color:#c00">
          {{ error }}
        </div>
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
export class StudentsFormComponent {
  loading = false;
  error: string | null = null;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: StudentsService,
    private router: Router
  ) {
    // inicializa o form no constructor
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required, minAgeValidator(16)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });
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

    const payload = this.form.value as StudentCreate;
    this.loading = true;
    this.error = null;

    this.service.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 409) {
          this.error = 'E-mail já cadastrado.';
        } else if (err?.status === 400) {
          this.error = 'Dados inválidos. Verifique os campos.';
        } else {
          this.error = 'Falha ao salvar. Tente novamente.';
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}
