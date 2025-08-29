import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: 'students',
    loadComponent: () => import('./features/students/students-list/students-list.component')
      .then(m => m.StudentsListComponent)
  },
  { path: '**', redirectTo: 'students' }
];
