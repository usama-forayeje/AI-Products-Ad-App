"use client";
import { auth } from "@/configs/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

function Authentication({ children }: any) {
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const onButtonPress = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/app");
    } catch (error) {
      console.error("❌ Login error:", error);
    }
  };

  return <div onClick={onButtonPress}>{children}</div>;
}

export default Authentication;
