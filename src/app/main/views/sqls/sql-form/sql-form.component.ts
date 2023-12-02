import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/enums/button-type.enum';
import { HeaderService } from 'src/app/layout/components/header/header.service';
import { Sql } from 'src/app/main/model/sql.model';
import { SqlService } from 'src/app/main/service/sql.service';
import { LoggerService } from 'src/app/shared/loggers/logger.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-sql-form',
  templateUrl: './sql-form.component.html',
  styleUrls: ['./sql-form.component.scss']
})
export class SqlFormComponent implements OnInit {

  sqlForm: UntypedFormGroup;
  loading: boolean = false;
  sql: Sql;
  headerButtonClickSubscription: Subscription = new Subscription();

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: SqlService,
    private logger: LoggerService,
    private clipboard: Clipboard,
  ) { 
    this.sql = new Sql();
    this.sqlForm = this.formBuilder.group({
      id: [null],
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      sql: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.headerService.headerData.disableButton = true;
    
    this.handleCreateOrUpdate();

    this.handleFormChanges();

    if (!await this.isNew()) {
      const params = await firstValueFrom(this.route.params);
      const id = params['id'];
      try {
        this.sql = await firstValueFrom(this.service.getById(id));
      } catch (error: any) {
        this.loading = false;
        this.headerService.headerData.disableButton = false;
        this.logger.error(error?.error?.message || error?.message);
        this.router.navigate(['..'], { relativeTo: this.route });
        return;
      }
      this.loadForm();
      this.headerService.headerData.disableButton = false;
    }
    await this.loadHeader();
    this.loading = false;
  }

  ngOnDestroy() {
    this.headerButtonClickSubscription.unsubscribe();
  }

  handleCreateOrUpdate() {
    this.headerButtonClickSubscription = this.headerService.buttonClicked.subscribe(async () => {
      this.headerService.headerData.disableButton = true;
      this.sql = this.sqlForm.getRawValue();
      if (await this.isNew()) {
        this.service.create(this.sql).subscribe({
          next: res => {
            this.logger.success(res?.message);
            this.router.navigate(['..', `${res.id}`], { relativeTo: this.route });
          },
          error: error => {
            this.logger.error(error?.error?.message);
          }, 
          complete: () => {
            this.headerService.headerData.disableButton = false;
          }
        });
      } else {
        this.service.update(this.sql).subscribe({
          next: res => {
            this.logger.success(res?.message);
            this.loadHeader();
          },
          error: error => {
            this.logger.error(error?.error?.message);
          },
          complete: () => {
            this.headerService.headerData.disableButton = false;
          }
        });
      }
    });
  }

  handleFormChanges() {
    this.sqlForm.valueChanges.subscribe(() => {
      this.headerService.headerData.disableButton = this.sqlForm.invalid;
    });
  }

  loadForm() {
    this.sqlForm.controls['id'].setValue(this.sql.id);
    this.sqlForm.controls['codigo'].setValue(this.sql.codigo);
    this.sqlForm.controls['descricao'].setValue(this.sql.descricao);
    this.sqlForm.controls['sql'].setValue(this.sql.sql);
  }

  async isNew() {
    const url = await firstValueFrom(this.route.url);
    return url[0].path === 'new';
  }

  async loadHeader() {
    let title = '';
    let disableButton = false;
    if (await this.isNew()) {
      title = 'Novo SQL';
      disableButton = true;
    } else {
      title = `${this.sql.id} - ${this.sql.descricao}`;
      disableButton = false;
    }
    this.headerService.headerData = {
      title,
      buttonType: ButtonType.SAVE,
      icon: 'save',
      arrowBack: true,
      route: this.route,
      disableButton
    };
  }

  copyToClipboard() {
    this.clipboard.copy(this.sqlForm.controls['sql'].value);
    this.logger.success('SQL copiado para a área de transferência!')
  }
}
