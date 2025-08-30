"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Monitor, Smartphone, Sparkles, Square } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  onHandleInputChange: any;
  onGenerate: any;
  loading: boolean;
}

function FormInput({ onHandleInputChange , onGenerate, loading}: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const onFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    onHandleInputChange("file", file);
    setPreview(URL.createObjectURL(file));
  };

  const sampleProduct: string[] = [
    "/headphone.png",
    "/perfume2.png",
    "/perfume.png",
    "/ice-creame.png",
    "/juice-can.png",
  ];

  const handleSampleImageClick = (imagePath: string) => {
    setPreview(imagePath);
  };

  return (
    <div>
      <div>
        <h2 className="font-semibold">1. Upload Product Image</h2>
        <div className="flex flex-col items-center gap-3">
          <Label
            htmlFor="file"
            className="mt-2 border-dashed border-2 rounded-2xl flex flex-col justify-center items-center p-5 min-h-[200px] cursor-pointer w-full relative"
          >
            {!preview ? (
              <div className="flex flex-col items-center gap-3">
                <ImagePlus className="h-8 w-8 opacity-40" />
                <h2 className="text-xl">Click to upload an image</h2>
                <p className="opacity-45">upload image upto 5MB</p>
              </div>
            ) : (
              <Image
                src={preview}
                alt="preview"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            )}
          </Label>
          <input
            type="file"
            id="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => onFileSelect(e.target.files)}
          />
        </div>

        <div>
          <h2 className="font-semibold opacity-70 mt-3">
            2. Select Sample Product to generate
          </h2>
          <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
            {sampleProduct.map((sample, index) => (
              <div
                key={index}
                className=" border rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <Image
                  src={sample}
                  alt={`Sample product ${index + 1}`}
                  width={100}
                  height={60}
                  className="rounded-lg w-[60px] h-[60px] cursor-pointer "
                  onClick={() => {
                    setPreview(sample);
                    onHandleInputChange("imageUrl", sample);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold">3. Enter Product Description</h2>
          <Textarea
            placeholder="Tell us about your product description"
            className="mt-2 min-h-[130px]"
            onChange={(e) => onHandleInputChange("description", e.target.value)}
          />
        </div>

        <div className="mt-8">
          <h2 className="font-semibold">4. Select Image Size</h2>
          <Select onValueChange={(value) => onHandleInputChange("size", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1024">
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  <small>1:1</small>
                </div>
              </SelectItem>
              <SelectItem value="1536x1024">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <small>16:9</small>
                </div>
              </SelectItem>
              <SelectItem value="1024x1536">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <small>9:16</small>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button className="mt-5 w-full" disabled={loading} onClick={onGenerate}>
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />} Generate
      </Button>
      <h2 className="mt-1 text-xs opacity-35 text-center">
        5 Credits to generate
      </h2>
    </div>
  );
}

export default FormInput;
