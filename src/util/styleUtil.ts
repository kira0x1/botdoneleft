import { Message, MessageEmbed, EmbedField } from 'discord.js';

const redColor = 0xcf274e;
// const blueColor = 0x4e74e6;
// const oldBlueColor = 0x6788eb;

export const embedColor = redColor;

export function darken(...content: string[]): string {
    const tag = `\``;
    return wrap(content, tag);
}

export function wrap(content: string[] | string, wrap: string = '`'): string {
    if (typeof content === 'string') return wrap + content + wrap;

    return content
        .filter(str => str !== ``)
        .map(str => wrap + str + wrap)
        .join(' ');
}

export function createFooter(message: Message): MessageEmbed {
    const author = message.author

    const embed = new MessageEmbed()
        .setColor(embedColor)
        .setFooter(author.username, author.avatarURL({ dynamic: true }))
        .setTimestamp(Date.now());

    return embed;
}

export function quickEmbed(message: Message, content: string) {
    const embed = new MessageEmbed().setTitle(content).setColor(embedColor);
    message.channel.send(embed);
}

export function createEmptyField(inline?: boolean | false): EmbedField {
    return { name: `\u200b`, value: '\u200b', inline: inline };
}

export function addCodeField(embed: MessageEmbed, content: string, title?: string, blank?: boolean, lang = 'yaml', inline?: boolean | false) {
    const value = `\`\`\`${lang}\n${content}\`\`\``

    if (title && blank) title = `\u200b\n${title}`
    embed.addField(title ? title : `\u200b`, value, inline)
}