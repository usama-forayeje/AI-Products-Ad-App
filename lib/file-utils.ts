// 📁 Clean file handling utilities
import { imagekit } from "@/lib/imagekit";

/**
 * 🖼️ Process uploaded file and convert to base64
 */
export async function processUploadedFile(file: File): Promise<{
  buffer: Buffer;
  base64: string;
  mimeType: string;
}> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    return { buffer, base64, mimeType };
  } catch (error) {
    throw new Error(
      `Failed to process file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * 🌐 Download image from URL and convert to base64
 */
export async function processImageUrl(imageUrl: string): Promise<{
  buffer: Buffer;
  base64: string;
  mimeType: string;
}> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = response.headers.get("content-type") || "image/jpeg";

    return { buffer, base64, mimeType };
  } catch (error) {
    throw new Error(
      `Failed to process image URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * ☁️ Upload image to ImageKit with retry logic
 */
export async function uploadToImageKit(
  base64Data: string,
  mimeType: string,
  fileName: string,
  folder: string,
  retries = 3
): Promise<{ url: string; fileId: string }> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await imagekit.upload({
        file: `data:${mimeType};base64,${base64Data}`,
        fileName,
        isPublished: true,
        folder,
      });

      return {
        url: result.url,
        fileId: result.fileId,
      };
    } catch (error) {
      console.error(`❌ ImageKit upload attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        throw new Error(
          `Failed to upload to ImageKit after ${retries} attempts`
        );
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw new Error("Upload failed after all retries");
}

/**
 * 🧹 Memory cleanup utility
 */
export function cleanupBuffers(...buffers: (Buffer | undefined)[]): void {
  buffers.forEach((buffer) => {
    if (buffer && typeof buffer === "object") {
      // Force garbage collection hint
      buffer.fill(0);
    }
  });
}
