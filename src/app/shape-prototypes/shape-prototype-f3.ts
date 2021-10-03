import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeF3 implements ShapePrototype {
  public readonly shapeClassId = 'f';
  public readonly shapePrototypeId = 'f3';
  public getShape(): IShape {
    return [
      { offsetX: 2, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
      { offsetX: 1, offsetY: 0 },
      { offsetX: 0, offsetY: 0 },
    ];
  }
}
