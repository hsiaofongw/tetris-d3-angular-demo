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
  block: IBlock;
  board: IBoard;
};

export type IGapDetectOption = { block: IBlock; board: IBoard };
