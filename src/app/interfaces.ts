import { Block } from './helpers/block';
import { Board } from './helpers/board';

export type IPoint = { offsetX: number; offsetY: number };
export type IShape = IPoint[];
export type ICell = { id: string; point: IPoint; blockId?: string };
export type IBlock = {
  id: string;
  cells: ICell[];
};

export type IBoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

export type IBlockMove = {
  direction: 'up' | 'left' | 'right' | 'down';
  steps: number;
};

export type IGap = { left: number; top: number; right: number; down: number };

export type IBoard = { nRows: number; nCols: number; cells: ICell[] };

export type IMoveDetectOption = {
  move: IBlockMove;
  block: Block;
  board: Board;
};

export type IGapDetectOption = { block: Block; board: Board };

/** 用于描述一个 block 的几何性质 */
export type IGeometry = {
  /** 左上角的块的位置 x */
  offsetX: number;

  /** 左上角的块的位置 y */
  offsetY: number;

  /** 包围这个块的最小矩形的宽度 */
  width: number;

  /** 包围这个块的最小矩形的高度 */
  height: number;
};

/** 判断一个 block 周围是否有足够多多 gap */
export type IFreeGapDetectOption = { block: Block; board: Board; gap: IGap };
