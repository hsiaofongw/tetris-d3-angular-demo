import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShapePatternDetectAndRotate } from './shape-pattern-detect-and-rotate';
import { GridDisplayComponent } from './grid-display/grid-display.component';
import { TetrisPlayComponent } from './tetris-play/tetris-play.component';
import { ViewComponent } from './view/view.component';
import { ShapeViewComponent } from './shape-view/shape-view.component';
import { GithubOauthRedirectBackComponent } from './github-oauth-redirect-back/github-oauth-redirect-back.component';
import { Board, GAME_BOARD } from './helpers/board';
import { Cell } from './helpers/cell';
import { ShapePrototypesModule } from './shape-prototypes/shape-prototype.module';
import { TickGenerator } from './ticks/tick-generator';
import { FastTickGenerator } from './ticks/fast-tick-generator';
import { TetrisDebugComponent } from './tetris-debug/tetris-debug.component';

@NgModule({
  declarations: [
    AppComponent,
    GridDisplayComponent,
    TetrisPlayComponent,
    ViewComponent,
    ShapeViewComponent,
    GithubOauthRedirectBackComponent,
    TetrisDebugComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ShapePrototypesModule],
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
