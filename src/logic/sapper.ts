import { Bombs } from "./bomb"
import { CellNumber, CellNumberData } from "./cellNumber"
import { Draw } from "./draw"
import { Flag } from "./flag"
import { Grid } from "./grid"

export type Position = {
  x: number
  y: number
}

export class Sapper extends Draw {
  ctx: CanvasRenderingContext2D
  grid: Grid 
  bombs: Bombs
  cellNumbers: CellNumber
  flag: Flag

  mapPassed = new Map<string, Position>()
  mapNumber = new Map<string, CellNumberData>()

  isDead = false
  interval?: NodeJS.Timer

  constructor(public canvas: HTMLCanvasElement) {
    super(canvas, 40)
    this.ctx = (canvas.getContext('2d') as CanvasRenderingContext2D)

    this.cellNumbers = new CellNumber(canvas, this.step)
    this.bombs = new Bombs(canvas, this.step)
    this.grid = new Grid(canvas, this.step)
    this.flag = new Flag(canvas, this.step)

    this.grid.initGrid()
    this.bombs.generateBombs(this.grid.map)
    this.cellNumbers.getBombsCount(this.grid.map, this.bombs.bombsMap)

    this.grid.setEventListeners(this.cellNumbers, this.bombs)

    this.setInterval()
  }

  checkFlagClick() {
    return this.flag.flagPositions.has(this.getKey(this.grid.clickedPosition))
  }

  setInterval() {
    this.interval = setInterval(() => {
      if (!this.checkFlagClick() && this.grid.clickedPosition.isBomb) {
        this.isDead = true
      }

      if (!this.isDead) this.draw()
    }, 1000 / 60)
  }

  draw() {
    this.clear()

    this.grid.drawClosedCells()
    this.cellNumbers.draw()
    if (this.isDead) {
      this.bombs.draw()
    }
    this.grid.draw()
    this.bombs.draw()
    this.flag.draw()
  }
}