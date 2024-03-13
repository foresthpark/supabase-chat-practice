/* eslint-disable @next/next/no-img-element */
import { useMessageStore, type Message } from "@/lib/stores/messageStore";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useUserStore } from "@/lib/stores/userStore";

type MessageProps = {
  m: Message;
};

export default function MessageComponent({ m }: MessageProps) {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex gap-2" key={m.id}>
      <img
        className="h-10 w-10 bg-white rounded-full"
        src={m.users?.avatar_url}
        alt=""
      />
      <div className="flex-1">
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center gap-1">
            <h1 className="font-bold">{m.users?.display_name}</h1>
            <h1 className="text-xs text-gray-400">
              {new Date(m.created_at).toDateString()}
            </h1>

            {m.is_edit && (
              <span className="text-xs text-gray-400 italic font-thin">
                (edited)
              </span>
            )}
          </div>
          {m.users?.id === user?.id && <MessageMenu message={m} />}
        </div>
        <p className="text-gray-300">{m.text}</p>
      </div>
    </div>
  );
}

const MessageMenu = ({ message }: { message: Message }) => {
  const { setActionMessage } = useMessageStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
