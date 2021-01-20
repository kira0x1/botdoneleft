// import { Guild } from "discord.js"

// export async function findGuild(discordId: string): Promise<IUser> {
//     try {
//         const user = await User.findOne({ discordId: discordId })
//         return user
//     } catch (error) {
//         console.error(error)
//         return error
//     }
// }

// export async function findOrCreateGuild(id: string, guild: Guild) {
//     let user = await findUser(id)
//     if (!user) user = await createUser(member)
//     return user
// }

// export async function createGuild(guild: Guild) {
//     try {
//         if (user instanceof GuildMember) return await new User(converMemberToIUser(user)).save()
//         return await new User(user).save()
//     }
//     catch (error) {
//         console.error(error)
//     }
// }