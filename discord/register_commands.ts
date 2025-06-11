import { GetAppId, GetDiscordToken } from '@/config';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { isDiscordCommand } from '@/types/types';
import { getCommandsFromN8n } from '@/lib/n8n';

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));;

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const command = require(filePath);
  if (!isDiscordCommand(command)) {
    throw new Error(
      `[ERROR] The command defined at ${filePath} doesn't conform to DiscordCommand type`
    );
  }

  const data = command.data;
  if (data.name !== file.slice(0, -3)) {
    console.log(`[WARNING] The command name (${data.toJSON()["name"]}) at ${filePath} is different from the file name.`);
    continue;
  }
  commands.push(data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(GetDiscordToken());

(async () => {
  const n8nCommmands = await getCommandsFromN8n();
  commands.push(...n8nCommmands.map(
    (e) => e.data.toJSON())
  );

  console.log("Creating commands : \n",
    commands.map((e) => e.name)
  )

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
