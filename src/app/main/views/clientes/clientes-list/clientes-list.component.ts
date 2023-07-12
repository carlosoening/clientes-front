import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { ClienteDto } from 'src/app/main/dto/cliente.dto';
import { Cliente } from 'src/app/main/model/cliente.model';
import { ClienteService } from 'src/app/main/service/cliente.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { MessageDialogService } from 'src/app/shared/message-dialog/message-dialog.service';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit {

  clientesDataSource: MatTableDataSource<ClienteDto> = new MatTableDataSource();
  
  displayedColumnsInitial = ['id', 'codigo', 'nome', 'febraban', 'acoes'];
  displayedColumnsMobile = ['id', 'codigo', 'nome', 'acoes'];
  displayedColumns = this.displayedColumnsInitial;
  loading: boolean = false;

  headerButtonClickSubscription: Subscription = new Subscription();
  headerOnSearchChangesSubscription: Subscription = new Subscription();

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.clientesDataSource.sort = sort;
  }

  constructor(
    public service: ClienteService,
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private messageDialogService: MessageDialogService,
  ) {
    this.headerService.headerData = {
      title: 'Clientes',
      buttonType: ButtonType.ADD,
      icon: 'add',
      route: this.route,
      searchInput: true,
    }; 
  }

  ngOnInit(): void {
    this.clientesDataSource.sort = this.sort;
    this.loading = true;
    this.service.getAll().subscribe({
      next: res => {
        this.clientesDataSource = new MatTableDataSource(res);
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
      this.loading = true;
      this.service.pesquisar(res).subscribe({
        next: res => {
          this.clientesDataSource = new MatTableDataSource(res);
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

  goToItem(item: Cliente) {
    this.router.navigate([`${item.id}`], { relativeTo: this.route });
  }
  
  deleteItem(item: Cliente) {
    const dialogRef = this.messageDialogService.openDialog({ 
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este cliente?'
    });
    dialogRef.afterClosed().subscribe({
      next: res => {
        if (res) {
          this.service.delete(Number(item.id)).subscribe({
            next: res => {
              this.loading = true;
              this.service.getAll().subscribe({
                next: res => {
                  this.clientesDataSource = new MatTableDataSource(res);
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
