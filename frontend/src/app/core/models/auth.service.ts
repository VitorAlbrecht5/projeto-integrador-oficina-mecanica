import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LoginDto, AuthResponse } from '../models/auth.model';
import { RespostaApi } from './resposta-api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http
      .post<RespostaApi<AuthResponse>>(this.apiUrl, credentials)
      .pipe(map((resposta) => resposta.dados));
  }


  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) return false;

    try {
      const partes = token.split('.');

      if (partes.length !== 3 || partes.some((parte) => !parte)) {
        throw new Error('Token inválido.');
      }

      const conteudo = partes[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload: unknown = JSON.parse(atob(conteudo));

      if (
        typeof payload === 'object' &&
        payload !== null &&
        'exp' in payload &&
        typeof payload.exp === 'number' &&
        Number.isFinite(payload.exp) &&
        payload.exp * 1000 > Date.now()
      ) {
        return true;
      }
    } catch {
      
    }

    this.logout();
    return false;
  }

}