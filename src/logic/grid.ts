import { Bombs } from "./bomb";
import { CellNumber } from "./cellNumber";
import { Draw, DrawEntity } from "./draw";
import { Position } from "./sapper";

type CellClickData = {
  isBombClick?: boolean
}

export type CellClickEvent = CustomEvent<CellClickData>

export type ClickPosition = {
  isBomb: boolean
} & Position
export class Grid extends Draw {
  readonly map = new Map<string, Position>()
  mapPassed = new Map<string, Position>();

  clickedPosition: ClickPosition = {x: 0, y: 0, isBomb: false}

  numbers?: CellNumber
  bombs?: Bombs

  constructor(public canvas: HTMLCanvasElement, step?: number) {
    super(canvas, step)

    this.clickEventListener = this.clickEventListener.bind(this)
  }

  initGrid() {
    for (let x = 0; x < Math.round(this.width / this.step); x ++) {
      for(let y = 0; y < Math.round(this.height / this.step); y++) {
        const sX = x * this.step
        const sY = y * this.step
        this.map.set(this.getKey({x: sX, y: sY}), {x: sX, y: sY})
      }
    }
  }

  public drawClosedCells() {
    this.ctx.beginPath()
    this.map.forEach(pos => {
      this.drawEntity(DrawEntity.CloseCell, pos)
    })
    this.ctx.closePath()
  }

  public draw(): void {
    this.drawPassed()
  }

  clickEventListener(e: MouseEvent) {
    this.clickedPosition.isBomb = false
    this.clickedPosition.x = Math.floor(e.offsetX / this.step) * this.step
    this.clickedPosition.y = Math.floor(e.offsetY / this.step) * this.step

    if (!this.bombs || !this.numbers) return

    if (this.bombs.bombsMap.has(this.getKey(this.clickedPosition))) {
      this.deadCellClick()
      return;
    }

    if (this.numbers.cellNumbers.has(this.getKey(this.clickedPosition))) {
      this.numberCellClick(this.numbers, this.clickedPosition)
    } else {
      this.emptyCellClick(this.numbers)
    }
  }


  setEventListeners(numbers: CellNumber, bombs: Bombs) {
    this.bombs = bombs
    this.numbers = numbers
    this.canvas.addEventListener('click', this.clickEventListener)
  }

  public removeListeners(): void {
    this.canvas.removeEventListener('click', this.clickEventListener)
  }

  deadCellClick() {
    this.clickedPosition.isBomb = true
  }

  numberCellClick(cellNumber: CellNumber, position: Position) {
    cellNumber.setDrawNumber(position)
  }

  emptyCellClick(numbers: CellNumber) {
    const queue: Position[] = [this.clickedPosition]
    let count = 0
    
    while(queue.length > 0 && count < 1000) {
      count++
      const position = (queue.pop() as Position)
      const parents = this.getParents(position, this.map)
      this.mapPassed.set(this.getKey(position), {...position})

      parents.forEach(parent => {
        if (this.mapPassed.has(this.getKey(parent))) return
        if (!numbers.cellNumbers.has(this.getKey(parent))) {
          queue.push(parent)
        }
      })
    }

    this.mapPassed.forEach(elem => {
      const numberParents = this.getParents(elem, numbers.cellNumbers)
      numberParents.forEach(number => numbers.setDrawNumber(number))
    })
  }

  drawPassed() {
    this.ctx.beginPath()
    this.mapPassed.forEach(passed => {
      this.drawEntity(DrawEntity.Passed, passed)
    })
    this.ctx.closePath()
  }
}