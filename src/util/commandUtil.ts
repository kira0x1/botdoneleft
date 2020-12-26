import { Message, MessageEmbed } from 'discord.js';
import { bot } from '../app';
import { Command, CommandGroup } from '../types/bdl';
import { embedColor, wrap } from './styleUtil';

export function findCommand(commandName: string): Command | undefined {
    commandName = commandName.toLowerCase()

    let commandFound: Command | undefined

    const commands = []
    bot.commands.array().map(c => c.commands.map(cmd => commands.push(cmd)))

    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i]

        if (cmd.name.toLowerCase() === commandName || cmd.aliases.find(a => a.toLowerCase() === commandName)) {
            commandFound = cmd
            break;
        }
    }

    return commandFound
}

export function findCommandGroup(groupName: string): CommandGroup | undefined {
    groupName = groupName.toLowerCase()

    let groupFound: CommandGroup | undefined

    const commandGroups = bot.commands.array()

    for (let i = 0; i < commandGroups.length; i++) {
        const group = commandGroups[i]
        if (group.name.toLowerCase() === groupName || group.aliases.find(a => a.toLowerCase() === groupName)) {
            groupFound = group;
            break;
        }
    }

    return groupFound
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