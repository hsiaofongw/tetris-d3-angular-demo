import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeF2 implements ShapePrototype {
  shapeClassId = 'f';
  shapePrototypeId = 'f2';
  getShape(): Shape {
    return [
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 2 },
    ];
  }
}
