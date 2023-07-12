import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Contato } from 'src/app/main/model/contato.model';

@Component({
  selector: 'app-contato-form-dialog',
  templateUrl: './contato-form-dialog.component.html',
  styleUrls: ['./contato-form-dialog.component.scss']
})
export class ContatoFormDialogComponent implements OnInit {

  isNew: boolean = false;
  title: string = 'Novo Contato';
  onGetData = new Subject<void>();
  contato: Contato | null = null;
  permiteSalvar: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ContatoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.contato = this.data.contato;
    if (this.contato) {
      this.title = 'Editar Contato'
    }
  }

  salvar() {
    this.onGetData.next();
  }

  getData(contato: Contato) {
    this.dialogRef.close(contato);
  }

  isValid(value: boolean) {
    this.permiteSalvar = value;
  }
}
