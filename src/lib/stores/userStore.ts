import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type UserStore = {
  user: User | undefined;
};

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
}));
