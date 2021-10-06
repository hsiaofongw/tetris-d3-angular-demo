import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GithubOauthRedirectBackComponent } from './auth/components/github-oauth-redirect-back/github-oauth-redirect-back.component';
import { TetrisDebugComponent } from './tetris-debug/tetris-debug.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', redirectTo: 'tetris-play', pathMatch: 'full' },
  { path: 'tetris-play', component: TetrisDebugComponent },
  { path: 'tetris-blocks-view', component: ViewComponent },
  {
    path: 'github-oauth-redirect-back',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: 'tetris-debug', component: TetrisDebugComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
