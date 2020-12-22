import { findAllUsers } from '../../mongodb/api/userApi'
import { Command } from "../../types/bdl";
import { MessageEmbed } from 'discord.js';
import { embedColor } from '../../util/styleUtil';

export const command: Command = {
    name: 'ListUsers',
    description: "List all users in the database",
    aliases: ['ls'],
    permissions: ['admin'],

    async execute(message, args) {
        const users = await findAllUsers();

        const embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle(`Users: ${users.length}`)

        users.map((user, i) => embed.addField(`${i + 1}: ${user.username}`, user.discordId))

        message.channel.send(embed)
    }
}