import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeA1 implements ShapePrototype {
  shapeClassId = 'a';
  shapePrototypeId = 'a1';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
      { offsetX: 3, offsetY: 0 },
    ];
  }
}
