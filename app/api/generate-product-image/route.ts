import { imagekit } from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios"; // You'll need axios on the server to download the image

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const description = formData.get("description") as string;
    const size = formData.get("size") as string;
    const imageUrl = formData.get("imageUrl") as string;

    let base64file;

    if (file instanceof File) {
      // Case 1: A file was uploaded
      const arrayBuffer = await file.arrayBuffer();
      base64file = Buffer.from(arrayBuffer).toString("base64");
    } else if (imageUrl) {
      // Case 2: A sample image URL was provided
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      base64file = Buffer.from(response.data).toString("base64");
    } else {
        return new NextResponse("No image file or URL provided", { status: 400 });
    }

    // Now, upload the base64file to ImageKit
    const imageKitRef = await imagekit.upload({
      file: base64file,
      fileName: Date.now().toString() + ".png",
      isPublished: true,
    });

    console.log(imageKitRef.url);

    return NextResponse.json(imageKitRef.url);

  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}