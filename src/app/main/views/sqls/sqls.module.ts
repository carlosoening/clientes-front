import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModule } from 'src/app/shared/app-material/app-material.module';

import { SqlService } from '../../service/sql.service';
import { SqlFormComponent } from './sql-form/sql-form.component';
import { SqlsListComponent } from './sqls-list/sqls-list.component';

const routes: Routes = [
  {
    path: '',
    component: SqlsListComponent
  },
  {
    path: 'new',
    component: SqlFormComponent
  },
  {
    path: ':id',
    component: SqlFormComponent
  },
];

@NgModule({
  declarations: [
    SqlsListComponent,
    SqlFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    AppMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSortModule,
  ],
  providers: [
    SqlService,
  ]
})
export class SqlsModule { }
