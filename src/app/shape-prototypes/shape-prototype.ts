import { InjectionToken } from '@angular/core';
import { IShape } from '../interfaces';

export abstract class ShapePrototype {
  abstract readonly shapeClassId: string;
  abstract readonly shapePrototypeId: string;
  abstract getShape(): IShape;
}

export const SHAPE_PROTOTYPES = new InjectionToken<ShapePrototype[]>(
  'ShapePrototypes'
);
