import { findOrCreateTimedBanUser } from "../../mongodb/api/timedBansApi";
import { Command } from "../../types/bdl";
import { getTarget, createOverrideField } from '../../util/discordUtil';
import { createFooter, wrap } from '../../util/styleUtil';

export const command: Command = {
    name: 'Override',
    aliases: ['ov'],
    description: 'lists moderation overrides for a user',
    args: true,
    permissions: ["admin"],

    async execute(message, args) {
        const target = await getTarget(args[0], message) || message.member
        const user = await findOrCreateTimedBanUser(target)

        if (!user) {
            return message.channel.send('user not found')
        }

        const embed = createFooter(message)
            .setTitle(`Overrides: ${target.displayName}`)
            .setDescription(`${target}\n${wrap(target.id)}`)
            .setThumbnail(target.user.avatarURL({ dynamic: true }))

        const mutes = []
        user.overrides.filter(ov => ov.punishment === 'mute')
            .map(ov => mutes.push(createOverrideField(ov)))

        const gulags = []
        user.overrides.filter(ov => ov.punishment === "gulag")
            .map(ov => mutes.push(createOverrideField(ov)))

        embed.addField(`Mutes: ${mutes.length}`, mutes.join('\n') || 'none')
        embed.addField(`Gulags: ${gulags.length}`, gulags.join('\n') || 'none')

        embed.addField(`\u200b\nJoined`, target.joinedAt.toLocaleDateString())
        message.channel.send(embed)
    }
}