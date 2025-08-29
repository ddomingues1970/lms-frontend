import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Informe usuário e senha';
      return;
    }

    this.loading = true;
    try {
      // guarda "Basic <base64>" e o username no sessionStorage
      this.auth.login(this.username, this.password);

      // debug no console
      console.log('[Auth] Logado como:', this.auth.getUsername());
      console.log('[Auth] Header:', this.auth.getAuthHeader());

      // segue para a lista de estudantes (ajustamos depois conforme role)
      this.router.navigate(['/students']);
    } catch (e) {
      console.error(e);
      this.error = 'Falha ao autenticar';
    } finally {
      this.loading = false;
    }
  }
}
