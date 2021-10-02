import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeD4 implements ShapePrototype {
  shapeClassId = 'd';
  shapePrototypeId = 'd4';
  getShape(): Shape {
    return [
      { offsetX: 1, offsetY: 2 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
    ];
  }
}
