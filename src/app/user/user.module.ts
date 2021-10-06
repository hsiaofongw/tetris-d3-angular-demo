import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthBearerInterceptor } from './interceptors/auth-bearer.interceptor';
import { UserComponent } from './components/user/user.component';
import { UserService } from './services/user.service';
import { ApiConfig, API_CONFIG } from './config';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, HttpClientModule, RouterModule.forChild([])],
  providers: [
    {
      provide: API_CONFIG,
      useValue: { server: '', path: '/api/v1/user' } as ApiConfig,
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
