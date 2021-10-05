import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { GameBoxControlEventsDispatcher } from './game-box-control-events-dispatcher.service';

export const KEYBOARD_EVENT_OBSERVABLE = new InjectionToken<
  Observable<KeyboardEvent>
>('KeyboardEvent$');

@Injectable()
export class KeyboardEventSource {
  constructor(
    @Inject(KEYBOARD_EVENT_OBSERVABLE) keyboardEvent$: Observable<KeyboardEvent>
  ) {
    keyboardEvent$.subscribe((event) => this._dispatch(event));
  }

  private _pluggedEventDispatchers: GameBoxControlEventsDispatcher[] = [];

  public plug(dispatcher: GameBoxControlEventsDispatcher): void {
    if (
      !this._pluggedEventDispatchers.find(
        (_dispatcher) => _dispatcher === dispatcher
      )
    ) {
      this._pluggedEventDispatchers.push(dispatcher);
    }
  }

  public unPlug(dispatcher: GameBoxControlEventsDispatcher): void {
    this._pluggedEventDispatchers = this._pluggedEventDispatchers.filter(
      (_dispatcher) => _dispatcher !== dispatcher
    );
  }

  private _dispatch(event: KeyboardEvent): void {
    for (const dispatcher of this._pluggedEventDispatchers) {
      dispatcher.dispatch(event);
    }
  }
}
