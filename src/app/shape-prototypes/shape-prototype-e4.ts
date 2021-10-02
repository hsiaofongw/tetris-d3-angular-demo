import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeE4 implements ShapePrototype {
  shapeClassId = 'e';
  shapePrototypeId = 'e4';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 2 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
    ];
  }
}
