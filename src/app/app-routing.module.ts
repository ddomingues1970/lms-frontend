import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(c => c.LoginComponent),
  },

  // Students
  {
    path: 'students',
    loadComponent: () =>
      import('./features/students/students-list/students-list.component')
        .then(c => c.StudentsListComponent),
  },

   {
    path: 'students/register',
    loadComponent: () =>
      import('./features/students/students-create/students-create.component')
        .then(c => c.StudentsCreateComponent),
    },
  {
    path: 'students/new',
    loadComponent: () =>
      import('./features/students/students-form/students-form.component')
        .then(c => c.StudentsFormComponent),
  }, 

  // Courses
  {
    path: 'courses/new',
    loadComponent: () =>
      import('./features/courses/courses-form/courses-form.component')
        .then(c => c.CoursesFormComponent),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/courses-list/courses-list.component')
        .then(c => c.CoursesListComponent),
  },
  {
    path: 'courses/:id/edit',
    loadComponent: () =>
      import('./features/courses/courses-edit/courses-edit.component')
        .then(c => c.CoursesEditComponent),
  },

  //Enrollments
  {
  path: 'enrollments',
  loadComponent: () =>
    import('./features/enrollments/enrollments-list/enrollments-list.component')
      .then(c => c.EnrollmentsListComponent),
  }, 
  
   // Redirecionamentos (sempre por último!)
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: '**', redirectTo: 'students' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
