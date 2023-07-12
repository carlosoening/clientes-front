import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _darkTheme = new Subject<boolean>();
  
  isDarkTheme = this._darkTheme.asObservable();
  
  constructor() {
  }
  
  setDarkTheme(isDarkTheme: boolean): void {
    localStorage.setItem('darkTheme', JSON.stringify(isDarkTheme))
    this._darkTheme.next(isDarkTheme);
  }

  getDarkTheme(): boolean {
    const darkTheme = localStorage.getItem('darkTheme');
    if (darkTheme) {
      return JSON.parse(darkTheme);
    }
    return false;
  }
  
}
