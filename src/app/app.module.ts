import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageComponent } from './page/page.component';
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ImagesComponent } from './images/images.component';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { HttpClientModule } from '@angular/common/http';
import { SafeHtmlPipe } from './common/SafeHtmlPipe';
import { TopbarComponent } from './topbar/topbar.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SwiperModule } from "swiper/angular";
import { MembersPageComponent } from './members-page/members-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    PageComponent,
    AdminComponent,
    ImagesComponent,
    SafeHtmlPipe,
    TopbarComponent,
    NotificationsComponent,
    MembersPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    GalleryModule,
    LightboxModule,
    HttpClientModule,
    SwiperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
