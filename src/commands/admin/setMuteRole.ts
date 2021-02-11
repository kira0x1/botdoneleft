import { setMuteRole } from '../../mongodb/api/serverApi';
import { Command } from '../../types/bdl';

export const command: Command = {
    name: 'SetMuteRole',
    description: 'Set the role to assign members when they are muted by the bot',
    aliases: ['setMute'],
    args: true,
    permissions: ['admin'],
    usage: '[RoleID | RoleName]',

    async execute(message, args) {
        const roleQuery = args.join(' ').toLowerCase()
        const role = message.guild.roles.cache.find(r => r.id === roleQuery || roleQuery === r.name.toLowerCase())

        if (!role || role === null) {
            return message.channel.send(`Role \`${roleQuery}\` not found`)
        }

        try {
            const server = await setMuteRole(role.id, message.guild)
            message.channel.send(`Mute Role set succesfuly`)
        } catch (error) {
            console.error(error)
            message.channel.send(`Error trying to save mute-role to database`)
        }
    }
}