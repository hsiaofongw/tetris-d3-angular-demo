import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeA4 implements ShapePrototype {
  public readonly shapeClassId = 'a';
  public readonly shapePrototypeId = 'a4';
  public getShape(): IShape {
    return [
      { offsetX: 2, offsetY: 3 },
      { offsetX: 2, offsetY: 2 },
      { offsetX: 2, offsetY: 1 },
      { offsetX: 2, offsetY: 0 },
    ];
  }
}
