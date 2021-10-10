import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewUpdate, ViewUpdateHook } from '../types';

@Injectable()
export class CollectViewStateForUser implements ViewUpdateHook {
  constructor(private httpClient: HttpClient) {}

  triggerWithUpdate(viewUpdate: ViewUpdate): void {
    // console.log('call');

    // this.httpClient
    //   .post('/api/v1/game-log/view', {
    //     board: viewUpdate.payload,
    //     timestamp: viewUpdate.timestamp,
    //   })
    //   .subscribe((res) => console.log({ res }));
  }
}
