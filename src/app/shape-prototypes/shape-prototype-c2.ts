import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeC2 implements ShapePrototype {
  shapeClassId = 'c';
  shapePrototypeId = 'c2';
  getShape(): Shape {
    return [
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 1, offsetY: 2 },
      { offsetX: 0, offsetY: 0 },
    ];
  }
}
