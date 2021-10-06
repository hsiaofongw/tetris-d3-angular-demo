import { TestBed } from '@angular/core/testing';

import { AuthBearerInterceptor } from './auth-bearer.interceptor';

describe('AuthBearerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthBearerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthBearerInterceptor = TestBed.inject(AuthBearerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
