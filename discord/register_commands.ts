import { GetAppId, GetDiscordToken } from '@/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const commands = [];
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
      commands.push(data.toJSON());
    }

  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "handler" property.`);
  }
}

console.log("commands created : \n", commands.map((e) => e.name))

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(GetDiscordToken());

(async () => {
  try {
    rest.put(
      Routes.applicationCommands(GetAppId()),
      { body: commands },
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
