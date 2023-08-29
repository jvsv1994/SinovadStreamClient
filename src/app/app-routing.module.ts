import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { NotFoundPage } from './not-found/not-found.page';
import { ConfirmEmailPage } from './confirm-email/confirm-email.page';
import { unloggedUserGuard } from './shared/guards/unlogged-user.guard ';
import { ResetPasswordPage } from './reset-password/reset-password.page';
import { RecoverPasswordPage } from './recover-password/recover-password.page';
import { LoginPage } from './login/login.page';
import { RegisterUserPage } from './register-user/register-user.page';
import { LandingPage } from './landing/landing.page';
import { RoleListPage } from './roles/role-list/role-list.page';
import { loggedUserGuard } from './shared/guards/logged-user.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { UserListPage } from './users/user-list/user-list.page';
import { MediaItemsComponent } from './media/items/media-items.component';
import { MediaDetailComponent } from './media/detail/media-detail.component';
import { VideoPage } from './media/video/component/video.page';
import { SearchViewPage } from './media/search/search-view/search-view.page';
import { ProfilesViewPage } from './profiles/profiles-view/profiles-view.page';
import { ProfileNewPage } from './profiles/profile-new/profile-new.page';
import { ProfileEditPage } from './profiles/profile-edit/profile-edit.page';
import { ServerSettingsGeneralPage } from './server-settings-general/server-settings-general.page';
import { LibraryListComponent } from './libraries/library-list/library-list.component';
import { TranscoderSettingssPage } from './transcode-settings/transcode-settings.page';
import { MyAccountPage } from './account-settings/my-account/my-account.page';
import { MovieListPage } from './movies/movie-list/movie-list.page';
import { TvSerieListPage } from './tvseries/tvserie-list/tvserie-list.page';
import { GenreListPage } from './genres/genre-list/genre-list.page';
import { MenuListPage } from './menus/menu-list/menu-list.page';

const routes: Routes = [
  {
    path: 'home',
    component: MediaItemsComponent,
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/movies',
    component: MediaItemsComponent,
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/tvseries',
    component: MediaItemsComponent,
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid',
    component: MediaItemsComponent,
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/libraries/:libraryId',
    component: MediaItemsComponent,
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/libraries/:libraryId/detail',
    component: MediaDetailComponent,
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media/server/:serverGuid/video/:mediaFileId',
    component: VideoPage,
    loadChildren: () => import('./media/video/video.module').then(m => m.VideoPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'search',
    component: SearchViewPage,
    loadChildren: () => import('./media/search/search.module').then(m => m.SearchModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'select-profile',
    component: ProfilesViewPage,
    loadChildren: () => import('./profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'add-profile',
    component: ProfileNewPage,
    loadChildren: () => import('./profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'edit-profile/:profileGuid',
    component: ProfileEditPage,
    loadChildren: () => import('./profiles/profiles.module').then(m => m.ProfilesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/settings/general',
    component: ServerSettingsGeneralPage,
    loadChildren: () => import('./server-settings-general/server-settings-general.module').then(m => m.ServerSettingsGeneralPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/manage/libraries',
    component: LibraryListComponent,
    loadChildren: () => import('./libraries/libraries.module').then(m => m.LibrariesModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/server/:serverGuid/settings/transcoder',
    component: TranscoderSettingssPage,
    loadChildren: () => import('./transcode-settings/transcode-settings.module').then(m => m.TranscoderSettingssPageModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'settings/account',
    component: MyAccountPage,
    loadChildren: () => import('./account-settings/account-settings.module').then(m => m.AccountSettingsModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'manage/movies',
    component: MovieListPage,
    loadChildren: () => import('./movies/movies.module').then(m => m.MoviesModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/tvseries',
    component: TvSerieListPage,
    loadChildren: () => import('./tvseries/tvseries.module').then(m => m.TvSeriesModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/genres',
    component: GenreListPage,
    loadChildren: () => import('./genres/genres.module').then(m => m.GenresModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/menus',
    component: MenuListPage,
    loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/users',
    component: UserListPage,
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'manage/roles',
    component: RoleListPage,
    loadChildren: () => import('./roles/roles.module').then(m => m.RolesPageModule),
    canActivate:[loggedUserGuard,adminGuard]
  },
  {
    path: 'landing',
    component:LandingPage,
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'register',
    component:RegisterUserPage,
    loadChildren: () => import('./register-user/register-user.module').then(m => m.RegisterAcccountPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'login',
    component:LoginPage,
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'recover',
    component:RecoverPasswordPage,
    loadChildren: () => import('./recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'reset/:base64Data',
    component:ResetPasswordPage,
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
   path: 'confirm/:base64Data',
   component:ConfirmEmailPage,
   loadChildren: () => import('./confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule),
   canActivate:[unloggedUserGuard]
  },
  {path: '404',
   component: NotFoundPage,
   loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundPageModule)
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
