import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from '../app-material/app-material.module';
import { MessageDialogComponent } from './message-dialog.component';



@NgModule({
  declarations: [
    MessageDialogComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
})
export class MessageDialogModule { }
