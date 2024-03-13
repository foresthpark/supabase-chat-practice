import React from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { getFromAndTo } from "@/lib/utils";
import { MESSAGE_COUNT } from "@/lib/constants";
import { useMessageStore } from "@/lib/stores/messageStore";
import { toast } from "sonner";

export default function LoadMoreMessages() {
  const { currentPage, setMessages, hasMore } = useMessageStore();

  const fetchMore = async () => {
    const { from, to } = getFromAndTo(currentPage, MESSAGE_COUNT);

    const supabase = supabaseBrowser();

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .select("*,users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      setMessages(data.reverse());
    }
  };

  if (hasMore) {
    return (
      <Button variant="outline" className="w-full" onClick={fetchMore}>
        Load More
      </Button>
    );
  }

  return null;
}
