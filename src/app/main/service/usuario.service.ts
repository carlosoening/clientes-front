import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateResponse } from 'src/app/@api/model/update-response.model';
import { AuthService } from 'src/app/@api/service/auth.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { AlterarSenhaDto } from '../dto/alterar-senha.dto';
import { Usuario } from '../model/usuario.model';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends EntityService<Usuario> {

  constructor(
    http: HttpClient,
    auth: AuthService,
    logger: LoggerService,
    router: Router
  ) {
    super(http, auth, '/usuario', logger, router);
  }

  alterarSenha(dadosAlterarSenha: AlterarSenhaDto) {
    return this.http.post<UpdateResponse>(`${this.url}/alterar-senha`, dadosAlterarSenha, this.getDefaultHttpOptions());
  }

}