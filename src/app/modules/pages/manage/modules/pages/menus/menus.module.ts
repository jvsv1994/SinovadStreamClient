import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuListPage } from './components/menu-list/menu-list.page';
import { MenuFormPage } from './components/menu-form/menu-form.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

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
