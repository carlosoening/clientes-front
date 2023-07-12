import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { CreateResponse } from 'src/app/@api/model/create-response.model';
import { DeleteResponse } from 'src/app/@api/model/delete-response.model';
import { UpdateResponse } from 'src/app/@api/model/update-response.model';
import { AuthService } from 'src/app/@api/service/auth.service';
import { DataService } from 'src/app/@api/service/data.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { Entity } from '../model/entity.model';

@Injectable({
  providedIn: 'root'
})
export abstract class EntityService<E extends Entity> extends DataService {

  constructor(
    protected http: HttpClient,
    protected authService: AuthService,
    @Inject(String)
    protected override contextUrl: string,
    protected logger: LoggerService,
    protected router: Router
  ) { 
    super(contextUrl);
  }

  getById(id: number): Observable<E> {
    return this.http.get<E>(`${this.url}/${id}`, this.getDefaultHttpOptions())
    .pipe(catchError(error => {
      if (error.status === 401) {
        this.authService.doLogout().subscribe(() => {
          this.router.navigate(['login']);
        });
      }
      throw new Error('A sua sessão expirou! Faça login novamente.');
    }));
  }

  getAll(): Observable<E[]> {
    return this.http.get<E[]>(this.url, this.getDefaultHttpOptions())
    .pipe(catchError(error => {
      if (error.status === 401) {
        this.logger.info('A sua sessão expirou! Faça login novamente.');
        this.authService.doLogout().subscribe(() => {
          this.router.navigate(['login']);
        });
      }
      return of([]);
    }));
  }

  create(entity: E): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(`${this.url}`, entity, this.getDefaultHttpOptions());
  }
  
  update(entity: E): Observable<UpdateResponse> {
    return this.http.put<UpdateResponse>(`${this.url}/${entity.id}`, entity, this.getDefaultHttpOptions());
  }

  delete(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.url}/${id}`, this.getDefaultHttpOptions());
  }

  pesquisar(texto: string): Observable<E[]> {
    return this.http.get<E[]>(`${this.url}/pesquisar`, {
      params: {
        texto
      },
      headers: this.getDefaultHeaderOptions()
    });
  }

  protected getAuthorizationToken(): string | null {
    return this.authService.getAuthorizationToken();
  }
}
