import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScoreUpdate, ScoreUpdateHook } from '../types';

@Injectable()
export class RecordScoreForUser implements ScoreUpdateHook {
  constructor(private httpClient: HttpClient) {}

  triggerWithUpdate(scoreUpdate: ScoreUpdate): void {
    this.httpClient.post('/api/v1/game-log/score', {
      timestamp: scoreUpdate.timestamp,
      score: scoreUpdate.payload,
    }).subscribe();
  }
}
