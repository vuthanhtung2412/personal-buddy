import {
  SlashCommandBuilder,
  Collection,
  Message,
  Interaction,
  MessageFlags
} from 'discord.js';
import { tryCatch } from "@/lib/try_catch";
import { isDiscordAPIError } from '@/types/type_guards';
import { askAI } from "@/lib/ai/ask";

export const data = new SlashCommandBuilder()
  .setName('tldr')
  .setDescription('summarize latest conversation in the channel')

export async function handler(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  await interaction.deferReply();

  const getMessageResult = await tryCatch(
    getChannelRecentMessages(interaction),
    isDiscordAPIError
  );

  if (getMessageResult.isErr()) {
    interaction.editReply(`Bot error : ${getMessageResult.error.name}`)
    console.error(getMessageResult.error)
    return;
  }

  const prompt = makePrompt(getMessageResult.value);

  const res = await askAI(prompt);
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

function makePrompt(messages: Collection<string, Message<boolean>>): string {
  let prompt = "<conversation>\n";

  // Convert messages to array and reverse to get chronological order
  const messagesArray = Array.from(messages.values()).reverse();

  for (const message of messagesArray) {
    const { id, content, author, createdAt, reference } = message;

    if (!content || content.trim() === '') continue; // Skip empty messages

    prompt += `  <message id="${id}" author="${author.username}" timestamp="${createdAt.toISOString()}"`;

    // Add reply_to attribute if this is a reply
    if (reference?.messageId) {
      prompt += ` reply_to="${reference.messageId}"`;
    }

    prompt += `>\n    ${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}\n  </message>\n\n`;
  }

  prompt += "</conversation>\n\n";
  prompt += "<instructions>\n";
  prompt += "  Please provide a concise summary of this conversation. Highlight the main topics discussed, any questions asked and answers provided, and any decisions or conclusions reached. Keep your summary to 3-4 sentences total.\n";
  prompt += "</instructions>";

  return prompt;
}

function getChannelRecentMessages(interaction: Interaction) {
  return interaction.channel?.messages.fetch({ limit: 100 }) || Promise.resolve(new Collection());
}
