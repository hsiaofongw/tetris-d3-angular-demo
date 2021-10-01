import { Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { fromEvent, Subscription } from 'rxjs';
import * as uuid from 'uuid';

type Point = { offsetX: number; offsetY: number };
type Shape = Point[];
type Cell = { id: string; point: Point; blockId?: string };
type Block = {
  id: string;
  offsetX: number;
  offsetY: number;
  cells: Cell[];
};

type BoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

type BlockMove = {
  direction: 'up' | 'left' | 'right' | 'down';
  steps: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  nCols = 20;
  nRows = 20;
  colPercentage = (1 / this.nCols) * 100;
  rowPercentage = (1 / this.nRows) * 100;
  tickPeriodMs = 500;

  @ViewChild('svgElement', { read: ElementRef })
  _svgElementRef!: ElementRef<HTMLElement>;

  _cells: Cell[] = [];

  _activeBlock?: Block;

  _keyUpSubscription?: Subscription;

  _keyUpProcedure: { [key: string]: () => void } = {};

  _tickTimer?: number;

  ngOnInit(): void {
    this._keyUpSubscription = fromEvent(document, 'keyup').subscribe((e) => {
      if (e instanceof KeyboardEvent) {
        this._handleKeyUp(e.key);
      }
    });

    this._registerKeyUpProcedure('s', () => this._handleSKeyUp());
    this._registerKeyUpProcedure('a', () => this._handleAKeyUp());
    this._registerKeyUpProcedure('d', () => this._handleDKeyUp());

    this._startTicking();
  }

  _startTicking(): void {
    const tick = () => {
      this._doItOnTick();
      this._tickTimer = window.setTimeout(() => tick(), this.tickPeriodMs);
    };

    this._tickTimer = window.setTimeout(() => tick(), this.tickPeriodMs);
  }

  _doItOnTick(): void {
    this._activeBlockMoveOneStep();

    if (this._activeBlock === undefined) {
      this._addRandomBlockToScreen();
    }
  }

  _stopTicking(): void {
    if (this._tickTimer) {
      window.clearTimeout(this._tickTimer);
    }
  }

  _handleSKeyUp(): void {
    this._activeBlockMoveOneStep();
  }

  _handleAKeyUp(): void {
    this._activeBlockMoveOneLeftStep();
  }

  _handleDKeyUp(): void {
    this._activeBlockMoveOneRightStep();
  }

  private _registerKeyUpProcedure(key: string, fn: () => void): void {
    this._keyUpProcedure[key] = fn;
  }

  private _getShapes(): Shape[] {
    const straight: Shape = [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
      { offsetX: 3, offsetY: 0 },
    ];

    const square: Shape = [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
    ];

    const tMinus: Shape = [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
    ];

    const lMinus: Shape = [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 2 },
      { offsetX: 1, offsetY: 2 },
    ];

    const skew: Shape = [
      { offsetX: 0, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
    ];

    const candidateShapes: Shape[] = [straight, square, tMinus, lMinus, skew];

    return candidateShapes;
  }

  private _getRandomShape(): Shape {
    const shapes = this._getShapes();
    const choose = d3.randomInt(0, shapes.length);
    return shapes[choose()];
  }

  private _getBoundingBox(shape: Shape): BoundingBox {
    const xOffsets = shape.map((point) => point.offsetX);
    const yOffsets = shape.map((point) => point.offsetY);
    const minX = Math.min(...xOffsets);
    const maxX = Math.max(...xOffsets);
    const minY = Math.min(...yOffsets);
    const maxY = Math.max(...yOffsets);
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  private _d3Update(): void {
    d3.select(this._svgElementRef.nativeElement)
      .selectAll('rect')
      .data(this._cells)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('fill', '#FFF')
            .attr('stroke', '#000')
            .attr('x', (d) => `${d.point.offsetX * this.colPercentage}%`)
            .attr('y', (d) => `${d.point.offsetY * this.rowPercentage}%`)
            .attr('width', this.colPercentage + '%')
            .attr('height', this.rowPercentage + '%'),
        (update) =>
          update
            .attr('x', (d) => `${d.point.offsetX * this.colPercentage}%`)
            .attr('y', (d) => `${d.point.offsetY * this.rowPercentage}%`),
        (exit) => exit.remove()
      );
  }

  _getRandomBlock() {
    const shape = this._getRandomShape();
    const blockId = uuid.v4();
    const blockBoundingBox = this._getBoundingBox(shape);
    const blockWidth = blockBoundingBox.width;
    const maximumAllowXOffset = this.nCols - blockWidth;
    const getBlockOffsetX = d3.randomInt(0, maximumAllowXOffset);
    const blockOffsetX = getBlockOffsetX();

    const block: Block = {
      id: blockId,
      offsetX: blockOffsetX,
      offsetY: 0,
      cells: shape.map((point) => ({ id: uuid.v4(), point: point })),
    };

    block.cells.forEach((cell) => (cell.blockId = blockId));

    return block;
  }

  _addRandomBlockToScreen(): void {
    const block = this._getRandomBlock();
    block.cells.forEach(
      (cell) => (cell.point.offsetX = block.offsetX + cell.point.offsetX)
    );
    block.cells.forEach((cell) => this._cells.push(cell));
    this._d3Update();
    this._activeBlock = block;
  }

  _moveBlock(block: Block, move: BlockMove): void {
    block.cells.forEach((cell) => {
      if (move.direction === 'down') {
        this._pointDown(cell.point, move.steps);
      }

      if (move.direction === 'right') {
        this._pointRight(cell.point, move.steps);
      }

      if (move.direction === 'left') {
        this._pointLeft(cell.point, move.steps);
      }

      if (move.direction === 'up') {
        this._pointUp(cell.point, move.steps);
      }
    });

    this._d3Update();
  }

  _pointRight(point: Point, steps: number): void {
    point.offsetX = point.offsetX + steps;
  }

  _pointDown(point: Point, steps: number): void {
    point.offsetY = point.offsetY + steps;
  }

  _pointLeft(point: Point, steps: number): void {
    point.offsetX = point.offsetX - steps;
  }

  _pointUp(point: Point, steps: number): void {
    point.offsetY = point.offsetY - steps;
  }

  _handleKeyUp(key: string): void {
    const fn = this._keyUpProcedure[key];
    if (fn !== undefined) {
      fn();
    }
  }

  _hasBarrierInLeft(): boolean {
    if (!this._activeBlock) {
      return false;
    }

    const cells = this._activeBlock.cells;
    const box = this._getBoundingBox(cells.map((cell) => cell.point));

    if (box.minX === 0) {
      return true;
    }

    const blockId = this._activeBlock.id;
    const otherCells = this._cells.filter((_cell) => _cell.blockId !== blockId);
    for (const cell of cells) {
      for (const _cell of otherCells) {
        if (
          _cell.point.offsetX === cell.point.offsetX - 1 &&
          _cell.point.offsetY === cell.point.offsetY
        ) {
          return true;
        }
      }
    }

    return false;
  }

  _hasBarrierInRight(): boolean {
    if (!this._activeBlock) {
      return false;
    }

    const cells = this._activeBlock.cells;
    const box = this._getBoundingBox(cells.map((cell) => cell.point));

    if (box.maxX === this.nCols - 1) {
      return true;
    }

    const blockId = this._activeBlock.id;
    const otherCells = this._cells.filter((_cell) => _cell.blockId !== blockId);
    for (const cell of cells) {
      for (const _cell of otherCells) {
        if (
          _cell.point.offsetX === cell.point.offsetX + 1 &&
          _cell.point.offsetY === cell.point.offsetY
        ) {
          return true;
        }
      }
    }

    return false;
  }

  _hasBarrierInBottom(): boolean {
    if (!this._activeBlock) {
      return false;
    }

    const cells = this._activeBlock.cells;
    const box = this._getBoundingBox(cells.map((cell) => cell.point));

    for (const cell of cells) {
      for (const _cell of this._cells) {
        if (
          _cell.blockId !== this._activeBlock.id &&
          _cell.point.offsetX === cell.point.offsetX &&
          _cell.point.offsetY === cell.point.offsetY + 1
        ) {
          return true;
        }
      }
    }

    if (box.maxY === this.nRows - 1) {
      return true;
    }

    return false;
  }

  _activeBlockMoveOneLeftStep(): void {
    if (this._hasBarrierInLeft()) {
      return;
    }

    if (this._activeBlock) {
      this._moveBlock(this._activeBlock, { direction: 'left', steps: 1 });
    }
  }

  _activeBlockMoveOneRightStep(): void {
    if (this._hasBarrierInRight()) {
      return;
    }

    if (this._activeBlock) {
      this._moveBlock(this._activeBlock, { direction: 'right', steps: 1 });
    }
  }

  _activeBlockMoveOneStep(): void {
    if (this._hasBarrierInBottom()) {
      this._activeBlock = undefined;
      return;
    }

    if (this._activeBlock) {
      this._moveBlock(this._activeBlock, { direction: 'down', steps: 1 });
    }
  }

  ngOnDestroy(): void {
    this._stopTicking();
  }
}
