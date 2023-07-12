import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { AlterarSenhaDto } from '../../dto/alterar-senha.dto';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit {

  loading: boolean = false;
  public alterarSenhaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private logger: LoggerService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
  ) { 
    this.alterarSenhaForm = this.formBuilder.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', Validators.required],
      confirmarSenha: ['', Validators.required],
    });

    this.headerService.headerData = {
      title: 'Alterar Senha',
      buttonType: null,
      icon: '',
      route: this.route
    }
  }

  ngOnInit(): void {
    this.alterarSenhaForm.valueChanges.subscribe(value => {
      if (value['novaSenha'] !== value['confirmarSenha']) {
        this.alterarSenhaForm.get('confirmarSenha')?.setErrors({ passwordsNotMatching: true });
      } else {
        this.alterarSenhaForm.get('confirmarSenha')?.setErrors({ passwordsNotMatching: null });
        this.alterarSenhaForm.get('confirmarSenha')?.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  alterarSenha() {
    const dadosAlterarSenha: AlterarSenhaDto = this.alterarSenhaForm.getRawValue();
    this.usuarioService.alterarSenha(dadosAlterarSenha).subscribe({
      next: res => {
        this.logger.success(res.message);
        this.router.navigate(['home']);
      },
      error: error => {
        this.logger.error(error?.error?.message);
      }
    })
  }
}
