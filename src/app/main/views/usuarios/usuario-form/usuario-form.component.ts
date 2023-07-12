import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { TipoUsuarioEnum } from 'src/app/enums/tipo-usuario.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { Usuario } from 'src/app/main/model/usuario.model';
import { UsuarioService } from 'src/app/main/service/usuario.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {

  usuarioForm: FormGroup;
  loading: boolean = false;
  tipoUsuarioEnum = TipoUsuarioEnum;
  usuario: Usuario;
  headerButtonClickSubscription: Subscription = new Subscription();

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: UsuarioService,
    private logger: LoggerService,
  ) { 
    this.usuario = new Usuario();
    this.usuarioForm = this.formBuilder.group({
      id: [null],
      codigo: ['', Validators.required],
      email: ['', Validators.required],
      nome: ['', Validators.required],
      senha: ['', Validators.required],
      ativo: [true, Validators.required],
      tipo: [this.tipoUsuarioEnum.USER, Validators.required],
      ip_maquina: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.headerService.headerData.disableButton = true;
    
    this.handleCreateOrUpdate();

    this.handleFormChanges();

    if (!await this.isNew()) {
      const params = await firstValueFrom(this.route.params);
      const id = params['id'];
      try {
        this.usuario = await firstValueFrom(this.service.getById(id));
      } catch (error: any) {
        this.loading = false;
        this.headerService.headerData.disableButton = false;
        this.logger.error(error?.error?.message || error?.message);
        this.router.navigate(['..'], { relativeTo: this.route });
        return;
      }
      this.loadForm();
      this.headerService.headerData.disableButton = false;
    }
    await this.loadHeader();
    this.loading = false;
  }

  ngOnDestroy() {
    this.headerButtonClickSubscription.unsubscribe();
  }

  handleCreateOrUpdate() {
    this.headerButtonClickSubscription = this.headerService.buttonClicked.subscribe(async () => {
      this.headerService.headerData.disableButton = true;
      this.usuario = this.usuarioForm.getRawValue();
      if (await this.isNew()) {
        this.service.create(this.usuario).subscribe({
          next: res => {
            this.logger.success(res?.message);
            this.router.navigate(['..', `${res.id}`], { relativeTo: this.route });
          },
          error: error => {
            this.logger.error(error?.error?.message);
          }, 
          complete: () => {
            this.headerService.headerData.disableButton = false;
          }
        });
      } else {
        this.service.update(this.usuario).subscribe({
          next: res => {
            this.logger.success(res?.message);
            this.loadHeader();
          },
          error: error => {
            this.logger.error(error?.error?.message);
          },
          complete: () => {
            this.headerService.headerData.disableButton = false;
          }
        });
      }
    });
  }

  handleFormChanges() {
    this.usuarioForm.valueChanges.subscribe(() => {
      this.headerService.headerData.disableButton = this.usuarioForm.invalid;
    });
  }

  loadForm() {
    this.usuarioForm.controls['id'].setValue(this.usuario.id);
    this.usuarioForm.controls['codigo'].setValue(this.usuario.codigo);
    this.usuarioForm.controls['nome'].setValue(this.usuario.nome);
    this.usuarioForm.controls['email'].setValue(this.usuario.email);
    this.usuarioForm.controls['senha'].setValue('placeholder');
    this.usuarioForm.controls['ativo'].setValue(this.usuario.ativo);
    this.usuarioForm.controls['tipo'].setValue(this.usuario.tipo);
    this.usuarioForm.controls['ip_maquina'].setValue(this.usuario.ip_maquina);
  }

  async isNew() {
    const url = await firstValueFrom(this.route.url);
    return url[0].path === 'new';
  }

  async loadHeader() {
    let title = '';
    let disableButton = false;
    if (await this.isNew()) {
      title = 'Novo Usuário';
      disableButton = true;
    } else {
      title = `${this.usuario.id} - ${this.usuario.nome}`;
      disableButton = false;
    }
    this.headerService.headerData = {
      title,
      buttonType: ButtonType.SAVE,
      icon: 'save',
      arrowBack: true,
      route: this.route,
      disableButton
    };
  }
}
