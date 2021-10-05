import { Inject, Injectable, InjectionToken } from '@angular/core';

export const TICK_SOURCE_MINIMUM_SOURCE = new InjectionToken<number>(
  'Min Interval MS'
);

export interface RespondToTick {
  tick(): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class TickSource {
  private _pluggedTicks: RespondToTick[] = [];

  constructor(
    @Inject(TICK_SOURCE_MINIMUM_SOURCE) private minimumInterval: number
  ) { }

  public plug(tickRespond: RespondToTick): void {
    if (
      !this._pluggedTicks.find((_tickRespond) => _tickRespond === tickRespond)
    ) {
      this._pluggedTicks.push(tickRespond);
      this._startTick(tickRespond);
    }
  }

  public unPlug(tickRespond: RespondToTick): void {
    this._pluggedTicks = this._pluggedTicks.filter(
      (_tickRespond) => _tickRespond !== tickRespond
    );
  }

  private _startTick(tickRespond: RespondToTick): void {
    if (!this._pluggedTicks.find(_tickRespond => _tickRespond === tickRespond)) {
      return;
    }

    tickRespond.tick().then(() => {
      window.setTimeout(
        () => this._startTick(tickRespond),
        this.minimumInterval
      );
    });
  }
}
