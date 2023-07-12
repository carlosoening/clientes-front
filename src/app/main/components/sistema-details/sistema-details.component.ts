import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TipoSistemaEnum } from 'src/app/enums/tipo-sistema.enum';

import { Sistema } from '../../model/sistema.model';

@Component({
  selector: 'app-sistema-details',
  templateUrl: './sistema-details.component.html',
  styleUrls: ['./sistema-details.component.scss']
})
export class SistemaDetailsComponent implements OnInit {

  @Input() sistema: Sistema | null = null;
  @Input() readonly: boolean = false;
  @Input() onGetData = new Subject<void>();
  @Output() getData = new EventEmitter<Sistema>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() isValid = new EventEmitter<boolean>();

  sistemaForm: FormGroup;

  tipoSistemaEnum = TipoSistemaEnum;

  constructor(
    private formBuilder: FormBuilder,
    ) {
    this.sistemaForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      url: [''],
      tipo: [TipoSistemaEnum.OUTRO]
    });
   }

  async ngOnInit(): Promise<void> {
    this.onGetData.subscribe(() => {
      const sistema: Sistema = this.sistemaForm.getRawValue();
      this.getData.emit(sistema);
    });

    this.sistemaForm.valueChanges.subscribe(() => {
      this.isValid.emit(this.sistemaForm.valid);
    });

    if (this.sistema) {
      this.sistemaForm.controls['id'].setValue(this.sistema.id);
      this.sistemaForm.controls['nome'].setValue(this.sistema.nome);
      this.sistemaForm.controls['url'].setValue(this.sistema.url);
      this.sistemaForm.controls['tipo'].setValue(
        this.readonly 
        ? this.getDescricaoTipoSistema(String(this.sistema.tipo)) 
        : this.sistema.tipo
      )
    }
  }

  edit() {
    this.onEdit.emit();
  }

  delete() {
    this.onDelete.emit();
  }

  getDescricaoTipoSistema(tipo: string) {
    switch (tipo) {
      case TipoSistemaEnum.GSAN_INTERNO:
        return 'GSAN Interno';
      case TipoSistemaEnum.GSAN_EXTERNO:
        return 'GSAN Externo';
      case TipoSistemaEnum.GESTOR_INTERNO:
        return 'Gestor Interno';
      case TipoSistemaEnum.GESTOR_EXTERNO:
        return 'Gestor Externo';
      default:
        return 'Outro';
    }
  }

  abrirUrlSistema() {
    window.open(this.sistemaForm.controls['url'].value, '_blank');
  }
}
