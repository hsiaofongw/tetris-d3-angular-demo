import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeF4 implements ShapePrototype {
  shapeClassId = 'f';
  shapePrototypeId = 'f4';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 2 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 1, offsetY: 0 },
    ];
  }
}
