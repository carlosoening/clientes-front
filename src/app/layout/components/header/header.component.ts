import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserToken } from 'src/app/@api/model/userToken.model';
import { AuthService } from 'src/app/@api/service/auth.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { ButtonType } from 'src/app/enums/button-type.enum';

import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();

  isDarkTheme: boolean = false;

  protected buttonTypeEnum = ButtonType;

  usuarioLogado: UserToken | null;

  @HostListener('document:keydown.control.enter')
  handleControlEnter() {
    if (!this.disableButton) {
      this.onButtonClick();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleNavigationKeys(event: any) {
    if (event?.target?.nodeName === 'INPUT'
      || event?.target?.nodeName === 'TEXTAREA') {
      return;
    }
    switch (event.key) {
      case '1':
        event.preventDefault();
        this.router.navigate(['clientes']);
        break;
      case '2':
        event.preventDefault();
        this.router.navigate(['usuarios']);
        break;
      case '3':
        event.preventDefault();
        this.router.navigate(['sqls']);
        break;
      case '4':
        event.preventDefault();
        this.router.navigate(['tipos-conexao']);
        break;
      case '5':
        event.preventDefault();
        this.router.navigate(['tipos-servidor']);
        break;
      case '6':
        event.preventDefault();
        this.router.navigate(['relatorio-backups']);
        break;
      case 'Backspace':
        event.preventDefault();
        this.previousRoute();
        break;
      default:
        return;
    }
  }

  constructor(
    public authService: AuthService,
    private router: Router,
    private headerService: HeaderService,
    private themeService: ThemeService,
  ) {
    this.usuarioLogado = this.authService.getCurrentToken();
    this.isDarkTheme = this.themeService.getDarkTheme();
  }

  ngOnInit(): void {
    this.authService.onLogin.subscribe(res => {
      this.usuarioLogado = res;
      this.isDarkTheme = this.themeService.getDarkTheme();
    });
  }

  get title() {
    return this.headerService.headerData.title;
  }

  get icon() {
    return this.headerService.headerData.icon;
  }

  get arrowBack() {
    return this.headerService.headerData.arrowBack;
  }

  get buttonType() {
    return this.headerService.headerData.buttonType;
  }

  get route() {
    return this.headerService.headerData.route;
  }

  get disableButton() {
    return this.headerService.headerData.disableButton;
  }

  get searchInput() {
    return this.headerService.headerData.searchInput;
  }

  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }
  
  fazerLogout() {
    this.authService.doLogout().subscribe(() => {});
  }

  goHome() {
    this.router.navigateByUrl('/home');
  }

  onSearchChange(event: any) {
    this.headerService.onSearchChanges.next(event.target.value);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onButtonClick() {
    this.headerService.buttonClicked.next(true);
  }

  previousRoute() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
