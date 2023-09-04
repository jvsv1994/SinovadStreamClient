import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from 'src/app/modules/shared/directives/click-outside-directive';
import { FormatDataPipe } from './pipes/format-data.pipe';
import { CustomConfirmDialogComponent } from './components/custom-confirm-dialog/custom-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { CustomContextMenuComponent } from './components/custom-context-menu/custom-context-menu.component';
import { CustomDialogOptionsComponent } from './components/custom-dialog-options/custom-dialog-options.component';
import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { DirectoryChooserPage } from './components/directory-chooser/directory-chooser.page';
import { CustomMenuComponent } from './components/custom-menu/custom-menu.component';
import { ServerConnectionErrorPage } from './components/server-connection-error/server-connection-error.page';
import { AngularMaterialModule } from '../material/angular-material.module';
import { CustomSpinnerComponent } from './components/custom-spinner/custom-spinner.component';
@NgModule({
  imports: [
    CommonModule,AngularMaterialModule
  ],
  declarations: [
    FormatDataPipe,ClickOutsideDirective,CustomMenuComponent,CustomConfirmDialogComponent,
    CustomSpinnerComponent,CustomContextMenuComponent,CustomDialogOptionsComponent,CustomPaginationComponent,
    DirectoryChooserPage,ServerConnectionErrorPage
  ],
  providers: [
  ],
  exports: [
    FormatDataPipe,ClickOutsideDirective,CustomMenuComponent,CustomConfirmDialogComponent,
    CustomSpinnerComponent,CustomContextMenuComponent,CommonModule,AngularMaterialModule,CustomDialogOptionsComponent,
    CustomPaginationComponent,DirectoryChooserPage,ServerConnectionErrorPage
  ]
})
export class SharedModule { }
