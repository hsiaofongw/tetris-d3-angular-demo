import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeD1 implements ShapePrototype {
  public readonly shapeClassId = 'd';
  public readonly shapePrototypeId = 'd1';
  public getShape(): IShape {
    return [
      { offsetX: 0, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 2, offsetY: 0 },
    ];
  }
}
