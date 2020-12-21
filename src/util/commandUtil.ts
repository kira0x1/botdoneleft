import { Message, MessageEmbed } from 'discord.js';
import { bot } from '../app';
import { Command, CommandGroup } from '../types/bdl';
import { embedColor, wrap } from './styleUtil';

export function findCommand(commandName: string): Command | undefined {
    let commandFound: Command | undefined

    if (!bot.commands) {
        console.log('BOT IS UNDEFINED')
        return
    }

    bot.commands.map(cmd => {
        commandFound = cmd.commands.find(
            c =>
                //Check name
                c.name.toLowerCase() === commandName.toLowerCase() ||

                //Check aliases
                c.aliases.find(a => a.toLowerCase() === commandName.toLowerCase())
        )

        if (commandFound) return
    })

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