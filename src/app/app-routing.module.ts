import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { loggedUserGuard } from './guards/logged-user.guard';
import { adminGuard } from './guards/admin.guard';
import { unloggedUserGuard } from './guards/unlogged-user.guard ';
import { VideoPage } from './modules/pages/media/video/component/video.page';
import { ProfilesViewPage } from './modules/pages/profiles/profiles-view/profiles-view.page';
import { ProfileNewPage } from './modules/pages/profiles/profile-new/profile-new.page';
import { ProfileEditPage } from './modules/pages/profiles/profile-edit/profile-edit.page';
import { ServerSettingsGeneralPage } from './modules/pages/server-settings-general/server-settings-general.page';
import { AlertsComponent } from './modules/pages/alerts/components/alerts/alerts.component';
import { LibraryListComponent } from './modules/pages/libraries/library-list/library-list.component';
import { TranscoderSettingssPage } from './modules/pages/transcode-settings/transcode-settings.page';
import { MyAccountPage } from './modules/pages/account-settings/my-account/my-account.page';
import { MovieListPage } from './modules/pages/movies/movie-list/movie-list.page';
import { GenreListPage } from './modules/pages/genres/genre-list/genre-list.page';
import { MenuListPage } from './modules/pages/menus/menu-list/menu-list.page';
import { UserListPage } from './modules/pages/users/user-list/user-list.page';
import { RoleListPage } from './modules/pages/roles/role-list/role-list.page';
import { LandingPage } from './modules/pages/landing/landing.page';
import { RegisterUserPage } from './modules/pages/register-user/register-user.page';
import { LoginPage } from './modules/pages/login/login.page';
import { RecoverPasswordPage } from './modules/pages/recover-password/recover-password.page';
import { ResetPasswordPage } from './modules/pages/reset-password/reset-password.page';
import { ConfirmEmailPage } from './modules/pages/confirm-email/confirm-email.page';
import { NotFoundPage } from './modules/pages/not-found/not-found.page';
import { TvSerieListPage } from './modules/pages/tvseries/tvserie-list/tvserie-list.page';
import { MediaItemsComponent } from './modules/pages/media-items/components/media-items.component';
import { MediaDetailComponent } from './modules/pages/media-detail/components/media-detail.component';
import { SearchViewPage } from './modules/pages/media-search/components/search-view/search-view.page';


const routes: Routes = [
  {
    path: 'home',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/pages/media-items/media-items.module').then(m => m.MediaItemsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/movies',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/pages/media-items/media-items.module').then(m => m.MediaItemsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/tvseries',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/pages/media-items/media-items.module').then(m => m.MediaItemsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/pages/media-items/media-items.module').then(m => m.MediaItemsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/libraries/:libraryId',
    component: MediaItemsComponent,
    loadChildren: () => import('./modules/pages/media-items/media-items.module').then(m => m.MediaItemsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/libraries/:libraryId/detail',
    component: MediaDetailComponent,
    loadChildren: () => import('./modules/pages/media-detail/media-detail.module').then(m => m.MediaDetailModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/video/:mediaFileId',
    component: VideoPage,
    loadChildren: () => import('./modules/pages/media/video/video.module').then(m => m.VideoPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'search',
    component: SearchViewPage,
    loadChildren: () => import('./modules/pages/media-search/media-search.module').then(m => m.MediaSearchModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'select-profile',
    component: ProfilesViewPage,
    loadChildren: () => import('./modules/pages/profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'add-profile',
    component: ProfileNewPage,
    loadChildren: () => import('./modules/pages/profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'edit-profile/:profileGuid',
    component: ProfileEditPage,
    loadChildren: () => import('./modules/pages/profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/settings/general',
    component: ServerSettingsGeneralPage,
    loadChildren: () => import('./modules/pages/server-settings-general/server-settings-general.module').then(m => m.ServerSettingsGeneralPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/status/alerts',
    component: AlertsComponent,
    loadChildren: () => import('./modules/pages/alerts/alerts.module').then(m => m.AlertsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/manage/libraries',
    component: LibraryListComponent,
    loadChildren: () => import('./modules/pages/libraries/libraries.module').then(m => m.LibrariesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/settings/transcoder',
    component: TranscoderSettingssPage,
    loadChildren: () => import('./modules/pages/transcode-settings/transcode-settings.module').then(m => m.TranscoderSettingssPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/account',
    component: MyAccountPage,
    loadChildren: () => import('./modules/pages/account-settings/account-settings.module').then(m => m.AccountSettingsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'manage/movies',
    component: MovieListPage,
    loadChildren: () => import('./modules/pages/movies/movies.module').then(m => m.MoviesModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/tvseries',
    component: TvSerieListPage,
    loadChildren: () => import('./modules/pages/tvseries/tvseries.module').then(m => m.TvSeriesModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/genres',
    component: GenreListPage,
    loadChildren: () => import('./modules/pages/genres/genres.module').then(m => m.GenresModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/menus',
    component: MenuListPage,
    loadChildren: () => import('./modules/pages/menus/menus.module').then(m => m.MenusModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/users',
    component: UserListPage,
    loadChildren: () => import('./modules/pages/users/users.module').then(m => m.UsersModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/roles',
    component: RoleListPage,
    loadChildren: () => import('./modules/pages/roles/roles.module').then(m => m.RolesPageModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'landing',
    component:LandingPage,
    loadChildren: () => import('./modules/pages/landing/landing.module').then(m => m.LandingPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'register',
    component:RegisterUserPage,
    loadChildren: () => import('./modules/pages/register-user/register-user.module').then(m => m.RegisterAcccountPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'login',
    component:LoginPage,
    loadChildren: () => import('./modules/pages/login/login.module').then(m => m.LoginPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'recover',
    component:RecoverPasswordPage,
    loadChildren: () => import('./modules/pages/recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'reset/:base64Data',
    component:ResetPasswordPage,
    loadChildren: () => import('./modules/pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
   path: 'confirm/:base64Data',
   component:ConfirmEmailPage,
   loadChildren: () => import('./modules/pages/confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule),
   canActivate:[unloggedUserGuard]
  },
  {path: '404',
   component: NotFoundPage,
   loadChildren: () => import('./modules/pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
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
