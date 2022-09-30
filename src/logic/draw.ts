import { Position } from "./sapper"

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
}