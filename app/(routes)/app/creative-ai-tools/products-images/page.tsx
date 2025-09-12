"use client";
import React, { useState } from "react";
import FormInput from "../_components/FormInput";
import PreviewResult from "../_components/PreviewResult";
import axios from "axios";
import { useAuthContext } from "@/app/provider";

type FormData = {
  file: File | null;
  description: string;
  size: string;
  imageUrl?: string;
  avatar?: string;
};

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
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const onHandleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const OnGenerate = async () => {
    if (!formData.file && !formData.imageUrl) {
      alert("Please upload an image or provide a URL.");
      return;
    }

    if (!formData.description || !formData.size) {
      alert("Please enter a description and size.");
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
    } catch (error) {
      console.error("Error during API call:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-3">
        {" "}
        {title ? title : "AI Product Image Generator"}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
        <div className="md:col-span-1 flex flex-col gap-4 justify-between ">
          <FormInput
            onHandleInputChange={(field: string, value: string | unknown) =>
              onHandleInputChange(field, value)
            }
            onGenerate={OnGenerate}
            loading={loading}
            enableAvatar={enableAvatar}
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-4 justify-between  ">
          <PreviewResult />
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
