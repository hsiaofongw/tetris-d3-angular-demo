import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeF1 implements ShapePrototype {
  public readonly shapeClassId = 'f';
  public readonly shapePrototypeId = 'f1';
  public getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 2, offsetY: 1 },
    ];
  }
}
