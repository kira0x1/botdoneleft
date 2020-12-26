import { MessageEmbed } from "discord.js";
import { findOrCreate } from "../../mongodb/api/userApi";
import { Command } from "../../types/bdl";
import { getTarget } from "../../util/discordUtil";
import { createFooter, embedColor } from "../../util/styleUtil";

export const command: Command = {
    name: 'rapsheet',
    description: 'Retrieves a given users rapsheet',
    aliases: ['rs'],
    permissions: ["admin", 'moderator', 'janitor'],
    // args: true,
    usage: '[id | name]',

    async execute(message, args) {
        const target = getTarget(args[0], message) || message.member
        const id = target.id

        const user = await findOrCreate(id, target)

        if (!user) {
            return message.channel.send('user not found')
        }

        const embed = createFooter(message)
            .setTitle(`Rapsheet`)
            .setDescription(`${target}`)
            .setThumbnail(target.user.avatarURL({ dynamic: true }))

        const warnings = []
        user.rapsheet.filter(r => r.punishment === 'warn').map(w => {
            warnings.push(`${w.date} <@${w.moderatedBy}>\t\t${w.reason}`)
        })

        embed.addField(`Warnings: ${warnings.length}`, warnings.join('\n') || 'none')

        message.channel.send(embed)
    }
}