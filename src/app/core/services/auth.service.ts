import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Role = 'ADMIN' | 'STUDENT' | null;

export interface AuthState {
  username: string | null;
  role: Role;
  authHeader: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERNAME_KEY = 'username';
  private readonly ROLE_KEY = 'role';
  private readonly AUTH_KEY = 'authHeader';

  // Estado reativo para que o topo/menus atualizem imediatamente
  private readonly _auth$ = new BehaviorSubject<AuthState>(this.readFromStorage());
  readonly auth$ = this._auth$.asObservable();

  /** Faz login e persiste credenciais básicas + role */
  login(username: string, password: string, role: 'ADMIN' | 'STUDENT' = 'STUDENT'): void {
    const basic = 'Basic ' + btoa(`${username}:${password}`);

    localStorage.setItem(this.AUTH_KEY, basic);
    localStorage.setItem(this.USERNAME_KEY, username);
    localStorage.setItem(this.ROLE_KEY, role);

    this._auth$.next({ username, role, authHeader: basic });
  }

  /** Limpa storage e estado reativo */
  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.ROLE_KEY);

    this._auth$.next({ username: null, role: null, authHeader: null });
  }

  /** Header Authorization para interceptors */
  getAuthHeader(): string | null {
    return this._auth$.value.authHeader ?? localStorage.getItem(this.AUTH_KEY);
  }

  /** Helpers síncronos (compatibilidade com código existente) */
  isLoggedIn(): boolean {
    return !!this.getAuthHeader();
  }

  getUsername(): string | null {
    return this._auth$.value.username ?? localStorage.getItem(this.USERNAME_KEY);
  }

  getRole(): 'ADMIN' | 'STUDENT' | null {
    const role = this._auth$.value.role ?? (localStorage.getItem(this.ROLE_KEY) as Role);
    return role ?? null;
  }

  /** Lê estado inicial do localStorage */
  private readFromStorage(): AuthState {
    return {
      username: localStorage.getItem(this.USERNAME_KEY),
      role: (localStorage.getItem(this.ROLE_KEY) as Role) ?? null,
      authHeader: localStorage.getItem(this.AUTH_KEY),
    };
  }
}
