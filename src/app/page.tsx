import ChatHeader from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import React from "react";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md">
        <ChatHeader />
      </div>
    </div>
  );
}
