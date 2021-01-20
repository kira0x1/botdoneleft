import { Command } from "../../types/bdl";
import { getRole } from "../../util/discordUtil";
import { quickEmbed } from "../../util/styleUtil";

const command: Command = {
    name: 'PersistRole',
    description: 'Makes sure a role is re-added to a member even if they leave, and rejoin the server',
    aliases: ['pr', 'syncrole'],
    args: true,
    permissions: ["admin"],
    usage: '[role name | role id]',

    async execute(message, args) {
        const query = args.join(' ')
        const role = getRole(query, message)
        if (!role) return quickEmbed(message, `Could not find role: \"${query}\"`)
        
    }
}