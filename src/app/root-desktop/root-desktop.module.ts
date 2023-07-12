import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { VideoPageModule } from '../video/video.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { HeaderDesktopPageModule } from '../header-desktop/header-desktop.module';
import { SideBarDesktopPageModule } from '../sidebar-desktop/siderbar-desktop.module';
import { SearchViewDesktopPage } from '../search-view-desktop/search-view-desktop.page';
import { RootDesktopPage } from './root-desktop.page';
import { NotFoundPage } from '../not-found/not-found.page';
import { ConfirmEmailPage } from '../confirm-email/confirm-email.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { RecoverPasswordPage } from '../recover-password/recover-password.page';
import { LoginPage } from '../login/login.page';
import { RegisterUserPage } from '../register-user/register-user.page';
import { TvSerieDetailPage } from '../tvserie-detail/tvserie-detail.page';
import { LandingPage } from '../landing/landing.page';
import { MovieDetailPage } from '../movie-detail/movie-detail.page';
import { ProfilesViewPage } from '../profiles-view/profiles-view.page';
import { TvSeriesPage } from '../tvseries/tvseries.page';
import { MoviesPage } from '../movies/movies.page';
import { HomePage } from '../home/home.page';
import { TranscoderSettingssPage } from '../transcode-settings/transcode-settings.page';
import { ItemListPage } from '../item-list/item-list.page';
import { ManageMediaPage } from '../manage-media/manage-media.page';

const routes: Routes = [
  {
    path: 'desktop/home',
    component: HomePage,
    loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'desktop/movies',
    component: MoviesPage,
    loadChildren: () => import('../movies/movies.module').then(m => m.MoviesPageModule)
  },
  {
    path: 'desktop/tvseries',
    component: TvSeriesPage,
    loadChildren: () => import('../tvseries/tvseries.module').then(m => m.TvSeriesPageModule)
  },
  {
    path: 'desktop/search',
    component: SearchViewDesktopPage,
    loadChildren: () => import('../search-view-desktop/search-view-desktop.module').then(m => m.SearchViewDesktopPageModule)
  },
  {
    path: 'desktop/select-profile',
    component: ProfilesViewPage,
    loadChildren: () => import('../profiles-view/profiles-view.module').then(m => m.ProfilesViewPageModule)
  },
  {
    path: 'desktop/moviedetail/:movieId',
    component: MovieDetailPage,
    loadChildren: () => import('../movie-detail/movie-detail.module').then(m => m.MovieDetailPageModule)
  },
  {
    path: 'desktop/tvseriedetail/:tvSerieId',
    component: TvSerieDetailPage,
    loadChildren: () => import('../tvserie-detail/tvserie-detail.module').then(m => m.TvSerieDetailPageModule)
  },
  {
    path: 'desktop/landing',
    component:LandingPage,
    loadChildren: () => import('../landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'desktop/register',
    component:RegisterUserPage,
    loadChildren: () => import('../register-user/register-user.module').then(m => m.RegisterAcccountPageModule)
  },
  {
    path: 'desktop/login',
    component:LoginPage,
    loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'desktop/recover',
    component:RecoverPasswordPage,
    loadChildren: () => import('../recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule)
  },
  {
    path: 'desktop/reset/:base64Data',
    component:ResetPasswordPage,
    loadChildren: () => import('../reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
   path: 'desktop/confirm/:base64Data',
   component:ConfirmEmailPage,
   loadChildren: () => import('../confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule)
  },
  {path: 'desktop/404',
   component: NotFoundPage,
   loadChildren: () => import('../not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'desktop/storage',
    component: ManageMediaPage,
    loadChildren: () => import('../manage-media/manage-media.module').then(m => m.ManageMediaPageModule)
  },
  {
    path: 'desktop/transcoding',
    component: TranscoderSettingssPage,
    loadChildren: () => import('../transcode-settings/transcode-settings.module').then(m => m.TranscoderSettingssPageModule)
  },
  {
    path: 'desktop/management-items',
    component: ItemListPage,
    loadChildren: () => import('../item-list/item-list.module').then(m => m.ItemListPageModule)
  },
  {
    path: 'desktop',
    pathMatch: 'full',
    redirectTo: 'desktop/home' // TODO change to home page eventually
  }
];

@NgModule({
    declarations: [
      RootDesktopPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      HeaderDesktopPageModule,
      SideBarDesktopPageModule,
      ReactiveFormsModule,
      SharedModule,
      SplashScreenPageModule,
      RouterModule.forChild(routes)
    ],
    exports: [RootDesktopPage]
})
export class RootDesktopPageModule {
}
