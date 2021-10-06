import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { JwtPersistenceService } from 'src/app/auth/services/jwt-persistence.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  clientId = 'Iv1.ac6dbe5b3e366cf5';
  githubRequestAuthorizationBaseURL = 'https://github.com/login/oauth/authorize';
  redirectUri = 'http://localhost:4200/github-oauth-redirect-back';
  
  avatarUrl?: string;
  defaultAvatarUrl = '';
  username?: string;
  githubHomePage?: string;

  constructor(
    private userService: UserService,
    private jwtPersistence: JwtPersistenceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.fetchProfile());
  }

  fetchProfile(): void {
    this.userService.getProfile().subscribe((profileQueryResult) => {
      if (profileQueryResult.error) {
        this.jwtPersistence.clear();
        return;
      }

      const profile = profileQueryResult.result;
      this.avatarUrl = profile.avatarUrl;
      this.username = profile.username;
      this.githubHomePage = profile.userGitHubHomePage;
    });
  }

  logOut(): void {
    this.username = undefined;
    this.avatarUrl = undefined;
    this.jwtPersistence.clear();
  }

  logIn(): void {
    const githubURLObject = new URL(this.githubRequestAuthorizationBaseURL);
    githubURLObject.searchParams.append('client_id', this.clientId);
    githubURLObject.searchParams.append('redirect_uri', this.redirectUri);
    const loginRedirectTo = githubURLObject.toString();
    window.open(loginRedirectTo, '_blank');
  }
}
