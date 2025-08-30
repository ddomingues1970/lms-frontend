import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ habilita *ngIf / pipes e <router-outlet>/<a routerLink>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  username: string | null = null;
  role: string | null = null;

  private onStorage = () => this.refreshAuthInfo();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshAuthInfo();
    window.addEventListener('storage', this.onStorage);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.onStorage);
  }

  private refreshAuthInfo(): void {
    this.username =
      this.authService.getUsername?.() ??
      localStorage.getItem('username') ??
      null;

    this.role =
      this.authService.getRole?.() ??
      localStorage.getItem('role') ??
      null;
  }

  isLoggedIn(): boolean {
    if (typeof this.authService.isLoggedIn === 'function') {
      return this.authService.isLoggedIn();
    }
    return !!localStorage.getItem('token') || !!localStorage.getItem('role');
  }

  isStudent(): boolean {
    return (this.role ?? '').toUpperCase() === 'STUDENT';
  }

  logout(): void {
    try {
      this.authService.logout?.();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('studentId');
      this.refreshAuthInfo();
      this.router.navigate(['/login']);
    }
  }
}
