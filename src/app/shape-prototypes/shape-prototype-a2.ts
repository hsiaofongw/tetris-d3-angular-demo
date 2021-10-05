import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeA2 implements ShapePrototype {
  public readonly shapeClassId = 'a';
  public readonly shapePrototypeId = 'a2';
  public getShape(): IShape {
    return [
      { offsetX: 2, offsetY: 0 },
      { offsetX: 2, offsetY: 1 },
      { offsetX: 2, offsetY: 2 },
      { offsetX: 2, offsetY: 3 },
    ];
  }
}
