"use client";
import { auth } from "@/configs/firebaseConfig";
import { signOut } from "firebase/auth";
import React from "react";
import { useAuthContext } from "../provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ProfileAvatar() {
  const user = useAuthContext();
  const router = useRouter();
  const onButtonPress = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.replace("/");
      })
      .catch((error) => {
        console.error(error);
        // An error happened.
      });
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          {user?.user?.photoURL && (
            <Image
              width={35}
              height={35}
              src={user?.user?.photoURL}
              alt="profile"
              referrerPolicy="no-referrer"
              className="w-[35px] h-[35px] rounded-full"
            />
          )}
        </PopoverTrigger>
        <PopoverContent className="w-full mx-w-lg cursor-pointer">
          <h2 onClick={onButtonPress}>Logout</h2>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ProfileAvatar;
