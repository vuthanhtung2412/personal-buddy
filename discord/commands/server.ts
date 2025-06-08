import { SlashCommandBuilder, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Provides information about the server.')

export async function handler(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  await interaction.reply(`This server is ${interaction.guild?.name} ` +
    `and has ${interaction.guild?.memberCount} members.`);
}
