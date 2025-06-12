import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Interaction,
  MessageFlags,
  REST,
  Routes
} from 'discord.js';
import { GetDiscordToken, GetAppId } from "@/config";
import fs from 'node:fs';
import path from 'node:path';
import { isDiscordCommand } from '@/types/types';
import { getCommandsFromN8n } from '@/lib/n8n';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function loadCommands() {
  // Load local file-based commands
  const interaction_handlers = new Collection<string, (interaction: Interaction) => Promise<void>>();
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');

  // Load commands from local files
  if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const command = require(filePath);

      if (!isDiscordCommand(command)) {
        throw new Error(`[ERROR] The command defined at ${filePath} doesn't conform to DiscordCommand type`);
      }

      const data = command.data;
      if (data.name !== file.slice(0, -3)) {
        console.log(`[WARNING] The command name (${data.toJSON()["name"]}) at ${filePath} is different from the file name.`);
        continue;
      }

      commands.push(data.toJSON());
      interaction_handlers.set(data.name, command.handler);
      console.log(`[INFO] Loaded local command: ${data.name}`);
    }
  }

  // Load N8n commands
  const n8nCommands = await getCommandsFromN8n();

  for (const command of n8nCommands) {
    if (!isDiscordCommand(command)) {
      throw new Error(`[ERROR] N8n command doesn't conform to DiscordCommand type:` +
        `${command}`);
    }

    const data = command.data;

    // Check for name conflicts
    if (interaction_handlers.has(data.name)) {
      console.log(`[WARNING] Command name conflict: ${data.name} already exists, skipping N8n command`);
      continue;
    }

    interaction_handlers.set(data.name, command.handler);
    commands.push(data.toJSON());
    console.log(`[INFO] Loaded N8n command: ${data.name}`);
  }

  // register commands with Discord
  const rest = new REST().setToken(GetDiscordToken());
  try {
    rest.put(
      Routes.applicationCommands(GetAppId()),
      { body: commands },
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    throw new Error(`[ERROR] Failed to register commands: ${error}`);
  }

  console.log("Registered commands : \n",
    commands.map((e) => e.name)
  )

  // Set up interaction handler
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const handler = interaction_handlers.get(interaction.commandName);
    if (!handler) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    await handler(interaction);
  });

  console.log(`[INFO] All commands + handlers registered successfully.`);
}


// Start discord bot
client.once(Events.ClientReady, async readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  // Load all commands after the client is ready
  await loadCommands();
});

client.login(GetDiscordToken());
