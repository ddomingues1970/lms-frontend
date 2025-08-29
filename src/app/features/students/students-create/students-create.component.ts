import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService } from '../../../core/services/students.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-students-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students-create.component.html',
  styleUrls: ['./students-create.component.css']
})
export class StudentsCreateComponent {
  student: Student = {
    id: 0,
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: ''
  };

  error: string | null = null;

  constructor(
    private studentsService: StudentsService,
    private router: Router
  ) {}

  private calculateAge(dateStr: string): number {
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  save() {
    if (!this.student.firstName || !this.student.lastName ||
        !this.student.birthDate || !this.student.email || !this.student.phone) {
      this.error = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.calculateAge(this.student.birthDate) < 16) {
      this.error = 'O estudante deve ter no mínimo 16 anos.';
      return;
    }

    this.studentsService.create(this.student).subscribe({
      next: () => this.router.navigate(['/students']),
      error: err => {
        if (err.status === 409) {
          this.error = 'E-mail já cadastrado.';
        } else {
          this.error = 'Erro ao salvar estudante.';
        }
      }
    });
  }
}
