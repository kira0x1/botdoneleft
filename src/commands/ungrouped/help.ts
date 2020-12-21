import { Message, MessageEmbed } from 'discord.js';
import { bot } from '../../app';
import { Command, CommandGroup } from '../../types/bdl';
import { findCommand, findCommandGroup } from '../../util/commandUtil';
import { embedColor, wrap } from '../../util/styleUtil';


export const command: Command = {
    name: 'help',
    aliases: ['h'],
    description: 'Lists all commands, or provides usage for specific command',

    async execute(message, args) {
        const query = args.shift()?.toLowerCase();
        if (!query) return allCommands(message);
        singleCommand(message, query)
    }
}

function helpGroup(message: Message, commandGroup: CommandGroup) {
    const embed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(commandGroup.name)

    let groupDesc = `**Description**\n`
        + commandGroup.description + `\n\n**Aliases**\n ${wrap(commandGroup.aliases, '`')}`

    embed.setDescription(groupDesc)

    commandGroup.commands.map(cmd => {
        let desc = cmd.description;

        //Add aliases to the description
        if (cmd.aliases) {
            desc += `\naliases: ${wrap(cmd.aliases, '`')}`;
        }

        desc += `\n${getUsage(cmd)}`;

        embed.addField(cmd.name.toLowerCase(), desc)
    })


    message.channel.send(embed)
}

function singleCommand(message: Message, query: string) {
    const command = findCommand(query)

    if (!command) {
        const commandGroup = findCommandGroup(query)
        if (commandGroup) return helpGroup(message, commandGroup)

        message.author.send(`Command ${wrap(query)} not found`);
        return;
    }

    //TODO Check for permissions
    // if (!hasPerms(message.author.id, query))
    // return message.author.send(`You do not have permission to use ${wrap(command.name)}`);



    const embed = new MessageEmbed().setColor(embedColor)
    InsertCommandEmbed(embed, command)
    message.channel.send(embed)
}


function allCommands(message: Message) {
    const embed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle("Commands")

    bot.commands.get("ungrouped").commands.map(cmd => {
        embed.addField(cmd.name, cmd.description)
    })

    bot.commands.map(group => {
        if (group.name !== "ungrouped")
            embed.addField(group.name, group.description)
    })

    message.channel.send(embed)
}

function InsertCommandEmbed(embed: MessageEmbed, command: Command) {
    embed.setTitle(command.name);
    embed.setDescription(command.description);
    embed.setColor(embedColor)

    if (command.usage) {
        embed.addField('Usage', wrap(command.usage, '`'));
    }

    if (command.aliases) {
        const aliasesString = wrap(command.aliases, '`');
        embed.addField('aliases: ', aliasesString);
    }

    return embed;
}

function getUsage(command: Command) {
    return command.usage ? wrap(`${bot.prefix}${command.name} ${command.usage}`, '`') : ``
}