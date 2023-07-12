import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { ClienteDto } from 'src/app/main/dto/cliente.dto';
import { BackupConfig } from 'src/app/main/model/backup-config.model';
import { Conexao } from 'src/app/main/model/conexao.model';
import { Contato } from 'src/app/main/model/contato.model';
import { Sistema } from 'src/app/main/model/sistema.model';
import { ClienteService } from 'src/app/main/service/cliente.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { MessageDialogComponent } from 'src/app/shared/message-dialog/message-dialog.component';

import { BackupConfigFormDialogComponent } from '../backup-config-form-dialog/backup-config-form-dialog.component';
import { ConexaoFormDialogComponent } from '../conexao-form-dialog/conexao-form-dialog.component';
import { ContatoFormDialogComponent } from '../contato-form-dialog/contato-form-dialog.component';
import { SistemaFormDialogComponent } from '../sistema-form-dialog/sistema-form-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {

  clienteForm: FormGroup;
  loading: boolean = false;
  cliente: ClienteDto;
  headerButtonClickSubscription: Subscription = new Subscription();
  versaoGsan: string = '';

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: ClienteService,
    private logger: LoggerService,
    private matDialog: MatDialog
  ) { 
    this.cliente = new ClienteDto();
    this.clienteForm = this.formBuilder.group({
      id: [null],
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      email: ['', Validators.required],
      febraban: ['', Validators.required],
      telefone: ['', Validators.required],
      tecnicoresponsavel: ['', Validators.required],
      backupconfigs: [[]],
      conexoes: [[]],
      contatos: [[]],
      sistemas: [[]],
      idsBackupConfigsExcluir: [[]],
      idsConexoesExcluir: [[]],
      idsContatosExcluir: [[]],
      idsSistemasExcluir: [[]],
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
        this.cliente = await firstValueFrom(this.service.getById(id));
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
      this.cliente = this.clienteForm.getRawValue();
      if (await this.isNew()) {
        this.service.create(this.cliente).subscribe({
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
        this.service.update(this.cliente).subscribe({
          next: async res => {
            this.logger.success(res?.message);
            this.loadHeader();
            this.cliente = await firstValueFrom(this.service.getById(Number(this.cliente.id)));
            this.loadForm();
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
    this.clienteForm.valueChanges.subscribe(() => {
      this.headerService.headerData.disableButton = this.clienteForm.invalid;
    });
  }

  loadForm() {
    this.clienteForm.controls['id'].setValue(this.cliente.id);
    this.clienteForm.controls['codigo'].setValue(this.cliente.codigo);
    this.clienteForm.controls['nome'].setValue(this.cliente.nome);
    this.clienteForm.controls['email'].setValue(this.cliente.email);
    this.clienteForm.controls['febraban'].setValue(this.cliente.febraban);
    this.clienteForm.controls['telefone'].setValue(this.cliente.telefone);
    this.clienteForm.controls['tecnicoresponsavel'].setValue(this.cliente.tecnicoresponsavel);
    this.clienteForm.controls['backupconfigs'].setValue(this.cliente.backupconfigs);
    this.clienteForm.controls['conexoes'].setValue(this.cliente.conexoes);
    this.clienteForm.controls['contatos'].setValue(this.cliente.contatos);
    this.clienteForm.controls['sistemas'].setValue(this.cliente.sistemas);
    this.clienteForm.controls['idsBackupConfigsExcluir'].setValue(this.cliente.idsBackupConfigsExcluir);
    this.clienteForm.controls['idsConexoesExcluir'].setValue(this.cliente.idsConexoesExcluir);
    this.clienteForm.controls['idsContatosExcluir'].setValue(this.cliente.idsContatosExcluir);
    this.clienteForm.controls['idsSistemasExcluir'].setValue(this.cliente.idsSistemasExcluir);
  }

  async isNew() {
    const url = await firstValueFrom(this.route.url);
    return url[0].path === 'new';
  }

  async loadHeader() {
    let title = '';
    let disableButton = false;
    if (await this.isNew()) {
      title = 'Novo Cliente';
      disableButton = true;
    } else {
      title = `${this.cliente.id} - ${this.cliente.nome}`;
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

  buscarVersao() {
    this.service.buscarVersaoGsan(Number(this.cliente.id)).subscribe({
      next: res => {
        this.versaoGsan = res?.versaoGsan;
      },
      error: error => {
        this.logger.error(error?.error?.message);
      }
    })
  }

  openBackupConfigDialog(action: 'add' | 'edit', backupConfig?: BackupConfig) {
    return this.matDialog.open(BackupConfigFormDialogComponent, {
      data: {
        backupConfig: action === 'edit' ? backupConfig : null
      }
    });
  }

  drop(event: CdkDragDrop<Sistema[]>) {
    if (this.cliente.sistemas) {
      moveItemInArray(this.cliente.sistemas, event.previousIndex, event.currentIndex);
      this.cliente.sistemas.forEach((sistema, index) => {
        sistema.ordem = index + 1;
      });
    }
  }

  addBackupConfig() {
    const dialogRef = this.openBackupConfigDialog('add');
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (!this.cliente.backupconfigs) {
          this.cliente.backupconfigs = new Array<BackupConfig>();
        }
        this.cliente.backupconfigs?.push(res);
        this.clienteForm.controls['backupconfigs'].setValue(this.cliente.backupconfigs);
      }
    });
  }

  editBackupConfig(backupConfig: BackupConfig) {
    const dialogRef = this.openBackupConfigDialog('edit', backupConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res && this.cliente.backupconfigs) {
        const index = this.cliente.backupconfigs?.findIndex((backup) => backup == backupConfig);
        this.cliente.backupconfigs[index] = res;
        this.clienteForm.controls['backupconfigs'].setValue(this.cliente.backupconfigs);  
      }
    });
  }

  deleteBackupConfig(backupConfig: BackupConfig) {
    const dialogRef = this.matDialog.open(MessageDialogComponent, {
      data: {
        title: 'Confirmação de Exclusão',
        message: 'Você tem certeza que deseja excluir esta Configuração de Backup?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const index = this.cliente.backupconfigs?.findIndex((backup) => backup == backupConfig);
        this.cliente.backupconfigs?.splice(Number(index), 1);
        this.clienteForm.controls['backupconfigs'].setValue(this.cliente.backupconfigs);
        if (backupConfig.id) {
          if (!this.cliente.idsBackupConfigsExcluir) {
            this.cliente.idsBackupConfigsExcluir = new Array<number>();
          }
          this.cliente.idsBackupConfigsExcluir.push(backupConfig.id);
          this.clienteForm.controls['idsBackupConfigsExcluir'].setValue(this.cliente.idsBackupConfigsExcluir);
        }
      }
    });
  }

  openConexaoDialog(action: 'add' | 'edit', conexao?: Conexao) {
    return this.matDialog.open(ConexaoFormDialogComponent, {
      data: {
        conexao: action === 'edit' ? conexao : null
      },
      width: '500px'
    });
  }

  addConexao() {
    const dialogRef = this.openConexaoDialog('add');
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (!this.cliente.conexoes) {
          this.cliente.conexoes = new Array<Conexao>();
        }
        this.cliente.conexoes?.push(res);
        this.clienteForm.controls['conexoes'].setValue(this.cliente.conexoes);
      }
    });
  }

  editConexao(conexao: Conexao) {
    const dialogRef = this.openConexaoDialog('edit', conexao);
    dialogRef.afterClosed().subscribe(res => {
      if (res && this.cliente.conexoes) {
        const index = this.cliente.conexoes?.findIndex((con) => con == conexao);
        this.cliente.conexoes[index] = res;
        this.clienteForm.controls['conexoes'].setValue(this.cliente.conexoes);  
      }
    });
  }

  deleteConexao(conexao: Conexao) {
    const dialogRef = this.matDialog.open(MessageDialogComponent, {
      data: {
        title: 'Confirmação de Exclusão',
        message: 'Você tem certeza que deseja excluir esta Conexão?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const index = this.cliente.conexoes?.findIndex((con) => con == conexao);
        this.cliente.conexoes?.splice(Number(index), 1);
        this.clienteForm.controls['conexoes'].setValue(this.cliente.conexoes);
        if (conexao.id) {
          if (!this.cliente.idsConexoesExcluir) {
            this.cliente.idsConexoesExcluir = new Array<number>();
          }
          this.cliente.idsConexoesExcluir.push(conexao.id);
          this.clienteForm.controls['idsConexoesExcluir'].setValue(this.cliente.idsConexoesExcluir);
        }
      }
    });
  }

  openContatoDialog(action: 'add' | 'edit', contato?: Contato) {
    return this.matDialog.open(ContatoFormDialogComponent, {
      data: {
        contato: action === 'edit' ? contato : null
      },
      width: '500px'
    });
  }

  addContato() {
    const dialogRef = this.openContatoDialog('add');
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (!this.cliente.contatos) {
          this.cliente.contatos = new Array<Contato>();
        }
        this.cliente.contatos?.push(res);
        this.clienteForm.controls['contatos'].setValue(this.cliente.contatos);
      }
    });
  }

  editContato(contato: Contato) {
    const dialogRef = this.openContatoDialog('edit', contato);
    dialogRef.afterClosed().subscribe(res => {
      if (res && this.cliente.contatos) {
        const index = this.cliente.contatos?.findIndex((con) => con == contato);
        this.cliente.contatos[index] = res;
        this.clienteForm.controls['contatos'].setValue(this.cliente.contatos);  
      }
    });
  }

  deleteContato(contato: Contato) {
    const dialogRef = this.matDialog.open(MessageDialogComponent, {
      data: {
        title: 'Confirmação de Exclusão',
        message: 'Você tem certeza que deseja excluir este Contato?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const index = this.cliente.contatos?.findIndex((con) => con == contato);
        this.cliente.contatos?.splice(Number(index), 1);
        this.clienteForm.controls['contatos'].setValue(this.cliente.contatos);
        if (contato.id) {
          if (!this.cliente.idsContatosExcluir) {
            this.cliente.idsContatosExcluir = new Array<number>();
          }
          this.cliente.idsContatosExcluir.push(contato.id);
          this.clienteForm.controls['idsContatosExcluir'].setValue(this.cliente.idsContatosExcluir);
        }
      }
    });
  }

  openSistemaDialog(action: 'add' | 'edit', sistema?: Sistema) {
    return this.matDialog.open(SistemaFormDialogComponent, {
      data: {
        sistema: action === 'edit' ? sistema : null
      },
      width: '500px'
    });
  }
  
  addSistema() {
    const dialogRef = this.openSistemaDialog('add');
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (!this.cliente.sistemas) {
          this.cliente.sistemas = new Array<Sistema>();
        }
        this.cliente.sistemas?.push(res);
        this.clienteForm.controls['sistemas'].setValue(this.cliente.sistemas);
      }
    });
  }
  
  editSistema(sistema: Sistema) {
    const dialogRef = this.openSistemaDialog('edit', sistema);
    dialogRef.afterClosed().subscribe(res => {
      if (res && this.cliente.sistemas) {
        const index = this.cliente.sistemas?.findIndex((sis) => sis == sistema);
        this.cliente.sistemas[index] = res;
        this.clienteForm.controls['sistemas'].setValue(this.cliente.sistemas);  
      }
    });
  }
  
  deleteSistema(sistema: Sistema) {
    const dialogRef = this.matDialog.open(MessageDialogComponent, {
      data: {
        title: 'Confirmação de Exclusão',
        message: 'Você tem certeza que deseja excluir este Sistema?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const index = this.cliente.sistemas?.findIndex((sis) => sis == sistema);
        this.cliente.sistemas?.splice(Number(index), 1);
        this.clienteForm.controls['sistemas'].setValue(this.cliente.sistemas);
        if (sistema.id) {
          if (!this.cliente.idsSistemasExcluir) {
            this.cliente.idsSistemasExcluir = new Array<number>();
          }
          this.cliente.idsSistemasExcluir.push(sistema.id);
          this.clienteForm.controls['idsSistemasExcluir'].setValue(this.cliente.idsSistemasExcluir);
        }
      }
    });
  }
}
