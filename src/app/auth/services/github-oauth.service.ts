import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig, API_CONFIG } from '../../types/config';
import { JwtQueryResult } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(API_CONFIG) private apiConfig: ApiConfig,
    private httpClient: HttpClient
  ) {}

  getJwt(authorizationCode: string): Observable<JwtQueryResult> {
    const fullPath = this.apiConfig.server + this.apiConfig.path;
    return this.httpClient.get<JwtQueryResult>(fullPath, {
      params: new HttpParams({ fromObject: { authorizationCode } }),
    });
  }
}
