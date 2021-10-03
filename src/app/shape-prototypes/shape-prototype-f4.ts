import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeF4 implements ShapePrototype {
  public readonly shapeClassId = 'f';
  public readonly shapePrototypeId = 'f4';
  public getShape(): IShape {
    return [
      { offsetX: 0, offsetY: 2 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 1, offsetY: 0 },
    ];
  }
}
