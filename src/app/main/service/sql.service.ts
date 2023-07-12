import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/@api/service/auth.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { Sql } from '../model/sql.model';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class SqlService extends EntityService<Sql> {

  constructor(
    http: HttpClient,
    auth: AuthService,
    logger: LoggerService,
    router: Router
  ) {
    super(http, auth, '/sql', logger, router);
  }

}
