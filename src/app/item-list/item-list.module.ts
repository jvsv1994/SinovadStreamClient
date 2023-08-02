import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemListPage } from './item-list.page';
import { SeasonListPageModule } from '../season-list/season-list.module';
import { SharedModule } from '../shared/shared.module';
import { PaginationPageModule} from '../pagination/pagination.module';
import { ItemFormPageModule } from '../item-form/item-form.module';
import { SeasonListModalPageModule } from '../season-list-modal/season-list-modal.module';
import { ConfirmMessageModalPageModule } from '../confirm-message-modal/confirm-message-modal.module';
import { ContextMenuPageModule } from '../context-menu/context-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SeasonListPageModule,
    PaginationPageModule,
    ItemFormPageModule,
    SeasonListModalPageModule,
    ConfirmMessageModalPageModule,
    ContextMenuPageModule
  ],
  declarations: [ItemListPage],
  exports: [ItemListPage]
})
export class ItemListPageModule {}
