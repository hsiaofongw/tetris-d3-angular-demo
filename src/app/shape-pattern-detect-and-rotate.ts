import { Inject, Injectable } from '@angular/core';
import { BarrierDetectService } from './barrier-detect.service';
import { Block } from './helpers/block';
import { Board } from './helpers/board';
import { IBlock, IBoard, IGap, IPoint, IShape } from './interfaces';
import {
  ShapePrototype,
  SHAPE_PROTOTYPES,
} from './shape-prototypes/shape-prototype';

@Injectable()
export class ShapePatternDetectAndRotate {
  /** 旋转法则，每一种形状对应的下一种形状 */
  public readonly rotateRules: Record<string, string> = {
    a1: 'a2',
    a2: 'a3',
    a3: 'a4',
    a4: 'a1',
    b1: 'b2',
    b2: 'b3',
    b3: 'b4',
    b4: 'b1',
    c1: 'c2',
    c2: 'c3',
    c3: 'c4',
    c4: 'c1',
    d1: 'd2',
    d2: 'd3',
    d3: 'd4',
    d4: 'd1',
    e1: 'e2',
    e2: 'e3',
    e3: 'e4',
    e4: 'e1',
    f1: 'f2',
    f2: 'f3',
    f3: 'f4',
    f4: 'f1',
    g1: 'g2',
    g2: 'g3',
    g3: 'g4',
    g4: 'g1',
  };

  /** 旋转限制，旋转时所需要的附近的空间数量 */
  public readonly gapRequres: Record<string, IGap> = {
    a1: { top: 2, down: 1, left: 0, right: 0 },
    a2: { top: 0, down: 0, left: 2, right: 1 },
    a3: { top: 2, down: 1, left: 0, right: 0 },
    a4: { top: 0, down: 0, left: 2, right: 1 },

    b1: { left: 0, right: 0, top: 1, down: 0 },
    b2: { left: 0, right: 1, top: 0, down: 0 },
    b3: { left: 0, right: 0, top: 0, down: 1 },
    b4: { left: 1, right: 0, top: 0, down: 0 },

    c1: { left: 0, right: 0, top: 1, down: 0 },
    c2: { left: 0, top: 0, right: 1, down: 0 },
    c3: { left: 0, right: 0, top: 0, down: 1 },
    c4: { left: 1, right: 0, top: 0, down: 0 },

    d1: { left: 0, right: 0, top: 1, down: 0 },
    d2: { left: 1, top: 0, right: 0, down: 0 },
    d3: { left: 0, right: 0, top: 1, down: 0 },
    d4: { left: 1, top: 0, right: 0, down: 0 },

    e1: { left: 0, right: 0, top: 1, down: 0 },
    e2: { left: 0, right: 1, top: 0, down: 0 },
    e3: { left: 0, right: 0, top: 0, down: 1 },
    e4: { left: 1, right: 0, top: 0, down: 0 },

    f1: { left: 0, right: 0, top: 1, down: 0 },
    f2: { left: 1, right: 0, top: 0, down: 0 },
    f3: { left: 0, right: 0, top: 1, down: 0 },
    f4: { left: 1, right: 0, top: 0, down: 0 },

    g1: { left: 0, right: 0, top: 0, down: 0 },
    g2: { left: 0, right: 0, top: 0, down: 0 },
    g3: { left: 0, right: 0, top: 0, down: 0 },
    g4: { left: 0, right: 0, top: 0, down: 0 },
  };

  constructor(
    @Inject(SHAPE_PROTOTYPES) private shapePrototypes: ShapePrototype[],
    private barrierDetectService: BarrierDetectService
  ) {}

  /** 判断当前 shape 是属于哪个 pattern */
  public detectPattern(shape: IShape): string | undefined {
    for (const _shapePrototype of this.shapePrototypes) {
      const _shape = _shapePrototype.getShape();
      if (
        _shape.length === shape.length &&
        this.canOneShapeTranslateToAnothor(_shape, shape)
      ) {
        return _shapePrototype.shapePrototypeId;
      }
    }

    return undefined;
  }

  /** 判断一个 shape 能否通过平移到达另一个 shape */
  public canOneShapeTranslateToAnothor(
    shape1: IShape,
    shape2: IShape
  ): boolean {
    if (shape1.length !== shape2.length) {
      return false;
    }

    const l = shape1.length;
    const deltas: IPoint[] = [];
    for (let i = 0; i < l; i++) {
      deltas.push({
        offsetX: shape1[i].offsetX - shape2[i].offsetX,
        offsetY: shape1[i].offsetY - shape2[i].offsetY,
      });
    }

    const offsetXs = deltas.map((delta) => delta.offsetX);
    const offsetYs = deltas.map((delta) => delta.offsetY);
    const maxDeltaX = Math.max(...offsetXs);
    const minDeltaX = Math.min(...offsetXs);

    if (maxDeltaX !== minDeltaX) {
      return false;
    }

    const maxDeltaY = Math.max(...offsetYs);
    const minDeltaY = Math.min(...offsetYs);

    if (maxDeltaY !== minDeltaY) {
      return false;
    }

    return true;
  }

  /** 判断一个 block 周围是否有足够的空间 */
  public gapDetect(block: Block, gap: IGap, board: Board): boolean {
    return this.barrierDetectService.freeGapDetect({ block, board, gap });
  }

  /** 判断一个 block 是否具备 rotate 的条件 */
  public canRotate(block: Block, board: Board): boolean {
    const pattern = this.detectPattern(block.cells.map((cell) => cell.point));

    if (!pattern) {
      window.console.log({ canRotate: 'No pattern detected' });
      return false;
    }

    const gapRequire = this.gapRequres[pattern];
    if (!gapRequire) {
      window.console.log({
        canRotate: 'Cant figure it out how many gap required',
      });
      return false;
    }

    if (!this.gapDetect(block, gapRequire, board)) {
      return false;
    }

    return true;
  }

  /** 进行 rotate */
  public rotate(block: IBlock, board: IBoard): void {
    const currentPattern = this.detectPattern(
      block.cells.map((cell) => cell.point)
    );
    if (!currentPattern) {
      return;
    }

    const rotateToPattern = this.rotateRules[currentPattern];
    if (!rotateToPattern) {
      return;
    }

    const rotateToShape = this.shapePrototypes.find(
      (shapeProto) => shapeProto.shapePrototypeId === rotateToPattern
    );
    if (!rotateToShape) {
      return;
    }

    const currentShape = this.shapePrototypes.find(
      (shapeProto) => shapeProto.shapePrototypeId === currentPattern
    );
    if (!currentShape) {
      return;
    }

    const from = currentShape.getShape();
    const to = rotateToShape.getShape();

    if (from.length !== to.length) {
      return;
    }

    const deltas: IPoint[] = [];
    for (let i = 0; i < from.length; i++) {
      deltas.push({
        offsetX: to[i].offsetX - from[i].offsetX,
        offsetY: to[i].offsetY - from[i].offsetY,
      });
    }

    for (let i = 0; i < deltas.length; i++) {
      block.cells[i].point.offsetX += deltas[i].offsetX;
      block.cells[i].point.offsetY += deltas[i].offsetY;
    }
  }
}
