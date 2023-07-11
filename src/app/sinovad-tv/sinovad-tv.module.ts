import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SinovadTvComponent } from './sinovad-tv.component';
import { MainTvPage } from '../main-tv/main-tv.page';
import { BrowserModule } from '@angular/platform-browser';
import { LoginTvPage } from '../login-tv/login-tv.page';

const routes: Routes = [
 {
  path: 'maintv',
  component:MainTvPage,
  outlet:"rostp",
  loadChildren: () => import('../main-tv/main-tv.module').then(m => m.MainTvPageModule)
},
{
  path: 'logintv',
  outlet:"rostp",
  component:LoginTvPage,
  loadChildren: () => import('../login-tv/login-tv.module').then(m => m.LoginTvPageModule)
},
];


@NgModule({
    declarations: [
      SinovadTvComponent
    ],
    imports: [
      BrowserModule,
      CommonModule,
      FormsModule,
      SharedModule,
      ReactiveFormsModule,
      RouterModule.forRoot(routes)
    ],
    exports: [SinovadTvComponent]
})
export class SinovadTvComponentModule {
}
