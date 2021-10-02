import { InjectionToken } from '@angular/core';
import { Shape } from '../interfaces';

export abstract class ShapePrototype {
  abstract readonly shapeClassId: string;
  abstract readonly shapePrototypeId: string;
  abstract getShape(): Shape;
}

export const SHAPE_PROTOTYPES = new InjectionToken<ShapePrototype[]>(
  'ShapePrototypes'
);
