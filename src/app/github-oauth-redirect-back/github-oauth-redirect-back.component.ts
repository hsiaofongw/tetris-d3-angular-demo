import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-github-oauth-redirect-back',
  templateUrl: './github-oauth-redirect-back.component.html',
  styleUrls: ['./github-oauth-redirect-back.component.scss']
})
export class GithubOauthRedirectBackComponent implements OnInit {

  code?: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    window.console.log(this.route.snapshot.queryParams);
    this.code = this.route.snapshot.queryParamMap.get('code') ?? '';
  }

}
