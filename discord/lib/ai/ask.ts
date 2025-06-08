import { AiClient } from "./client";
import { GetEnv } from "@/config";

const DEV_MODEL = "llama-3.3-70b-versatile"
const PROD_MODEL = 'deepseek/deepseek-chat-v3-0324:free'
const PROD_REASONING_MODEL = 'deepseek/deepseek-r1:free'

export const askAI = async (question: string) => {
  let model = DEV_MODEL
  if (GetEnv() == "production") {
    model = PROD_MODEL
  }
  const completion = await AiClient.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'user',
        content: question,
      },
    ],
  });
  return completion.choices[0].message;
}

export const askReasoningAI = async (question: string) => {
  let model = DEV_MODEL
  if (GetEnv() == "production") {
    model = PROD_REASONING_MODEL
  }
  const completion = await AiClient.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'user',
        content: question,
      },
    ],
  });
  return completion.choices[0].message;
}
