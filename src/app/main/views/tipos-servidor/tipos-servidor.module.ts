import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { TipoServidorService } from '../../service/tipo-servidor.service';
import { TipoServidorFormComponent } from './tipo-servidor-form/tipo-servidor-form.component';
import { TiposServidorListComponent } from './tipos-servidor-list/tipos-servidor-list.component';

const routes: Routes = [
  {
    path: '',
    component: TiposServidorListComponent
  },
  {
    path: 'new',
    component: TipoServidorFormComponent
  },
  {
    path: ':id',
    component: TipoServidorFormComponent
  },
];

@NgModule({
  declarations: [
    TiposServidorListComponent,
    TipoServidorFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    AppMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [
    TipoServidorService,
  ]
})
export class TiposServidorModule { }
