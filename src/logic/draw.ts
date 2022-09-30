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
}