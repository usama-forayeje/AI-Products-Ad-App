// app/api/generate-product-image/route.ts
import { type NextRequest, NextResponse } from "next/server";
import type { ProductAdResponse } from "@/types/product-ad";
import {
  processUploadedFile,
  processImageUrl,
  uploadToImageKit,
  cleanupBuffers,
} from "@/lib/file-utils";
import { generateAIPrompts, generateProductImage } from "@/lib/ai-services";
import {
  getUserData,
  validateUserCredits,
  createProductAd,
  updateUserCredits,
  completeProductAd,
  markProductAdFailed,
  generateDocId,
} from "@/lib/database-utils";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ProductAdResponse>> {
  let docId: string | null = null;
  let buffer: Buffer | undefined;
  let generatedBuffer: Buffer | undefined;

  try {
    console.log("🔍 Parsing form data...");
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const description = (formData.get("description") as string)?.trim();
    const size = (formData.get("size") as string) || "1024x1024";
    const imageUrl = (formData.get("imageUrl") as string)?.trim();
    const userEmail = (formData.get("userEmail") as string)?.trim();
    const avatar = (formData.get("avatar") as string)?.trim();

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { success: false, message: "Product description is required" },
        { status: 400 }
      );
    }

    if (!file && !imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide either a file or image URL",
        },
        { status: 400 }
      );
    }

    console.log("👤 Checking user data and credits...");
    const { userDoc, userData } = await getUserData(userEmail);
    validateUserCredits(userData, 5);

    console.log("📝 Creating product ad document...");
    docId = generateDocId();
    await createProductAd(docId, userEmail, description, size);

    console.log("🖼️ Processing image...");
    let imageBase64: string;
    let avatarBase64: string | undefined;
    let mimeType: string;

    if (file) {
      const fileData = await processUploadedFile(file);
      buffer = fileData.buffer;
      imageBase64 = fileData.base64;
      mimeType = fileData.mimeType;
    } else if (imageUrl) {
      const urlData = await processImageUrl(imageUrl);
      buffer = urlData.buffer;
      imageBase64 = urlData.base64;
      mimeType = urlData.mimeType;
    } else {
      throw new Error("No valid image source provided");
    }

    if (avatar) {
      const avatarData = await processImageUrl(avatar);
      avatarBase64 = avatarData.base64;
    }

    console.log("☁️ Uploading original image...");
    const originalUpload = await uploadToImageKit(
      imageBase64,
      mimeType,
      `product_${docId}_original.jpg`,
      "/product_ads/originals/"
    );

    console.log("🤖 Generating AI prompts...");
    const prompts = await generateAIPrompts(
      description,
      imageBase64,
      avatarBase64
    );

    console.log("🎨 Generating enhanced product image...");
    const generatedImageBase64 = await generateProductImage(
      imageBase64,
      prompts.textToImage,
      avatarBase64
    );

    generatedBuffer = Buffer.from(generatedImageBase64, "base64");

    console.log("☁️ Uploading generated image...");
    const generatedUpload = await uploadToImageKit(
      generatedImageBase64,
      "image/jpeg",
      `product_${docId}_generated.jpg`,
      "/product_ads/generated/"
    );

    console.log("💳 Updating user credits...");
    await updateUserCredits(userDoc, userData.credits, 5);

    console.log("✅ Completing product ad...");
    await completeProductAd(
      docId,
      originalUpload.url,
      generatedUpload.url,
      prompts.textToImage,
      prompts.imageToVideo
    );

    cleanupBuffers(buffer, generatedBuffer);

    console.log("🎉 Product ad generated successfully!");
    return NextResponse.json({
      success: true,
      message: "🎉 Product ad generated successfully!",
      data: {
        docId,
        originalImageUrl: originalUpload.url,
        generatedImageUrl: generatedUpload.url,
        prompts,
        creditsRemaining: userData.credits - 5,
      },
    });
  } catch (error) {
    console.error("❌ Product Ad Generation Error:", error);

    cleanupBuffers(buffer, generatedBuffer);

    if (docId) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await markProductAdFailed(docId, errorMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    let statusCode = 500;
    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("User not found")
    ) {
      statusCode = 404;
    } else if (
      errorMessage.includes("credits") ||
      errorMessage.includes("Insufficient")
    ) {
      statusCode = 403;
    } else if (
      errorMessage.includes("required") ||
      errorMessage.includes("Invalid")
    ) {
      statusCode = 400;
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate product ad",
        error: "Failed to generate product ad",
        details: errorMessage,
      },
      { status: statusCode }
    );
  }
}
