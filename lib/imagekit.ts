import ImageKit from "imagekit";
import { Transformation } from "imagekit/dist/libs/interfaces/Transformation";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
});

export const getImageKitUrl = (
  filePath: string,
  transformation?: Transformation[]
) => {
  return imagekit.url({
    path: filePath,
    transformation: transformation,
  });
};
