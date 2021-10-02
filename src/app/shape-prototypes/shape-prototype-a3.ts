import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeA3 implements ShapePrototype {
  shapeClassId = 'a';
  shapePrototypeId = 'a3';
  getShape(): Shape {
    return [
      { offsetX: 3, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 0, offsetY: 0 },
    ];
  }
}
