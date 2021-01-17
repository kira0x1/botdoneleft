import { onMemberJoin } from '../../system/rolePersist'
import { Command } from "../../types/bdl";
import { getTarget } from '../../util/discordUtil';

export const command: Command = {
    name: 'TestJoin',
    aliases: ['tj'],
    description: "Tests join event listener",
    args: true,
    permissions: ["admin"],

    async execute(message, args) {
        const target = await getTarget(args.join(' '), message);

        if (!target) return message.reply('Failed to find member, please use a proper id or mention')
        onMemberJoin(target);
    }
}