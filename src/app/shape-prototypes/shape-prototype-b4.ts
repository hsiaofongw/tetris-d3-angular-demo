import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeB4 implements ShapePrototype {
  shapeClassId = 'b';
  shapePrototypeId = 'b4';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 2 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 2 },
    ];
  }
}
