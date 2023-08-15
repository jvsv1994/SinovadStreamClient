import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SinovadWebComponent } from './sinovad-web.component';
import { RouterModule, Routes } from '@angular/router';
import { AccountPage } from '../account/account.page';
import { GenreListPage } from '../genres/genre-list/genre-list.page';
import { TranscoderSettingssPage } from '../transcode-settings/transcode-settings.page';
import { NotFoundPage } from '../not-found/not-found.page';
import { ConfirmEmailPage } from '../confirm-email/confirm-email.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { RecoverPasswordPage } from '../recover-password/recover-password.page';
import { LoginPage } from '../login/login.page';
import { RegisterUserPage } from '../register-user/register-user.page';
import { LandingPage } from '../landing/landing.page';
import { ServerSettingsGeneralPage } from '../server-settings-general/server-settings-general.page';
import { WebContainerPageModule } from '../web-container/web-container.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { SharedModule } from '../shared/shared.module';
import { UserListPage } from '../users/user-list/user-list.page';
import { RoleListPage } from '../roles/role-list/role-list.page';
import { MenuListPage } from '../menus/menu-list/menu-list.page';
import { MovieListPage } from '../movies/movie-list/movie-list.page';
import { TvSerieListPage } from '../tvseries/tvserie-list/tvserie-list.page';
import { LibraryListComponent } from '../libraries/library-list/library-list.component';
import { ProfilesViewPage } from '../profiles/profiles-view/profiles-view.page';
import { ProfileNewPage } from '../profiles/profile-new/profile-new.page';
import { ProfileEditPage } from '../profiles/profile-edit/profile-edit.page';
import { SearchViewPage } from '../media/search/search-view/search-view.page';
import { MediaDetailComponent } from '../media/detail/media-detail.component';
import { MediaItemsComponent } from '../media/items/media-items.component';
import { VideoPageModule } from '../media/video/video.module';
import { VideoPage } from '../media/video/component/video.page';
import { loggedUserGuard } from '../shared/guards/logged-user.guard';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: 'home',
        component: MediaItemsComponent,
        loadChildren: () => import('../media/media.module').then(m => m.MediaModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'media/movies',
        component: MediaItemsComponent,
        loadChildren: () => import('../media/media.module').then(m => m.MediaModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'media/tvseries',
        component: MediaItemsComponent,
        loadChildren: () => import('../media/media.module').then(m => m.MediaModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'media/server/:serverGuid',
        component: MediaItemsComponent,
        loadChildren: () => import('../media/media.module').then(m => m.MediaModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'media/server/:serverGuid/libraries/:libraryId',
        component: MediaItemsComponent,
        loadChildren: () => import('../media/media.module').then(m => m.MediaModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'media/server/:serverGuid/libraries/:libraryId/detail',
        component: MediaDetailComponent,
        loadChildren: () => import('../media/media.module').then(m => m.MediaModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'media/server/:serverGuid/video/:mediaFileId',
        component: VideoPage,
        loadChildren: () => import('../media/video/video.module').then(m => m.VideoPageModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'search',
        component: SearchViewPage,
        loadChildren: () => import('../media/search/search.module').then(m => m.SearchModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'select-profile',
        component: ProfilesViewPage,
        loadChildren: () => import('../profiles/profiles.module').then(m => m.ProfilesModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'add-profile',
        component: ProfileNewPage,
        loadChildren: () => import('../profiles/profiles.module').then(m => m.ProfilesModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'edit-profile/:profileGuid',
        component: ProfileEditPage,
        loadChildren: () => import('../profiles/profiles.module').then(m => m.ProfilesModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'settings/server/:serverGuid/settings/general',
        component: ServerSettingsGeneralPage,
        loadChildren: () => import('../server-settings-general/server-settings-general.module').then(m => m.ServerSettingsGeneralPageModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'settings/server/:serverGuid/manage/libraries',
        component: LibraryListComponent,
        loadChildren: () => import('../libraries/libraries.module').then(m => m.LibrariesModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'settings/server/:serverGuid/settings/transcoder',
        component: TranscoderSettingssPage,
        loadChildren: () => import('../transcode-settings/transcode-settings.module').then(m => m.TranscoderSettingssPageModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'manage/movies',
        component: MovieListPage,
        loadChildren: () => import('../movies/movies.module').then(m => m.MoviesModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'manage/tvseries',
        component: TvSerieListPage,
        loadChildren: () => import('../tvseries/tvseries.module').then(m => m.TvSeriesModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'manage/genres',
        component: GenreListPage,
        loadChildren: () => import('../genres/genres.module').then(m => m.GenresModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'manage/menus',
        component: MenuListPage,
        loadChildren: () => import('../menus/menus.module').then(m => m.MenusModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'manage/users',
        component: UserListPage,
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'manage/roles',
        component: RoleListPage,
        loadChildren: () => import('../roles/roles.module').then(m => m.RolesPageModule),
        canActivate:[loggedUserGuard]
      },
      {
        path: 'settings/account',
        component: AccountPage,
        loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule),
        canActivate:[loggedUserGuard]
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
