import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeA2 implements ShapePrototype {
  shapeClassId = 'a';
  shapePrototypeId = 'a2';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 2 },
      { offsetX: 0, offsetY: 3 },
    ];
  }
}
