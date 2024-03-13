"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { User } from "@supabase/supabase-js";
import React, { useEffect, useRef } from "react";
import { useUserStore } from "./userStore";

type InitUserProps = {
  user: User | undefined;
};

export default function InitUser({ user }: InitUserProps) {
  const init = useRef(false);

  useEffect(() => {
    if (!init.current) {
      useUserStore.setState({ user });
    }
    init.current = true;
  }, []);

  return null;
}
