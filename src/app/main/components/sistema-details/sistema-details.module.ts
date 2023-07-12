import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { SistemaDetailsComponent } from './sistema-details.component';



@NgModule({
  declarations: [
    SistemaDetailsComponent
  ],
  exports: [
    SistemaDetailsComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class SistemaDetailsModule { }
