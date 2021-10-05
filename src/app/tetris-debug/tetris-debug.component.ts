import { Component, Inject, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { fromEvent, Subscription } from 'rxjs';
import { BarrierDetectService } from '../barrier-detect.service';
import { GridDisplayComponent } from '../grid-display/grid-display.component';
import { Block } from '../helpers/block';
import { Board, GAME_BOARD } from '../helpers/board';
import { Cell } from '../helpers/cell';
import { Point } from '../helpers/point';
import { IBlockMove, IBoundingBox, ICell, IGap, IShape } from '../interfaces';
import { ShapePatternDetectAndRotate } from '../shape-pattern-detect-and-rotate';
import {
  ShapePrototype,
  SHAPE_PROTOTYPES,
} from '../shape-prototypes/shape-prototype';
import { TickGenerator } from '../ticks/tick-generator';

@Component({
  selector: 'app-tetris-debug',
  templateUrl: './tetris-debug.component.html',
  styleUrls: ['./tetris-debug.component.scss'],
})
export class TetrisDebugComponent {
  @ViewChild(GridDisplayComponent) gridDisplay!: GridDisplayComponent;

  tickPeriodMs = 500;

  _scores = 0;

  __activeBlock?: Block;

  get _activeBlock(): Block | undefined {
    return this.__activeBlock;
  }

  set _activeBlock(value: Block | undefined) {
    this.__activeBlock = value;

    if (value === undefined) {
      this._tryEliminate();
    }
  }

  _keyUpSubscription?: Subscription;

  _keyUpProcedure: { [key: string]: () => void } = {};

  _tickTimer?: number;

  _isPaused = false;

  _blocks: Block[] = [];

  get nRows(): number {
    return this.board.nRows;
  }
  get nCols(): number {
    return this.board.nCols;
  }
  get _cells(): Cell[] {
    return this.board.cells;
  }

  constructor(
    @Inject(SHAPE_PROTOTYPES) private shapePrototypes: ShapePrototype[],
    @Inject(GAME_BOARD) private board: Board,
    private shapePattern: ShapePatternDetectAndRotate,
    private barrierDetectService: BarrierDetectService
  ) {}

  _reset(): void {
    this._activeBlock = undefined;
    this.board.reset();
    // this._d3Update();
  }

  /** 尝试消去整行的块 */
  _tryEliminate(): void {
    const cellsGroupByRows: ICell[][] = [];
    for (let i = 0; i < this.board.nRows; i++) {
      cellsGroupByRows.push(
        this._cells.filter((_cell) => _cell.point.offsetY === i)
      );
    }

    const cellIds = new Set<string>();
    for (let i = 0; i < this.board.nRows; i++) {
      const row = cellsGroupByRows[i];
      if (row.length === this.board.nCols) {
        for (const cell of row) {
          cellIds.add(cell.id);
        }

        this._cells
          .filter((_cell) => _cell.point.offsetY < i)
          .forEach((_cell) => _cell.down());
      }
    }

    for (const id of cellIds) {
      this.board.deleteCell(id);
    }
    this._scores += cellIds.size;
  }

  ngOnInit(): void {
    this._reset();

    fromEvent(document, 'keydown').subscribe((e) => {
      if (e instanceof KeyboardEvent && e.key === 'Tab') {
        e.preventDefault();
      }
    });

    this._keyUpSubscription = fromEvent(document, 'keyup').subscribe((e) => {
      if (e instanceof KeyboardEvent) {
        this._handleKeyUp(e.key);
      }
    });

    this._registerKeyUpProcedure('s', () => this._handleSKeyUp());
    this._registerKeyUpProcedure('a', () => this._handleAKeyUp());
    this._registerKeyUpProcedure('d', () => this._handleDKeyUp());
    this._registerKeyUpProcedure('w', () => this._handleWKeyUp());
    this._registerKeyUpProcedure('ArrowUp', () => this._handleWKeyUp());
    this._registerKeyUpProcedure('ArrowLeft', () => this._handleAKeyUp());
    this._registerKeyUpProcedure('ArrowRight', () => this._handleDKeyUp());
    this._registerKeyUpProcedure('ArrowDown', () => this._handleSKeyUp());
    this._registerKeyUpProcedure(' ', () => this._handleSpaceKeyUp());
    this._registerKeyUpProcedure('r', () => this._reset());
    this._registerKeyUpProcedure('n', () => this._addRandomBlockToScreen());
    this._registerKeyUpProcedure('k', () => this._activeBlockMoveUpStep());
    this._registerKeyUpProcedure('h', () =>
      this._activeIBlockMoveOneLeftStep()
    );
    this._registerKeyUpProcedure('j', () => this._activeIBlockMoveOneStep());
    this._registerKeyUpProcedure('l', () =>
      this._activeIBlockMoveOneRightStep()
    );
    this._registerKeyUpProcedure('Tab', () => this._switchActiveBlockToNext());
  }

  /** 响应空格键 */
  _handleSpaceKeyUp(): void {
    this._isPaused = !this._isPaused;
  }

  /** 响应 S 键和下箭头键 */
  _handleSKeyUp(): void {
    this._activeIBlockMoveOneStep();
  }

  /** 响应 A 键和左箭头键 */
  _handleAKeyUp(): void {
    this._activeIBlockMoveOneLeftStep();
  }

  /** 响应 D 键和右箭头键 */
  _handleDKeyUp(): void {
    this._activeIBlockMoveOneRightStep();
  }

  /** 响应 W 键和上箭头键 */
  _handleWKeyUp(): void {
    this._rotate();
  }

  /** 顺时针 90 度旋转 */
  private _rotate(): void {
    if (!this._activeBlock) {
      return;
    }

    if (!this.shapePattern.canRotate(this._activeBlock, this.board)) {
      return;
    }

    this.shapePattern.rotate(this._activeBlock, this.board);
    this._d3Update();
  }

  /** 注册按键响应回调 */
  private _registerKeyUpProcedure(key: string, fn: () => void): void {
    this._keyUpProcedure[key] = fn;
  }

  private _getShapes(): ShapePrototype[] {
    return this.shapePrototypes;
  }

  private _getRandomShape(): IShape {
    const shapes = this._getShapes();
    const choose = d3.randomInt(0, shapes.length);
    const chooseShape = shapes[choose()];

    return chooseShape.getShape();
  }

  private _getBoundingBox(shape: IShape): IBoundingBox {
    const xOffsets = shape.map((point) => point.offsetX);
    const yOffsets = shape.map((point) => point.offsetY);
    const minX = Math.min(...xOffsets);
    const maxX = Math.max(...xOffsets);
    const minY = Math.min(...yOffsets);
    const maxY = Math.max(...yOffsets);
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  private _d3Update(): void {
    this.gridDisplay.update();
  }

  _getRandomBlock() {
    const shape = this._getRandomShape();
    const blockBoundingBox = this._getBoundingBox(shape);
    const blockWidth = blockBoundingBox.width;
    const maximumAllowXOffset = this.board.nCols - blockWidth;
    const getBlockOffsetX = d3.randomInt(0, maximumAllowXOffset);
    const initialBlockOffsetX = getBlockOffsetX();

    const cells = shape.map((_point) => Cell.create(Point.create(_point)));
    cells.forEach((cell) => {
      for (let i = 0; i < initialBlockOffsetX; i++) {
        cell.right();
      }
    });
    const block = Block.create(cells);
    return block;
  }

  _addRandomBlockToScreen(): void {
    const block = this._getRandomBlock();
    block.cells.forEach((cell) => this.board.addCell(cell));

    this._d3Update();
    this._activeBlock = block;
    this._blocks.push(block);
  }

  _moveBlock(block: Block, move: IBlockMove): void {
    const handlerMap: { [Property in IBlockMove['direction']]: () => void } = {
      left: () => block.cells.forEach((cell) => cell.left()),
      right: () => block.cells.forEach((cell) => cell.right()),
      down: () => block.cells.forEach((cell) => cell.down()),
      up: () => block.cells.forEach((cell) => cell.up()),
    };
    handlerMap[move.direction]();
    this._d3Update();
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

    if (box.maxY === this.board.nRows - 1) {
      return true;
    }

    return false;
  }

  _activeBlockMoveUpStep(): void {
    if (
      this._activeBlock &&
      this.barrierDetectService.canMove({
        move: { direction: 'up', steps: 1 },
        block: this._activeBlock,
        board: this.board,
      })
    ) {
      this._activeBlock.up();
      this._d3Update();
    }
  }

  _activeIBlockMoveOneLeftStep(): void {
    if (
      this._activeBlock &&
      this.barrierDetectService.canMove({
        move: { direction: 'left', steps: 1 },
        block: this._activeBlock,
        board: this.board,
      })
    ) {
      this._activeBlock.left();
      this._d3Update();
    }
  }

  _activeIBlockMoveOneRightStep(): void {
    if (
      this._activeBlock &&
      this.barrierDetectService.canMove({
        move: { direction: 'right', steps: 1 },
        block: this._activeBlock,
        board: this.board,
      })
    ) {
      this._activeBlock.right();
      this._d3Update();
    }
  }

  _activeIBlockMoveOneStep(): void {
    if (
      this._activeBlock &&
      this.barrierDetectService.canMove({
        move: { direction: 'down', steps: 1 },
        block: this._activeBlock,
        board: this.board,
      })
    ) {
      this._activeBlock.down();
      this._d3Update();
    }
  }

  ngOnDestroy(): void {
    this._keyUpSubscription?.unsubscribe();
  }

  handleCellClick(cell: Cell): void {
    const block = this._blocks.find((_block) => _block.id === cell.blockId);
    if (block !== undefined) {
      this._activeBlock = block;
      this._showFreeGaps();
    }
  }

  /** 切换当前 activeBlock 为下一个 */
  _switchActiveBlockToNext(): void {
    const currentActiveBlockIdx = this._blocks.findIndex(
      (_block) => _block.id === this._activeBlock?.id
    );
    if (currentActiveBlockIdx !== -1) {
      const nextBlockIdx = (currentActiveBlockIdx + 1) % this._blocks.length;
      const nextBlock = this._blocks[nextBlockIdx];
      this._activeBlock = nextBlock;
    }
  }

  _showFreeGaps(): void {
    if (this._activeBlock !== undefined) {
      const block = this._activeBlock;
      const gaps = this.barrierDetectService.gapsDetect({
        block,
        board: this.board,
      });
      ({
        board: this.board,
        block,
        gaps,
        geometry: block.getGeometry(),
      });
    }
  }
}
