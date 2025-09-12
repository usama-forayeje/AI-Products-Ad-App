"use client";

import { useAuthContext } from "@/app/provider";
import { db } from "@/configs/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Eye, Loader2, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// 🔹 Types
type PreviewProductType = {
  id: string;
  email: string;
  status: string;
  productDescription: string;
  productSize: string;
  finalProductUrl?: string;
  productUrl?: string;
  createdAt?: string;
  imageToVideoStatus?: string;
  imageToVideoUrl?: string;
};

function PreviewResult() {
  const { user } = useAuthContext();
  const [productsList, setProductsList] = useState<PreviewProductType[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Firestore Listener
  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, "user_ads"),
      where("email", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchDocs: PreviewProductType[] = [];
      snapshot.forEach((doc) => {
        matchDocs.push({ id: doc.id, ...doc.data() } as PreviewProductType);
      });
      setProductsList(matchDocs);
    });

    return () => unsubscribe();
  }, [user?.email]);

  // 🔹 Date Formatter (short)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔹 Download Image
  const downloadImage = async (url: string) => {
    try {
      const result = await fetch(url);
      const blob = await result.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "Usama_Forayaje_AI.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("✅ Image downloaded successfully!");
    } catch (error) {
      toast.error("❌ Failed to download image.");
    }
  };

  const GenerateVideo = async (config: any) => {
    setLoading(true);
    const result = await axios.post("/api/generate-product-video", {
      imageUrl: config?.finalProductUrl,
      imageToVideoPrompt: config?.imageToVideoPrompt,
      uid: user?.uid,
      docId: config?.id,
    });
    setLoading(false);

    console.log(result.data);
  };

  return (
    <div className="p-6 rounded-2xl bg-muted/40">
      <h2 className="text-3xl font-bold mb-6">✨ Generated Products</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {productsList.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden shadow-md rounded-2xl hover:shadow-xl transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="truncate text-lg font-semibold">
                {product.productDescription.toUpperCase()}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {formatDate(product.createdAt)}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 🔹 Pending State → Skeleton */}
              {product.status === "pending" ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-[200px] rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded" />
                    <Skeleton className="h-8 w-16 rounded" />
                    <Skeleton className="h-8 w-24 rounded" />
                  </div>
                </div>
              ) : (
                <>
                  {/* 🔹 Image */}
                  <Image
                    src={product.finalProductUrl || product.productUrl || ""}
                    alt={product.productDescription}
                    width={500}
                    height={500}
                    className="w-full h-[200px] object-cover rounded-lg border hover:scale-[1.02] transition-transform"
                  />

                  {/* 🔹 Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {/* Download */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() =>
                          downloadImage(
                            product.finalProductUrl || product.productUrl || ""
                          )
                        }
                      >
                        <Download className="w-5 h-5" />
                      </Button>

                      {/* View */}
                      <Link
                        href={
                          product.finalProductUrl || product.productUrl || ""
                        }
                        target="_blank"
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="cursor-pointer hover:bg-primary/10"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </Link>

                      {/* Play */}
                      {product?.imageToVideoUrl && (
                        <Link href={product?.imageToVideoUrl} target="_blank">
                          <Button
                            variant="ghost"
                            className="cursor-pointer hover:bg-primary/10"
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Animate */}

                    {!product?.imageToVideoUrl && (
                      <Button
                        className="gap-2 cursor-pointer bg-gradient-to-r from-purple-500
                     to-indigo-500 hover:opacity-90 transition text-white"
                        onClick={() => GenerateVideo(product)}
                        disabled={product.imageToVideoStatus === "pending"}
                      >
                        {product.imageToVideoStatus === "pending" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        Animate
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PreviewResult;
