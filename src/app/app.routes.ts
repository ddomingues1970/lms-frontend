import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./features/students/students-list/students-list.component')
        .then(m => m.StudentsListComponent)
  },
  {
    path: 'students/register',
    loadComponent: () =>
      import('./features/students/students-create/students-create.component')
        .then(m => m.StudentsCreateComponent)
  },
  { path: '**', redirectTo: 'students' }
];
