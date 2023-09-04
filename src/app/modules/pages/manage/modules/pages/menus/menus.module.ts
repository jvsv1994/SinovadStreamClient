import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuFormComponent } from './components/menu-form/menu-form.component';

@NgModule({
    declarations: [
      MenuListComponent,MenuFormComponent
    ],
    providers:[],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      SharedModule
    ],
    exports: [MenuListComponent,MenuFormComponent]
})
export class MenusModule {
}
