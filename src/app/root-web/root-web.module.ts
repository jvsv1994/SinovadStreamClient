import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { VideoPageModule } from '../video/video.module';
import { SideBarTvPageModule } from '../sidebar-tv/siderbar-tv.module';
import { SplashScreenPageModule } from '../splash-screen/splash-screen.module';
import { HeaderWebPageModule } from '../header-web/header-web.module';
import { SearchViewWebPage } from '../search-view-web/search-view-web.page';
import { NotFoundPage } from '../not-found/not-found.page';
import { ProfilesViewPage } from '../profiles-view/profiles-view.page';
import { MoviesPage } from '../movies/movies.page';
import { HomePage } from '../home/home.page';
import { TvSeriesPage } from '../tvseries/tvseries.page';
import { MovieDetailPage } from '../movie-detail/movie-detail.page';
import { TvSerieDetailPage } from '../tvserie-detail/tvserie-detail.page';
import { LandingPage } from '../landing/landing.page';
import { RegisterUserPage } from '../register-user/register-user.page';
import { LoginPage } from '../login/login.page';
import { RecoverPasswordPage } from '../recover-password/recover-password.page';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { ConfirmEmailPage } from '../confirm-email/confirm-email.page';
import { RootWebPage } from './root-web.page';

const routes: Routes = [
  {
    path: 'web/home',
    component: HomePage,
    loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'web/movies',
    component: MoviesPage,
    loadChildren: () => import('../movies/movies.module').then(m => m.MoviesPageModule)
  },
  {
    path: 'web/tvseries',
    component: TvSeriesPage,
    loadChildren: () => import('../tvseries/tvseries.module').then(m => m.TvSeriesPageModule)
  },
  {
    path: 'web/search',
    component: SearchViewWebPage,
    loadChildren: () => import('../search-view-web/search-view-web.module').then(m => m.SearchViewWebPageModule)
  },
  {
    path: 'web/select-profile',
    component: ProfilesViewPage,
    loadChildren: () => import('../profiles-view/profiles-view.module').then(m => m.ProfilesViewPageModule)
  },
  {
    path: 'web/moviedetail/:movieId',
    component: MovieDetailPage,
    loadChildren: () => import('../movie-detail/movie-detail.module').then(m => m.MovieDetailPageModule)
  },
  {
    path: 'web/tvseriedetail/:tvSerieId',
    component: TvSerieDetailPage,
    loadChildren: () => import('../tvserie-detail/tvserie-detail.module').then(m => m.TvSerieDetailPageModule)
  },
  {
    path: 'web/landing',
    component:LandingPage,
    loadChildren: () => import('../landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'web/register',
    component:RegisterUserPage,
    loadChildren: () => import('../register-user/register-user.module').then(m => m.RegisterAcccountPageModule)
  },
  {
    path: 'web/login',
    component:LoginPage,
    loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'web/recover',
    component:RecoverPasswordPage,
    loadChildren: () => import('../recover-password/recover-password.module').then(m => m.RecoverPasswordPageModule)
  },
  {
    path: 'web/reset/:base64Data',
    component:ResetPasswordPage,
    loadChildren: () => import('../reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'confirm/:base64Data',
    component:ConfirmEmailPage,
    loadChildren: () => import('../confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule)
  },
  {
    path: 'web/404',
    component:NotFoundPage,
    loadChildren: () => import('../not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'web',
    pathMatch: 'full',
    redirectTo: 'web/home' // TODO change to home page eventually
  }
];

@NgModule({
    declarations: [
      RootWebPage
    ],
    imports: [
      CommonModule,
      FormsModule,
      VideoPageModule,
      HeaderWebPageModule,
      ReactiveFormsModule,
      SharedModule,
      SideBarTvPageModule,
      SplashScreenPageModule,
      RouterModule.forChild(routes)
    ],
    exports: [RootWebPage]
})
export class RootWebPageModule {
}
