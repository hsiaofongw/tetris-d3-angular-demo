import { InjectionToken } from '@angular/core';
import { IBoard } from '../interfaces';

export type IScore = number;
export type ViewUpdate = { updateType: 'viewUpdate'; payload: IBoard };
export type ScoreUpdate = { updateType: 'scoreUpdate'; payload: IScore };
export type Update = ViewUpdate | ScoreUpdate;
export type UpdateType = Update['updateType'];

export type UpdateHook<T extends Update> = { triggerWithUpdate: (update: T) => void; }


export type ViewUpdateHook = UpdateHook<ViewUpdate>;

export const VIEW_UPDATE_HOOKS = new InjectionToken<ViewUpdateHook[]>(
  'Update hooks trigger by view update'
);

export type ScoreUpdateHook = UpdateHook<ScoreUpdate>;

export const SCORE_UPDATE_HOOKS = new InjectionToken<ScoreUpdateHook[]>(
  'Update hooks trigger by score update'
);
