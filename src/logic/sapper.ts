import { Bombs } from "./bomb"
import { CellNumber, CellNumberData } from "./cellNumber"
import { Draw } from "./draw"
import { Flag } from "./flag"
import { Grid } from "./grid"

export type Position = {
  x: number
  y: number
}

export enum Difficult {
  VeryEasy = 'VeryEasy',
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
  VeryHard = 'VeryHard',
  // Expert = 'Expert'
}

type DifficultData = {
  widthCellCount: number
  heightCellCount: number
  bombsCount: number
  step: number
}

export const difficultData: Record<Difficult, DifficultData> = {
  [Difficult.VeryEasy]: {heightCellCount: 9, widthCellCount: 9, bombsCount: 10, step: 40},
  [Difficult.Easy]: {heightCellCount: 16, widthCellCount: 16, bombsCount: 40, step: 40},
  [Difficult.Medium]: {heightCellCount: 16, widthCellCount: 30, bombsCount: 99, step: 40},
  [Difficult.Hard]: {heightCellCount: 50, widthCellCount: 50, bombsCount: 500, step: 20},
  [Difficult.VeryHard]: {heightCellCount: 100, widthCellCount: 100, bombsCount: 2000, step: 10}
}

export class Sapper extends Draw {
  grid: Grid 
  bombs: Bombs
  cellNumbers: CellNumber
  flag: Flag

  mapPassed = new Map<string, Position>()
  mapNumber = new Map<string, CellNumberData>()

  isDead = false

  constructor(public canvas: HTMLCanvasElement, difficult = Difficult.VeryEasy) {
    const {bombsCount, widthCellCount, heightCellCount, step} = difficultData[difficult]

    super(canvas, step)
    this.canvas.width = widthCellCount * step
    this.canvas.height = heightCellCount * step
    this.width = widthCellCount * step
    this.height = heightCellCount * step

    this.cellNumbers = new CellNumber(canvas, this.step)
    this.bombs = new Bombs(canvas, this.step)
    this.grid = new Grid(canvas, this.step)
    this.flag = new Flag(canvas, this.step)

    this.bombs.bombsLimit = bombsCount

    this.grid.initGrid()
    this.bombs.generateBombs(this.grid.map)
    this.cellNumbers.getBombsCount(this.grid.map, this.bombs.bombsMap)

    this.grid.setEventListeners(this.cellNumbers, this.bombs)
  }

  checkFlagClick() {
    return this.flag.flagPositions.has(this.getKey(this.grid.clickedPosition))
  }

  logicBeforeDraw() {
    if (!this.checkFlagClick() && this.grid.clickedPosition.isBomb) {
      this.isDead = true
    }
  }

  draw() {
    this.clear()

    this.grid.drawClosedCells()
    this.cellNumbers.draw()
    if (this.isDead) {
      this.bombs.draw(this.grid.clickedPosition)
    }
    this.grid.draw()
    this.flag.draw()
    if (this.isDead) {
      this.bombs.drawClosedBombs(this.flag.flagPositions)
    }
  }

  public removeListeners(): void {
    this.flag.removeListeners()
    this.grid.removeListeners()
  }
}