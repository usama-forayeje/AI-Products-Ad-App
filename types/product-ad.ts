// 🎯 Clean TypeScript types for better development experience
export interface ProductAdRequest {
  file?: File;
  imageUrl?: string;
  description: string;
  size: string;
  userEmail: string;
}

export interface ProductAdResponse {
  success: boolean;
  message: string;
  data?: {
    docId: string;
    originalImageUrl: string;
    generatedImageUrl: string;
    prompts: {
      textToImage: string;
      imageToVideo: string;
    };
    creditsRemaining: number;
  };
  error?: string;
  details?: string;
}

export interface AIPrompts {
  textToImage: string;
  imageToVideo: string;
}

export interface UserData {
  email: string;
  credits: number;
  uid: string;
}

export interface ProductAd {
  id: string;
  email: string;
  status: "pending" | "completed" | "failed";
  productDescription: string;
  productSize: string;
  finalProductUrl?: string;
  productUrl?: string;
  createdAt: string;
  updatedAt: string;
  imageToVideoPrompt?: string;
  textToImagePrompt?: string;
  imageToVideoStatus?: "pending" | "completed" | "failed";
  imageToVideoUrl?: string;
  error?: string;
}
