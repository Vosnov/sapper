import { Draw, DrawEntity } from "./draw";
import { Flag } from "./flag";
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

  public draw(coloredBomb?: Position): void {
    this.ctx.beginPath()
    this.ctx.fillStyle = 'blue'

    this.bombsMap.forEach(bomb => {
      this.drawEntity(DrawEntity.Bomb, bomb)

      if (coloredBomb && this.getKey(bomb) === this.getKey(coloredBomb)) {
        this.drawEntity(DrawEntity.ColoredBomb, coloredBomb)
      }

    })
    this.ctx.closePath()
  }

  drawClosedBombs(flagPositions: Flag['flagPositions']) {
    this.bombsMap.forEach(bomb => {
      flagPositions.forEach(flag => {
        if (this.getKey(flag) === this.getKey(bomb)) {
          this.drawEntity(DrawEntity.ClosedBomb, flag)
        }
      })
    })
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
      this.bombsMap.set(this.getKey(bomb), bomb)
    }
  }
}