import { Inject, Injectable } from '@angular/core';
import { Point, Shape } from './interfaces';
import {
  ShapePrototype,
  SHAPE_PROTOTYPES,
} from './shape-prototypes/shape-prototype';

@Injectable()
export class ShapePatternDetectAndRotate {
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
