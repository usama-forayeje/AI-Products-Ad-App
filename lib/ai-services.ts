// lib/ai-services.ts
import { serverOpenAI } from "@/lib/openAI";
import { AIPrompts } from "@/types/product-ad";
import { genAI } from "./gimini";
import {
  ChatCompletionMessageParam,
  ChatCompletionContentPart,
} from "openai/resources/chat/completions";
import { Part } from "@google/generative-ai";

/**
 * 🎨 Generate AI prompts using OpenAI (SERVER-SIDE ONLY)
 */
export async function generateAIPrompts(
  productDescription: string,
  imageBase64?: string,
  avatar?: string
): Promise<AIPrompts> {
  try {
    const systemPrompt = `You are a professional marketing AI that creates stunning product advertisements.
    
Create hyper-realistic, high-resolution product showcase prompts featuring the product in the center.
Surround it with dynamic, visually appealing splashes or thematic props.
Bright, clean background, realistic shadows and reflections.
Add cinematic depth of field (bokeh) for a professional look.

Return ONLY valid JSON in EXACT format:
{
  "textToImage": "<detailed prompt for image generation>",
  "imageToVideo": "<detailed prompt for video generation>"
}
No extra text or explanation.`;

    const avatarSystemPrompt = `Create a vibrant product showcase image featuring the uploaded product image being held naturally by the uploaded avatar image. 
Position the product clearly in the avatar's hands, making it the focal point of the scene. Surround the product with dynamic splashes of liquid or relevant materials that complement the product.
Use a clean, colorful background to make the product stand out. Add subtle floating elements related to the product's flavor, ingredients, or theme for extra context and visual interest.
Ensure both the avatar and product are sharp, well-lit, and in focus, while motion and energy are conveyed though the splash effects. Also give me image to video prompt for same in JSON format: {
"textToImage": "<detailed prompt for image generation>"
"imageToVideo": "<detailed prompt for video generation>",}
No extra text or explanation.`;

    const userPrompt = `Product: ${productDescription}
    
Please create professional marketing prompts for this product.`;

    // Initialize user content as an array to handle text and multiple images
    const userContent: ChatCompletionContentPart[] = [
      { type: "text", text: userPrompt },
    ];

    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
      });
    }

    if (avatar) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${avatar}` },
      });
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          avatar && avatar.length > 2
            ? avatarSystemPrompt
            : systemPrompt.trim(),
      },
      { role: "user", content: userContent },
    ];

    const response = await serverOpenAI.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    let content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    content = content.replace(/```json\s*|```/g, "").trim();
    const prompts = JSON.parse(content) as AIPrompts;

    if (!prompts.textToImage || !prompts.imageToVideo) {
      throw new Error("Invalid prompt structure from OpenAI");
    }

    return prompts;
  } catch (error) {
    console.error("❌ OpenAI Prompt Generation Error:", error);
    throw new Error(
      `Failed to generate AI prompts: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * 🎬 Generate enhanced product image using Gemini ImageGeneration
 */
export async function generateProductImage(
  imageBase64: string,
  prompt: string,
  avatar?: string
): Promise<string> {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-image-preview",
      });

      const parts: Part[] = [
        { text: prompt },
        { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
      ];

      if (avatar) {
        parts.push({ inlineData: { data: avatar, mimeType: "image/jpeg" } });
      }

      const response = await model.generateContent({
        contents: [{ role: "user", parts }],
      });

      const candidate = response.response?.candidates?.[0];
      if (!candidate) throw new Error("No candidates returned from Gemini");

      for (const part of candidate.content.parts) {
        if ("inlineData" in part && part.inlineData?.data) {
          return part.inlineData.data;
        }
      }

      throw new Error("No image inlineData found in Gemini response");
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt === MAX_RETRIES - 1) {
        throw new Error(
          `Failed to generate product image after ${MAX_RETRIES} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }

  throw new Error("Failed to generate product image after all retries.");
}
