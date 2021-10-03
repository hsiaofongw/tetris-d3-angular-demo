import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeF2 implements ShapePrototype {
  public readonly shapeClassId = 'f';
  public readonly shapePrototypeId = 'f2';
  public getShape(): IShape {
    return [
      { offsetX: 1, offsetY: 0 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 2 },
    ];
  }
}
