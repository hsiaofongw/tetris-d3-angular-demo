import { ICell, IPoint } from '../interfaces';
import { Point } from './point';
import * as uuid from 'uuid';

/** 单元格 */
export class Cell implements ICell {
  /** block ID, 当加入 block 后产生 */
  blockId?: string;

  constructor(public readonly id: string, public point: Point) {}

  /** 创建一个 cell */
  public static create(point: Point): Cell {
    return new Cell(uuid.v4(), point.clone());
  }

  /** 复制一个 cell */
  public clone(): Cell {
    return Cell.create(this.point.clone());
  }

  /** 左移一步 */
  public left(): void {
    this.point = this.point.add({ offsetX: -1, offsetY: 0 });
  }

  /** 右移一步 */
  public right(): void {
    this.point = this.point.add({ offsetX: 1, offsetY: 0 });
  }

  /** 上移一步 */
  public up(): void {
    this.point = this.point.add({ offsetX: 0, offsetY: -1 });
  }

  /** 下移一步 */
  public down(): void {
    this.point = this.point.add({ offsetX: 0, offsetY: 1 });
  }

  /** 重叠判断 */
  public isOverlap(cell: ICell): boolean {
    return this.point.isOverlap(cell.point);
  }

  /** 重叠判断 */
  public isOverlapWithPoint(point: IPoint): boolean {
    return this.point.isOverlap(point);
  }
}
