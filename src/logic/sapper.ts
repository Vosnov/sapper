import { Bombs } from "./bomb"
import { CellNumber } from "./cellNumber"
import { Grid } from "./grid"

export type Position = {
  x: number
  y: number
}

export class Sapper {
  ctx: CanvasRenderingContext2D
  step = 40
  grid: Grid 
  bombs: Bombs
  cellNumbers: CellNumber

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = (canvas.getContext('2d') as CanvasRenderingContext2D)

    this.cellNumbers = new CellNumber(canvas, this.step)
    this.bombs = new Bombs(canvas, this.step)
    this.grid = new Grid(canvas, this.step)

    this.grid.initGrid()
    this.bombs.generateBombs(this.grid.map)
    this.cellNumbers.getBombsCount(this.grid.map, this.bombs.bombsMap)
  }

  draw() {
    this.grid.draw()
    this.bombs.draw()
    this.cellNumbers.draw()
  }
}