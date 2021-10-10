import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewUpdate, ViewUpdateHook } from '../types';

@Injectable()
export class CollectViewStateForUser implements ViewUpdateHook {
  constructor(private httpClient: HttpClient) {}

  triggerWithUpdate(viewUpdate: ViewUpdate): void {
    console.log({ viewUpdate });
  }
}
