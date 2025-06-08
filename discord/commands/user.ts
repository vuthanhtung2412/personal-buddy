import { SlashCommandBuilder, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('user')
  .setDescription('Provides information about the user.')

export async function handler(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  await interaction.reply(`This command was run by` +
    `${interaction.user.username}`)
}
