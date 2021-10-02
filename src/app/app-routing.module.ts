import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './play/play.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'play '},
  { path: 'play', component: PlayComponent },
  { path: 'view', component: ViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
