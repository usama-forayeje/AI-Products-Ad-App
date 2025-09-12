// 🤖 Server-side OpenAI configuration - SECURE
import { OpenAI } from "openai"

export const serverOpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-side only, not NEXT_PUBLIC_
})
