import { create } from "zustand";
import { MESSAGE_COUNT } from "../constants";

export type Message = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

type MessageStore = {
  currentMessageIds: string[];
  setCurrentMessageIds: (id: string) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  actionMessage: Message | undefined;
  setActionMessage: (message: Message | undefined) => void;
  deleteMessage: (id: string) => void;
  editMessage: (id: string, text: string) => void;
  currentPage: number;
  setMessages: (messages: Message[]) => void;
  hasMore: boolean;
};

export const useMessageStore = create<MessageStore>((set) => ({
  hasMore: true,
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      currentPage: state.currentPage + 1,
      hasMore: messages.length >= MESSAGE_COUNT,
    })),
  currentPage: 1,
  currentMessageIds: [],
  setCurrentMessageIds: (id: string) => {
    set((state) => {
      return {
        currentMessageIds: [...state.currentMessageIds, id],
      };
    });
  },
  actionMessage: undefined,
  messages: [],
  addMessage: (message) =>
    set((state) => {
      return {
        messages: [...state.messages, message],
        currentMessageIds: [...state.currentMessageIds, message.id],
      };
    }),
  setActionMessage: (message: Message | undefined) =>
    set({ actionMessage: message }),
  deleteMessage: (id: string) => {
    set((state) => {
      return {
        messages: state.messages.filter((m) => m.id !== id),
      };
    });
    set({ actionMessage: undefined });
  },
  editMessage: (id: string, text: string) => {
    set((state) => {
      return {
        messages: state.messages.map((m) =>
          m.id === id ? { ...m, text, is_edit: true } : m
        ),
      };
    });
    set({ actionMessage: undefined });
  },
}));
