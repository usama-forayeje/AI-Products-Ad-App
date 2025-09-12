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
    const systemPrompt = `You are a world-class creative marketing AI that designs next-level, ultra-realistic product advertisements.  

Craft hyper-detailed, photorealistic, high-resolution showcase prompts where the product is the absolute centerpiece, flawlessly integrated with natural textures, shadows, and reflections so it feels tangible and real.  
Enhance the scene with dynamic, visually striking splashes, particles, or thematic props that match the product’s identity and amplify its appeal.  
Use a vibrant, clean background with cinematic lighting and depth of field (bokeh) to create a premium, studio-quality look.  
Incorporate subtle glow, motion, and atmospheric effects to add energy while keeping the product crisp and in perfect focus.  
Final output should feel like a luxury commercial shoot — polished, immersive, and irresistibly engaging.  

Return ONLY valid JSON in EXACT format:  
{  
  "textToImage": "<detailed prompt for image generation>",  
  "imageToVideo": "<detailed prompt for video generation>"  
}  
No extra text or explanation.`;

    const avatarSystemPrompt = `You are a world-class creative marketing AI that designs next-level, ultra-realistic avatar + product advertisements.  

Craft hyper-detailed, photorealistic, high-resolution showcase prompts where the avatar naturally and convincingly holds the product.  
Ensure the product looks seamlessly integrated in the avatar’s hands with lifelike grip, correct proportions, realistic shadows, and subtle reflections, so it feels truly part of the scene.  
Focus on cinematic lighting that highlights both the avatar and the product, making them sharp, vivid, and ultra-real.  
Surround the product with dynamic, visually striking splashes, glowing particles, or thematic elements that enhance its flavor, style, or brand story.  
Use a clean yet premium background with soft gradients and depth of field (bokeh) for a professional, studio-quality look.  
Add subtle atmosphere (motion blur, energy trails, or floating elements) to convey excitement while keeping the product crystal clear as the hero of the shot.  
The final image should look like a luxury commercial campaign — immersive, authentic, and irresistibly engaging.  

Return ONLY valid JSON in EXACT format:  
{  
  "textToImage": "<detailed prompt for image generation>",  
  "imageToVideo": "<detailed prompt for video generation>"  
}  
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
