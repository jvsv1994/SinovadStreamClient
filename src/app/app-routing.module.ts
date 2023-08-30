import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { AlertsComponent } from './modules/alerts/components/alerts/alerts.component';
import { MediaItemsComponent } from './modules/media/items/media-items.component';
import { loggedUserGuard } from './guards/logged-user.guard';
import { MediaDetailComponent } from './modules/media/detail/media-detail.component';
import { VideoPage } from './modules/media/video/component/video.page';
import { SearchViewPage } from './modules/media/search/search-view/search-view.page';
import { ProfilesViewPage } from './modules/profiles/profiles-view/profiles-view.page';
import { ProfileNewPage } from './modules/profiles/profile-new/profile-new.page';
import { ProfileEditPage } from './modules/profiles/profile-edit/profile-edit.page';
import { ServerSettingsGeneralPage } from './modules/server-settings-general/server-settings-general.page';
import { LibraryListComponent } from './modules/libraries/library-list/library-list.component';
import { TranscoderSettingssPage } from './modules/transcode-settings/transcode-settings.page';
import { MyAccountPage } from './modules/account-settings/my-account/my-account.page';
import { MovieListPage } from './modules/movies/movie-list/movie-list.page';
import { adminGuard } from './guards/admin.guard';
import { TvSerieListPage } from './modules/tvseries/tvserie-list/tvserie-list.page';
import { GenreListPage } from './modules/genres/genre-list/genre-list.page';
import { MenuListPage } from './modules/menus/menu-list/menu-list.page';
import { UserListPage } from './modules/users/user-list/user-list.page';
import { RoleListPage } from './modules/roles/role-list/role-list.page';
import { LandingPage } from './modules/landing/landing.page';
import { unloggedUserGuard } from './guards/unlogged-user.guard ';
import { RegisterUserPage } from './modules/register-user/register-user.page';
import { LoginPage } from './modules/login/login.page';
import { RecoverPasswordPage } from './modules/recover-password/recover-password.page';
import { ResetPasswordPage } from './modules/reset-password/reset-password.page';
import { ConfirmEmailPage } from './modules/confirm-email/confirm-email.page';
import { NotFoundPage } from './modules/not-found/not-found.page';

const routes: Routes = [
  {
    path: 'home',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/movies',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/tvseries',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/libraries/:libraryId',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/libraries/:libraryId/detail',
    component: MediaDetailComponent,
    loadChildren: () => import('./modules/media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/video/:mediaFileId',
    component: VideoPage,
    loadChildren: () => import('./modules/media/video/video.module').then(m => m.VideoPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'search',
    component: SearchViewPage,
    loadChildren: () => import('./modules/media/search/search.module').then(m => m.SearchModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'select-profile',
    component: ProfilesViewPage,
    loadChildren: () => import('./modules/profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'add-profile',
    component: ProfileNewPage,
    loadChildren: () => import('./modules/profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'edit-profile/:profileGuid',
    component: ProfileEditPage,
    loadChildren: () => import('./modules/profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/settings/general',
    component: ServerSettingsGeneralPage,
    loadChildren: () => import('./modules/server-settings-general/server-settings-general.module').then(m => m.ServerSettingsGeneralPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/status/alerts',
    component: AlertsComponent,
    loadChildren: () => import('./modules/alerts/alerts.module').then(m => m.AlertsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/manage/libraries',
    component: LibraryListComponent,
    loadChildren: () => import('./modules/libraries/libraries.module').then(m => m.LibrariesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/settings/transcoder',
    component: TranscoderSettingssPage,
    loadChildren: () => import('./modules/transcode-settings/transcode-settings.module').then(m => m.TranscoderSettingssPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/account',
    component: MyAccountPage,
    loadChildren: () => import('./modules/account-settings/account-settings.module').then(m => m.AccountSettingsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'manage/movies',
    component: MovieListPage,
    loadChildren: () => import('./modules/movies/movies.module').then(m => m.MoviesModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/tvseries',
    component: TvSerieListPage,
    loadChildren: () => import('./modules/tvseries/tvseries.module').then(m => m.TvSeriesModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/genres',
    component: GenreListPage,
    loadChildren: () => import('./modules/genres/genres.module').then(m => m.GenresModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/menus',
    component: MenuListPage,
    loadChildren: () => import('./modules/menus/menus.module').then(m => m.MenusModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/users',
    component: UserListPage,
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/roles',
    component: RoleListPage,
    loadChildren: () => import('./modules/roles/roles.module').then(m => m.RolesPageModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'landing',
    component:LandingPage,
    loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'register',
    component:RegisterUserPage,
    loadChildren: () => import('./modules/register-user/register-user.module').then(m => m.RegisterAcccountPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'login',
    component:LoginPage,
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'recover',
    component:RecoverPasswordPage,
    loadChildren: () => import('./modules/recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'reset/:base64Data',
    component:ResetPasswordPage,
    loadChildren: () => import('./modules/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
   path: 'confirm/:base64Data',
   component:ConfirmEmailPage,
   loadChildren: () => import('./modules/confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule),
   canActivate:[unloggedUserGuard]
  },
  {path: '404',
   component: NotFoundPage,
   loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home' // TODO change to home page eventually
  },
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
