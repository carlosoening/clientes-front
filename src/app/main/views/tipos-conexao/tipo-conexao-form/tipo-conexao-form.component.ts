import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { TipoConexao } from 'src/app/main/model/tipo-conexao.model';
import { TipoConexaoService } from 'src/app/main/service/tipo-conexao.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

@Component({
  selector: 'app-tipo-conexao-form',
  templateUrl: './tipo-conexao-form.component.html',
  styleUrls: ['./tipo-conexao-form.component.scss']
})
export class TipoConexaoFormComponent implements OnInit {

  tipoConexaoForm: UntypedFormGroup;
  loading: boolean = false;
  tipoConexao: TipoConexao;
  headerButtonClickSubscription: Subscription = new Subscription();

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: TipoConexaoService,
    private logger: LoggerService,
  ) { 
    this.tipoConexao = new TipoConexao();
    this.tipoConexaoForm = this.formBuilder.group({
      id: [null],
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
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
        this.tipoConexao = await firstValueFrom(this.service.getById(id));
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
      this.tipoConexao = this.tipoConexaoForm.getRawValue();
      if (await this.isNew()) {
        this.service.create(this.tipoConexao).subscribe({
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
        this.service.update(this.tipoConexao).subscribe({
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
    this.tipoConexaoForm.valueChanges.subscribe(() => {
      this.headerService.headerData.disableButton = this.tipoConexaoForm.invalid;
    });
  }

  loadForm() {
    this.tipoConexaoForm.controls['id'].setValue(this.tipoConexao.id);
    this.tipoConexaoForm.controls['codigo'].setValue(this.tipoConexao.codigo);
    this.tipoConexaoForm.controls['nome'].setValue(this.tipoConexao.nome);
  }

  async isNew() {
    const url = await firstValueFrom(this.route.url);
    return url[0].path === 'new';
  }

  async loadHeader() {
    let title = '';
    let disableButton = false;
    if (await this.isNew()) {
      title = 'Novo Tipo de Conexão';
      disableButton = true;
    } else {
      title = `${this.tipoConexao.id} - ${this.tipoConexao.nome}`;
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
