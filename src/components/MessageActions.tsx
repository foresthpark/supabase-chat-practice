import React, { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMessageStore } from "@/lib/stores/messageStore";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditAlert() {
  const { actionMessage, editMessage } = useMessageStore();
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const handleEditMessage = async () => {
    const text = inputRef.current.value.trim();
    if (text === "") return toast.error("Message cannot be empty");
    if (!actionMessage?.id) return toast.error("Message not found");

    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from("messages")
      .update({ text, is_edit: true })
      .eq("id", actionMessage?.id);

    if (error) return toast.error(error.message);
    editMessage(actionMessage?.id, inputRef.current.value);
    document.getElementById("trigger-edit")?.click();
    return toast.success("Message updated successfully");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div id="trigger-edit"></div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>
            {`Edit you're message. You can change the text and save it.`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Message
            </Label>
            <Input
              ref={inputRef}
              defaultValue={actionMessage?.text}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEditMessage}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAlert() {
  const { actionMessage, deleteMessage } = useMessageStore();

  const handleMessageDelete = async () => {
    if (!actionMessage?.id) return toast.error("Message not found");
    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage?.id);

    if (error) return toast.error(error.message);
    deleteMessage(actionMessage?.id);
    return toast.success("Message deleted successfully");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div id="trigger-delete"></div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMessageDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
