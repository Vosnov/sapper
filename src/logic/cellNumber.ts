import { Bombs } from "./bomb";
import { Draw } from "./draw";
import { Grid } from "./grid";
import { Position } from "./sapper";

export type CellNumberData = {
  count: number
} & Position

export class CellNumber extends Draw {
  cellNumbers = new Map<string, CellNumberData>()

  public getBombsCount(grid: Grid['map'], bombs: Bombs['bombsMap']) {
    const angels: Position[] = [
      {x: this.step, y: 0},
      {x: -this.step, y: 0},
      {x: 0, y: this.step},
      {x: 0, y: -this.step},
      {x: -this.step, y: -this.step},
      {x: this.step, y: this.step},
      {x: -this.step, y: this.step},
      {x: this.step, y: -this.step},
    ]

    grid.forEach((cell, cellKey) => {
      if (bombs.has(cellKey)) return
      let count = 0

      angels.forEach(angel => {
        const bomb = bombs.get(`x${cell.x + angel.x}y${cell.y + angel.y}`)

        if (bomb) {
          count++
        }
      })

      if (count === 0) return
      this.cellNumbers.set(`x${cell.x}y${cell.y}`, {...cell, count})
    })
  }

  draw() {
    this.ctx.beginPath()
    const fontSize = 32;
    this.ctx.font = `${fontSize}px serif`;
    console.log(this.cellNumbers)
    this.cellNumbers.forEach((cell) => {
      this.ctx.fillStyle = 'green'
      this.ctx.fillText(`${cell.count}`, cell.x + (this.step / 2) - (fontSize / 4), cell.y + (this.step / 2) + (fontSize / 3))
    })
    this.ctx.closePath()
  }
}