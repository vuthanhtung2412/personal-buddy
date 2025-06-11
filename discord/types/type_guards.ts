// IDK how to classify these type guards
import { DiscordAPIError } from "discord.js"

export function isDiscordAPIError(err: any): err is DiscordAPIError {
  return (
    !!err &&
    typeof err === "object" &&
    "code" in err &&
    "method" in err &&
    "name" in err &&
    "rawError" in err &&
    "requestBody" in err &&
    "status" in err &&
    "url" in err &&
    typeof err.code === "number" &&
    typeof err.status === "number" &&
    typeof err.name === "string"
  );
}
