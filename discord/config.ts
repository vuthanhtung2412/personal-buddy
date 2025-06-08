export const GetDiscordToken = () => {
  const res = process.env.DISCORD_TOKEN;
  if (!res) {
    throw new Error("discord token is not set");
  }
  return res
}

export const GetGuildId = () => {
  const res = process.env.GUILD_ID;
  if (!res) {
    throw new Error("guild (server_id) is not set");
  }
  return res
}

export const GetAppId = () => {
  const res = process.env.DISCORD_APP_ID;
  if (!res) {
    throw new Error("app id is not set");
  }
  return res
}

export const GetAppPk = () => {
  const res = process.env.DISCORD_APP_PK;
  if (!res) {
    throw new Error("app public key is not set");
  }
  return res
}

export const GetEnv = () => {
  const res = process.env.NODE_ENV;
  if (!res) {
    return "development"
  }
  return res
}

export const GetOpenRouterAPIKey = () => {
  const res = process.env.OPEN_ROUTER_API_KEY;
  if (!res) {
    throw new Error("openrouter api key is not set");
  }
  return res
}

export const GetGroqAPIKey = () => {
  const res = process.env.GROQ_API_KEY;
  if (!res) {
    throw new Error("groq api key is not set");
  }
  return res
}

export const GetN8NAPIKey = () => {
  const res = process.env.N8N_API_KEY;
  if (!res) {
    throw new Error("n8n api key is not set");
  }
  return res
}
