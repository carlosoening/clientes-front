import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { TipoServidor } from 'src/app/main/model/tipo-servidor.model';
import { TipoServidorService } from 'src/app/main/service/tipo-servidor.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

@Component({
  selector: 'app-tipo-servidor-form',
  templateUrl: './tipo-servidor-form.component.html',
  styleUrls: ['./tipo-servidor-form.component.scss']
})
export class TipoServidorFormComponent implements OnInit {

  tipoServidorForm: UntypedFormGroup;
  loading: boolean = false;
  tipoServidor: TipoServidor;
  headerButtonClickSubscription: Subscription = new Subscription();

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: TipoServidorService,
    private logger: LoggerService,
  ) { 
    this.tipoServidor = new TipoServidor();
    this.tipoServidorForm = this.formBuilder.group({
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
        this.tipoServidor = await firstValueFrom(this.service.getById(id));
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
      this.tipoServidor = this.tipoServidorForm.getRawValue();
      if (await this.isNew()) {
        this.service.create(this.tipoServidor).subscribe({
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
        this.service.update(this.tipoServidor).subscribe({
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
    this.tipoServidorForm.valueChanges.subscribe(() => {
      this.headerService.headerData.disableButton = this.tipoServidorForm.invalid;
    });
  }

  loadForm() {
    this.tipoServidorForm.controls['id'].setValue(this.tipoServidor.id);
    this.tipoServidorForm.controls['codigo'].setValue(this.tipoServidor.codigo);
    this.tipoServidorForm.controls['nome'].setValue(this.tipoServidor.nome);
  }

  async isNew() {
    const url = await firstValueFrom(this.route.url);
    return url[0].path === 'new';
  }

  async loadHeader() {
    let title = '';
    let disableButton = false;
    if (await this.isNew()) {
      title = 'Novo Tipo de Servidor';
      disableButton = true;
    } else {
      title = `${this.tipoServidor.id} - ${this.tipoServidor.nome}`;
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
