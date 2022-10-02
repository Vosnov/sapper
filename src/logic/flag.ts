import { Draw, DrawEntity } from "./draw";
import { Position } from "./sapper";

export type FlagCountEvent = CustomEvent<number>
export class Flag extends Draw {
  flagPositions = new Map<string, Position>()
  clickedPosition: Position = {x: -100, y: -100}

  constructor(protected canvas: HTMLCanvasElement, public step: number) {
    super(canvas, step)
    this.contextmenuListener = this.contextmenuListener.bind(this)

    this.setEventListener()
  }

  contextmenuListener(e: MouseEvent) {
    e.preventDefault()
    this.clickedPosition.x = Math.floor(e.offsetX / this.step) * this.step
    this.clickedPosition.y = Math.floor(e.offsetY / this.step) * this.step

    if (this.flagPositions.has(this.getKey(this.clickedPosition))) {
      this.removeFlag(this.clickedPosition)
    } else {
      this.setFlag(this.clickedPosition)
    }
  }

  setEventListener() {
    this.canvas.addEventListener('contextmenu', this.contextmenuListener)
  }

  public removeListeners(): void {
    this.canvas.removeEventListener('contextmenu', this.contextmenuListener)
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