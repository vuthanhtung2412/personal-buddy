import { SlashCommandBuilder, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!')

export async function handler(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  await interaction.reply('Pong!');
}
