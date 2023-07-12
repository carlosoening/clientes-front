import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { Conexao } from 'src/app/main/model/conexao.model';

@Component({
  selector: 'app-conexao-form-dialog',
  templateUrl: './conexao-form-dialog.component.html',
  styleUrls: ['./conexao-form-dialog.component.scss']
})
export class ConexaoFormDialogComponent implements OnInit {

  isNew: boolean = false;
  title: string = 'Nova Conexão';
  onGetData = new Subject<void>();
  conexao: Conexao | null = null;
  permiteSalvar: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConexaoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.conexao = this.data.conexao;
    if (this.conexao) {
      this.title = 'Editar Conexão'
    }
  }

  salvar() {
    this.onGetData.next();
  }

  getData(conexao: Conexao) {
    this.dialogRef.close(conexao);
  }

  isValid(value: boolean) {
    this.permiteSalvar = value;
  }
}
