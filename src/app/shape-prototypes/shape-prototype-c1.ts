import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeC1 implements ShapePrototype {
  shapeClassId = 'c';
  shapePrototypeId = 'c1';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
      { offsetX: 0, offsetY: 1 },
    ];
  }
}
