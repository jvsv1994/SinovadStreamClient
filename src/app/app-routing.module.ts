import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { loggedUserGuard } from './guards/logged-user.guard';
import { unloggedUserGuard } from './guards/unlogged-user.guard ';
import { SearchViewPage } from './modules/pages/media-search/components/search-view/search-view.page';
import { VideoComponent } from './modules/pages/media-video/components/video/video.component';
import { MediaItemsComponent } from './modules/pages/media-items/components/media-items/media-items.component';
import { MediaDetailComponent } from './modules/pages/media-detail/components/media-detail/media-detail.component';
import { LoginComponent } from './modules/pages/login/components/login/login.component';
import { RegisterUserComponent } from './modules/pages/register-user/components/register-user/register-user.component';
import { ResetPasswordComponent } from './modules/pages/reset-password/components/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './modules/pages/confirm-email/components/confirm-email/confirm-email.component';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { RecoverPasswordComponent } from './modules/pages/recover-password/components/recover-password/recover-password.component';

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
    component: VideoComponent,
    loadChildren: () => import('./modules/pages/media-video/media-video.module').then(m => m.MediaVideoModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'search',
    component: SearchViewPage,
    loadChildren: () => import('./modules/pages/media-search/media-search.module').then(m => m.MediaSearchModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'profiles',
    loadChildren: () => import('./modules/pages/profiles/profiles.module').then(m => m.ProfilesModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/pages/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'manage',
    loadChildren: () => import('./modules/pages/manage/manage.module').then(m => m.ManageModule)
  },
  {
    path: 'landing',
    component:LandingPageComponent,
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'register',
    component:RegisterUserComponent,
    loadChildren: () => import('./modules/pages/register-user/register-user.module').then(m => m.RegisterAcccountPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'login',
    component:LoginComponent,
    loadChildren: () => import('./modules/pages/login/login.module').then(m => m.LoginPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'recover',
    component:RecoverPasswordComponent,
    loadChildren: () => import('./modules/pages/recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
    path: 'reset/:base64Data',
    component:ResetPasswordComponent,
    loadChildren: () => import('./modules/pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
    canActivate:[unloggedUserGuard]
  },
  {
   path: 'confirm/:base64Data',
   component:ConfirmEmailComponent,
   loadChildren: () => import('./modules/pages/confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule),
   canActivate:[unloggedUserGuard]
  },
  {
    path: '404',
   component: NotFoundPageComponent
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
