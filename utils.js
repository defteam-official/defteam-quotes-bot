const FONT_SIZE_FACTOR = 0.4

export const wrapText = (obj) => {
    let { context, text, xPos, yPos, maxWidth, lineHeight, canvasWidth, canvasHeight } = obj
    const words = text.split(' ')
    let line = '"'

    if (context.measureText(text).width > maxWidth) {
        words.forEach(word => {
            const prevLine = `${line}${word} `
            const prevWidth = context.measureText(prevLine).width

            if (prevWidth > maxWidth) {
                context.fillText(line, xPos, yPos)
                line = `${word} `
                yPos += lineHeight
            } else {
                line = prevLine
            }
        })

        context.fillText(`${line}"`, xPos, yPos)
    } else {
        const { xPos, yPos } = getCenterPosition(canvasWidth, context.measureText(text).width, canvasHeight, lineHeight)
        context.fillText(`"${text}"`, xPos, yPos)
    }
}

export const clipperImage = (context, img, xPos, yPos, width, height, radius) => {
    context.beginPath()
    context.arc(xPos + radius, yPos + radius, radius, Math.PI, Math.PI + Math.PI / 2, false)
    context.lineTo(xPos + width - radius, yPos)
    context.arc(xPos + width - radius, yPos + radius, radius, Math.PI + Math.PI / 2, Math.PI * 2, false)
    context.lineTo(xPos + width, yPos + height - radius)
    context.arc(xPos + width - radius, yPos + height - radius, radius, Math.PI * 2, Math.PI / 2, false)
    context.lineTo(xPos + radius, yPos + height)
    context.arc(xPos + radius, yPos + height - radius, radius, Math.PI / 2, Math.PI, false)
    context.closePath()
    context.save()
    context.clip()
    context.drawImage(img, xPos, yPos, width, height)
    context.restore()
}

export const getFontSize = (text) => Math.round(48 - ((text.length / 10) * FONT_SIZE_FACTOR))

export const getCenterPosition = (canvasWidth, textWidth, canvasHeight, textHeight) => {
    return {
        xPos: canvasWidth / 2 - textWidth / 2,
        yPos: canvasHeight / 2 - textHeight / 2
    }
}
