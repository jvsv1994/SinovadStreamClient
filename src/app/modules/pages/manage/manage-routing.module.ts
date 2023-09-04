import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { adminGuard } from 'src/app/guards/admin.guard';
import { UserListPage } from './modules/pages/users/components/user-list/user-list.page';
import { GenreListPage } from './modules/pages/genres/components/genre-list/genre-list.page';
import { MenuListPage } from './modules/pages/menus/components/menu-list/menu-list.page';
import { RoleListPage } from './modules/pages/roles/components/role-list/role-list.page';
import { MovieListComponent } from './modules/pages/movies/components/movie-list/movie-list.component';
import { TvSerieListComponent } from './modules/pages/tvseries/components/tvserie-list/tvserie-list.component';

const routes: Routes = [ {
  path: 'movies',
  component: MovieListComponent,
  loadChildren: () => import('./modules/pages/movies/movies.module').then(m => m.MoviesModule),
  canActivate:[loggedUserGuard,adminGuard]
},
{
  path: 'tvseries',
  component: TvSerieListComponent,
  loadChildren: () => import('./modules/pages/tvseries/tvseries.module').then(m => m.TvSeriesModule),
  canActivate:[loggedUserGuard,adminGuard]
},
{
  path: 'genres',
  component: GenreListPage,
  loadChildren: () => import('./modules/pages/genres/genres.module').then(m => m.GenresModule),
  canActivate:[loggedUserGuard,adminGuard]
},
{
  path: 'menus',
  component: MenuListPage,
  loadChildren: () => import('./modules/pages/menus/menus.module').then(m => m.MenusModule),
  canActivate:[loggedUserGuard,adminGuard]
},
{
  path: 'users',
  component: UserListPage,
  loadChildren: () => import('./modules/pages/users/users.module').then(m => m.UsersModule),
  canActivate:[loggedUserGuard,adminGuard]
},
{
  path: 'roles',
  component: RoleListPage,
  loadChildren: () => import('./modules/pages/roles/roles.module').then(m => m.RolesPageModule),
  canActivate:[loggedUserGuard,adminGuard]
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
