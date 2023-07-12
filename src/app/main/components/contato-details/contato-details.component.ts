import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { Contato } from '../../model/contato.model';

@Component({
  selector: 'app-contato-details',
  templateUrl: './contato-details.component.html',
  styleUrls: ['./contato-details.component.scss']
})
export class ContatoDetailsComponent implements OnInit {

  @Input() contato: Contato | null = null;
  @Input() readonly: boolean = false;
  @Input() onGetData = new Subject<void>();
  @Output() getData = new EventEmitter<Contato>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() isValid = new EventEmitter<boolean>();

  contatoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    ) {
    this.contatoForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      email: [''],
      telefone: [''],
    });
   }

  async ngOnInit(): Promise<void> {
    this.onGetData.subscribe(() => {
      const contato: Contato = this.contatoForm.getRawValue();
      this.getData.emit(contato);
    });

    this.contatoForm.valueChanges.subscribe(() => {
      this.isValid.emit(this.contatoForm.valid);
    });

    if (this.contato) {
      this.contatoForm.controls['id'].setValue(this.contato.id);
      this.contatoForm.controls['nome'].setValue(this.contato.nome);
      this.contatoForm.controls['email'].setValue(this.contato.email);
      this.contatoForm.controls['telefone'].setValue(this.contato.telefone);
    }
  }

  edit() {
    this.onEdit.emit();
  }

  delete() {
    this.onDelete.emit();
  }
}
