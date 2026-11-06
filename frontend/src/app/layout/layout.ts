import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import { AuthService } from '../core/models/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  nomeSistema = 'Garagem Pro';
  menuAberto = false;

  get identificacaoAdmin(): string {
    const token = this.auth.getToken();

    if (!token) return 'Administrador';

    try {
      const parte = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const dados: unknown = JSON.parse(atob(parte));

      if (typeof dados === 'object' && dados !== null) {
        if ('nome' in dados && typeof dados.nome === 'string') {
          return dados.nome;
        }

        if ('email' in dados && typeof dados.email === 'string') {
          return dados.email;
        }
      }
    } catch {
    }

    return 'Administrador';
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  sair(): void {
    this.auth.logout();
    this.fecharMenu();

    void this.router.navigateByUrl('/login', {
      replaceUrl: true
    });
  }
}