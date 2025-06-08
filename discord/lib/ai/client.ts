import {
  GetGroqAPIKey,
  GetOpenRouterAPIKey,
  GetEnv
} from '@/config';
import OpenAI from 'openai';


export const AiClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: GetGroqAPIKey()
}
)

if (GetEnv() == "production") {
  AiClient.baseURL = 'https://openrouter.ai/api/v1'
  AiClient.apiKey = GetOpenRouterAPIKey()
}


