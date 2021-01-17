import { GuildMember } from "discord.js";
import { findUser } from "../mongodb/api/userApi";
import { BdlClient } from "../types/bdl";

export async function init(client: BdlClient) {
    client.on('guildMemberAdd', onMemberJoin);
}

export async function onMemberJoin(member: GuildMember) {
    const id = member.id;
    const foundUser = await findUser(id);

    if (!foundUser) {
        console.log("user not found in db");
        return;
    }

    console.log(`found user: ${foundUser.username}\nRoles:`);
    console.table(foundUser.roles)
    console.table(foundUser.rapsheet)
    // console.log(foundUser.roles.map(r => `\t${r.name}`).join(',\n'))
}
