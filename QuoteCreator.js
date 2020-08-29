import path from 'path'
import fs from 'fs'
import { createCanvas, registerFont, loadImage } from 'canvas'
import { clipperImage, getFontSize, wrapText } from './utils'

export class QuoteCreator {
    #canvasWidth = 1200
    #canvasHeight = 720
    outputPath = path.resolve(__dirname, 'output', 'output.jpeg')

    constructor () {
        this.canvas = createCanvas(this.#canvasWidth, this.#canvasHeight)
        this.ctx = this.canvas.getContext('2d')

        this.#init()
    }

    #init () {
        registerFont('./font/Roboto-Medium.ttf', { family: 'Roboto Medium' })
        registerFont('./font/Roboto-Bold.ttf', { family: 'Roboto Bold' })
        registerFont('./font/Roboto-Black.ttf', { family: 'Roboto Black' })

        this.ctx.fillStyle = '#FFF'
    }

    #createTitle () {
        this.ctx.font = '36px "Roboto Black"'
        this.ctx.fillText('Фонд золотых цитат DefTeam', 385, 70)
    }

    #createBody (quotes) {
        const fontSize = getFontSize(quotes)
        this.ctx.font = `${fontSize}px "Roboto Bold"`

        wrapText({
            context: this.ctx,
            text: quotes,
            xPos: 227,
            yPos: 200,
            maxWidth: 840,
            lineHeight: fontSize,
            canvasWidth: this.#canvasWidth,
            canvasHeight: this.#canvasHeight
        })
    }

    async #createFooter ({ name, photo }) {
        const image = await loadImage(photo)
        clipperImage(this.ctx, image, 500, 590, 60, 60, 30)

        this.ctx.font = '24px "Roboto Medium"'
        this.ctx.fillText(name, 580, 627)
    }

    async create (quotes, user) {
        this.#createTitle()
        this.#createBody(quotes)
        await this.#createFooter(user)

        return new Promise((resolve, reject) => {
            const out = fs.createWriteStream(this.outputPath)
            const stream = this.canvas.createJPEGStream({
                quality: 0.95,
                chromaSubsampling: false
            })
            stream.pipe(out)

            out.on('finish', () => {
                this.ctx.clearRect(0, 0, this.#canvasWidth, this.#canvasHeight)
                resolve()
            })
            out.addListener('error', e => reject(e))
        })
    }
}
