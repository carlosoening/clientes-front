import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { BackupConfigDetailsModule } from '../../components/backup-config-details/backup-config-details.module';
import { ConexaoDetailsModule } from '../../components/conexao-details/conexao-details.module';
import { ContatoDetailsModule } from '../../components/contato-details/contato-details.module';
import { SistemaDetailsModule } from '../../components/sistema-details/sistema-details.module';
import { ClienteService } from '../../service/cliente.service';
import { BackupConfigFormDialogComponent } from './backup-config-form-dialog/backup-config-form-dialog.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ConexaoFormDialogComponent } from './conexao-form-dialog/conexao-form-dialog.component';
import { ContatoFormDialogComponent } from './contato-form-dialog/contato-form-dialog.component';
import { SistemaFormDialogComponent } from './sistema-form-dialog/sistema-form-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesListComponent
  },
  {
    path: 'new',
    component: ClienteFormComponent
  },
  {
    path: ':id',
    component: ClienteFormComponent
  },
];

@NgModule({
  declarations: [
    ClientesListComponent,
    ClienteFormComponent,
    BackupConfigFormDialogComponent,
    ConexaoFormDialogComponent,
    ContatoFormDialogComponent,
    SistemaFormDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    BackupConfigDetailsModule,
    ConexaoDetailsModule,
    ContatoDetailsModule,
    SistemaDetailsModule,
    DragDropModule,
    MatSortModule,
  ],
  providers: [
    ClienteService,
  ]
})
export class ClientesModule { }
