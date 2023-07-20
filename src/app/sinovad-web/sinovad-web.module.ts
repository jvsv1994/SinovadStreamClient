import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { SinovadWebComponent } from './sinovad-web.component';
import { RootWebPageModule } from '../root-web/root-web.module';
import { RootWebAdminPageModule } from '../root-web-admin/root-web-admin.module';
import { RouterModule, Routes } from '@angular/router';
import { AccountPage } from '../account/account.page';
import { RoleListPage } from '../role-list/role-list.page';
import { UserListPage } from '../user-list/user-list.page';
import { MenuListPage } from '../menu-list/menu-list.page';
import { GenreListPage } from '../genre-list/genre-list.page';
import { TvSerieListPage } from '../tvserie-list/tvserie-list.page';
import { MovieListPage } from '../movie-list/movie-list.page';
import { TranscoderSettingssPage } from '../transcode-settings/transcode-settings.page';
import { ManageMediaPage } from '../manage-media/manage-media.page';
import { NotFoundPage } from '../not-found/not-found.page';
import { ConfirmEmailPage } from '../confirm-email/confirm-email.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { RecoverPasswordPage } from '../recover-password/recover-password.page';
import { LoginPage } from '../login/login.page';
import { RegisterUserPage } from '../register-user/register-user.page';
import { LandingPage } from '../landing/landing.page';
import { TvSerieDetailPage } from '../tvserie-detail/tvserie-detail.page';
import { MovieDetailPage } from '../movie-detail/movie-detail.page';
import { ProfilesViewPage } from '../profiles-view/profiles-view.page';
import { TvSeriesPage } from '../tvseries/tvseries.page';
import { MoviesPage } from '../movies/movies.page';
import { HomePage } from '../home/home.page';
import { SearchViewRootPage } from '../search-view-root/search-view-root.page';
import { ServerSettingsGeneralPage } from '../server-settings-general/server-settings-general.page';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: 'home',
        component: HomePage,
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'movies',
        component: MoviesPage,
        loadChildren: () => import('../movies/movies.module').then(m => m.MoviesPageModule)
      },
      {
        path: 'tvseries',
        component: TvSeriesPage,
        loadChildren: () => import('../tvseries/tvseries.module').then(m => m.TvSeriesPageModule)
      },
      {
        path: 'search',
        component: SearchViewRootPage,
        loadChildren: () => import('../search-view-root/search-view-root.module').then(m => m.SearchViewRootPageModule)
      },
      {
        path: 'select-profile',
        component: ProfilesViewPage,
        loadChildren: () => import('../profiles-view/profiles-view.module').then(m => m.ProfilesViewPageModule)
      },
      {
        path: 'moviedetail/:movieId',
        component: MovieDetailPage,
        loadChildren: () => import('../movie-detail/movie-detail.module').then(m => m.MovieDetailPageModule)
      },
      {
        path: 'tvseriedetail/:tvSerieId',
        component: TvSerieDetailPage,
        loadChildren: () => import('../tvserie-detail/tvserie-detail.module').then(m => m.TvSerieDetailPageModule)
      },
      {
        path: 'landing',
        component:LandingPage,
        loadChildren: () => import('../landing/landing.module').then(m => m.LandingPageModule)
      },
      {
        path: 'register',
        component:RegisterUserPage,
        loadChildren: () => import('../register-user/register-user.module').then(m => m.RegisterAcccountPageModule)
      },
      {
        path: 'login',
        component:LoginPage,
        loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'recover',
        component:RecoverPasswordPage,
        loadChildren: () => import('../recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule)
      },
      {
        path: 'reset/:base64Data',
        component:ResetPasswordPage,
        loadChildren: () => import('../reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
      },
      {
       path: 'confirm/:base64Data',
       component:ConfirmEmailPage,
       loadChildren: () => import('../confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule)
      },
      {path: '404',
       component: NotFoundPage,
       loadChildren: () => import('../not-found/not-found.module').then(m => m.NotFoundPageModule)
      },
      {
        path: 'settings/server/:serverGuid/settings/general',
        component: ServerSettingsGeneralPage,
        loadChildren: () => import('../server-settings-general/server-settings-general.module').then(m => m.ServerSettingsGeneralPageModule)
      },
      {
        path: 'settings/server/:serverGuid/manage/libraries',
        component: ManageMediaPage,
        loadChildren: () => import('../manage-media/manage-media.module').then(m => m.ManageMediaPageModule)
      },
      {
        path: 'settings/server/:serverGuid/settings/transcoder',
        component: TranscoderSettingssPage,
        loadChildren: () => import('../transcode-settings/transcode-settings.module').then(m => m.TranscoderSettingssPageModule)
      },
      {
        path: 'movie-list',
        component: MovieListPage,
        loadChildren: () => import('../movie-list/movie-list.module').then(m => m.MovieListPageModule)
      },
      {
        path: 'tvserie-list',
        component: TvSerieListPage,
        loadChildren: () => import('../tvserie-list/tvserie-list.module').then(m => m.TvSerieListPageModule)
      },
      {
        path: 'genre-list',
        component: GenreListPage,
        loadChildren: () => import('../genre-list/genre-list.module').then(m => m.GenreListPageModule)
      },
      {
        path: 'menu-list',
        component: MenuListPage,
        loadChildren: () => import('../menu-list/menu-list.module').then(m => m.MenuListPageModule)
      },
      {
        path: 'user-list',
        component: UserListPage,
        loadChildren: () => import('../user-list/user-list.module').then(m => m.UserListPageModule)
      },
      {
        path: 'role-list',
        component: RoleListPage,
        loadChildren: () => import('../role-list/role-list.module').then(m => m.RoleListPageModule)
      },
      {
        path: 'settings/account',
        component: AccountPage,
        loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home' // TODO change to home page eventually
      },
      {
        path: 'web',
        pathMatch: 'full',
        redirectTo: 'home' // TODO change to home page eventually
      }
    ]
  }
];
@NgModule({
    declarations: [
      SinovadWebComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        RootWebPageModule,
        RootWebAdminPageModule,
        RouterModule.forChild(routes)
    ],
    exports: [SinovadWebComponent]
})
export class SinovadWebComponentModule {
}
