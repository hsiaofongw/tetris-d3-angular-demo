import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeB1 implements ShapePrototype {
  public readonly shapeClassId = 'b';
  public readonly shapePrototypeId = 'b1';
  public getShape(): Shape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
      { offsetX: 2, offsetY: 1 },
    ];
  }
}
