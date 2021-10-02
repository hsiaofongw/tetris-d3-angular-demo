import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeD2 implements ShapePrototype {
  shapeClassId = 'd';
  shapePrototypeId = 'd2';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 1, offsetY: 2 },
    ];
  }
}
