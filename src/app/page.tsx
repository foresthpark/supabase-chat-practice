import React from "react";
import ChatHeader from "@/components/ChatHeader";
import { supabaseServer } from "@/lib/supabase/server";
import InitUser from "@/lib/stores/initUser";
import { Input } from "@/components/ui/input";

export default async function HomePage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getSession();

  return (
    <>
      <InitUser user={data.session?.user} />
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col">
          <ChatHeader user={data.session?.user} />
          <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto">
            <div className="flex-1"></div>
            <div className="space-y-7">
              {[...Array(15)].map((_, i) => (
                <div className="flex gap-2" key={i}>
                  <div className="h-10 w-10 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h1 className="font-bold">Forest P</h1>
                      <h1 className="text-xs text-gray-400">
                        {new Date().toDateString()}
                      </h1>
                    </div>
                    <p className="text-gray-300">
                      Lorum Ipsum MEssage goes right here
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5">
            <Input placeholder="Type a message" />
          </div>
        </div>
      </div>
    </>
  );
}
