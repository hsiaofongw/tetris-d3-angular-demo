import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeF1 implements ShapePrototype {
  shapeClassId = 'f';
  shapePrototypeId = 'f1';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 2, offsetY: 1 },
    ];
  }
}
