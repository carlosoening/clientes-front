import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(
    private matSnackBar: MatSnackBar
  ) { }

  private showSnackBar(msg: string, action?: string) {
    this.matSnackBar.open(msg, action || 'OK', { duration: 3000 });
  }

  public success(msg: string, action?: string) {
    this.showSnackBar(msg, action);
  }

  public error(msg: string, action?: string) {
    this.showSnackBar(msg, action);
  }

  public info(msg: string, action?: string) {
    this.showSnackBar(msg, action);
  }

}
