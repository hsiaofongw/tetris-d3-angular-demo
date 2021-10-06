import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthBearerInterceptor } from './interceptors/auth-bearer.interceptor';
import { UserComponent } from './components/user/user.component';
import { UserService } from './services/user.service';
import { ApiConfig, API_CONFIG } from './config';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: API_CONFIG,
      useValue: { server: 'http://localhost:3000', path: '/user' } as ApiConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthBearerInterceptor,
      multi: true,
    },
    UserService,
  ],
  exports: [UserComponent],
})
export class UserModule {}
