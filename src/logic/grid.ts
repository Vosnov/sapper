import { Bombs } from "./bomb";
import { CellNumber, CellNumberData } from "./cellNumber";
import { Draw } from "./draw";
import { Position } from "./sapper";

export class Grid extends Draw {
  readonly map = new Map<string, Position>()
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

  public draw(): void {
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'red'
    for (let i = 0; i <= this.width; i += this.step) {
      this.ctx.moveTo(i, 0)
      this.ctx.lineTo(i, this.height)
    }
    for(let i = 0; i <= this.height; i += this.step) {
      this.ctx.moveTo(0, i)
      this.ctx.lineTo(this.width, i)
    }
    this.ctx.stroke()
    this.ctx.closePath()
  }

  setEventListeners(numbers: CellNumber, bombs: Bombs) {
    this.canvas.addEventListener('mousedown', (e) => {
      this.clear()

      this.clickedPosition.x = Math.floor(e.offsetX / this.step) * this.step
      this.clickedPosition.y = Math.floor(e.offsetY / this.step) * this.step
      console.log(this.clickedPosition, numbers.cellNumbers)

      if (bombs.bombsMap.has(this.getKey(this.clickedPosition))) {
        console.log('dead')
        return;
      }

      if (numbers.cellNumbers.has(this.getKey(this.clickedPosition))) {
        this.openNumberCell(numbers, this.clickedPosition)
      } else {
        this.openNumberCells(numbers)
      }
      
      this.draw()
    })
  }

  openNumberCell(cellNumber: CellNumber, position: Position) {
    const numberData = cellNumber.cellNumbers.get(this.getKey(position))
    if (numberData) {
      const mapNumbers = new Map()
      mapNumbers.set(this.getKey(position), numberData)
      cellNumber.draw(mapNumbers)
    }
  }

  openNumberCells(numbers: CellNumber) {
    const queue: Position[] = [this.clickedPosition]
    const passed = new Map<string, Position>()
    let count = 0
    
    while(queue.length > 0 && count < 1000) {
      count++
      const position = (queue.pop() as Position)
      const parents = this.getParents(position, this.map)
      passed.set(this.getKey(position), position)

      parents.forEach(parent => {
        if (passed.has(this.getKey(parent))) return
        if (!numbers.cellNumbers.has(this.getKey(parent))) {
          queue.push(parent)
        }
      })
    }

    passed.forEach(elem => {
      const numberParents = this.getParents(elem, numbers.cellNumbers)
      const mapNumberParents = new Map<string, CellNumberData>()

      numberParents.forEach(number => {
        mapNumberParents.set(this.getKey(number), number)
      })

      numbers.draw(mapNumberParents)

      this.ctx.beginPath()
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(elem.x, elem.y, this.step, this.step)
      this.ctx.closePath()
    })
  }
}