import { Draw, DrawEntity } from "./draw";
import { Flag } from "./flag";
import { Grid } from "./grid";
import { Position } from "./sapper";
export class Bombs extends Draw {
  bombsMap = new Map<string, Position>()
  bombsLimit = 10

  private createBomb(freePositions: Position) {
    const bomb: Position = {x: -100, y: -100}

    bomb.x = freePositions.x
    bomb.y = freePositions.y

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

  shuffle<T>(array: Array<T>) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex !== 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
  public generateBombs(grid: Grid['map']) {
    const freePositions: Position[] = Array.from(grid.values())

    this.shuffle(freePositions)

    for (let i = 0; i <= this.bombsLimit; i++) {
      if (i > freePositions.length - 1) return
      const bomb = this.createBomb(freePositions[i])

      this.bombsMap.set(this.getKey(bomb), bomb)
    }
  }
}