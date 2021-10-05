import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Block } from './helpers/block';
import {
  IBlock,
  IMoveDetectOption,
  ICell,
  IGap,
  IGapDetectOption,
  IFreeGapDetectOption,
  IBlockMove,
} from './interfaces';

/**
 * 提供 barrier 和 gap 检测服务，
 * 分为两个主要功能：barrier 检测和 gap 检测：
 *
 * 1) barrier 检测主要来自在进行左、右、下方向的移动时，需要判断这样一个移动是否可以进行，
 * 例如说，当有方块阻挡时，一个移动不可以进行，当移动会使方块移动到屏幕外时，移动不可以进行。
 *
 * 2) gap 检测主要来自旋转时，对周围空间面积数的判断需求，因为有些旋转操作需要周围有足够空间时才可以进行。
 */
@Injectable({
  providedIn: 'root',
})
export class BarrierDetectService {
  /** 取得在当前 activeBlock 之外的 cells */
  private _getOtherCells(activeBlock: IBlock, cells: ICell[]): ICell[] {
    return cells.filter((cell) => cell.blockId !== activeBlock.id);
  }

  /**
   * 返回一个 block 四个方向上各有多少长度的空闲空间，
   * 具体的计算方式是：构造一个包围这个块的最小矩形，然后看这个矩形能够往上下左右四个方向各移动几个长度单位。
   */
  public gapsDetect(option: IGapDetectOption): IGap {
    const gap: IGap = { left: 0, right: 0, top: 0, down: 0 };
    const block = option.block;
    const board = option.board;

    const rangeDetect = (_block: Block) =>
      !board.isOverlap(_block) && !board.isOutOfRange(_block);

    let wrapBlock = block.getMinimumWrapBlock();
    board.detachBlock(block);
    while (rangeDetect(wrapBlock)) {
      gap.left = gap.left + 1;
      wrapBlock.left();
    }

    board.detachBlock(wrapBlock);
    wrapBlock = block.getMinimumWrapBlock();
    while (rangeDetect(wrapBlock)) {
      gap.right = gap.right + 1;
      wrapBlock.right();
    }

    board.detachBlock(wrapBlock);
    wrapBlock = block.getMinimumWrapBlock();
    while (rangeDetect(wrapBlock)) {
      gap.top = gap.top + 1;
      wrapBlock.up();
    }

    board.detachBlock(wrapBlock);
    wrapBlock = block.getMinimumWrapBlock();
    while (rangeDetect(wrapBlock)) {
      gap.down = gap.down + 1;
      wrapBlock.down();
    }

    board.detachBlock(wrapBlock);
    board.attachBlock(block);

    gap.left -= 1;
    gap.top -= 1;
    gap.right -= 1;
    gap.down -= 1;

    return gap;
  }

  /** 判断一个 block 能否向指定方向移动指定长度 */
  public canMove(option: IMoveDetectOption): boolean {
    const direction = option.move.direction;
    const steps = option.move.steps;
    const block = option.block;
    const board = option.board;

    let tempBlock = block.clone();
    board.detachBlock(block);
    board.attachBlock(tempBlock);

    const stepperMap: {
      [Property in IBlockMove['direction']]: (_block: Block) => void;
    } = {
      left: (_block) => _block.left(),
      up: (_block) => _block.up(),
      right: (_block) => _block.right(),
      down: (_block) => _block.down(),
    };

    const stepper = stepperMap[direction];
    
    let can = true;

    for (let step = 0; step < steps; step++) {
      stepper(tempBlock);
      if (board.isOverlap(tempBlock)) {
        can = false;
        break;
      }

      if (board.isOutOfRange(tempBlock)) {
        can = false;
        break;
      }
    }

    board.detachBlock(tempBlock);
    board.attachBlock(block);

    return can;
  }

  /** 判断一个 block 周围是否有足够多的 gap, 如果有则返回 true, 否则返回 false */
  public freeGapDetect(option: IFreeGapDetectOption): boolean {
    const freeGap = this.gapsDetect(option);
    return (
      freeGap.left >= option.gap.left &&
      freeGap.top >= option.gap.top &&
      freeGap.right >= option.gap.right &&
      freeGap.down >= option.gap.down
    );
  }
}
