import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Interaction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { GetDiscordToken } from "@/config";
import fs from 'node:fs';
import path from 'node:path';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const interaction_handlers = new Collection<string, (interaction: Interaction) => Promise<void>>();

// Grab all the command folders from the commands directory you created earlier
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));;

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const command = require(filePath);
  if ('data' in command && 'handler' in command) {

    const data = command.data;
    if (data instanceof SlashCommandBuilder) {
      if (data.name !== file.slice(0, -3)) {
        console.log(`[WARNING] The command name (${command.data.toJSON()["name"]}) at ${filePath} is different from the file name.`);
        continue;
      }
      interaction_handlers.set(data.name, command.handler);
    }
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "handler" property.`);
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const handler = interaction_handlers.get(interaction.commandName);

  if (!handler) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await handler(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
    }
  }
});


// Start discord bot
client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.login(GetDiscordToken())
