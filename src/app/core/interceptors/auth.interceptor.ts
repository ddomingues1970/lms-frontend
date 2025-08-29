import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { API_BASE } from '../services/api.config';

function isSameOrigin(url: string): boolean {
  try {
    if (url.startsWith('/')) return true;
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin;
  } catch {
    return false;
  }
}

function shouldAttachAuth(url: string): boolean {
  const base = (API_BASE || '').replace(/\/+$/, '');
  const u = url.replace(/\/+$/, '');
  return (
    (!!base && (u.startsWith(base) || u.startsWith(`${base}/`))) ||
    u.startsWith('/api') ||
    isSameOrigin(u)
  );
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let r = req;

    if (!req.headers.has('Authorization') && shouldAttachAuth(req.url)) {
      const header = this.auth.getAuthHeader(); // ex.: "Basic <base64>"
      if (header) {
        r = req.clone({ setHeaders: { Authorization: header } });
      }
    }

    return next.handle(r).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403)) {
          // 401: credencial inválida/ausente; 403: falta de role
          // deixa a sessão como está; apenas leva ao /login para nova tentativa
          if (this.router.url !== '/login') this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
