import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MenuFormPage } from './menu-form/menu-form.page';
import { MenuListPage } from './menu-list/menu-list.page';

@NgModule({
    declarations: [
      MenuListPage,MenuFormPage
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MenuListPage,MenuFormPage]
})
export class MenusModule {
}
