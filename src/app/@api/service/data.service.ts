import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ResponseErrorApi } from '../model/response-error-api.model';

@Injectable({
  providedIn: 'root'
})
export abstract class DataService {

  protected url = '/api';

  constructor(
    @Inject(String)
    protected contextUrl?: string,
  ) {
    if (contextUrl) {
      this.url += contextUrl;
    }
  }

  protected getDefaultHttpOptions() {
    return {
      headers: this.getDefaultHeaderOptions()
    }
  }

  public getDefaultHeaderOptions() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.getAuthorizationToken()}`
    }
  }

  protected abstract getAuthorizationToken(): string | null;
  
  protected handleGenericError(response: HttpErrorResponse): Observable<any> {
    if (response.status == 0) {
      return throwError(() => new Error('Ops! Verifique sua conexão de internet e tente novamente.'));
    }

    if (!(response.error && response.error.errors)) {
      return throwError(() => new Error('Algo deu errado: ' + response.message));
    }

    const erros = response.error.errors;
    if (!(erros instanceof Array)) {
      return throwError(() => new Error(erros));
    }

    let msg: string = erros[0];
    if (erros.length > 1) {
      msg = "Epa! ";
      erros.forEach(m => {
        msg += m + ' ';
      });

      msg = msg.trim();
    }

    return throwError(() => new Error(msg));
  }

  protected handleResponseErrorApi(response: HttpErrorResponse): Observable<any> {
    if (response.status == 0) {
      const msg = 'Ops! Verifique sua conexão de internet e tente novamente.';
      return throwError(() => new ResponseErrorApi(msg, msg, null, 0, null, new Date().getTime()));
    }
    return throwError(() => new ResponseErrorApi(response.message, response.error.message, 
      response.error.path, response.status, response.error.errors, response.error.timestamp));
  }
}
