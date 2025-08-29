import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentsService } from '../../../core/services/students.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit {
  students: Student[] = [];
  loading = false;
  error: string | null = null;

  constructor(private studentsService: StudentsService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.studentsService.list().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Erro ao carregar estudantes.';
        this.loading = false;
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/students/register']);
  }
}
