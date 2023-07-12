import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@api/service/auth.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { TipoConexao } from '../model/tipo-conexao.model';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class TipoConexaoService extends EntityService<TipoConexao> {

  constructor(
    http: HttpClient,
    auth: AuthService,
    logger: LoggerService,
    router: Router
  ) {
    super(http, auth, '/tipoconexao', logger, router);
  }

}
