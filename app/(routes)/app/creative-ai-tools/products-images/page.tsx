"use client";
import React, { useEffect, useState } from "react";
import FormInput from "../_components/FormInput";
import PreviewResult from "../_components/PreviewResult";
import axios from "axios";
import { useAuthContext } from "@/app/provider";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import toast from "react-hot-toast";

type FormData = {
  file: File | null;
  description: string;
  size: string;
  imageUrl?: string;
  avatar?: string;
};

interface UserData {
  credits?: number;
  displayName?: string;
  email?: string;
  photoURL?: string;
  uid?: string;
}

const ProductImages = ({
  title,
  enableAvatar,
}: {
  title: string;
  enableAvatar?: boolean;
}) => {
  const [formData, setFormData] = useState<FormData>({
    file: null,
    description: "",
    size: "",
    imageUrl: "",
  });

  const router = useRouter();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check if user is logged in
  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  // Listen to real-time user data for credits
  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserData);
        } else {
          setUserData(null);
        }
      },
      (error) => {
        console.error("Error fetching user data:", error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const onHandleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const OnGenerate = async () => {
    // Check if user has sufficient credits
    const userCredits = userData?.credits || 0;

    if (userCredits <= 0) {
      toast.error("❌ Insufficient Credits! Please buy credits to continue.");
      router.push("/app");
      return;
    }

    // Existing validation
    if (!formData.file && !formData.imageUrl) {
      toast.error("Please upload an image or provide a URL.");
      return;
    }

    if (!formData.description || !formData.size) {
      toast.error("Please enter a description and size.");
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();
      if (formData.file) {
        formPayload.append("file", formData.file);
      } else if (formData.imageUrl) {
        formPayload.append("imageUrl", formData.imageUrl);
      }
      formPayload.append("description", formData.description);
      formPayload.append("size", formData.size || "1028x1028");
      formPayload.append("userEmail", user?.email || "");
      formPayload.append("avatar", formData.avatar || "");

      const result = await axios.post(
        "/api/generate-product-image",
        formPayload
      );
      console.log(result.data);

      // Show success message with remaining credits
      const remainingCredits = Math.max(0, userCredits - 1);
      toast.success(
        `✅ Image generated successfully!\n\nRemaining Credits: ${remainingCredits}`
      );
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("❌ Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-3">
        {title ? title : "AI Product Image Generator"}
      </h2>

      {/* Credits Warning Banner */}
      {userData && userData.credits !== undefined && userData.credits <= 5 && (
        <div
          className={`mb-4 p-3 rounded-lg border ${
            userData.credits <= 0
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {userData.credits <= 0
                  ? "❌ No Credits Remaining!"
                  : `⚠️ Low Credits: ${userData.credits} remaining`}
              </p>
              <p className="text-sm">
                {userData.credits <= 0
                  ? "Purchase credits to generate images."
                  : "Consider purchasing more credits."}
              </p>
            </div>
            <button
              onClick={() => router.push("/app")}
              className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded hover:bg-primary/90 transition-colors"
            >
              Buy Credits
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col gap-4 justify-between">
          <FormInput
            onHandleInputChange={(field: string, value: string | unknown) =>
              onHandleInputChange(field, value)
            }
            onGenerate={OnGenerate}
            loading={loading}
            enableAvatar={enableAvatar}
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4 justify-between">
          <PreviewResult />
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
