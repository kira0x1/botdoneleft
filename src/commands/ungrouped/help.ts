import { Command } from "../../types/bdl";
import { bot } from '../../app';
import { Message, MessageEmbed } from 'discord.js';
import { embedColor, wrap, createFooter } from '../../util/styleUtil';
import { findCommand } from '../../util/commandUtil';


export const command: Command = {
    name: 'help',
    aliases: ['h'],
    description: 'Lists all commands, and provides usage for specific command, query: strings',

    async execute(message, args) {
        const query = args.shift()?.toLowerCase();
        if (!query) return allCommands(message);

        singleCommand(message, query)
    }
}

function singleCommand(message: Message, query: string) {
    const command = findCommand(query)

    if (!command) {
        message.author.send(`Command ${wrap(query)} not found`);
        return;
    }

    //TODO Check for permissions
    // if (!hasPerms(message.author.id, query))
    // return message.author.send(`You do not have permission to use ${wrap(command.name)}`);


    const embed = InsertCommandEmbed(createFooter(message), command)
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
