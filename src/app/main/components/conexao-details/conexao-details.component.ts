import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, of, Subject } from 'rxjs';
import { LoggerService } from 'src/app/shared/loggers/logger.service';

import { Conexao } from '../../model/conexao.model';
import { TipoConexao } from '../../model/tipo-conexao.model';
import { TipoConexaoService } from '../../service/tipo-conexao.service';

@Component({
  selector: 'app-conexao-details',
  templateUrl: './conexao-details.component.html',
  styleUrls: ['./conexao-details.component.scss']
})
export class ConexaoDetailsComponent implements OnInit {

  @Input() conexao: Conexao | null = null;
  @Input() readonly: boolean = false;
  @Input() onGetData = new Subject<void>();
  @Output() getData = new EventEmitter<Conexao>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() isValid = new EventEmitter<boolean>();

  conexaoForm: FormGroup;
  tiposConexao: TipoConexao[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tipoConexaoService: TipoConexaoService,
    private logger: LoggerService,
    ) {
    this.conexaoForm = this.formBuilder.group({
      id: [null],
      tipoconexao_id: ['', !this.readonly ? Validators.required : null],
      ip: [''],
      usuario: [''],
      senha: [''],
    });
   }

  async ngOnInit(): Promise<void> {
    this.onGetData.subscribe(() => {
      const conexao: Conexao = this.conexaoForm.getRawValue();
      this.getData.emit(conexao);
    });

    this.conexaoForm.valueChanges.subscribe(() => {
      this.isValid.emit(this.conexaoForm.valid);
    });

    this.tiposConexao = await firstValueFrom(this.tipoConexaoService.getAll()
      .pipe(catchError(error => {
        this.logger.error(error?.error?.message);
        return of([]);
      })));

    if (this.conexao) {
      this.conexaoForm.controls['id'].setValue(this.conexao.id);
      this.conexaoForm.controls['tipoconexao_id'].setValue(
        this.readonly 
        ? this.getNomeTipoConexao(Number(this.conexao.tipoconexao_id)) 
        : this.conexao.tipoconexao_id);
      this.conexaoForm.controls['ip'].setValue(this.conexao.ip);
      this.conexaoForm.controls['usuario'].setValue(this.conexao.usuario);
      this.conexaoForm.controls['senha'].setValue(this.conexao.senha);
    }
  }

  edit() {
    this.onEdit.emit();
  }

  delete() {
    this.onDelete.emit();
  }

  getNomeTipoConexao(id: number) {
    const tipoConexao = this.tiposConexao.filter(t => {
      return t.id === id;
    });
    return tipoConexao[0].nome;
  }
}
