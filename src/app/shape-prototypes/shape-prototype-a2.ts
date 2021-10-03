import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeA2 implements ShapePrototype {
  public readonly shapeClassId = 'a';
  public readonly shapePrototypeId = 'a2';
  public getShape(): IShape {
    return [
      { offsetX: 0, offsetY: 0 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 2 },
      { offsetX: 0, offsetY: 3 },
    ];
  }
}
