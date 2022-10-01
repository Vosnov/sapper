import { fieldImage, numbersImage } from "../App"
import { Position } from "./sapper"

export enum DrawEntity {
  Bomb = 'Bomb',
  Number = 'Number',
  CloseCell = 'CloseCell',
  Passed = 'Passed',
  Flag = 'Flag',
}
export abstract class Draw {
  protected ctx: CanvasRenderingContext2D
  width: number
  height: number

  constructor(protected canvas: HTMLCanvasElement, protected step = 20) {
    this.canvas = canvas
    this.step = step
    this.ctx = (canvas.getContext('2d') as CanvasRenderingContext2D)
    this.width = canvas.width
    this.height = canvas.height
  }

  public draw() {

  }

  protected randomInteger(min: number, max: number) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  getParents<T extends Position>({x, y}: Position, map: Map<string, T>) {
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

    const parents: T[] = []

    angels.forEach(angel => {
      const parent = map.get(`x${angel.x + x}y${angel.y + y}`)

      if (parent) parents.push(parent)
    })
    
    return parents
  }

  protected getKey({x, y}: Position) {
    return `x${x}y${y}`
  }

  protected clear() {
    this.ctx.beginPath()
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.closePath()
  }

  private drawNumber({x, y}: Position, count: number) {
    const leftOffset = 64 * (count - 1)
    return this.ctx.drawImage(numbersImage, leftOffset, 0, 64, 64, x, y, this.step, this.step)
  }

  protected drawEntity(entity: DrawEntity, {x, y}: Position, count?: number) {
    if (entity === DrawEntity.Bomb) {
      return this.ctx.drawImage(fieldImage, 128, 0, 64, 64, x, y, this.step, this.step)
    }

    if (entity === DrawEntity.Number) {
      this.drawNumber({x, y}, count || 1)
    }

    if (entity === DrawEntity.CloseCell) {
      return this.ctx.drawImage(fieldImage, 64, 0, 64, 64, x, y, this.step, this.step)
    }

    if (entity === DrawEntity.Passed) {
      return this.ctx.drawImage(fieldImage, 0, 0, 64, 64, x, y, this.step, this.step)
    }

    if (entity === DrawEntity.Flag) {
      return this.ctx.drawImage(fieldImage, 64 * 5, 0, 64, 64, x, y, this.step, this.step)
    }
  }
}