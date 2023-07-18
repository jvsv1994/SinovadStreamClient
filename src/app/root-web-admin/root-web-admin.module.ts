import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { VideoPageModule } from '../video/video.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { HeaderWebAdminPageModule } from '../header-web-admin/header-web-admin.module';
import { SideBarWebAdminPageModule } from '../sidebar-web-admin/siderbar-web-admin.module';
import { SearchViewWebAdminPage } from '../search-view-web-admin/search-view-web-admin.page';
import { RootWebAdminPage } from './root-web-admin.page';
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
import { ManageMediaPage } from '../manage-media/manage-media.page';
import { MenuListPage } from '../menu-list/menu-list.page';
import { UserListPage } from '../user-list/user-list.page';
import { RoleListPage } from '../role-list/role-list.page';
import { GenreListPage } from '../genre-list/genre-list.page';
import { MovieListPage } from '../movie-list/movie-list.page';
import { TvSerieListPage } from '../tvserie-list/tvserie-list.page';
import { AccountPage } from '../account/account.page';

const routes: Routes = [
  {
    path: 'web-admin/home',
    component: HomePage,
    loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'web-admin/movies',
    component: MoviesPage,
    loadChildren: () => import('../movies/movies.module').then(m => m.MoviesPageModule)
  },
  {
    path: 'web-admin/tvseries',
    component: TvSeriesPage,
    loadChildren: () => import('../tvseries/tvseries.module').then(m => m.TvSeriesPageModule)
  },
  {
    path: 'web-admin/search',
    component: SearchViewWebAdminPage,
    loadChildren: () => import('../search-view-web-admin/search-view-web-admin.module').then(m => m.SearchViewWebAdminPageModule)
  },
  {
    path: 'web-admin/select-profile',
    component: ProfilesViewPage,
    loadChildren: () => import('../profiles-view/profiles-view.module').then(m => m.ProfilesViewPageModule)
  },
  {
    path: 'web-admin/moviedetail/:movieId',
    component: MovieDetailPage,
    loadChildren: () => import('../movie-detail/movie-detail.module').then(m => m.MovieDetailPageModule)
  },
  {
    path: 'web-admin/tvseriedetail/:tvSerieId',
    component: TvSerieDetailPage,
    loadChildren: () => import('../tvserie-detail/tvserie-detail.module').then(m => m.TvSerieDetailPageModule)
  },
  {
    path: 'web-admin/landing',
    component:LandingPage,
    loadChildren: () => import('../landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'web-admin/register',
    component:RegisterUserPage,
    loadChildren: () => import('../register-user/register-user.module').then(m => m.RegisterAcccountPageModule)
  },
  {
    path: 'web-admin/login',
    component:LoginPage,
    loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'web-admin/recover',
    component:RecoverPasswordPage,
    loadChildren: () => import('../recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule)
  },
  {
    path: 'web-admin/reset/:base64Data',
    component:ResetPasswordPage,
    loadChildren: () => import('../reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
   path: 'web-admin/confirm/:base64Data',
   component:ConfirmEmailPage,
   loadChildren: () => import('../confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule)
  },
  {path: 'web-admin/404',
   component: NotFoundPage,
   loadChildren: () => import('../not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'web-admin/storages',
    component: ManageMediaPage,
    loadChildren: () => import('../manage-media/manage-media.module').then(m => m.ManageMediaPageModule)
  },
  {
    path: 'web-admin/transcoder',
    component: TranscoderSettingssPage,
    loadChildren: () => import('../transcode-settings/transcode-settings.module').then(m => m.TranscoderSettingssPageModule)
  },
  {
    path: 'web-admin/movie-list',
    component: MovieListPage,
    loadChildren: () => import('../movie-list/movie-list.module').then(m => m.MovieListPageModule)
  },
  {
    path: 'web-admin/tvserie-list',
    component: TvSerieListPage,
    loadChildren: () => import('../tvserie-list/tvserie-list.module').then(m => m.TvSerieListPageModule)
  },
  {
    path: 'web-admin/genre-list',
    component: GenreListPage,
    loadChildren: () => import('../genre-list/genre-list.module').then(m => m.GenreListPageModule)
  },
  {
    path: 'web-admin/menu-list',
    component: MenuListPage,
    loadChildren: () => import('../menu-list/menu-list.module').then(m => m.MenuListPageModule)
  },
  {
    path: 'web-admin/user-list',
    component: UserListPage,
    loadChildren: () => import('../user-list/user-list.module').then(m => m.UserListPageModule)
  },
  {
    path: 'web-admin/role-list',
    component: RoleListPage,
    loadChildren: () => import('../role-list/role-list.module').then(m => m.RoleListPageModule)
  },
  {
    path: 'web-admin/account',
    component: AccountPage,
    loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'web-admin',
    pathMatch: 'full',
    redirectTo: 'web-admin/home' // TODO change to home page eventually
  }
];

@NgModule({
    declarations: [
      RootWebAdminPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      HeaderWebAdminPageModule,
      SideBarWebAdminPageModule,
      ReactiveFormsModule,
      SharedModule,
      SplashScreenPageModule,
      RouterModule.forChild(routes)
    ],
    exports: [RootWebAdminPage]
})
export class RootWebAdminPageModule {
}
