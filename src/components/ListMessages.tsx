"use client";
import { Message, useMessageStore } from "@/lib/stores/messageStore";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import MessageComponent from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { ArrowDown } from "lucide-react";
import LoadMoreMessages from "./LoadMoreMessages";

export default function ListMessages() {
  const messages = useMessageStore((state) => state.messages);
  const { addMessage, currentMessageIds, deleteMessage, editMessage } =
    useMessageStore();
  const supabase = supabaseBrowser();
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScroll, setUserScroll] = useState(false);
  const [notification, setNotification] = useState(0);

  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;

      setUserScroll(isScroll);

      const isBottom =
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight;

      if (isBottom) setNotification(0);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          if (!currentMessageIds.includes(payload.new.id)) {
            const { data, error } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single();

            if (error) return toast.error(error.message);

            const newMessage = {
              ...payload.new,
              users: data,
            };

            addMessage(newMessage as Message);
          }
          const scrollContainer = scrollRef.current;
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          )
            setNotification((prev) => prev + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        async (payload) => {
          deleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        async (payload) => {
          editMessage(payload.new.id, payload.new.text);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [
    addMessage,
    currentMessageIds,
    deleteMessage,
    editMessage,
    messages,
    supabase,
  ]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScroll)
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [messages, userScroll]);

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex-1 pb-3">
          <LoadMoreMessages />
        </div>

        <div className="space-y-7">
          {messages?.map((m) => (
            <MessageComponent key={m.id} m={m} />
          ))}
        </div>

        <DeleteAlert />
        <EditAlert />
      </div>
      {userScroll && (
        <div className="absolute bottom-20 w-full">
          {notification > 0 ? (
            <div
              className="w-36 bg-green-500 p-1 rounded-md cursor-pointer mx-auto text-center text-sm"
              onClick={scrollDown}
            >
              {notification} new {notification > 1 ? "messages" : "message"}
            </div>
          ) : (
            <div
              className="w-10 h-10 bg-primary rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
}
