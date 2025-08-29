import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false // <- força o Angular a tratar como NÃO-standalone
})
export class AppComponent {
  title = 'lms-frontend';

  constructor(private auth: AuthService) {}

  get username(): string | null {
    return this.auth.getUsername();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout();
  }
}
