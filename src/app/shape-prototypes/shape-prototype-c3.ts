import { Injectable } from '@angular/core';
import { Shape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeC3 implements ShapePrototype {
  public readonly shapeClassId = 'c';
  public readonly shapePrototypeId = 'c3';
  public getShape(): Shape {
    return [
      { offsetX: 2, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 2, offsetY: 0 },
    ];
  }
}
