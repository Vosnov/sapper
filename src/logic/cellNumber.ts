import { Bombs } from "./bomb";
import { Draw } from "./draw";
import { Grid } from "./grid";
import { Position } from "./sapper";

export type CellNumberData = {
  count: number
} & Position

export class CellNumber extends Draw {
  cellNumbers = new Map<string, CellNumberData>()
  drawCellNumbers = new Map<string, CellNumberData>()

  public getBombsCount(grid: Grid['map'], bombs: Bombs['bombsMap']) {

    grid.forEach((cell, cellKey) => {
      if (bombs.has(cellKey)) return
      let count = 0

      count = this.getParents(cell, bombs).length

      if (count === 0) return
      this.cellNumbers.set(this.getKey(cell), {...cell, count})
    })
  }

  setDrawNumber(position: Position) {
    const cell = this.cellNumbers.get(this.getKey(position))
    if (cell) {
      this.drawCellNumbers.set(this.getKey(cell), {...cell})
    }
  }

  draw() {
    this.ctx.beginPath()
    const fontSize = 32;
    this.ctx.font = `${fontSize}px serif`;
    this.drawCellNumbers.forEach((cell) => {
      this.ctx.fillStyle = 'green'
      this.ctx.fillText(`${cell.count}`, cell.x + (this.step / 2) - (fontSize / 4), cell.y + (this.step / 2) + (fontSize / 3))
    })
    this.ctx.closePath()
  }
}