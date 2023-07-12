import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { RecuperarSenhaComponent } from './recuperar-senha.component';

const routes: Routes = [
  {
    path: '',
    component: RecuperarSenhaComponent,
  }
]

@NgModule({
  declarations: [
    RecuperarSenhaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    AppMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class RecuperarSenhaModule { }
