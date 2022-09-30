import { Draw } from "./draw";
import { Grid } from "./grid";
import { Position } from "./sapper";

export class Bombs extends Draw {
  bombsMap = new Map<string, Position>()
  bombsLimit = 10

  private createBomb(freePositions: Position[]) {
    const bomb: Position = {x: 0, y: 0}

    if (freePositions.length === 0) return bomb

    const rndPos = this.randomInteger(0, freePositions.length - 1)
    bomb.x = freePositions[rndPos].x
    bomb.y = freePositions[rndPos].y

    return bomb
  }

  public draw(): void {
    this.ctx.beginPath()
    this.ctx.fillStyle = 'blue'
    this.bombsMap.forEach(bomb => {
      this.ctx.fillRect(bomb.x, bomb.y, this.step, this.step)
    })
    this.ctx.closePath()
  }

  public generateBombs(grid: Grid['map']) {
    for (let i = 0; i <= this.bombsLimit; i++) {
      const freePositions: Position[] = []
      grid.forEach((cell, cellKey) => {
        if (!this.bombsMap.has(cellKey)) {
          freePositions.push(cell)
        }
      })

      const bomb = this.createBomb(freePositions)
      this.bombsMap.set(`x${bomb.x}y${bomb.y}`, bomb)
    }
  }
}