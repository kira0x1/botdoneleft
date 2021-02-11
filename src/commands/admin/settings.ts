import { findOrCreateServer } from '../../mongodb/api/serverApi';
import { Command } from '../../types/bdl';
import { createFooter } from '../../util/styleUtil';

export const command: Command = {
    name: 'settings',
    aliases: [],
    permissions: ['admin'],
    description: 'Lists settings',

    async execute(message, args) {
        const server = await findOrCreateServer(message.guild)
        const embed = createFooter(message)
            .setTitle('Settings')
            .addField(`Mute Role`, server.muteRoleId ? server.muteRoleId : `not assigned`)
            .addField(`Gulag Role`, server.gulagRoleId ? server.gulagRoleId : `not assigned`)

        message.channel.send(embed)
    }
}