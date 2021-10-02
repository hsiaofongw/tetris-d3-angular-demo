import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { fromEvent, Subscription } from 'rxjs';
import * as uuid from 'uuid';
import {
  Block,
  BlockMove,
  Board,
  BoundingBox,
  Cell,
  Point,
  Shape,
} from './interfaces';
import { ShapePatternDetectAndRotate } from './shape-pattern-detect-and-rotate';
import {
  ShapePrototype,
  SHAPE_PROTOTYPES,
} from './shape-prototypes/shape-prototype';

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

  _scores = 0;

  _cells: Cell[] = [];

  __activeBlock?: Block;

  get _activeBlock(): Block | undefined { return this.__activeBlock; }

  set _activeBlock(value: Block | undefined) { 
    this.__activeBlock = value 

    if (value === undefined) {
      this._tryEliminate();
    }
  }

  _keyUpSubscription?: Subscription;

  _keyUpProcedure: { [key: string]: () => void } = {};

  _tickTimer?: number;

  readonly board: Board = {
    nCols: this.nCols,
    nRows: this.nRows,
    cells: this._cells,
  };

  constructor(
    @Inject(SHAPE_PROTOTYPES) private shapePrototypes: ShapePrototype[],
    private shapePattern: ShapePatternDetectAndRotate
  ) {}

  /** 尝试消去整行的块 */
  _tryEliminate(): void {
    const cellsGroupByRows: Cell[][] = [];
    for (let i = 0; i < this.nRows; i++) {
      cellsGroupByRows.push(this._cells.filter(_cell => _cell.point.offsetY === i));
    }

    const cellIds = new Set<string>();
    for (let i = 0; i < this.nRows; i++) {
      const row = cellsGroupByRows[i];
      if (row.length === this.nCols) {
        for (const cell of row) {
          cellIds.add(cell.id);
        }

        this._cells.filter(_cell => _cell.point.offsetY < i).forEach(_cell => _cell.point.offsetY = _cell.point.offsetY+1);
      }
    }

    this._cells = this._cells.filter(_cell => !cellIds.has(_cell.id));
    this._scores += cellIds.size;
  }

  ngOnInit(): void {
    this._keyUpSubscription = fromEvent(document, 'keyup').subscribe((e) => {
      if (e instanceof KeyboardEvent) {
        this._handleKeyUp(e.key);
      }
    });

    this._registerKeyUpProcedure('s', () => this._handleSKeyUp());
    this._registerKeyUpProcedure('a', () => this._handleAKeyUp());
    this._registerKeyUpProcedure('d', () => this._handleDKeyUp());
    this._registerKeyUpProcedure('w', () => this._handleWKeyUp());

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

  _handleWKeyUp(): void {
    this._rotate();
  }

  private _rotate(): void {
    // window.console.log('pressed rotate key');
    // 如果没有 activeBlock 则不 rotate
    if (!this._activeBlock) {
      return;
    }

    // 如果 rotate 不了则不 rotate
    if (!this.shapePattern.canRotate(this._activeBlock, this.board)) {
      // window.console.log('cant rotate')
      return;
    }

    // 可以 rotate
    // window.console.log('ok to rotate');
    this.shapePattern.rotate(this._activeBlock, this.board);
    this._d3Update();
  }

  private _registerKeyUpProcedure(key: string, fn: () => void): void {
    this._keyUpProcedure[key] = fn;
  }

  private _getShapes(): ShapePrototype[] {
    return this.shapePrototypes;
  }

  private _getRandomShape(): Shape {
    const shapes = this._getShapes();
    const choose = d3.randomInt(0, shapes.length);
    const chooseShape = shapes[choose()];

    // window.console.log({choose: chooseShape});

    return chooseShape.getShape();
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
            .attr('fill', '#BBD0D6')
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

  /** 判断左侧一格空间内是否有障碍物 */
  _hasBarrierInLeft(): boolean {
    if (!this._activeBlock) {
      return false;
    }

    return !this.shapePattern.gapDetect(
      this._activeBlock,
      { left: 1, top: 0, down: 0, right: 0 },
      this.board
    );
  }

  /** 判断右侧一格空间内是否有障碍物 */
  _hasBarrierInRight(): boolean {
    if (!this._activeBlock) {
      return false;
    }

    return !this.shapePattern.gapDetect(
      this._activeBlock,
      { left: 0, right: 1, down: 0, top: 0 },
      this.board
    );
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
    this._keyUpSubscription?.unsubscribe();
  }
}
