import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';

import { Login } from '../model/login.model';
import { UserToken } from '../model/userToken.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends DataService {

  private static readonly TOKEN_KEY_NAME = 'token';

  onLogin = new Subject<UserToken | null>();

  constructor(
    private http: HttpClient
  ) {
    super('/login');
  }

  public doLogin(dadosLogin: Login): Observable<UserToken> {
    return new Observable((obs) => {
      this.http.post<UserToken>(this.url, dadosLogin)
      .pipe(catchError(this.handleResponseErrorApi))
      .subscribe({
        next: (res: UserToken) => {
          if (!res.token) {
            obs.error('Resposta não suportada: ' + res);
            return;
          }
          const userToken = this.saveToken(res);
          this.onLogin.next(userToken);
          obs.next(userToken);
        },
        error: error => {
          obs.error(error);
        }
      });
    })
  }

  public doLogout(): Observable<UserToken | null> {
    let userToken: any = localStorage.getItem(AuthService.TOKEN_KEY_NAME);
    if (userToken) {
      userToken = JSON.parse(userToken);
      localStorage.removeItem(AuthService.TOKEN_KEY_NAME);
    }
    return of(userToken);
  }

  isAutenticado(): boolean {
    return !!this.getCurrentToken();
  }

  public getAuthorizationToken(): string | null{
    const current = this.getCurrentToken();
    if (!current) return null;
    return current.token;
  }

  public getCurrentToken(): UserToken | null {
    const token = localStorage.getItem(AuthService.TOKEN_KEY_NAME);
    if (!token) return null;
    return JSON.parse(token);
  }

  private saveToken(token: UserToken) {
    localStorage.setItem(AuthService.TOKEN_KEY_NAME, JSON.stringify(token));
    return token;
  }

}
