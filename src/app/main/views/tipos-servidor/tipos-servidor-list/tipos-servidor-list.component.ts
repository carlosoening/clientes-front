import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { TipoServidor } from 'src/app/main/model/tipo-servidor.model';
import { TipoServidorService } from 'src/app/main/service/tipo-servidor.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { MessageDialogService } from 'src/app/shared/message-dialog/message-dialog.service';

@Component({
  selector: 'app-tipos-servidor-list',
  templateUrl: './tipos-servidor-list.component.html',
  styleUrls: ['./tipos-servidor-list.component.scss']
})
export class TiposServidorListComponent implements OnInit {

  tiposServidor$: Observable<TipoServidor[]>;
  
  displayedColumns = ['id', 'codigo', 'nome', 'acoes'];

  headerButtonClickSubscription: Subscription = new Subscription();
  headerOnSearchChangesSubscription: Subscription = new Subscription();

  constructor(
    public service: TipoServidorService,
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private messageDialogService: MessageDialogService,
  ) {
    this.headerService.headerData = {
      title: 'Tipos de Servidor',
      buttonType: ButtonType.ADD,
      icon: 'add',
      route: this.route,
      searchInput: true,
    };

    this.tiposServidor$ = this.service.getAll();
  }

  ngOnInit(): void {
    this.headerButtonClickSubscription = this.headerService.buttonClicked
      .subscribe(() => this.router.navigate(['new'], { relativeTo: this.route }));

    this.headerOnSearchChangesSubscription = this.headerService.onSearchChanges.subscribe((res: any) => {
      this.tiposServidor$ = this.service.pesquisar(res);
    });
  }

  ngOnDestroy() {
    this.headerButtonClickSubscription.unsubscribe();
    this.headerOnSearchChangesSubscription.unsubscribe();
  }

  goToItem(item: TipoServidor) {
    this.router.navigate([`${item.id}`], { relativeTo: this.route });
  }
  
  deleteItem(item: TipoServidor) {
    const dialogRef = this.messageDialogService.openDialog({ 
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este Tipo de Servidor?'
    });
    dialogRef.afterClosed().subscribe({
      next: res => {
        if (res) {
          this.service.delete(Number(item.id)).subscribe({
            next: res => {
              this.tiposServidor$ = this.service.getAll();
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
}
