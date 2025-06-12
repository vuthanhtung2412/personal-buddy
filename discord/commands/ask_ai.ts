import {
  Interaction,
  SlashCommandBuilder,
  MessageFlags,
} from 'discord.js';
import { askAI } from "@/lib/ai/ask";
import { tryCatch } from "@/lib/try_catch";
import { isDiscordAPIError } from '@/types/type_guards';

export const data = new SlashCommandBuilder()
  .setName('ask_ai')
  .setDescription('ask AI simple question')
  .addStringOption(option =>
    option
      .setName('message')
      .setDescription('message to ai')
      .setRequired(true))

export async function handler(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const message = interaction.options.getString("message", true)

  await interaction.deferReply();

  const res = await askAI(
    `Please answer the question below concisely under 2000 character` +
    `\n---\n ` +
    `${message}`)

  if (res.isErr()) {
    interaction.editReply(`Error fetching AI response: ${res.error}`);
    return;
  }
  const content = res.value.content;

  if (!content) {
    interaction.editReply("Bot have nothing to say")
    return;
  }

  const result = await tryCatch(
    interaction.followUp(content),
    isDiscordAPIError
  );

  if (result.isErr()) {
    await interaction.deleteReply();
    await interaction.followUp({
      content: `Bot error : ${result.error.name}`,
      flags: MessageFlags.Ephemeral
    })
    console.error(result.error)
  }
}
