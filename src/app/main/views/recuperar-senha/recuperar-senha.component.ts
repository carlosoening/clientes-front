import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { RecuperarSenhaService } from '../../service/recuperar-senha.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {

  recuperarSenhaForm: FormGroup;
  novaSenhaForm: FormGroup;
  loading: boolean = false;
  etapa: string = 'recuperarSenhaComEmail';
  token: string = '';
  usuarioId = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private recuperarSenhaService: RecuperarSenhaService
  ) { 
    this.recuperarSenhaForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

    this.novaSenhaForm = this.formBuilder.group({
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.route.queryParams);
    if (params['token'] && params['usuarioId']) {
      this.etapa = 'redefinirSenha'
      this.token = params['token'];
      this.usuarioId = params['usuarioId'];
    }

    this.novaSenhaForm.valueChanges.subscribe(value => {
      if (value['senha'] !== value['confirmarSenha']) {
        this.novaSenhaForm.get('confirmarSenha')?.setErrors({ passwordsNotMatching: true });
      } else {
        this.novaSenhaForm.get('confirmarSenha')?.setErrors({ passwordsNotMatching: null });
        this.novaSenhaForm.get('confirmarSenha')?.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  enviarEmailRecuperarSenha() {
    this.loading = true;
    this.recuperarSenhaService.enviarEmailRecuperarSenha(this.recuperarSenhaForm.controls['email'].getRawValue()).subscribe(
      {
        next: res => {
          this.logger.success(res.message);
        },
        error: error => {
          this.logger.error(error.error?.message);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.etapa = 'emailEnviado'
        }
      }
    );
  }

  redefinirSenha() {
    this.loading = true;
    this.recuperarSenhaService.redefinirSenha(
      this.token, 
      Number(this.usuarioId), 
      this.novaSenhaForm.controls['senha'].getRawValue()
    ).subscribe({
      next: res => {
        this.logger.success(res.message);
      },
      error: error => {
        this.logger.error(error.error?.message);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.router.navigate(['login']);
      }
    })
  }

}
