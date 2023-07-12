import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageDialogComponent } from './message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MessageDialogService {

  constructor(
    private matDialog: MatDialog,
  ) { }

  openDialog(data: any) {
    return this.matDialog.open(MessageDialogComponent, {
      data
    });
  }
}
