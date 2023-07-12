import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { Usuario } from 'src/app/main/model/usuario.model';
import { UsuarioService } from 'src/app/main/service/usuario.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { MessageDialogService } from 'src/app/shared/message-dialog/message-dialog.service';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {

  usuariosDataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  
  displayedColumnsInitial = ['id', 'codigo', 'nome', 'tipo', 'ativo', 'acoes'];
  displayedColumnsMobile = ['id', 'codigo', 'nome', 'tipo', 'acoes'];
  displayedColumns = this.displayedColumnsInitial;

  headerButtonClickSubscription: Subscription = new Subscription();
  headerOnSearchChangesSubscription: Subscription = new Subscription();
  loading: boolean = false;

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.usuariosDataSource.sort = sort;
  }

  constructor(
    public service: UsuarioService,
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private messageDialogService: MessageDialogService,
  ) {
    this.headerService.headerData = {
      title: 'Usuários',
      buttonType: ButtonType.ADD,
      icon: 'add',
      route: this.route,
      searchInput: true,
    };
  }

  ngOnInit(): void {
    this.usuariosDataSource.sort = this.sort;
    this.loading = true;
    this.service.getAll().subscribe({
      next: res => {
        this.usuariosDataSource = new MatTableDataSource(res);
      },
      error: error => {
        this.logger.error(error.error?.message);
      },
      complete: () => {
        this.loading = false;
      }
    });
    this.headerButtonClickSubscription = this.headerService.buttonClicked
      .subscribe(() => this.router.navigate(['new'], { relativeTo: this.route }));

    this.headerOnSearchChangesSubscription = this.headerService.onSearchChanges.subscribe((res: any) => {
      this.service.pesquisar(res).subscribe({
        next: res => {
          this.usuariosDataSource = new MatTableDataSource(res);
        },
        error: error => {
          this.logger.error(error.error?.message);
        },
        complete: () => {
          this.loading = false;
        }
      });
    });

    if (window.screen.width <= 600) {
      this.displayedColumns = this.displayedColumnsMobile;
    }
  }

  ngOnDestroy() {
    this.headerButtonClickSubscription.unsubscribe();
    this.headerOnSearchChangesSubscription.unsubscribe();
  }

  retornaDescricaoTipoUsuario(tipo: string) {
    switch(tipo) {
      case 'admin':
        return 'Administrador';
      case 'user':
        return 'Usuário';
      default:
        return 'Usuário';
    }  
  }

  goToItem(item: Usuario) {
    this.router.navigate([`${item.id}`], { relativeTo: this.route });
  }
  
  deleteItem(item: Usuario) {
    const dialogRef = this.messageDialogService.openDialog({ 
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este usuário?'
    });
    dialogRef.afterClosed().subscribe({
      next: res => {
        if (res) {
          this.service.delete(Number(item.id)).subscribe({
            next: res => {
              this.loading = true;
              this.service.getAll().subscribe({
                next: res => {
                  this.usuariosDataSource = new MatTableDataSource(res);
                },
                error: error => {
                  this.logger.error(error.error?.message);
                },
                complete: () => {
                  this.loading = false;
                }
              });
              this.logger.success(res.message);
            },
            error: error => {
              this.logger.error(error.error?.message);
            }
          });
        }
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(event.target.innerWidth <= 600) {
      this.displayedColumns = this.displayedColumnsMobile;
    } else if(event.target.innerWidth > 600) {
      this.displayedColumns = this.displayedColumnsInitial;
    }
  }
}
