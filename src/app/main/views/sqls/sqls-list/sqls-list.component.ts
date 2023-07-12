import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { Sql } from 'src/app/main/model/sql.model';
import { SqlService } from 'src/app/main/service/sql.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { MessageDialogService } from 'src/app/shared/message-dialog/message-dialog.service';

@Component({
  selector: 'app-sqls-list',
  templateUrl: './sqls-list.component.html',
  styleUrls: ['./sqls-list.component.scss']
})
export class SqlsListComponent implements OnInit {

  sqlsDataSource: MatTableDataSource<Sql> = new MatTableDataSource();
  
  displayedColumns = ['id', 'codigo', 'descricao', 'acoes'];

  headerButtonClickSubscription: Subscription = new Subscription();
  headerOnSearchChangesSubscription: Subscription = new Subscription();
  loading: boolean = false;

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.sqlsDataSource.sort = sort;
  }

  constructor(
    public service: SqlService,
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private messageDialogService: MessageDialogService,
  ) {
    this.headerService.headerData = {
      title: 'SQLs',
      buttonType: ButtonType.ADD,
      icon: 'add',
      route: this.route,
      searchInput: true
    };
  }

  ngOnInit(): void {
    this.sqlsDataSource.sort = this.sort;
    this.loading = true;
    this.service.getAll().subscribe({
      next: res => {
        this.sqlsDataSource = new MatTableDataSource(res);
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
          this.sqlsDataSource = new MatTableDataSource(res);
        },
        error: error => {
          this.logger.error(error.error?.message);
        },
        complete: () => {
          this.loading = false;
        }
      });
    });
  }

  ngOnDestroy() {
    this.headerButtonClickSubscription.unsubscribe();
    this.headerOnSearchChangesSubscription.unsubscribe();
  }

  goToItem(item: Sql) {
    this.router.navigate([`${item.id}`], { relativeTo: this.route });
  }
  
  deleteItem(item: Sql) {
    const dialogRef = this.messageDialogService.openDialog({ 
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este SQL?'
    });
    dialogRef.afterClosed().subscribe({
      next: res => {
        if (res) {
          this.service.delete(Number(item.id)).subscribe({
            next: res => {
              this.loading = true;
              this.service.getAll().subscribe({
                next: res => {
                  this.sqlsDataSource = new MatTableDataSource(res);
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
}
