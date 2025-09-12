// lib/ai-services.ts
import { serverOpenAI } from "@/lib/openAI";
import { AIPrompts } from "@/types/product-ad";
import { genAI } from "./gimini";

/**
 * 🎨 Generate AI prompts using OpenAI (SERVER-SIDE ONLY)
 */
export async function generateAIPrompts(
  productDescription: string,
  imageBase64?: string
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

    const userPrompt = `Product: ${productDescription}
    
Please create professional marketing prompts for this product.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    if (imageBase64) {
      messages[1].content = [
        { type: "text", text: userPrompt },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
        },
      ];
    }

    const response = await serverOpenAI.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

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
  prompt: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview", // ✅ correct model
    });

    const response = await model.generateContent({
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    });

    const candidate = response.response?.candidates?.[0];
    if (!candidate) throw new Error("No candidates returned from Gemini");

    for (const part of candidate.content.parts) {
      if ("inlineData" in part && part.inlineData?.data) {
        return part.inlineData.data; // Base64 image
      }
    }

    throw new Error("No image inlineData found in Gemini response");
  } catch (error) {
    console.error("❌ Gemini Image Generation Error:", error);
    throw new Error(
      `Failed to generate product image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

