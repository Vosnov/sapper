import { Bombs } from "./bomb";
import { CellNumber } from "./cellNumber";
import { Draw, DrawEntity } from "./draw";
import { EventNames, Position } from "./sapper";

type CellClickData = {
  isBombClick?: boolean
}

export type CellClickEvent = CustomEvent<CellClickData>

export class Grid extends Draw {
  readonly map = new Map<string, Position>()
  mapPassed = new Map<string, Position>();

  clickedPosition: Position = {x: 0, y: 0}

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

  setEventListeners(numbers: CellNumber, bombs: Bombs) {
    this.canvas.addEventListener('mousedown', (e) => {
      this.clickedPosition.x = Math.floor(e.offsetX / this.step) * this.step
      this.clickedPosition.y = Math.floor(e.offsetY / this.step) * this.step

      if (bombs.bombsMap.has(this.getKey(this.clickedPosition))) {
        this.deadCellClick()
        return;
      }

      if (numbers.cellNumbers.has(this.getKey(this.clickedPosition))) {
        this.numberCellClick(numbers, this.clickedPosition)
      } else {
        this.emptyCellClick(numbers)
      }
    })
  }

  deadCellClick() {
    const event = new CustomEvent<CellClickData>(EventNames.CellClick, {detail: {isBombClick: true}, bubbles: true})
    this.canvas.dispatchEvent(event)
  }

  numberCellClick(cellNumber: CellNumber, position: Position) {
    cellNumber.setDrawNumber(position)

    const event = new CustomEvent<CellClickData>(EventNames.CellClick, {detail: {}, bubbles: true})
    this.canvas.dispatchEvent(event)
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

    const event = new CustomEvent<CellClickData>(EventNames.CellClick, {detail: {}, bubbles: true})
    this.canvas.dispatchEvent(event)
  }

  drawPassed() {
    this.ctx.beginPath()
    this.mapPassed.forEach(passed => {
      this.drawEntity(DrawEntity.Passed, passed)
    })
    this.ctx.closePath()
  }
}