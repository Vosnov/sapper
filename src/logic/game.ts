import { SapperInterface, Smile } from "./sapperInterface";
import { Difficult, Sapper } from "./sapper";

export class Game {
  sapper: Sapper
  sapperInterface: SapperInterface

  gameTimer?: NodeJS.Timer

  isDeadFlag = false
  isWinFlag = false

  constructor (public gameCanvas: HTMLCanvasElement, public interfaceCanvas: HTMLCanvasElement, public difficult: Difficult) {
    this.sapper = new Sapper(gameCanvas, difficult)

    interfaceCanvas.width = this.sapper.width + 40
    interfaceCanvas.height = this.sapper.height + 140

    this.sapperInterface = new SapperInterface(interfaceCanvas, this.sapper, this.reset.bind(this))

    this.start()
    this.sapperInterface.startTimer()
  }

  reset() {
    this.removeListeners()

    this.sapper = new Sapper(this.gameCanvas, this.difficult)
    this.sapperInterface = new SapperInterface(this.interfaceCanvas, this.sapper, this.reset.bind(this))

    this.isDeadFlag = false
    this.isWinFlag = false

    this.start()
    this.sapperInterface.startTimer()
  }

  start() {
    this.gameTimer = setInterval(() => {
      this.sapperInterface.draw()

      if (!this.sapper.isDead) {
        this.sapper.logicBeforeDraw()
        this.sapper.draw()
      }

      if (this.sapper.isDead && !this.isDeadFlag) {
        this.isDeadFlag = true
        this.sapper.removeListeners()
        this.sapperInterface.clearTimer()

        if (this.sapperInterface.buttonState !== Smile.Clicked) {
          this.sapperInterface.buttonState = Smile.Dead
        }
      }

      if (this.sapper.isWin && !this.isWinFlag) {
        this.isWinFlag = true
        alert('You win')
        this.sapper.removeListeners()
        this.sapperInterface.clearTimer()
        this.sapperInterface.buttonState = Smile.Win
        this.sapperInterface.drawButton()
      }
    }, 1000 / 60)
  }

  removeListeners() {
    clearInterval(this.gameTimer)
    this.sapper.removeListeners()
    this.sapperInterface.removeListeners()
  }
}