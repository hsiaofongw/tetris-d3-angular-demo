import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeC3 implements ShapePrototype {
  shapeClassId = 'c';
  shapePrototypeId = 'c3';
  getShape(): Shape {
    return [
      { offsetX: 2, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 2, offsetY: 0 },
    ];
  }
}
