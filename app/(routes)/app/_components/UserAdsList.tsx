"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function UserAdsList() {
  const [adsList, setAdsList] = useState([]);

  return (
    <div className="container">
      <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-8 text-center md:text-left mt-5">
        My Ads
      </h2>
      {adsList?.length == 0 && (
        <div className="p-5 border-dashed border-2 rounded-2xl flex flex-col justify-center items-center  mt-6 gap-2">
          <Image
            src={"/signboard.png"}
            alt="empty"
            width={200}
            height={200}
            className="w-20"
          />
          <h2 className="text-xl">You don't have any ads create a new ad.</h2>
          <Button className="ml-5">
            <Link href={"/create-ad"}>Create New Ad</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserAdsList;
