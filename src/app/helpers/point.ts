import { IPoint } from '../interfaces';

/** 点 */
export class Point implements IPoint {
  constructor(
    public readonly offsetX: number,
    public readonly offsetY: number
  ) {}

  /** 创建 */
  public static create(data: IPoint): Point {
    const p = new Point(data.offsetX, data.offsetY);

    return p;
  }

  /** 复制 */
  public clone(): Point {
    return Point.create({ offsetX: this.offsetX, offsetY: this.offsetY });
  }

  /** 向量加法 */
  public add(point: IPoint): Point {
    return Point.create({
      offsetX: this.offsetX + point.offsetX,
      offsetY: this.offsetY + point.offsetY,
    });
  }

  /** 重叠判断 */
  public isOverlap(point: IPoint): boolean {
    return this.offsetX === point.offsetX && this.offsetY === point.offsetY;
  }

  /** 序列化 */
  toString(): string {
    return `(${(this.offsetX, this.offsetY)})`;
  }
}
