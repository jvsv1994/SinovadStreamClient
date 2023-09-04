import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedUserGuard } from 'src/app/guards/logged-user.guard';
import { ServerItemsComponent } from './components/server-items/server-items.component';
import { LibraryItemsComponent } from './components/library-items/library-items.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { ItemVideoComponent } from './components/item-video/item-video.component';

const routes: Routes = [{
  path: 'server/:serverGuid',
  component: ServerItemsComponent,
  canActivate:[loggedUserGuard]
},
{
  path: 'server/:serverGuid/libraries/:libraryId',
  component: LibraryItemsComponent,
  canActivate:[loggedUserGuard]
},
{
  path: 'media/server/:serverGuid/libraries/:libraryId/detail',
  component: ItemDetailComponent,
  canActivate:[loggedUserGuard]
},
{
  path: 'media/server/:serverGuid/video/:mediaFileId',
  component: ItemVideoComponent,
  canActivate:[loggedUserGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }
