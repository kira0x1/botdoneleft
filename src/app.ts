import { token } from './config'
import { BdlClient } from './types/bdl'

const bot = new BdlClient({
    presence: { activity: { name: 'Socialist\'s Trolling', type: 'WATCHING' } }
})

bot.on('ready', () => {
    console.log('meow')
})

bot.on('message', async message => {
    if (message.author.bot) return
})

bot.login(token)