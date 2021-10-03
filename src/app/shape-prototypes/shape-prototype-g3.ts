import { Injectable } from '@angular/core';
import { IShape } from '../interfaces';
import { ShapePrototype } from './shape-prototype';

@Injectable()
export class ShapePrototypeG3 implements ShapePrototype {
  public readonly shapeClassId = 'g';
  public readonly shapePrototypeId = 'g3';
  public getShape(): IShape {
    return [
      { offsetX: 1, offsetY: 1 },
      { offsetX: 0, offsetY: 1 },
      { offsetX: 0, offsetY: 0 },
      { offsetX: 1, offsetY: 0 },
    ];
  }
}
