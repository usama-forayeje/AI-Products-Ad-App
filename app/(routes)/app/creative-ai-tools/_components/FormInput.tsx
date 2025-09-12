"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ImagePlus,
  Loader2,
  Monitor,
  Smartphone,
  Sparkles,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  onHandleInputChange: (field: string, value: unknown) => void;
  onGenerate: () => void;
  loading: boolean;
}

function FormInput({ onHandleInputChange, onGenerate, loading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const onFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    onHandleInputChange("imageUrl", null); // Clear imageUrl when a file is selected
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

  return (
    <Card className="shadow-lg border rounded-2xl p-6 space-y-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          🚀 Generate Your Product Ad
        </CardTitle>
        <CardDescription>
          Upload or pick a sample, describe your product & generate stunning
          visuals.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* 🔹 Step 1: Upload */}
        <div>
          <Label className="text-lg font-semibold">
            1. Upload Product Image
          </Label>
          <Label
            htmlFor="file"
            className="mt-3 border-dashed border-2 rounded-2xl flex flex-col justify-center items-center p-6 min-h-[200px] cursor-pointer w-full relative hover:bg-muted/40 transition-all"
          >
            {!preview ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <ImagePlus className="h-10 w-10 opacity-40" />
                <p className="text-base font-medium">
                  Click to upload an image
                </p>
                <p className="text-sm opacity-45">Max size 5MB</p>
              </div>
            ) : (
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-contain rounded-lg"
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

        {/* 🔹 Step 2: Pick Sample */}
        <div>
          <Label className="text-lg font-semibold">
            2. Or Select a Sample Product
          </Label>
          <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
            {sampleProduct.map((sample, index) => (
              <button
                type="button"
                key={index}
                onClick={() => {
                  onHandleInputChange("file", null);
                  onHandleInputChange("imageUrl", sample);
                  setPreview(sample);
                }}
                className={`border rounded-lg overflow-hidden p-1 hover:scale-105 transition-transform ${
                  preview === sample ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={sample}
                  alt={`Sample product ${index + 1}`}
                  width={70}
                  height={70}
                  className="rounded-md w-[70px] h-[70px] object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Step 3: Description */}
        <div>
          <Label className="text-lg font-semibold">
            3. Product Description
          </Label>
          <Textarea
            placeholder="Tell us about your product..."
            className="mt-2 min-h-[130px]"
            onChange={(e) => onHandleInputChange("description", e.target.value)}
          />
        </div>

        {/* 🔹 Step 4: Resolution */}
        <div>
          <Label className="text-lg font-semibold">4. Select Image Size</Label>
          <Select onValueChange={(value) => onHandleInputChange("size", value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Choose Resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1024">
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  <small>1:1 (Square)</small>
                </div>
              </SelectItem>
              <SelectItem value="1536x1024">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <small>16:9 (Landscape)</small>
                </div>
              </SelectItem>
              <SelectItem value="1024x1536">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <small>9:16 (Portrait)</small>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 🔹 Step 5: Generate */}
        <div className="text-center">
          <Button
            className="mt-4 w-full flex items-center justify-center gap-2"
            disabled={loading}
            onClick={onGenerate}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </Button>
          <p className="mt-2 text-xs opacity-60">⚡ Costs 5 Credits</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default FormInput;
