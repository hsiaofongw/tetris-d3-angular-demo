import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeD3 implements ShapePrototype {
  shapeClassId = 'd';
  shapePrototypeId = 'd3';
  getShape(): Shape {
    return [
      { offsetX: 2, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
    ];
  }
}
