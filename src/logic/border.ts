import { borderImage, scoreboardImage } from "../App";
import { Draw } from "./draw";
import { Position, Sapper } from "./sapper";

export class Border extends Draw {
  time = 0
  timerInterval?: NodeJS.Timer 
  gameInterval?: NodeJS.Timer

  constructor(public canvas: HTMLCanvasElement, public sapper: Sapper) {
    super(canvas, 20)
    
    this.startTimer()
    this.startGame()

    this.drawInterfaceBorder()
  }

  startGame() {
    this.gameInterval = setInterval(() => {
      this.sapper.logicBeforeDraw()
      this.sapper.draw()
      this.draw()

      if (this.sapper.isDead) {
        this.removeListeners()
      }
    }, 1000 / 60)
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.time === 999) {
        clearInterval(this.timerInterval)
        return
      }
      this.time++
      this.drawTimer()
    }, 1000)
  }

  drawBombCount() {
    const count = this.sapper.bombs.bombsLimit - this.sapper.flag.flagPositions.size
    this.drawNumbers({x: 30, y: 35},  this.convertNumber(count))
  }

  drawTimer() {
    this.drawNumbers({x: this.width - (52 / 2 * 3) - 30, y: 35}, this.convertNumber(this.time))
  }

  convertNumber(num: number) {
    if (num <= 9) return `00${num}`
    if (num <= 99) return `0${num}`
    if (num <= 999) return `${num}`
    return '000'
  }

  public removeListeners(): void {
    clearInterval(this.timerInterval)
    clearInterval(this.gameInterval)
  }

  public draw(): void {
    this.drawBombCount()
    this.drawTimer()
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
    this.ctx.translate(0, -100)
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

  drawNumbers({x, y}: Position, count: string) {
    this.ctx.drawImage(scoreboardImage, 52 * Number(count[0] || 0), 0, 52, 93, x, y, 52 / 2, 93 / 2)
    this.ctx.drawImage(scoreboardImage, 52 * Number(count[1] || 0), 0, 52, 93, x + 52 / 2, y, 52 / 2, 93 / 2)
    this.ctx.drawImage(scoreboardImage, 52 * Number(count[2] || 0), 0, 52, 93, x + 52, y, 52 / 2, 93 / 2)
  }
}