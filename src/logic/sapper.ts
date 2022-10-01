import { Bombs } from "./bomb"
import { CellNumber, CellNumberData } from "./cellNumber"
import { Draw } from "./draw"
import { Flag } from "./flag"
import { CellClickEvent, Grid } from "./grid"

export type Position = {
  x: number
  y: number
}

export enum EventNames {
  CellClick = 'CellClick',
  RightCellClick = 'RightCellClick',
}

export class Sapper extends Draw {
  ctx: CanvasRenderingContext2D
  grid: Grid 
  bombs: Bombs
  cellNumbers: CellNumber
  flag: Flag

  mapPassed = new Map<string, Position>()
  mapNumber = new Map<string, CellNumberData>()
  isBombClick = false

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

    this.canvas.addEventListener(EventNames.CellClick, (((e: CellClickEvent) => {
      if (this.isBombClick) {
        return
      }

      if (e.detail.isBombClick) this.isBombClick = e.detail.isBombClick

      this.draw()
    }) as EventListener))

    this.canvas.addEventListener(EventNames.RightCellClick, ((() => {
      this.draw()
    }) as EventListener))
  }

  draw() {
    this.clear()

    this.grid.drawClosedCells()
    this.cellNumbers.draw()
    if (this.isBombClick) {
      console.log('dead')
      this.bombs.draw()
    }
    this.grid.draw()
    this.bombs.draw()
    this.flag.draw()
  }

}