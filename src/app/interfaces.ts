export type Point = { offsetX: number; offsetY: number };
export type Shape = Point[];
export type Cell = { id: string; point: Point; blockId?: string };
export type Block = {
  id: string;
  offsetX: number;
  offsetY: number;
  cells: Cell[];
};

export type BoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

export type BlockMove = {
  direction: 'up' | 'left' | 'right' | 'down';
  steps: number;
};

export type Gap = { left: number; top: number; right: number; down: number };

export type Board = { nCols: number, nRows: number, cells: Cell[] };
