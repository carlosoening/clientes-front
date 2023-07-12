import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { AlterarSenhaComponent } from './alterar-senha.component';

const routes: Routes = [
  {
    path: '',
    component: AlterarSenhaComponent
  }
];

@NgModule({
  declarations: [
    AlterarSenhaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    
    AppMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ]
})
export class AlterarSenhaModule { }
