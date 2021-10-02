import { Inject, Injectable } from '@angular/core';
import { Gap, Point, Shape } from './interfaces';
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
  public readonly gapRequres: Record<string, Gap> = {
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
    @Inject(SHAPE_PROTOTYPES) private shapePrototypes: ShapePrototype[]
  ) {}

  public detectPattern(shape: Shape): string | undefined {
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

  public canOneShapeTranslateToAnothor(shape1: Shape, shape2: Shape): boolean {
    if (shape1.length !== shape2.length) {
      return false;
    }

    const l = shape1.length;
    const deltas: Point[] = [];
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
}
