import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthenticationGuard } from './authenticationGuard';
import { HomepageComponent } from './homepage/homepage.component';
import { ImagesComponent } from './images/images.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { MembersPageComponent } from './members-page/members-page.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path:'',
    component: HomepageComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path:'page',
    component: PageComponent,
    pathMatch: 'full',
    runGuardsAndResolvers: 'always'
  },
  {
    path:'admin',
    component: AdminComponent,
    pathMatch: 'full',
    canActivate: [AuthenticationGuard],
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
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
