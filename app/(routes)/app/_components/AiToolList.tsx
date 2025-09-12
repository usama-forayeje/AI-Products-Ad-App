import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AiTool {
  name: string;
  desc: string;
  bannerImage: string;
  path: string;
}

const AiTools: AiTool[] = [
  {
    name: "AI Product Image",
    desc: "Generate high-quality, professional product images instantly with AI.",
    bannerImage: "/product-image.png",
    path: "app/creative-ai-tools/products-images",
  },
  {
    name: "AI Product Video",
    desc: "Create engaging product showcase videos using AI.",
    bannerImage: "/product-video.png",
    path: "app/creative-ai-tools/products-video",
  },
  {
    name: "AI Product With Avatar",
    desc: "Bring your products to life with AI avatars.",
    bannerImage: "/product-avatar.png",
    path: "app/creative-ai-tools/products-avatar",
  },
];

function AiToolList() {
  return (
    <div className=" mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center md:text-left">
        Create AI Tool
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {AiTools.map((tool: AiTool, index: number) => (
          <div
            key={index}
            className="bg-zinc-800 rounded-2xl p-4 md:p-6 hover:bg-zinc-700 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl h-full flex flex-col"
          >
            {/* Mobile Layout: Image > Text > Button */}
            <div className="flex flex-col h-full">
              {/* Image Section - Top on mobile, Right on desktop */}
              <div className="flex justify-center sm:hidden mb-4">
                <div className="relative w-28 h-28">
                  <Image
                    src={tool?.bannerImage}
                    alt={tool.name}
                    fill
                    sizes="112px"
                    className="object-contain rounded-lg"
                    priority={index < 3}
                  />
                </div>
              </div>

              {/* Desktop Layout: Text Left, Image Right */}
              <div className="hidden sm:flex gap-4 h-full">
                {/* Text Content Section - Left Side */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-xl lg:text-2xl text-white mb-3">
                    {tool.name}
                  </h3>
                  <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-4 flex-1">
                    {tool.desc}
                  </p>

                  {/* Button at bottom of text section */}
                  <div className="mt-auto">
                    <Button className="w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-base">
                      <Link href={tool.path} className="block">
                        Create Now
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Image Section - Right Side */}
                <div className="flex justify-end items-start flex-shrink-0">
                  <div className="relative w-36 h-36 lg:w-40 lg:h-40">
                    <Image
                      src={tool?.bannerImage}
                      alt={tool.name}
                      fill
                      sizes="(max-width: 1024px) 144px, 160px"
                      className="object-contain rounded-lg"
                      priority={index < 3}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Text Content */}
              <div className="sm:hidden flex flex-col flex-1 text-center">
                <h3 className="font-bold text-lg text-white mb-3">
                  {tool.name}
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 flex-1">
                  {tool.desc}
                </p>

                {/* Button always at bottom on mobile */}
                <div className="mt-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-sm">
                    <Link href={tool.path} className="block w-full">
                      Create Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiToolList;
