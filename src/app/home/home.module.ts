import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HorizontalItemListPageModule } from '../horizontal-item-list/horizontal-item-list.module';
import { HomePage } from './home.page';


@NgModule({
    declarations: [
      HomePage
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      HorizontalItemListPageModule
    ],
    exports: [HomePage]
})
export class HomePageModule {
}
