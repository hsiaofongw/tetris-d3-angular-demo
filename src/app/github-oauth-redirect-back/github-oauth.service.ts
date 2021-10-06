import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtQueryResult } from './interfaces';

// fullPath = server + path
export type ApiConfig = { server: string; path: string };
export const AUTH_API_CONFIG = new InjectionToken<ApiConfig>(
  'Auth Backend Config'
);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    @Inject(AUTH_API_CONFIG) private apiConfig: ApiConfig,
    private httpClient: HttpClient
  ) {}

  getJwt(authorizationCode: string): Observable<JwtQueryResult> {
    const fullPath = this.apiConfig.server + this.apiConfig.path;
    return this.httpClient.get<JwtQueryResult>(fullPath, {
      params: new HttpParams({ fromObject: { authorizationCode } }),
    });
  }
}
