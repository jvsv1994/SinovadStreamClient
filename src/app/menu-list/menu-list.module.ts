import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { MenuListPage } from './menu-list.page';
import { MenuFormPageModule } from '../menu-form/menu-form.module';

@NgModule({
    declarations: [
      MenuListPage
    ],
    providers:[],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      PaginationPageModule,
      MenuFormPageModule
    ],
    exports: [MenuListPage]
})
export class MenuListPageModule {
}
