import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeE3 implements ShapePrototype {
  public readonly shapeClassId = 'e';
  public readonly shapePrototypeId = 'e3';
  public getShape(): Shape {
    return [
      { offsetX: 2, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 1, offsetY: 0 },
    ];
  }
}
