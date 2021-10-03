import { IBlock } from '../interfaces';
import { Cell } from './cell';
import * as uuid from 'uuid';

/** 块，例如说一个俄罗斯方块 */
export class Block implements IBlock {
  constructor(public readonly id: string, public cells: Cell[]) {}

  /** 创建 */
  public static create(cells: Cell[]): Block {
    const blockId = uuid.v4();
    cells.forEach((cell) => (cell.blockId = blockId));
    return new Block(blockId, cells);
  }

  /** 复制 */
  public clone(): Block {
    return Block.create(this.cells.map((cell) => cell.clone()));
  }

  /** 左移一步 */
  public left(): void {
    this.cells.forEach((cell) => cell.left());
  }

  /** 右移一步 */
  public right(): void {
    this.cells.forEach((cell) => cell.right());
  }

  /** 上移一步 */
  public up(): void {
    this.cells.forEach((cell) => cell.up());
  }

  /** 下移一步 */
  public down(): void {
    this.cells.forEach((cell) => cell.down());
  }

  /** 是否重叠 */
  public isOverlap(cell: Cell): boolean {
    return this.cells
      .filter((_cell) => _cell.blockId !== cell.blockId)
      .some((_cell) => _cell.point.isOverlap(cell.point));
  }
}
