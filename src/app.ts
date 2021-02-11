import chalk from 'chalk';
import { token } from './config';
import { findOrCreateServer } from './mongodb/api/serverApi';
import { RefreshTimedBans } from './mongodb/api/timedBansApi';
import { connectToDB } from './mongodb/database';
import { LoadCommands } from './system/commandLoader';
import { BdlClient } from './types/bdl';
import { findCommand, sendArgsError } from './util/commandUtil';
import { checkPermission } from './util/discordUtil';
import { wrap } from './util/styleUtil';
import { Guild } from 'discord.js';

export const bot = new BdlClient({
    presence: { activity: { name: 'Socialist\'s Trolling', type: 'WATCHING' } }
})

connectToDB()

bot.on('ready', async () => {
    await LoadCommands(bot)
    RefreshTimedBans()
    console.log(chalk.bgMagenta.bold(`${bot.user.username} is online!`))

    // bot.guilds.cache.map(g => initServer(g))
})

bot.on('guildCreate', async (guild) => {
    initServer(guild)
})

async function initServer(guild: Guild) {
    const server = await findOrCreateServer(guild)
    const s = {
        name: server.name,
        serverId: server.guildId,
        muteRoleId: server.muteRoleId,
        gulagRoleId: server.gulagRoleId
    }
    console.table(s)
}

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

    if (!checkPermission(message.member, command)) {
        message.member.send("You dont have enough permissions to use that command")
        return;
    }

    if (command.args && args.length === 0) return sendArgsError(command, message)

    try {
        command.execute(message, args)
    }
    catch (error) {
        console.error(error)
    }
})

bot.login(token)