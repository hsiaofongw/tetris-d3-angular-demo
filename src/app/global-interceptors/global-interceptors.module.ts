import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthBearerInterceptor } from './auth-bearer.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthBearerInterceptor,
      multi: true,
    },
  ],
})
export class GlobalInterceptorsModule {}
