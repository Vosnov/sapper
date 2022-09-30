import { Bombs } from "./bomb"
import { CellNumber, CellNumberData } from "./cellNumber"
import { Draw } from "./draw"
import { CellClickEvent, Grid } from "./grid"

export type Position = {
  x: number
  y: number
}

export enum EventNames {
  CellClick = 'CellClick'
}

export class Sapper extends Draw {
  ctx: CanvasRenderingContext2D
  grid: Grid 
  bombs: Bombs
  cellNumbers: CellNumber

  mapPassed = new Map<string, Position>()
  mapNumber = new Map<string, CellNumberData>()

  constructor(public canvas: HTMLCanvasElement) {
    super(canvas, 40)
    this.ctx = (canvas.getContext('2d') as CanvasRenderingContext2D)

    this.cellNumbers = new CellNumber(canvas, this.step)
    this.bombs = new Bombs(canvas, this.step)
    this.grid = new Grid(canvas, this.step)

    this.grid.initGrid()
    this.bombs.generateBombs(this.grid.map)
    this.cellNumbers.getBombsCount(this.grid.map, this.bombs.bombsMap)

    this.grid.setEventListeners(this.cellNumbers, this.bombs)

    this.canvas.addEventListener(EventNames.CellClick, (((e: CellClickEvent) => {
      e.detail.mapNumber?.forEach((value, key) => this.mapNumber.set(key, value))
      e.detail.mapPassed?.forEach((value, key) => this.mapPassed.set(key, value))
      this.draw()
    }) as EventListener))
  }

  draw() {
    this.clear()
    this.grid.draw()

    this.cellNumbers.draw(this.mapNumber)
    this.drawPassed()
  }

  drawPassed() {
    this.ctx.beginPath()
    this.mapPassed.forEach(passed => {
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(passed.x, passed.y, this.step, this.step)
    })
    this.ctx.closePath()
  }
}