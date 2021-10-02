import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  clientId = 'Iv1.904dfc227b774cc7';
  githubRequestAuthorizationBaseURL = 'https://github.com/login/oauth/authorize';
  loginRedirectTo?: SafeUrl;

  constructor(private router: Router, private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const githubURLObject = new URL(this.githubRequestAuthorizationBaseURL);
    githubURLObject.searchParams.append('client_id', this.clientId);
    this.loginRedirectTo = this.domSanitizer.bypassSecurityTrustUrl(githubURLObject.toString())
  }
}
