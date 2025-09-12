import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_URL!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVET_KEY!,
});

// Helper function for client-side usage
export const getImageKitUrl = (filePath: string, transformations?: any[]) => {
  return imagekit.url({
    path: filePath,
    transformation: transformations,
  });
};
