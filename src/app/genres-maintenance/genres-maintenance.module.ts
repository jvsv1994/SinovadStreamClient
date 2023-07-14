import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { GenresMaintenancePage } from './genres-maintenance.page';
import { PaginationPageModule } from '../pagination/pagination.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';


@NgModule({
    declarations: [
      GenresMaintenancePage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      PaginationPageModule,
      ContextMenuPageModule
    ],
    exports: [GenresMaintenancePage]
})
export class GenresMaintenancePageModule {
}
