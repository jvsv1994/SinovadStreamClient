import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule} from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { SidebarAccountPage } from './components/sidebar-account/sidebar-account.page';
import { SidebarAdministratorPage } from './components/sidebar-administrator/sidebar-administrator.page';
import { SidebarMediaPage } from './components/sidebar-media/sidebar-media.page';
import { DropDownServersComponent } from './components/drop-down-servers/drop-down-servers.component';
import { DropDownUserPage } from './components/dropdown-user/dropdown-user.page';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [AppComponent,NavbarComponent,DropDownUserPage,SidebarAccountPage,SidebarAdministratorPage,SidebarMediaPage,DropDownServersComponent,SplashScreenComponent],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule
  ],
  bootstrap:[AppComponent]
})
export class AppModule {}


