"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PreviewProductType } from "../creative-ai-tools/_components/PreviewResult";
import { useAuthContext } from "@/app/provider";
import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  PlayCircle,
  Sparkles,
  XCircle,
  Trash2,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function UserAdsList() {
  const [adsList, setAdsList] = useState<PreviewProductType[]>([]);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  // 🔹 Firestore Listener
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "user_ads"),
      where("email", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchDocs: PreviewProductType[] = [];
      snapshot.forEach((doc) => {
        matchDocs.push({ id: doc.id, ...doc.data() } as PreviewProductType);
      });
      // Sort by creation date, most recent first
      matchDocs.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAdsList(matchDocs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.email]);

  // 🔹 Date Formatter (short)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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
    if (!url) {
      toast.error("❌ Image URL not available.");
      return;
    }
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

  // 🔹 Delete Ad Function
  const handleDeleteClick = (adId: string) => {
    setAdToDelete(adId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!adToDelete) return;
    try {
      await deleteDoc(doc(db, "user_ads", adToDelete));
      toast.success("✅ Ad deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("❌ Failed to delete ad.");
    } finally {
      setIsModalOpen(false);
      setAdToDelete(null);
    }
  };

  // 🔹 Skeleton Loader
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {[...Array(4)].map((_, index) => (
        <Card
          key={index}
          className="flex flex-col animate-pulse overflow-hidden"
        >
          <Skeleton className="w-full aspect-[4/3] rounded-none" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
          <CardFooter className="flex gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-8 text-center md:text-left mt-5">
        My Ads
      </h2>

      {loading ? (
        <SkeletonLoader />
      ) : adsList.length === 0 ? (
        <div className="p-8 border-dashed border-2 rounded-2xl flex flex-col justify-center items-center mt-6 gap-4 bg-muted/20">
          <Image
            src={"/signboard.png"}
            alt="empty"
            width={120}
            height={120}
            className="w-20"
          />
          <h2 className="text-xl text-center">
            You don&apos;t have any ads. Let&apos;s create a new one!
          </h2>
          <Button>
            <Link href={"/creative-ai-tools/product-ad-generator"}>
              Create New Ad
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {adsList.map((ad) => (
            <Card
              key={ad.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col relative"
            >
              <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center">
                {ad.status === "completed" && ad.finalProductUrl ? (
                  <Image
                    src={ad.finalProductUrl}
                    alt={ad.productDescription || "Generated product ad"}
                    fill
                    className="object-cover"
                  />
                ) : ad.status === "failed" ? (
                  <div className="text-center text-destructive/80 p-4">
                    <XCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Generation Failed</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm">In Progress...</p>
                  </div>
                )}
              </div>
              <CardHeader className="flex-1">
                <CardTitle className="text-lg font-semibold truncate">
                  {ad.productDescription}
                </CardTitle>
                <CardDescription className="text-sm">
                  {ad.productSize} • {formatDate(ad.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center p-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => downloadImage(ad.finalProductUrl)}
                    disabled={ad.status !== "completed"}
                  >
                    <Download size={16} />
                  </Button>
                  {ad.imageToVideoUrl &&
                    ad.imageToVideoStatus === "completed" && (
                      <Button variant="outline" size="icon" asChild>
                        <Link href={ad.imageToVideoUrl} target="_blank">
                          <PlayCircle size={16} />
                        </Link>
                      </Button>
                    )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(ad.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <Button asChild className="flex items-center gap-1">
                  <Link href={`/dashboard/ads/${ad.id}`}>
                    <Eye size={16} />
                    <span className="hidden sm:inline">View</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your ad
              and its associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UserAdsList;
