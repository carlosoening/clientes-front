import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Sistema } from 'src/app/main/model/sistema.model';

@Component({
  selector: 'app-sistema-form-dialog',
  templateUrl: './sistema-form-dialog.component.html',
  styleUrls: ['./sistema-form-dialog.component.scss']
})
export class SistemaFormDialogComponent implements OnInit {

  isNew: boolean = false;
  title: string = 'Novo Sistema';
  onGetData = new Subject<void>();
  sistema: Sistema | null = null;
  permiteSalvar: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SistemaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.sistema = this.data.sistema;
    if (this.sistema) {
      this.title = 'Editar Sistema'
    }
  }

  salvar() {
    this.onGetData.next();
  }

  getData(sistema: Sistema) {
    this.dialogRef.close(sistema);
  }

  isValid(value: boolean) {
    this.permiteSalvar = value;
  }
}
