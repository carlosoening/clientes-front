import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { UsuarioService } from '../../service/usuario.service';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosListComponent
  },
  {
    path: 'new',
    component: UsuarioFormComponent
  },
  {
    path: ':id',
    component: UsuarioFormComponent
  },
];

@NgModule({
  declarations: [
    UsuariosListComponent,
    UsuarioFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    AppMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSortModule,
  ],
  providers: [
    UsuarioService,
  ]
})
export class UsuariosModule { }
