// 🗄️ Clean database operations
import { collection, doc, getDocs, query, setDoc, updateDoc, where, type DocumentReference } from "firebase/firestore"
import { db } from "@/configs/firebaseConfig"
import { UserData } from "@/types/product-ad"

/**
 * 👤 Get user data from Firestore
 */
export async function getUserData(email: string): Promise<{
  userDoc: DocumentReference
  userData: UserData
}> {
  try {
    const userRef = collection(db, "users")
    const q = query(userRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      throw new Error("User not found")
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data() as UserData

    return {
      userDoc: userDoc.ref,
      userData,
    }
  } catch (error) {
    throw new Error(`Failed to get user data: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * ✅ Check if user has enough credits
 */
export function validateUserCredits(userData: UserData, requiredCredits = 5): void {
  if (!userData.credits || userData.credits < requiredCredits) {
    throw new Error(`Insufficient credits. You need at least ${requiredCredits} credits to generate an ad.`)
  }
}

/**
 * 📝 Create new product ad document
 */
export async function createProductAd(docId: string, email: string, description: string, size: string): Promise<void> {
  try {
    await setDoc(doc(db, "user_ads", docId), {
      email,
      status: "pending",
      productDescription: description,
      productSize: size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    throw new Error(`Failed to create product ad: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * 🔄 Update user credits
 */
export async function updateUserCredits(
  userDoc: DocumentReference,
  currentCredits: number,
  creditsToDeduct: number,
): Promise<void> {
  try {
    await updateDoc(userDoc, {
      credits: currentCredits - creditsToDeduct,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    throw new Error(`Failed to update user credits: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * ✨ Complete product ad with results
 */
export async function completeProductAd(
  docId: string,
  originalImageUrl: string,
  generatedImageUrl: string,
  textToImagePrompt: string,
  imageToVideoPrompt: string,
): Promise<void> {
  try {
    await updateDoc(doc(db, "user_ads", docId), {
      finalProductUrl: generatedImageUrl,
      productUrl: originalImageUrl,
      status: "completed",
      imageToVideoPrompt,
      textToImagePrompt,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    throw new Error(`Failed to complete product ad: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * ❌ Mark product ad as failed
 */
export async function markProductAdFailed(docId: string, errorMessage: string): Promise<void> {
  try {
    await updateDoc(doc(db, "user_ads", docId), {
      status: "failed",
      error: errorMessage,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to update ad status:", error)
  }
}

/**
 * 🆔 Generate unique document ID
 */
export function generateDocId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}