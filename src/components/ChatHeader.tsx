"use client";
import React from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type ChatHeaderProps = {
  user: User | undefined;
};

export default function ChatHeader({ user }: ChatHeaderProps) {
  const router = useRouter();
  const handleLoginWithGithub = () => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 border-b flex justify-between items-center">
        <div className="">
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-sm text-gray-400">2 Online</h1>
          </div>
        </div>
        {user ? (
          <Button onClick={handleLogOut}>Logout</Button>
        ) : (
          <Button onClick={handleLoginWithGithub}>Login</Button>
        )}
      </div>
    </div>
  );
}
