import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubOauthRedirectBackComponent } from './components/github-oauth-redirect-back/github-oauth-redirect-back.component';
import { JwtPersistenceService } from './services/jwt-persistence.service';
import { AuthService } from './services/github-oauth.service';
import { ApiConfig, API_CONFIG } from '../types/config';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [GithubOauthRedirectBackComponent],
  imports: [CommonModule, RouterModule.forChild([
    {
      path: '',
      component: GithubOauthRedirectBackComponent
    }
  ])],
  providers: [
    JwtPersistenceService,
    AuthService,
    {
      provide: API_CONFIG,
      useValue: {
        server: 'http://localhost:3000',
        path: '/token',
      } as ApiConfig,
    },
  ],
})
export class AuthModule {}
