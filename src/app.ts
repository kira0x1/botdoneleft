import { LoadCommands } from './system/commandLoader'
import { token } from './config'
import { BdlClient } from './types/bdl'
import { findCommand, sendArgsError } from './util/commandUtil'
import chalk from 'chalk';
import { wrap } from 'module';

export const bot = new BdlClient({
    presence: { activity: { name: 'Socialist\'s Trolling', type: 'WATCHING' } }
})

bot.on('ready', async () => {
    await LoadCommands(bot)
    console.log(chalk.bgMagenta.bold(`${bot.user.username} is online!`))
})

bot.on('message', async message => {
    // Make sure the user is not a bot, and the message starts with the prefix assigned
    // And make sure its not sent in a dm
    if (message.author.bot || !message.content.startsWith(bot.prefix) || message.channel.type === 'dm')
        return

    // Split up message into an array and remove the prefix
    let args = message.content.slice(bot.prefix.length).split(/ +/);

    // Remove the first element from the args array ( this is the command name )
    let commandName = args.shift();

    let command = findCommand(commandName)

    // If command not found send a message
    if (!command)
        return message.author.send(`command ${wrap(commandName || '')} not found`);

    if (command.args && args.length === 0) return sendArgsError(command, message)

    try {
        command.execute(message, args)
    }
    catch (error) {
        console.error(error)
    }
})

bot.login(token)