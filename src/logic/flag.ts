import { Draw, DrawEntity } from "./draw";
import { Position } from "./sapper";

export class Flag extends Draw {
  flagPositions = new Map<string, Position>()
  clickedPosition: Position = {x: 0, y: 0}

  constructor(protected canvas: HTMLCanvasElement, protected step: number) {
    super(canvas, step)

    this.setEventListener()
  }

  setEventListener() {
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      this.clickedPosition.x = Math.floor(e.offsetX / this.step) * this.step
      this.clickedPosition.y = Math.floor(e.offsetY / this.step) * this.step

      if (this.flagPositions.has(this.getKey(this.clickedPosition))) {
        this.removeFlag(this.clickedPosition)
      } else {
        this.setFlag(this.clickedPosition)
      }
      console.log(e)
    })
  }

  removeFlag(position: Position) {
    this.flagPositions.delete(this.getKey(position))
  }

  setFlag(position: Position) {
    this.flagPositions.set(this.getKey(position), {...position})
  }

  public draw(): void {
    this.flagPositions.forEach(flag => {
      this.drawEntity(DrawEntity.Flag, flag)
    })
  }
}