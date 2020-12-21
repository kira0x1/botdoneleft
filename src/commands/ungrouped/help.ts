import { Command } from "../../types/bdl";
import { bot } from '../../app';
import { Message, MessageEmbed } from 'discord.js';
import { embedColor, wrap } from '../../util/styleUtil';

export const command: Command = {
    name: 'help',
    aliases: ['h'],
    description: 'Lists all commands, and provides usage for specific commands',

    async execute(message, args) {
        // const query = args.shift()?.toLowerCase();
        // if (!query) return
        AllCommands(message);
    }
}

function AllCommands(message: Message) {
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

    if (command.usage) {
        embed.addField('Usage', wrap(command.usage, '`'));
    }

    if (command.aliases) {
        const aliasesString = wrap(command.aliases, '`');
        embed.addField('aliases: ', aliasesString);
    }
    return embed;
}
