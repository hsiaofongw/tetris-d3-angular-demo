import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig, API_CONFIG } from '../config';
import { UserProfileQueryResult } from '../interfaces';

@Injectable()
export class UserService {
  constructor(
    @Inject(API_CONFIG) private apiConfig: ApiConfig,
    private httpClient: HttpClient
  ) {}

  getProfile(): Observable<UserProfileQueryResult> {
    const fullPath = this.apiConfig.server + this.apiConfig.path;
    return this.httpClient.get<UserProfileQueryResult>(fullPath);
  }
}
