import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SinovadWebComponent } from './sinovad-web.component';
import { RouterModule, Routes } from '@angular/router';
import { AccountPage } from '../account/account.page';
import { GenreListPage } from '../genres/genre-list/genre-list.page';
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
import { HomePage } from '../home/home.page';
import { SearchViewRootPage } from '../search-view-root/search-view-root.page';
import { ServerSettingsGeneralPage } from '../server-settings-general/server-settings-general.page';
import { WebContainerPageModule } from '../web-container/web-container.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { SharedModule } from '../shared/shared.module';
import { UserListPage } from '../users/user-list/user-list.page';
import { RoleListPage } from '../roles/role-list/role-list.page';
import { MenuListPage } from '../menus/menu-list/menu-list.page';
import { MediaMoviesPage } from '../media-movies/media-movies.page';
import { MediaTvSeriesPage } from '../media-tvseries/media-tvseries.page';
import { MovieListPage } from '../movies/movie-list/movie-list.page';
import { TvSerieListPage } from '../tvseries/tvserie-list/tvserie-list.page';

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
        path: 'media/movies',
        component: MediaMoviesPage,
        loadChildren: () => import('../media-movies/media-movies.module').then(m => m.MediaMoviesPageModule)
      },
      {
        path: 'media/tvseries',
        component: MediaTvSeriesPage,
        loadChildren: () => import('../media-tvseries/media-tvseries.module').then(m => m.MediaTvSeriesPageModule)
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
        path: 'manage/movies',
        component: MovieListPage,
        loadChildren: () => import('../movies/movies.module').then(m => m.MoviesModule)
      },
      {
        path: 'manage/tvseries',
        component: TvSerieListPage,
        loadChildren: () => import('../tvseries/tvseries.module').then(m => m.TvSeriesModule)
      },
      {
        path: 'manage/genres',
        component: GenreListPage,
        loadChildren: () => import('../genres/genres.module').then(m => m.GenresModule)
      },
      {
        path: 'manage/menus',
        component: MenuListPage,
        loadChildren: () => import('../menus/menus.module').then(m => m.MenusModule)
      },
      {
        path: 'manage/users',
        component: UserListPage,
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'manage/roles',
        component: RoleListPage,
        loadChildren: () => import('../roles/roles.module').then(m => m.RolesPageModule)
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
      },
      {path: '**', redirectTo: '/404'}
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
        WebContainerPageModule,
        SplashScreenPageModule,
        RouterModule.forChild(routes)
    ],
    exports: [SinovadWebComponent]
})
export class SinovadWebComponentModule {
}
