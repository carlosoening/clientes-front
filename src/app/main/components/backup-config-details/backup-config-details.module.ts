import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { BackupConfigDetailsComponent } from './backup-config-details.component';



@NgModule({
  declarations: [
    BackupConfigDetailsComponent
  ],
  exports: [
    BackupConfigDetailsComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class BackupConfigDetailsModule { }
