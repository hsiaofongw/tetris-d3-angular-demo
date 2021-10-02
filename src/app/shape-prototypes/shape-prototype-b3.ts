import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeB3 implements ShapePrototype {
  shapeClassId = 'b';
  shapePrototypeId = 'b3';
  getShape(): Shape {
    return [
      { offsetX: 2, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
    ];
  }
}
