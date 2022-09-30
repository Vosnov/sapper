import { Draw } from "./draw";
import { Position } from "./sapper";

export class Grid extends Draw {
  readonly map = new Map<string, Position>()

  initGrid() {
    for (let x = 0; x < Math.round(this.width / this.step); x ++) {
      for(let y = 0; y < Math.round(this.height / this.step); y++) {
        this.map.set(`x${x * this.step}y${y * this.step}`, {x: x* this.step, y: y * this.step})
      }
    }
  }

  public draw(): void {
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'red'
    for (let i = 0; i <= this.width; i += this.step) {
      this.ctx.moveTo(i, 0)
      this.ctx.lineTo(i, this.height)
    }
    for(let i = 0; i <= this.height; i += this.step) {
      this.ctx.moveTo(0, i)
      this.ctx.lineTo(this.width, i)
    }
    this.ctx.stroke()
    this.ctx.closePath()
  }
}