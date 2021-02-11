import { setGulagRole } from '../../mongodb/api/serverApi';
import { Command } from '../../types/bdl';

export const command: Command = {
    name: 'SetGulagRole',
    description: 'Set the role to assign members when they are gulaged by the bot',
    aliases: ['setGulag'],
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
            const server = await setGulagRole(role.id, message.guild)
            message.channel.send(`Gulag Role set succesfuly`)
        } catch (error) {
            console.error(error)
            message.channel.send(`Error trying to save mute-role to database`)
        }
    }
}