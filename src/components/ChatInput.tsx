"use client";
import React from "react";
import { Input } from "./ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "@/lib/stores/userStore";
import { Message, useMessageStore } from "@/lib/stores/messageStore";

export default function ChatInput() {
  const user = useUserStore((state) => state.user);
  const { addMessage, setCurrentMessageIds } = useMessageStore();

  const handleSendMessage = async (text: string) => {
    const supabase = supabaseBrowser();
    const id = uuidv4();
    const newMessage = {
      id,
      text,
      send_by: user?.id,
      is_edit: false,
      users: {
        id: user?.id,
        avatar_url: user?.user_metadata?.avatar_url,
        display_name: user?.user_metadata?.full_name,
      },
      created_at: new Date().toISOString(),
    };

    addMessage(newMessage as Message);
    setCurrentMessageIds(newMessage.id);

    const { error } = await supabase.from("messages").insert({ text, id });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-5">
      <Input
        placeholder="Type a message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (e.currentTarget.value.trim() === "")
              return toast.error("Message cannot be empty");
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
