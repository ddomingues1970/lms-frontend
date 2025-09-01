import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // habilita *ngIf / pipes e <router-outlet>/<a routerLink>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  username: string | null = null;
  role: string | null = null;

  private storageHandler = () => this.refreshAuthInfo();
  private routerSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshAuthInfo();

    // 1) se outro tab alterar o localStorage
    window.addEventListener('storage', this.storageHandler);

    // 2) após navegações (ex.: login -> redireciona), atualiza o header
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.refreshAuthInfo());
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageHandler);
    this.routerSub?.unsubscribe();
  }

  private refreshAuthInfo(): void {
    // tenta pelo serviço; se não existir, cai no localStorage
    this.username =
      (this.authService.getUsername?.() ?? null) ??
      localStorage.getItem('username') ??
      null;

    this.role =
      (this.authService.getRole?.() ?? null) ??
      localStorage.getItem('role') ??
      null;
  }

  isLoggedIn(): boolean {
    if (typeof this.authService.isLoggedIn === 'function') {
      return this.authService.isLoggedIn();
    }
    // fallback defensivo
    return !!localStorage.getItem('authHeader') || !!localStorage.getItem('role');
  }

  isStudent(): boolean {
    return (this.role ?? '').toUpperCase() === 'STUDENT';
  }

  logout(): void {
    try {
      this.authService.logout?.();
    } finally {
      // limpeza defensiva para qualquer implementação anterior
      localStorage.removeItem('authHeader');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('studentId');
      this.refreshAuthInfo();
      this.router.navigate(['/login']);
    }
  }
}
