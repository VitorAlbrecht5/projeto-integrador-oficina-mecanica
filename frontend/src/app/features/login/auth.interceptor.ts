import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../core/models/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const api = new URL(environment.apiUrl, window.location.origin);
  const destino = new URL(req.url, window.location.origin);
  const base = api.pathname.replace(/\/$/, '');

  const daApi =
    destino.origin === api.origin &&
    (
      destino.pathname === base ||
      destino.pathname.startsWith(`${base}/`)
    );

  const publica =
    destino.pathname === `${base}/auth/login` ||
    destino.pathname.startsWith(`${base}/veiculos/consulta/`);

  if (!daApi || publica) {
    return next(req);
  }

  const token = auth.getToken();

  const requisicao = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(requisicao).pipe(
    catchError((erro: unknown) => {
      if (
        erro instanceof HttpErrorResponse &&
        erro.status === 401 &&
        auth.getToken() === token
      ) {
        auth.logout();

        void router.navigateByUrl('/login', {
          replaceUrl: true,
        });
      }

      return throwError(() => erro);
    }),
  );
};