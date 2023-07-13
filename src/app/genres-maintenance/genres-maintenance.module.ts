import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { GenresMaintenancePage } from './genres-maintenance.page';
import { PaginationPageModule } from '../pagination/pagination.module';


@NgModule({
    declarations: [
      GenresMaintenancePage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      PaginationPageModule
    ],
    exports: [GenresMaintenancePage]
})
export class GenresMaintenancePageModule {
}
