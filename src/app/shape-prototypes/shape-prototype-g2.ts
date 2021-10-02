import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeG2 implements ShapePrototype {
  shapeClassId = 'g';
  shapePrototypeId = 'g2';
  getShape(): Shape {
    return [
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
    ];
  }
}
