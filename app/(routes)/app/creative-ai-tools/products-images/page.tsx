"use client";
import React, { useState } from "react";
import FormInput from "../_components/FormInput";
import PreviewResult from "../_components/PreviewResult";
import axios from "axios";

type FormData = {
  file: File | null;
  description: string;
  size: string;
  imageUrl?: string;
};

const ProductImages = () => {
  const [formData, setFormData] = useState<FormData>();
  const [loading, setLoading] = useState(false);

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const OnGenerate = async () => {
    setLoading(true);
    if (!formData?.file && !formData?.imageUrl) {
      alert("Please upload an image");
      return;
    }

    if (!formData?.description || !formData?.size) {
      alert("Please enter a description and size");
      return;
    }

    const formPayload = new FormData();

    formPayload.append("file", formData?.file as Blob);
    formPayload.append("description", formData?.description ?? "");
    formPayload.append("size", formData?.size ?? "1028x1028");

    const result = await axios.post("/api/generate-product-image", formPayload);
    console.log(result.data);
    setLoading(false);
    
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-3">AI Product Image Generator</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 ">
        <div>
          <FormInput
            onHandleInputChange={(field: string, value: string) =>
              onHandleInputChange(field, value)
            }
            onGenerate={OnGenerate}
            loading={loading}
          />
        </div>
        <div className=" md:grid-cols-2 ">
          <PreviewResult />
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
