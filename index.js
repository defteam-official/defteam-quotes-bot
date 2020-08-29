import { VK } from 'vk-io'
import { green } from 'chalk'
import { config } from 'dotenv'
import { QuoteCreator } from './QuoteCreator'
import fs from 'fs'

config()

const vk = new VK({
    token: process.env.TOKEN
})

const quoteCreator = new QuoteCreator()

vk.updates.on('message_new', async (context) => {
    const { text, replyMessage } = context

    if (text === '!цитата') {
        if (replyMessage) {
            const { text, senderId } = replyMessage

            if (text) {
                const user = await vk.api.users.get({
                    user_ids: senderId,
                    fields: 'photo_400_orig'
                })

                const { first_name, last_name, photo_400_orig } = user[0]

                await quoteCreator.create(text, { name: `${first_name} ${last_name}`, photo: photo_400_orig })
                await context.sendPhotos({
                    value: quoteCreator.outputPath
                })
                fs.unlink(quoteCreator.outputPath, () => {})
            }
        } else {
            await context.send('Ошибка! Цитата не найдена')
        }
    }
})

void (async () => {
    await vk.updates.start()
    console.log(green('Bot started!'))
})()
