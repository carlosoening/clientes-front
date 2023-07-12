import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './@api/service/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  mostrarMenu: boolean = false;

  isDarkTheme: boolean;
  
  constructor(
    public authService: AuthService,
    public router: Router,
    private themeService: ThemeService
  ) {
    this.isDarkTheme = this.themeService.getDarkTheme();
  }

  ngOnInit() {
    this.themeService.isDarkTheme.subscribe(res => {
      this.isDarkTheme = res;
    });
  }

  fazerLogout() {
    this.authService.doLogout().subscribe(() => {});
  }

  goHome() {
    this.router.navigateByUrl('/home');
  }

}
