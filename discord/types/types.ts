// IDK how to classify the export in this file
//
import {
  Interaction,
  SlashCommandBuilder,
} from 'discord.js';

export type DiscordCommand = {
  data: SlashCommandBuilder;
  handler: (interaction: Interaction) => Promise<void>;
}

export const isDiscordCommand = (
  input: any
): input is DiscordCommand => {
  return (
    !!input &&
    typeof input === "object" &&
    "data" in input &&
    "handler" in input &&
    input.data instanceof SlashCommandBuilder &&
    input.handler instanceof Function
  )
}
