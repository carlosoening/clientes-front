import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/@api/service/auth.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { ClienteDto } from '../dto/cliente.dto';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends EntityService<ClienteDto> {

  constructor(
    http: HttpClient,
    auth: AuthService,
    logger: LoggerService,
    router: Router
  ) {
    super(http, auth, '/cliente', logger, router);
  }

  buscarVersaoGsan(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/buscar-versao/gsan/${id}`, this.getDefaultHttpOptions());
  }
}
