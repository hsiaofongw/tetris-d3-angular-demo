import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import {
  IBlock,
  IMoveDetectOption,
  ICell,
  IGap,
  IGapDetectOption,
} from './interfaces';


/** 提供 barrier 和 gap 检测服务 */
@Injectable({
  providedIn: 'root',
})
export class BarrierDetectService {
  /** 将 cells 按行分组 */
  private _groupCellsByRows(cells: ICell[]): Record<string, ICell[]> {
    const cellsGroupByRows: Record<string, ICell[]> = {};
    for (const cell of cells) {
      const rowId = cell.point.offsetY.toString();
      if (cellsGroupByRows[rowId] === undefined) {
        cellsGroupByRows[rowId] = new Array<ICell>();
      }

      cellsGroupByRows[rowId].push(cell);
    }

    return cellsGroupByRows;
  }

  /** 将 cells 按列分组 */
  private _groupCellsByCols(cells: ICell[]): Record<string, ICell[]> {
    const cellsGroupByCols: Record<string, ICell[]> = {};
    for (const cell of cells) {
      const colId = cell.point.offsetX.toString();
      if (cellsGroupByCols[colId] === undefined) {
        cellsGroupByCols[colId] = new Array<ICell>();
      }

      cellsGroupByCols[colId].push(cell);
    }

    return cellsGroupByCols;
  }

  /** 取得指定 block 最左边一整排的 cells */
  private _getLeftCells(block: IBlock): ICell[] {
    const cellsGroupByRow: Record<string, ICell[]> = this._groupCellsByRows(block.cells);

    const leftMostCells: ICell[] = new Array<ICell>();
    for (const rowId in cellsGroupByRow) {
      const row = parseInt(rowId);
      const cellsInThisRow = cellsGroupByRow[row];
      const leftMostCellOfThisRow =
        cellsInThisRow[
          d3.minIndex(cellsInThisRow, (_cell) => _cell.point.offsetX)
        ];
      leftMostCells.push(leftMostCellOfThisRow);
    }

    return leftMostCells;
  }

  /** 取得指定 block 最右边一整排的 cells */
  private _getRightCells(block: IBlock): ICell[] {
    const cellsGroupByRow: Record<string, ICell[]> = this._groupCellsByRows(block.cells);

    const rightMostCells: ICell[] = new Array<ICell>();
    for (const rowId in cellsGroupByRow) {
      const row = parseInt(rowId);
      const cellsInThisRow = cellsGroupByRow[row];
      const rightMostCell = cellsInThisRow[d3.maxIndex(cellsInThisRow, _cell => _cell.point.offsetX)];
      rightMostCells.push(rightMostCell);
    }

    return rightMostCells;
  }

  /** 取得指定 block 最上边一整排的 cells */
  private _getTopCells(block: IBlock): ICell[] {
    const cellsGroupByCols: Record<string, ICell[]> = this._groupCellsByCols(block.cells);

    const topMostCells: ICell[] = new Array<ICell>();
    for (const colId in cellsGroupByCols) {
      const col = parseInt(colId);
      const cellsInThisCol = cellsGroupByCols[col];
      const topMostCell = cellsInThisCol[d3.minIndex(cellsInThisCol, _cell => _cell.point.offsetY)];
      topMostCells.push(topMostCell);
    }

    return topMostCells;
  }

  /** 取得指定 block 最下边一整排的 cells */
  private _getBottomCells(block: IBlock): ICell[] {
    const cellsGroupByCols: Record<string, ICell[]> = this._groupCellsByCols(block.cells);

    const bottomCells: ICell[] = new Array<ICell>();
    for (const colId in cellsGroupByCols) {
      const col = parseInt(colId);
      const cellsInThisCol = cellsGroupByCols[col];
      const bottomMostCell = cellsInThisCol[d3.maxIndex(cellsInThisCol, _cell => _cell.point.offsetY)];
      bottomCells.push(bottomMostCell);
    }

    return bottomCells;
  }

  /** 取得在当前 activeBlock 之外的 cells */
  private _getOtherCells(activeBlock: IBlock, cells: ICell[]): ICell[] {
    return cells.filter((cell) => cell.blockId !== activeBlock.id);
  }

  /** 
   * 返回一个 block 四个方向上各有多少长度的空闲空间，
   * 具体地，block 在一个方向上的空闲空间长度，是指 block 该侧所有 cell 往该方向的 gap 的最小值。
   */
  public gapsDetect(option: IGapDetectOption): IGap {
    const gaps: IGap = { left: 0, right: 0, top: 0, down: 0 };
    gaps.left = this._detectLeftGap(option);
    return gaps;
  }

  /** 返回一个 block 最左边再往左有多少空闲空间 */
  private _detectLeftGap(option: IGapDetectOption): number {
    const leftCells = this._getLeftCells(option.block);
    const otherCells = this._getOtherCells(option.block, option.board.cells);
    const gaps: number[] = [];
    for (const leftCell of leftCells) {
      const otherCellsInThisRow = otherCells.filter(_cell => _cell.point.offsetY === leftCell.point.offsetY);
      const otherCellsInThisRowLeft = otherCellsInThisRow.filter(_cell => _cell.point.offsetX <= leftCell.point.offsetX);
      const rightMost = otherCellsInThisRowLeft[d3.maxIndex(otherCellsInThisRowLeft, _cell => _cell.point.offsetX)];
      const gapInThisRow = leftCell.point.offsetX - rightMost.point.offsetX - 1;
      gaps.push(gapInThisRow);
    }

    return d3.min(gaps) ?? 0;
  }

  /** 判断一个 block 能否向指定方向移动指定长度 */
  canMove(option: IMoveDetectOption): boolean {
    return true;
  }
}
