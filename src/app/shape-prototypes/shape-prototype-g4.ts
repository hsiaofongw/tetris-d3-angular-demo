import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeG4 implements ShapePrototype {
  shapeClassId = 'g';
  shapePrototypeId = 'g4';
  getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
    ];
  }
}
