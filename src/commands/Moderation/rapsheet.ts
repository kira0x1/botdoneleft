import { findOrCreate } from "../../mongodb/api/userApi";
import { Command } from "../../types/bdl";
import { createRapsheetField, getTarget } from "../../util/discordUtil";
import { createFooter, wrap } from "../../util/styleUtil";

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
            .setTitle('Rapsheet')
            .setDescription(`${target}\n${wrap(target.id)}`)
            .setThumbnail(target.user.avatarURL({ dynamic: true }))

        const warnings = []
        user.rapsheet.filter(r => r.punishment === 'warn').map(rap => {
            warnings.push(createRapsheetField(rap))
        })

        embed.addField(`Warnings: ${warnings.length}`, warnings.join('\n') || 'none')

        const mutes = []
        user.rapsheet.filter(r => r.punishment === 'mute').map(rap => {
            mutes.push(createRapsheetField(rap))
        })

        embed.addField(`Mutes: ${mutes.length}`, mutes.join('\n') || 'none')

        const gulags = []
        user.rapsheet.filter(r => r.punishment === 'gulag').map(rap => {
            gulags.push(createRapsheetField(rap))
        })

        embed.addField(`Gulags: ${gulags.length}`, gulags.join('\n') || 'none')
        embed.addField(`\u200b\nJoined`, target.joinedAt.toLocaleDateString())

        message.channel.send(embed)
    }
}