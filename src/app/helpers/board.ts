import { InjectionToken } from '@angular/core';
import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { IBoard } from '../interfaces';
import { ShapePrototype } from '../shape-prototypes/shape-prototype';
import { Block } from './block';
import { Cell } from './cell';
import { Point } from './point';

/** 依赖注入符号 */
export const GAME_BOARD = new InjectionToken<Board>('Game Board');

/** 棋盘 */
export class Board implements IBoard {
  constructor(
    public readonly nRows: number,
    public readonly nCols: number,
    public readonly cells: Cell[]
  ) {}

  /** 重置 */
  public reset(): void {
    const nCells = this.cells.length;
    this.cells.splice(0, nCells);
  }

  /** 棋盘更新事件 */
  public cellUpdate = new Subject<Board>();

  /** 创建一个棋盘 */
  public static create(data: IBoard): Board {
    return new Board(data.nRows, data.nCols, new Array<Cell>());
  }

  /** 查询在一个给定位置是否有 cell 存在 */
  // 暂时不使用装饰器
  // @CachedQuery
  public queryCell(point: Point): Cell | undefined {
    for (const cell of this.cells) {
      if (cell.isOverlapWithPoint(point)) {
        return cell;
      }
    }

    return undefined;
  }

  /** 在此棋盘中，对于一个给定的 block, 查询是否超出棋盘范围 */
  public isOutOfRange(block: Block): boolean {

    for (const cell of block.cells) {
      if (cell.point.offsetX < 0 || cell.point.offsetX >= this.nCols) {
        return true;
      }

      if (cell.point.offsetY < 0 || cell.point.offsetY >= this.nRows) {
        return true;
      }
    }

    return false;
  }

  /** 在此棋盘中，对于一个给定的 block, 查询是否有其他 block 的 cell 与它重叠 */
  public isOverlap(block: Block): boolean {

    for (const cell of block.cells) {
      const cellQueryResult = this.queryCell(cell.point);
      if (
        cellQueryResult !== undefined &&
        cellQueryResult.blockId !== block.id
      ) {
        return true;
      }
    }

    return false;
  }

  /** 添加单元到此棋盘中 */
  public addCell(cell: Cell): void {
    this.cells.push(cell);

    this.cellUpdate.next(this);
  }

  /** 从此网格中删除指定的单元 */
  public deleteCell(cellId: string): void {
    const cellIndex = this.cells.findIndex(cell => cell.id === cellId);
    if (cellIndex !== -1) {
      this.cells.splice(cellIndex, 1);
    }

    this.cellUpdate.next(this);
  }

  /** 卸载一个 block (一般是临时卸载) */
  public detachBlock(block: Block): void {
    block.cells.forEach(cell => this.deleteCell(cell.id));
  }

  /** 加载一个 block */
  public attachBlock(block: Block): void {
    block.cells.forEach(cell => this.addCell(cell));
  }

  /** 在当前的 board 上产生一个 block */
  public getBlock(shapeProto: ShapePrototype): Block {
    const shape = shapeProto.getShape();
    const points = shape.map(p => Point.create(p));
    const cells = points.map(p => Cell.create(p));
    const block = Block.create(cells);
    const geometry = block.getGeometry();
    const maxStepsAllowToMoveRight = this.nCols - (geometry.offsetX + geometry.width);
    const stepsToMove = d3.randomInt(0, maxStepsAllowToMoveRight+1)();
    for (let step = 0; step < stepsToMove; step++) {
      block.right();
    }

    return block;
  }

}
