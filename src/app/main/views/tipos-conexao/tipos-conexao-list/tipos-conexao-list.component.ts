import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { TipoConexao } from 'src/app/main/model/tipo-conexao.model';
import { TipoConexaoService } from 'src/app/main/service/tipo-conexao.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { MessageDialogService } from 'src/app/shared/message-dialog/message-dialog.service';

@Component({
  selector: 'app-tipos-conexao-list',
  templateUrl: './tipos-conexao-list.component.html',
  styleUrls: ['./tipos-conexao-list.component.scss']
})
export class TiposConexaoListComponent implements OnInit {

  tiposConexao$: Observable<TipoConexao[]>;
  
  displayedColumns = ['id', 'codigo', 'nome', 'acoes'];

  headerButtonClickSubscription: Subscription = new Subscription();
  headerOnSearchChangesSubscription: Subscription = new Subscription();

  constructor(
    public service: TipoConexaoService,
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private messageDialogService: MessageDialogService,
  ) {
    this.headerService.headerData = {
      title: 'Tipos de Conexão',
      buttonType: ButtonType.ADD,
      icon: 'add',
      route: this.route,
      searchInput: true,
    };

    this.tiposConexao$ = this.service.getAll();
  }

  ngOnInit(): void {
    this.headerButtonClickSubscription = this.headerService.buttonClicked
      .subscribe(() => this.router.navigate(['new'], { relativeTo: this.route }));
    
    this.headerOnSearchChangesSubscription = this.headerService.onSearchChanges.subscribe((res: any) => {
      this.tiposConexao$ = this.service.pesquisar(res);
    });
  }

  ngOnDestroy() {
    this.headerButtonClickSubscription.unsubscribe();
    this.headerOnSearchChangesSubscription.unsubscribe();
  }

  goToItem(item: TipoConexao) {
    this.router.navigate([`${item.id}`], { relativeTo: this.route });
  }
  
  deleteItem(item: TipoConexao) {
    const dialogRef = this.messageDialogService.openDialog({ 
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este Tipo de Conexão?'
    });
    dialogRef.afterClosed().subscribe({
      next: res => {
        if (res) {
          this.service.delete(Number(item.id)).subscribe({
            next: res => {
              this.tiposConexao$ = this.service.getAll();
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
