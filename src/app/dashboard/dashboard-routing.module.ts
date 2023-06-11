import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OuterLayoutComponent } from '../user-layout/outer-layout/outer-layout.component';
import { NotesDashboardComponent } from './notes-dashboard/notes-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: OuterLayoutComponent,
    children: [
      {
        path: '',
        component: NotesDashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
