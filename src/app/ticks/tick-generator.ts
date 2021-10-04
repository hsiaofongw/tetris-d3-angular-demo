export abstract class TickGenerator {
  /** 返回的 Tick 像 window.requestAnimationFrame 那样用 */
  public abstract getTick(): (fn: () => void) => void;
}
