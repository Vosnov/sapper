import { borderImage } from "../App";
import { Draw } from "./draw";

export class Border extends Draw {
  constructor(public canvas: HTMLCanvasElement) {
    super(canvas, 20)
  }

  public draw(): void {
    this.drawInterfaceBorder()
  }

  drawInterfaceBorder() {
    this.ctx.beginPath()
    this.ctx.fillStyle = '#bfbfbf'
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.drawBorder(this.width, 100 + this.step)
    this.ctx.translate(0, 100)

    this.drawBorder(this.width, this.height - 100)
    this.ctx.translate(0, 0)

    this.ctx.drawImage(borderImage, 184, 40, 40, 40, 0, 0, this.step, this.step)
    this.ctx.drawImage(borderImage, 184 + 40, 40, 40, 40, this.width - this.step, 0, this.step, this.step)
    this.ctx.closePath()
  }

  drawBorder(width: number, height: number) {
    for(let i = 0; i < height; i += this.step) {
      this.ctx.drawImage(borderImage, 80, 16, 40, 64, 0, i, this.step, this.step)
      this.ctx.drawImage(borderImage, 80, 16, 40, 64, width - this.step, i, this.step, this.step)
    }

    for(let i = 0; i < width; i += this.step) {
      this.ctx.drawImage(borderImage, 120, 40, 64, 40, i, 0, this.step, this.step)
      this.ctx.drawImage(borderImage, 120, 40, 64, 40, i, height - this.step, this.step, this.step)
    }

    this.ctx.drawImage(borderImage, 0, 0, 40, 40, 0, 0, this.step, this.step)
    this.ctx.drawImage(borderImage, 40, 0, 40, 40, width - this.step, 0, this.step, this.step)
    this.ctx.drawImage(borderImage, 0, 40, 40, 40, 0, height - this.step, this.step, this.step)
    this.ctx.drawImage(borderImage, 40, 40, 40, 40, width - this.step, height - this.step, this.step, this.step)
  }
}