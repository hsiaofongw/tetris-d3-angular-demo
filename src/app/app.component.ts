import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  clientId = 'Iv1.ac6dbe5b3e366cf5';
  githubRequestAuthorizationBaseURL = 'https://github.com/login/oauth/authorize';
  redirectUri = 'http://localhost:4200/github-oauth-redirect-back';
  loginRedirectTo?: SafeUrl;

  constructor(private router: Router, private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const githubURLObject = new URL(this.githubRequestAuthorizationBaseURL);
    githubURLObject.searchParams.append('client_id', this.clientId);
    githubURLObject.searchParams.append('redirect_uri', this.redirectUri);
    this.loginRedirectTo = this.domSanitizer.bypassSecurityTrustUrl(githubURLObject.toString())
  }
}
