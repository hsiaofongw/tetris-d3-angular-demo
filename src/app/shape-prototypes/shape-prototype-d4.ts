import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeD4 implements ShapePrototype {
  public readonly shapeClassId = 'd';
  public readonly shapePrototypeId = 'd4';
  public getShape(): IShape {
    return [
      { offsetX: 1, offsetY: 2 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
    ];
  }
}
