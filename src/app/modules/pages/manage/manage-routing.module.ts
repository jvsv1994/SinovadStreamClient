import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { mainAdminGuard } from 'src/app/guards/main-admin.guard';
import { MovieListComponent } from './modules/pages/movies/components/movie-list/movie-list.component';
import { TvSerieListComponent } from './modules/pages/tvseries/components/tvserie-list/tvserie-list.component';
import { GenreListComponent } from './modules/pages/genres/components/genre-list/genre-list.component';
import { MenuListComponent } from './modules/pages/menus/components/menu-list/menu-list.component';
import { mediadbAdminGuard } from 'src/app/guards/mediadb-admin.guard';

const routes: Routes = [
  {
    path: 'movies',
    component: MovieListComponent,
    loadChildren: () => import('./modules/pages/movies/movies.module').then(m => m.MoviesModule),
    canActivate:[mediadbAdminGuard]
  },
  {
    path: 'tvseries',
    component: TvSerieListComponent,
    loadChildren: () => import('./modules/pages/tvseries/tvseries.module').then(m => m.TvSeriesModule),
    canActivate:[mediadbAdminGuard]
  },
  {
    path: 'genres',
    component: GenreListComponent,
    loadChildren: () => import('./modules/pages/genres/genres.module').then(m => m.GenresModule),
    canActivate:[mediadbAdminGuard]
  },
  {
    path: 'menus',
    component: MenuListComponent,
    loadChildren: () => import('./modules/pages/menus/menus.module').then(m => m.MenusModule),
    canActivate:[mainAdminGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/pages/users/users.module').then(m => m.UsersModule),
  },
  {
    path: 'roles',
    loadChildren: () => import('./modules/pages/roles/roles.module').then(m => m.RolesPageModule),
  },
  {
    path: 'catalogs',
    loadChildren: () => import('./modules/pages/catalogs/catalogs.module').then(m => m.CatalogsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
