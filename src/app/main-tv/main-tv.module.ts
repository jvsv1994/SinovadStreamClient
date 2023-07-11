import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { ItemViewPage } from '../item-view/item-view.page';
import { HorizontalItemListPage } from '../horizontal-item-list/horizontal-item-list.page';
import { VideoPageModule } from '../video/video.module';
import { SideBarTvPageModule } from '../sidebar-tv/siderbar-tv.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { SearchViewTvPage } from '../search-view-tv/search-view-tv.page';
import { MainTvPage } from './main-tv.page';

const routes: Routes = [
  {
    path: 'hilp',
    component: HorizontalItemListPage,
    outlet:"rohtp",
    loadChildren: () => import('../horizontal-item-list/horizontal-item-list.module').then(m => m.HorizontalItemListPageModule)
  },
  {
    path: 'svtp',
    component: SearchViewTvPage,
    outlet:"rohtp",
    loadChildren: () => import('../search-view-tv/search-view-tv.module').then(m => m.SearchViewTvPageModule)
  },
  {
    path: 'ivp',
    component: ItemViewPage,
    outlet:"rohtp",
    loadChildren: () => import('../item-view/item-view.module').then(m => m.ItemViewPageModule)
  }
];

@NgModule({
    declarations: [
      MainTvPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      ReactiveFormsModule,
      SharedModule,
      SideBarTvPageModule,
      SplashScreenPageModule,
      RouterModule.forChild(routes)
    ],
    exports: [MainTvPage]
})
export class MainTvPageModule {
}
