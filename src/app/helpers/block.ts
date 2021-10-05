import { IBlock, IGeometry } from '../interfaces';
import { Cell } from './cell';
import * as uuid from 'uuid';
import * as d3 from 'd3';
import { Point } from './point';

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

  /** 获取几何信息 */
  public getGeometry(): IGeometry {
    const geometry: IGeometry = { offsetX: 0, offsetY: 0, width: 0, height: 0 };
    geometry.offsetX = d3.min(this.cells, (cell) => cell.point.offsetX) ?? -1;
    geometry.offsetY = d3.min(this.cells, (cell) => cell.point.offsetY) ?? -1;
    const maxX = d3.max(this.cells, (cell) => cell.point.offsetX) ?? -1;
    const maxY = d3.max(this.cells, (cell) => cell.point.offsetY) ?? -1;

    geometry.width = maxX - geometry.offsetX;
    geometry.height = maxY - geometry.offsetY;

    return geometry;
  }

  /** 产生一个最小囊括矩形 */
  public getMinimumWrapBlock(): Block {
    const cells: Cell[] = new Array<Cell>();
    const geometry = this.getGeometry();
    for (let i = 0; i < geometry.height; i++) {
      for (let j = 0; j < geometry.width; j++) {
        const point = Point.create({
          offsetX: j + geometry.offsetX,
          offsetY: i + geometry.offsetY,
        });
        const cell = Cell.create(point);
        cells.push(cell);
      }
    }

    return Block.create(cells);
  }
}
