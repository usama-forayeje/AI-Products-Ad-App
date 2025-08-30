import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_URL!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVET_KEY!,
});
