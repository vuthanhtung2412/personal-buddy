import { AiClient } from "./client";
// import { GetEnv } from "@/config";
import { Err, Ok } from "@/types/result";

// Unable to put reasoning tokens in `completion.usage?.completion_tokens_details?.reasoning_tokens`
// const DEV_MODEL = "deepseek-r1-distill-llama-70b"
// const PROD_MODEL = 'deepseek/deepseek-chat-v3-0324:free'
// const PROD_REASONING_MODEL = 'deepseek/deepseek-r1:free'
const DEV_MODEL = "llama-3.3-70b-versatile"

export const askAI = async (question: string) => {
  let model = DEV_MODEL
  // if (GetEnv() == "production") {
  //   model = PROD_MODEL
  // }
  const completion = await AiClient.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'user',
        content: question,
      },
    ],
  });

  if (!completion.choices[0]?.message) {
    return new Err("No choices returned from AI");
  }
  return new Ok(completion.choices[0]?.message)

}

export const askReasoningAI = async (question: string) => {
  let model = DEV_MODEL
  // if (GetEnv() == "production") {
  //   model = PROD_REASONING_MODEL
  // }
  const completion = await AiClient.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'user',
        content: question,
      },
    ],
  });
  return completion.choices[0]?.message;
}
