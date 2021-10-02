import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubOauthRedirectBackComponent } from './github-oauth-redirect-back.component';

describe('GithubOauthRedirectBackComponent', () => {
  let component: GithubOauthRedirectBackComponent;
  let fixture: ComponentFixture<GithubOauthRedirectBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GithubOauthRedirectBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubOauthRedirectBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
