import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../guards/role.guard';
import { OuterLayoutComponent } from '../user-layout/outer-layout/outer-layout.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: OuterLayoutComponent,
    children: [
      {
        path: 'users-list',
        component: UserListComponent,
        canActivate: [RoleGuard]
      },
      {
        path: 'users-profile',
        component: UserProfileComponent
      },
      {
        path: '',
        redirectTo: 'users-list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
