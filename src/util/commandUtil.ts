import { Message, MessageEmbed } from 'discord.js';
import { bot } from '../app';
import { BdlClient, commandGroup, Command } from '../types/bdl';
import { embedColor, wrap } from './styleUtil';

export function findCommand(commandName: string) {
    let commandFound

    if (!bot.commands) {
        return console.log('BOT IS UNDEFINED')
    }

    bot.commands.map(cmd => {
        commandFound = cmd.commands.find(c => c.name === commandName)
        if (commandFound) return
    })

    return commandFound
}

export function sendArgsError(command: Command, message: Message) {
    let usageString = 'Arguments required';
    const embed = new MessageEmbed().setColor(embedColor);

    if (command.usage) {
        usageString = command.name + ' ';
        usageString += wrap(command.usage, '`');
    }

    embed.addField('Arguments Required', usageString);
    return message.channel.send(embed);
}