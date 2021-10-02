import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShapePatternDetectAndRotate } from './shape-pattern-detect-and-rotate';
import { SHAPE_PROTOTYPES } from './shape-prototypes/shape-prototype';
import { ShapePrototypeA1 } from './shape-prototypes/shape-prototype-a1';
import { ShapePrototypeA2 } from './shape-prototypes/shape-prototype-a2';
import { ShapePrototypeA3 } from './shape-prototypes/shape-prototype-a3';
import { ShapePrototypeA4 } from './shape-prototypes/shape-prototype-a4';
import { ShapePrototypeB1 } from './shape-prototypes/shape-prototype-b1';
import { ShapePrototypeB2 } from './shape-prototypes/shape-prototype-b2';
import { ShapePrototypeB3 } from './shape-prototypes/shape-prototype-b3';
import { ShapePrototypeB4 } from './shape-prototypes/shape-prototype-b4';
import { ShapePrototypeC1 } from './shape-prototypes/shape-prototype-c1';
import { ShapePrototypeC2 } from './shape-prototypes/shape-prototype-c2';
import { ShapePrototypeC3 } from './shape-prototypes/shape-prototype-c3';
import { ShapePrototypeC4 } from './shape-prototypes/shape-prototype-c4';
import { ShapePrototypeD1 } from './shape-prototypes/shape-prototype-d1';
import { ShapePrototypeD2 } from './shape-prototypes/shape-prototype-d2';
import { ShapePrototypeD3 } from './shape-prototypes/shape-prototype-d3';
import { ShapePrototypeD4 } from './shape-prototypes/shape-prototype-d4';
import { ShapePrototypeE1 } from './shape-prototypes/shape-prototype-e1';
import { ShapePrototypeE2 } from './shape-prototypes/shape-prototype-e2';
import { ShapePrototypeE3 } from './shape-prototypes/shape-prototype-e3';
import { ShapePrototypeE4 } from './shape-prototypes/shape-prototype-e4';
import { ShapePrototypeF1 } from './shape-prototypes/shape-prototype-f1';
import { ShapePrototypeF2 } from './shape-prototypes/shape-prototype-f2';
import { ShapePrototypeF3 } from './shape-prototypes/shape-prototype-f3';
import { ShapePrototypeF4 } from './shape-prototypes/shape-prototype-f4';
import { ShapePrototypeG1 } from './shape-prototypes/shape-prototype-g1';
import { ShapePrototypeG2 } from './shape-prototypes/shape-prototype-g2';
import { ShapePrototypeG3 } from './shape-prototypes/shape-prototype-g3';
import { ShapePrototypeG4 } from './shape-prototypes/shape-prototype-g4';
import { GridDisplayComponent } from './grid-display/grid-display.component';
import { PlayComponent } from './play/play.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [AppComponent, GridDisplayComponent, PlayComponent, ViewComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    ShapePatternDetectAndRotate,
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeA1, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeA2, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeA3, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeA4, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeB1, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeB2, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeB3, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeB4, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeC1, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeC2, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeC3, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeC4, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeD1, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeD2, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeD3, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeD4, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeE1, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeE2, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeE3, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeE4, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeF1, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeF2, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeF3, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeF4, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeG1, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeG2, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeG3, multi: true },
    { provide: SHAPE_PROTOTYPES, useClass: ShapePrototypeG4, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
