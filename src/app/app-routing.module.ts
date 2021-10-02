import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GithubOauthRedirectBackComponent } from './github-oauth-redirect-back/github-oauth-redirect-back.component';
import { PlayComponent } from './play/play.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: 'play', pathMatch: 'full'},
  { path: 'play', component: PlayComponent },
  { path: 'view', component: ViewComponent },
  { path: 'github-oauth-redirect-back', component: GithubOauthRedirectBackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
