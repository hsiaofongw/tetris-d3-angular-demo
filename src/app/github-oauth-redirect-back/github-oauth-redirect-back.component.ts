import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { AuthService } from './github-oauth.service';
import { JwtQueryResult } from './interfaces';
import { JwtPersistenceService } from './jwt-persistence.service';

@Component({
  selector: 'app-github-oauth-redirect-back',
  templateUrl: './github-oauth-redirect-back.component.html',
  styleUrls: ['./github-oauth-redirect-back.component.scss'],
})
export class GithubOauthRedirectBackComponent implements OnInit {
  /** 登录成功到开始跳转的等待时间（秒） */
  waitUntilJumpSecs = 3;

  /** 跳转到首页的时间戳 */
  whenJumpToHomePageTX?: number;

  /** 多少秒后调整到首页，这里的值是计算出来的 */
  secondsUntilJumpToHomePage?: string;

  constructor(
    private route: ActivatedRoute,
    private githubOAuthService: AuthService,
    private jwtPersistenceService: JwtPersistenceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const authorizationCode =
      this.route.snapshot.queryParamMap.get('code') ?? '';
    this.getJwt(authorizationCode).subscribe((jwtQueryResult) => {
      if (jwtQueryResult.error) {
        console.error(jwtQueryResult.error);
      }

      if (jwtQueryResult.result) {
        this.jwtPersistenceService.write(jwtQueryResult.result.jwt);

        timer(this.waitUntilJumpSecs * 1000).subscribe(() => {
          this.router.navigate(['']);
        });
        this.whenJumpToHomePageTX = (new Date().valueOf()) + this.waitUntilJumpSecs * 1000;
        this.startCounting();       
      }
    });
  }

  getJwt(authorizationCode: string): Observable<JwtQueryResult> {
    return this.githubOAuthService.getJwt(authorizationCode);
  }

  /** 开始倒计时 */
  startCounting(): void {
    const counter = (tx: number) => {
      if (!this.whenJumpToHomePageTX) {
        return;
      }

      if (tx > this.whenJumpToHomePageTX) {
        return;
      }

      this.calcSecondsUntilJumpToHomePage();
      window.setTimeout(() => counter(new Date().valueOf()), 0);
    }

    counter(new Date().valueOf());
  }

  /** 计算还有多少秒要跳转到首页 */
  calcSecondsUntilJumpToHomePage(): void {
    const now = new Date().valueOf();
    if (!this.whenJumpToHomePageTX) {
      return undefined;
    }

    this.secondsUntilJumpToHomePage = (
      (this.whenJumpToHomePageTX - now) /
      1000
    ).toFixed(0);
  }
}
