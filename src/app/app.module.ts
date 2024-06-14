import { NgModule, isDevMode } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { DropDownServersComponent } from './components/drop-down-servers/drop-down-servers.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarMediaComponent } from './components/sidebar-media/sidebar-media.component';
import { SidebarAdministratorComponent } from './components/sidebar-administrator/sidebar-administrator.component';
import { SidebarAccountComponent } from './components/sidebar-account/sidebar-account.component';
import { DropDownUserComponent } from './components/dropdown-user/dropdown-user.component';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({ declarations: [AppComponent, NotFoundPageComponent, LandingPageComponent, NavbarComponent, DropDownUserComponent, SidebarAccountComponent, SidebarAdministratorComponent, SidebarMediaComponent, DropDownServersComponent, SplashScreenComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        FormsModule,
        SharedModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [{ provide: APP_BASE_HREF, useValue: '/' }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}


