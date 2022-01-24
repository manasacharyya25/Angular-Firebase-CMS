import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ImagesComponent } from './images/images.component';
import { MembersPageComponent } from './members-page/members-page.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path:'',
    component: HomepageComponent,
    pathMatch: 'full',
  },
  {
    path:'page',
    component: PageComponent,
    pathMatch: 'full',
  },
  {
    path:'admin',
    component: AdminComponent,
    pathMatch: 'full',
  },
  {
    path:'images',
    component: ImagesComponent,
    pathMatch: 'full',
  },
  {
    path: 'members',
    component: MembersPageComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
