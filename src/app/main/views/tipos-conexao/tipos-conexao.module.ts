import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { TipoConexaoService } from '../../service/tipo-conexao.service';
import { TipoConexaoFormComponent } from './tipo-conexao-form/tipo-conexao-form.component';
import { TiposConexaoListComponent } from './tipos-conexao-list/tipos-conexao-list.component';

const routes: Routes = [
  {
    path: '',
    component: TiposConexaoListComponent
  },
  {
    path: 'new',
    component: TipoConexaoFormComponent
  },
  {
    path: ':id',
    component: TipoConexaoFormComponent
  },
];

@NgModule({
  declarations: [
    TiposConexaoListComponent,
    TipoConexaoFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    AppMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [
    TipoConexaoService,
  ]
})
export class TiposConexaoModule { }
