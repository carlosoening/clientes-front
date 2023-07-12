import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@api/service/auth.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { TipoServidor } from '../model/tipo-servidor.model';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class TipoServidorService extends EntityService<TipoServidor> {

  constructor(
    http: HttpClient,
    auth: AuthService,
    logger: LoggerService,
    router: Router
  ) {
    super(http, auth, '/tiposervidor', logger, router);
  }

}
