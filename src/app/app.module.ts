import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShapePatternDetectAndRotate } from './shape-pattern-detect-and-rotate';
import { GridDisplayComponent } from './grid-display/grid-display.component';
import { ViewComponent } from './view/view.component';
import { ShapeViewComponent } from './shape-view/shape-view.component';
import { Board, GAME_BOARD } from './helpers/board';
import { Cell } from './helpers/cell';
import { ShapePrototypesModule } from './shape-prototypes/shape-prototype.module';
import { TickGenerator } from './ticks/tick-generator';
import { FastTickGenerator } from './ticks/fast-tick-generator';
import { TetrisComponent } from './tetris/tetris.component';
import {
  KeyboardEventSource,
  KEYBOARD_EVENT_OBSERVABLE,
} from './controller/keyboard-event-source.service';
import { fromEvent, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TICK_SOURCE_MINIMUM_SOURCE as TICK_SOURCE_MINIMUM_INTERVAL } from './tick-sources/tick-source.service';
import { HttpClientModule } from '@angular/common/http';
import { UserModule } from './user/user.module';
import { GlobalInterceptorsModule } from './global-interceptors/global-interceptors.module';
import { UpdateHookModule } from './update-hooks/update-hooks.module';

@NgModule({
  declarations: [
    AppComponent,
    GridDisplayComponent,
    ViewComponent,
    ShapeViewComponent,
    TetrisComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ShapePrototypesModule,
    HttpClientModule,
    UserModule,
    GlobalInterceptorsModule,
    UpdateHookModule,
  ],
  providers: [
    ShapePatternDetectAndRotate,
    {
      provide: GAME_BOARD,
      useFactory: () =>
        Board.create({ nCols: 20, nRows: 20, cells: new Array<Cell>() }),
    },
    {
      provide: TickGenerator,
      useClass: FastTickGenerator,
    },
    {
      provide: KEYBOARD_EVENT_OBSERVABLE,
      useValue: fromEvent(window.document, 'keyup').pipe(
        filter((e) => e instanceof KeyboardEvent)
      ) as Observable<KeyboardEvent>,
    },
    {
      provide: KeyboardEventSource,
      useFactory: (event$: Observable<KeyboardEvent>) =>
        new KeyboardEventSource(event$),
      deps: [KEYBOARD_EVENT_OBSERVABLE],
    },
    {
      provide: TICK_SOURCE_MINIMUM_INTERVAL,
      useValue: 500,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
