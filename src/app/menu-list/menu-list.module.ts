import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { PaginationPageModule } from '../pagination/pagination.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';
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
      ContextMenuPageModule,
      MenuFormPageModule
    ],
    exports: [MenuListPage]
})
export class MenuListPageModule {
}
