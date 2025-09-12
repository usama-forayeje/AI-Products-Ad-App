import { db } from "@/configs/firebaseConfig";
import { imagekit } from "@/lib/imagekit";
import { replicate } from "@/lib/replicate";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, imageToVideoPrompt, uid, docId } = await req.json();
    if (!imageUrl || !imageToVideoPrompt || !uid || !docId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Mark video generation as pending
    await updateDoc(doc(db, "user_ads", docId), {
      imageToVideoStatus: "pending",
    });

    // 2️⃣ Generate video with Replicate
    const output = await replicate.run("wan-video/wan-2.2-i2v-fast", {
      input: {
        image: imageUrl,
        prompt: imageToVideoPrompt,
      },
    });

    const videoUrl = output.url(); // replicate returns a URL

    // 3️⃣ Fetch video from URL
    const response = await fetch(videoUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    // 4️⃣ Upload video to ImageKit
    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: `video_${Date.now()}_${uid}.mp4`,
      folder: "videos",
      isPublished: true,
    });

    // 5️⃣ Update Firestore with uploaded video URL and status
    await updateDoc(doc(db, "user_ads", docId), {
      imageToVideoUrl: uploadResult.url,
      imageToVideoStatus: "completed",
    });

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const currentCredits = userSnap.data().credits || 0;
    await updateDoc(userRef, {
      credits: currentCredits - 10, // deduct 5 credits
    });

    return NextResponse.json({ url: uploadResult.url, success: true });
  } catch (error) {
    console.error("=== VIDEO GENERATION ERROR ===", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
