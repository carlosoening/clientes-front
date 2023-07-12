import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, Observable, of, Subject } from 'rxjs';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { BackupConfig } from '../../model/backup-config.model';
import { TipoServidor } from '../../model/tipo-servidor.model';
import { TipoServidorService } from '../../service/tipo-servidor.service';

@Component({
  selector: 'app-backup-config-details',
  templateUrl: './backup-config-details.component.html',
  styleUrls: ['./backup-config-details.component.scss']
})
export class BackupConfigDetailsComponent implements OnInit {

  @Input() backupConfig: BackupConfig | null = null;
  @Input() readonly: boolean = false;
  @Input() onGetData = new Subject<void>();
  @Output() getData = new EventEmitter<BackupConfig>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() isValid = new EventEmitter<boolean>();

  backupForm: FormGroup;
  tiposServidor: TipoServidor[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tipoServidorService: TipoServidorService,
    private logger: LoggerService,
    ) {
    this.backupForm = this.formBuilder.group({
      id: [null],
      descricao: [''],
      usuariodb: ['', !this.readonly ? Validators.required : null],
      senhadb: ['', !this.readonly ? Validators.required : null],
      nomedb: ['', !this.readonly ? Validators.required : null],
      host: ['', !this.readonly ? Validators.required : null],
      port: [null, !this.readonly ? Validators.required : null],
      caminhobackup: [''],
      caminhojava: [''],
      caminhopgdump: [''],
      caminhosendhostjar: [''],
      horaexecucaobackup: [''],
      tiposervidor_id: [null, !this.readonly ? Validators.required : null],
      hostnamenuvem: [''],
      nomediretorionuvem: [''],
      qtdiasbackupnuvem: [null],
    });
   }

  async ngOnInit(): Promise<void> {
    this.onGetData.subscribe(() => {
      const backupConfig: BackupConfig = this.backupForm.getRawValue();
      this.getData.emit(backupConfig);
    });

    this.backupForm.valueChanges.subscribe(() => {
      this.isValid.emit(this.backupForm.valid);
    });

    this.tiposServidor = await firstValueFrom(this.tipoServidorService.getAll()
      .pipe(catchError(error => {
        this.logger.error(error?.error?.message);
        return of([]);
      })));

    if (this.backupConfig) {
      this.backupForm.controls['id'].setValue(this.backupConfig.id);
      this.backupForm.controls['descricao'].setValue(this.backupConfig.descricao);
      this.backupForm.controls['usuariodb'].setValue(this.backupConfig.usuariodb);
      this.backupForm.controls['senhadb'].setValue(this.backupConfig.senhadb);
      this.backupForm.controls['nomedb'].setValue(this.backupConfig.nomedb);
      this.backupForm.controls['host'].setValue(this.backupConfig.host);
      this.backupForm.controls['port'].setValue(this.backupConfig.port);
      this.backupForm.controls['caminhobackup'].setValue(this.backupConfig.caminhobackup);
      this.backupForm.controls['caminhojava'].setValue(this.backupConfig.caminhojava);
      this.backupForm.controls['caminhopgdump'].setValue(this.backupConfig.caminhopgdump);
      this.backupForm.controls['caminhosendhostjar'].setValue(this.backupConfig.caminhosendhostjar);
      this.backupForm.controls['horaexecucaobackup'].setValue(this.backupConfig.horaexecucaobackup);
      this.backupForm.controls['tiposervidor_id'].setValue(
        this.readonly 
        ? this.getNomeTipoServidor(Number(this.backupConfig.tiposervidor_id)) 
        : this.backupConfig.tiposervidor_id);
      this.backupForm.controls['hostnamenuvem'].setValue(this.backupConfig.hostnamenuvem);
      this.backupForm.controls['nomediretorionuvem'].setValue(this.backupConfig.nomediretorionuvem);
      this.backupForm.controls['qtdiasbackupnuvem'].setValue(this.backupConfig.qtdiasbackupnuvem);
    }
  }

  edit() {
    this.onEdit.emit();
  }

  delete() {
    this.onDelete.emit();
  }

  getNomeTipoServidor(id: number) {
    const tipoServidor = this.tiposServidor.filter(t => {
      return t.id === id;
    });
    return tipoServidor[0].nome;
  }
}
