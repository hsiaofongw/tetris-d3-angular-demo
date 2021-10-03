import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GithubOauthRedirectBackComponent } from './github-oauth-redirect-back/github-oauth-redirect-back.component';
import { TetrisPlayComponent } from './tetris-play/tetris-play.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: 'play', pathMatch: 'full'},
  { path: 'play', component: TetrisPlayComponent },
  { path: 'view', component: ViewComponent },
  { path: 'github-oauth-redirect-back', component: GithubOauthRedirectBackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
