import { Draw, DrawEntity } from "./draw";
import { EventNames, Position } from "./sapper";

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

      this.setFlag(this.clickedPosition)

      const event = new CustomEvent(EventNames.RightCellClick, {bubbles: true})
      this.canvas.dispatchEvent(event)
    })
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