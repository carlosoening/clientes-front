import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperarSenhaService {

  private url: string = '/api/recuperar-senha';

  constructor(
    private http: HttpClient
  ) {
  }

  enviarEmailRecuperarSenha(email: string): Observable<any> {
    const baseUrl: string = window.location.origin;
    return this.http.post<any>(`${this.url}/enviar-email`, { email, baseUrl });
  }

  redefinirSenha(token: string, usuarioId: number, senha: string): Observable<any> {
    return this.http.post<any>(`${this.url}/redefinir-senha`, {
      token,
      usuarioId,
      senha
    });
  }
}
