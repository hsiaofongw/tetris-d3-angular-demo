import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeE1 implements ShapePrototype {
  public readonly shapeClassId = 'e';
  public readonly shapePrototypeId = 'e1';
  public getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
    ];
  }
}
