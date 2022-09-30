import { Bombs } from "./bomb";
import { CellNumber } from "./cellNumber";
import { Draw } from "./draw";
import { Position } from "./sapper";

export class Grid extends Draw {
  readonly map = new Map<string, Position>()
  clickedPosition: Position = {x: 0, y: 0}

  initGrid() {
    for (let x = 0; x < Math.round(this.width / this.step); x ++) {
      for(let y = 0; y < Math.round(this.height / this.step); y++) {
        const sX = x * this.step
        const sY = y + this.step
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
      this.clickedPosition.x = Math.floor(e.offsetX / this.step) * this.step
      this.clickedPosition.y = Math.floor(e.offsetY / this.step) * this.step
      console.log(this.clickedPosition, numbers.cellNumbers)

      if (bombs.bombsMap.has(this.getKey(this.clickedPosition))) {
        console.log('dead')
        return;
      }

      if (numbers.cellNumbers.has(this.getKey(this.clickedPosition))) {
        this.openNumberCell()
      } else {
        this.openNumberCells(numbers)
      }
    })
  }

  openNumberCell() {
    console.log('Hello')
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

    console.log(passed)
    this.ctx.beginPath()
    passed.forEach(elem => {
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(elem.x, elem.y, this.step, this.step)
    })
    this.ctx.closePath()
  }
}