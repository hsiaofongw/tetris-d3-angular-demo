import { Injectable } from '@angular/core';
import { GameBoxControl } from '../interfaces';

type GameBoxEventHandler = () => void;

type AbstractGameBoxEventTable<T extends string> = {
  [Property in T]: GameBoxEventHandler[];
};

export type GameBoxEvent =
  | 'up'
  | 'rotate'
  | 'down'
  | 'left'
  | 'right'
  | 'reset'
  | 'new'
  | 'pause'
  | 'delete'
  | 'fall';

type GameBoxEventTable = AbstractGameBoxEventTable<GameBoxEvent>;
type KeyboardEventMap = Record<string, keyof GameBoxEventTable>;

@Injectable({
  providedIn: 'root',
})
export class GameBoxControlEventsDispatcher {
  private _pluggedGameBoxControls: GameBoxControl<any>[] = [];

  private readonly _keyboardEventMap: KeyboardEventMap = {
    w: 'rotate',
    a: 'left',
    s: 'down',
    d: 'right',
    ' ': 'pause',
    k: 'up',
    r: 'reset',
    n: 'new',
    h: 'left',
    l: 'right',
    j: 'down',
    e: 'delete',
    f: 'fall'
  };

  public plug<T>(control: GameBoxControl<T>): void {
    this._pluggedGameBoxControls.push(control);
  }

  public unPlug(control: GameBoxControl<any>): void {
    this._pluggedGameBoxControls = this._pluggedGameBoxControls.filter(
      (_control) => _control !== control
    );
  }

  public dispatch(event: KeyboardEvent): void {
    if (event.key === undefined) {
      return;
    }

    const key = this._keyboardEventMap[event.key as string];
    if (key === undefined) {
      return;
    }

    const upperCased = key.charAt(0).toUpperCase() + key.slice(1);
    for (const control of this._pluggedGameBoxControls) {
      const handler = (control as any)[`onGameBox${upperCased}`];
      if (handler !== undefined) {
        handler.call(control);
      }
    }
  }
}
