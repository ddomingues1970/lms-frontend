import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../services/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // ⚠️ Somente para testes. Depois migraremos para JWT/login.
  private username = 'admin';
  private password = 'admin123';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Só adiciona Authorization para chamadas ao backend
    if (!req.url.startsWith(API_BASE)) {
      return next.handle(req);
    }

    // Se já existir Authorization, não sobrescreva
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    const token = btoa(`${this.username}:${this.password}`);
    const authReq = req.clone({ setHeaders: { Authorization: `Basic ${token}` } });
    return next.handle(authReq);
  }
}
