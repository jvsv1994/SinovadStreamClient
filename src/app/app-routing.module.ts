import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { loggedUserGuard } from './guards/logged-user.guard';
import { unloggedUserGuard } from './guards/unlogged-user.guard ';
import { LoginComponent } from './modules/pages/login/components/login/login.component';
import { RegisterUserComponent } from './modules/pages/register-user/components/register-user/register-user.component';
import { ResetPasswordComponent } from './modules/pages/reset-password/components/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './modules/pages/confirm-email/components/confirm-email/confirm-email.component';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { RecoverPasswordComponent } from './modules/pages/recover-password/components/recover-password/recover-password.component';
import { SearchViewComponent } from './modules/pages/media-search/components/search-view/search-view.component';
import { HomePageComponent } from './modules/pages/home/components/home-page/home-page.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    loadChildren: () => import('./modules/pages/home/home.module').then(m => m.HomeModule),
    canActivate:[loggedUserGuard]
  },
  {
    path: 'media',
    loadChildren: () => import('./modules/pages/media/media.module').then(m => m.MediaModule)
  },
  {
    path: 'search',
    component: SearchViewComponent,
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
