import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScoreUpdate, ScoreUpdateHook } from '../types';

@Injectable()
export class RecordScoreForUser implements ScoreUpdateHook {
  constructor(private httpClient: HttpClient) {}

  triggerWithUpdate(scoreUpdate: ScoreUpdate): void {
    console.log({ scoreUpdate });
  }
}
