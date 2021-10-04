import { Tick } from './interfaces';
import { TickGenerator } from './tick-generator';

export class FastTickGenerator implements TickGenerator {
  getTick(): Tick {
    return (fn: () => void) => {
      window.setTimeout(() => fn(), 300);
    };
  }
}
