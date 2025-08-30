import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private AUTH_KEY = 'authHeader';
  private USER_KEY = 'username';

  login(username: string, password: string): void {
    const token = btoa(`${username}:${password}`);
    sessionStorage.setItem(this.AUTH_KEY, `Basic ${token}`);
    sessionStorage.setItem(this.USER_KEY, username);
  }

  logout(): void {
    sessionStorage.removeItem(this.AUTH_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  getAuthHeader(): string | null {
    return sessionStorage.getItem(this.AUTH_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAuthHeader();
  }

  getUsername(): string | null {
    return sessionStorage.getItem(this.USER_KEY);
  }

  getRole(): string | null {
  return localStorage.getItem('role'); // ou de onde você estiver guardando
}

}
