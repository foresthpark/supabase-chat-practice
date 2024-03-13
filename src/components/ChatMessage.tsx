import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { supabaseServer } from "@/lib/supabase/server";
import InitMessages from "@/lib/stores/initMessages";
import { MESSAGE_COUNT } from "@/lib/constants";

export default async function ChatMessage() {
  const supabase = supabaseServer();

  const { data } = await supabase
    .from("messages")
    .select("*,users(*)")
    .range(0, MESSAGE_COUNT)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback="Loading...">
      <ListMessages />
      <InitMessages messages={data?.reverse() ?? []} />
    </Suspense>
  );
}
