import { NgModule } from '@angular/core';
import { SCORE_UPDATE_HOOKS, VIEW_UPDATE_HOOKS } from './types';
import { CollectViewStateForUser } from './hooks/record-view-for-user.hook';
import { RecordScoreForUser } from './hooks/record-score-for-user.hook';

@NgModule({
  providers: [
    {
      provide: VIEW_UPDATE_HOOKS,
      useClass: CollectViewStateForUser,
      multi: true,
    },
    {
      provide: SCORE_UPDATE_HOOKS,
      useClass: RecordScoreForUser,
      multi: true,
    },
  ],
})
export class UpdateHookModule {}
