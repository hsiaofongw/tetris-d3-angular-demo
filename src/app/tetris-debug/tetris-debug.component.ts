import { Component, Inject, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { fromEvent, Subscription } from 'rxjs';
import { BarrierDetectService } from '../barrier-detect.service';
import {
  GameBoxControlEventsDispatcher,
  GameBoxEvent,
} from '../controller/game-box-control-events-dispatcher.service';
import { KeyboardEventSource } from '../controller/keyboard-event-source.service';
import { GridDisplayComponent } from '../grid-display/grid-display.component';
import { Block } from '../helpers/block';
import { Board, GAME_BOARD } from '../helpers/board';
import { Cell } from '../helpers/cell';
import { GameBoxControl } from '../interfaces';
import { ShapePatternDetectAndRotate } from '../shape-pattern-detect-and-rotate';
import {
  ShapePrototype,
  SHAPE_PROTOTYPES,
} from '../shape-prototypes/shape-prototype';
import { RespondToTick, TickSource } from '../tick-sources/tick-source.service';

@Component({
  selector: 'app-tetris-debug',
  templateUrl: './tetris-debug.component.html',
  styleUrls: ['./tetris-debug.component.scss'],
})
export class TetrisDebugComponent
  implements GameBoxControl<GameBoxEvent>, RespondToTick
{
  @ViewChild(GridDisplayComponent) gridDisplay!: GridDisplayComponent;

  _scores = 0;
  _activeBlock?: Block;
  _keyUpSubscription?: Subscription;
  _keyUpProcedure: { [key: string]: () => void } = {};
  _tickTimer?: number;
  _blocks: Block[] = [];
  _isPaused = false;

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
    @Inject(SHAPE_PROTOTYPES) private shapeProtos: ShapePrototype[],
    @Inject(GAME_BOARD) private board: Board,
    private shapePattern: ShapePatternDetectAndRotate,
    private barrierDetectService: BarrierDetectService,
    private eventSource: KeyboardEventSource,
    private eventDispatcher: GameBoxControlEventsDispatcher,
    private tickSource: TickSource
  ) {}

  onGameBoxUp(): void {
    this._activeBlockMoveUpStep();
  }

  onGameBoxRotate(): void {
    this._rotate();
  }

  onGameBoxDown(): void {
    this._activeBlockMoveDownOneStep();
  }

  onGameBoxLeft(): void {
    this._activeBlockMoveOneLeftStep();
  }

  onGameBoxRight(): void {
    this._activeBlockMoveOneRightStep();
  }

  onGameBoxReset(): void {
    this._reset();
  }

  onGameBoxNew(): void {
    this._addRandomBlockToScreen();
  }

  onGameBoxTogglePause(): void {
    this._isPaused = !this._isPaused;
  }

  onGameBoxDelete(): void {
    if (this._activeBlock) {
      this.board.detachBlock(this._activeBlock);
      this._blocks = this._blocks.filter(
        (_block) => _block !== this._activeBlock
      );
      this._d3Update();
    }
  }

  onGameBoxFall(): void {
    this._fall();
  }

  onGameBoxActiveBlockFall(): void {
    this._activeBlockFall();
  }

  /** 重置游戏状态 */
  _reset(): void {
    this._clearAllBlocks(() => {
      this._activeBlock = undefined;
      this.board.reset();
      if (this.gridDisplay !== undefined) {
        this._d3Update();
      }
      this._blocks = new Array<Block>();
    });
  }

  /** 清空所有方块 */
  _clearAllBlocks(onComplete: () => void): void {
    if (this._blocks.length === 0) {
      onComplete();
      return;
    }

    const _block = this._blocks.shift() as Block;
    this.board.detachBlock(_block);
    if (this.gridDisplay !== undefined) {
      this._d3Update();
    }

    window.setTimeout(() => this._clearAllBlocks(() => onComplete()), 0);
  }

  /** 让所有方块做自由落体 */
  _fall(): void {
    const getBlocksInAir = () =>
      this._blocks.filter((_block) =>
        this.barrierDetectService.canMove({
          move: { direction: 'down', steps: 1 },
          block: _block,
          board: this.board,
        })
      );

    let blocksInAir = getBlocksInAir();
    if (blocksInAir.length === 0) {
      return;
    }

    blocksInAir.forEach((block) => {
      block.down();
      this._d3Update();
    });

    window.setTimeout(() => this._fall(), 0);
  }

  /** 让当前 activeBlock 自由落体 */
  _activeBlockFall(): void {
    if (!this._activeBlock) {
      return;
    }

    const activeBlock = this._activeBlock;
    if (
      !this.barrierDetectService.canMove({
        move: { direction: 'down', steps: 1 },
        block: activeBlock,
        board: this.board,
      })
    ) {
      return;
    }

    activeBlock.down();
    this._d3Update();
    window.setTimeout(() => this._activeBlockFall(), 0);
  }

  /** 尝试消去整行的块 */
  _tryEliminate(): void {
    let targetCells: Cell[] = [];
    for (let rowIdx = 0; rowIdx < this.nRows; rowIdx++) {
      const cells = this.board.cells.filter(
        (cell) => cell.point.offsetY === rowIdx
      );

      if (cells.length === this.nCols) {
        targetCells = cells;
        break;
      }
    }

    if (targetCells.length) {
      targetCells.forEach((cell) => {
        this.board.deleteCell(cell.id);
        this._blocks.forEach((_block) => _block.deleteCell(cell.id));
      });
      this._d3Update();
      this._scores += this.nCols;
      this.board.cells
          .filter((cell) => cell.point.offsetY < targetCells[0].point.offsetY)
          .forEach((cell) => cell.down());
      this._d3Update();
      this._prune();

      window.setTimeout(() => this._tryEliminate(), 0);
    }
  }

  ngOnInit(): void {
    this._muteSpecialKeys();
    this.eventSource.plug(this.eventDispatcher);
    this.eventDispatcher.plug<GameBoxEvent>(this);
    this.tickSource.plug(this);
    this._reset();
  }

  /** 屏蔽特定功能按键 */
  _muteSpecialKeys(): void {
    fromEvent(window.document, 'keydown').subscribe(e => {
      if (e instanceof KeyboardEvent) {
        const keysToMute = new Set<string>();
        keysToMute.add(' ');
        keysToMute.add('Tab');

        if (keysToMute.has(e.key)) {
          e.preventDefault();
        }
      }
    });
  }

  /** 删除所有空的 block */
  _prune(): void {
    const emptyBlockIds = this._blocks
      .filter((_block) => _block.cells.length === 0)
      .map((_block) => _block.id);
    emptyBlockIds.forEach((_blockId) => {
      const _blockIndex = this._blocks.findIndex(
        (_block) => _block.id === _blockId
      );
      if (_blockIndex !== -1) {
        this._blocks.splice(_blockIndex, 1);
      }
    });
  }

  tick(): Promise<void> {
    return new Promise((resolve) => {
      const todo = () => {
        
        if (this._isPaused) {
          window.setTimeout(() => todo(), 0);
          return;
        }

        if (this._activeBlock === undefined) {
          this._addRandomBlockToScreen();
          resolve();
          return;
        }
  
        const activeBlock = this._activeBlock;
        const canMove = this.barrierDetectService.canMove({
          move: { direction: 'down', steps: 1 },
          block: activeBlock,
          board: this.board,
        });
        if (canMove) {
          activeBlock.down();
          this._d3Update();
          resolve();
          return;
        }
  
        this._activeBlock = undefined;
        this._tryEliminate();
        resolve();
      };

      todo();
    });
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

  /** 刷新显示，也就是说让视图和数据同步，或者说就是把数据同步到视图上 */
  private _d3Update(): void {
    if (this.gridDisplay) {
      this.gridDisplay.update();
    }
  }

  /** 随机产生一个形状随机的 block, 然后把这个刚随机产生的 block 置为 activeBlock */
  private _addRandomBlockToScreen(): void {
    const protoIdx = d3.randomInt(0, this.shapeProtos.length)();
    const proto = this.shapeProtos[protoIdx];
    const block = this.board.getBlock(proto);
    this.board.attachBlock(block);

    this._d3Update();
    this._activeBlock = block;
    this._blocks.push(block);
  }

  /** 尝试将当前 activeBlock 向上移动一个单位，一般仅在 debug 模式进行此操作 */
  private _activeBlockMoveUpStep(): void {
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

  /** 尝试将当前 activeBlock 向左移动一个单位 */
  private _activeBlockMoveOneLeftStep(): void {
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

  /** 尝试将当前 activeBlock 向右移动一个单位 */
  private _activeBlockMoveOneRightStep(): void {
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

  /** 尝试将当前 activeBlock 向下移动一个单位 */
  _activeBlockMoveDownOneStep(): void {
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

  /** 响应鼠标点击 cell 事件 */
  public handleCellClick(cell: Cell): void {
    const block = this._blocks.find((_block) => _block.id === cell.blockId);
    if (block !== undefined) {
      this._activeBlock = block;
      this._showFreeGaps();
    }
  }

  /** 切换当前 activeBlock 为下一个 */
  private _switchActiveBlockToNext(): void {
    const currentActiveBlockIdx = this._blocks.findIndex(
      (_block) => _block.id === this._activeBlock?.id
    );
    if (currentActiveBlockIdx !== -1) {
      const nextBlockIdx = (currentActiveBlockIdx + 1) % this._blocks.length;
      const nextBlock = this._blocks[nextBlockIdx];
      this._activeBlock = nextBlock;
    }
  }

  /** 在控制台打印当前 activeBlock 四个方向上的空余空间有多少 */
  private _showFreeGaps(): void {
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
