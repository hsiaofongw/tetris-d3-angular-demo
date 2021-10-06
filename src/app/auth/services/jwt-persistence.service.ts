import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtPersistenceService {
  public read(): string {
    return window.localStorage.getItem('jwt') ?? '';
  }

  public write(jwt: string): void {
    window.localStorage.setItem('jwt', jwt);
  }

  public clear(): void {
    window.localStorage.removeItem('jwt');
  }
}
