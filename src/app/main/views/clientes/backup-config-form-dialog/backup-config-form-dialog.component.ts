import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { BackupConfig } from 'src/app/main/model/backup-config.model';

@Component({
  selector: 'app-backup-config-form-dialog',
  templateUrl: './backup-config-form-dialog.component.html',
  styleUrls: ['./backup-config-form-dialog.component.scss']
})
export class BackupConfigFormDialogComponent implements OnInit {

  isNew: boolean = false;
  title: string = 'Nova Configuração de Backup';
  onGetData = new Subject<void>();
  backupConfig: BackupConfig | null = null;
  permiteSalvar: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<BackupConfigFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.backupConfig = this.data.backupConfig;
    if (this.backupConfig) {
      this.title = `${this.backupConfig.id} - ${this.backupConfig.descricao}`
    }
  }

  salvar() {
    this.onGetData.next();
  }

  getData(backupConfig: BackupConfig) {
    this.dialogRef.close(backupConfig);
  }

  isValid(value: boolean) {
    this.permiteSalvar = value;
  }
}
