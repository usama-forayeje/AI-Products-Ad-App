import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import { useAuthContext } from "../provider";
import { doc, onSnapshot } from "firebase/firestore";
import { Coins, Sparkles } from "lucide-react";
import { db } from "@/configs/firebaseConfig";

interface UserData {
  credits?: number;
  displayName?: string;
  email?: string;
  photoURL?: string;
  uid?: string;
}

function AppHeader() {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Listen to real-time updates for user data
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserData);
        } else {
          setUserData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="p-4 flex items-center justify-between w-full">
        <SidebarTrigger />

        <div className="flex items-center gap-4">
          {/* Credits Display */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Coins className="h-4 w-4 text-primary" />
                <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-yellow-500 animate-pulse" />
              </div>

              <span className="text-sm font-medium text-primary">Credits:</span>

              {loading ? (
                <div className="h-4 w-8 bg-muted animate-pulse rounded" />
              ) : (
                <span className="text-sm font-bold text-primary min-w-[2rem] text-center">
                  {userData?.credits || 0}
                </span>
              )}
            </div>
          </div>

          <ProfileAvatar />
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
