"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { Message, useMessageStore } from "./messageStore";
import { MESSAGE_COUNT } from "../constants";

type InitMessageProps = {
  messages: Message[];
};

export default function InitMessages({ messages }: InitMessageProps) {
  const init = useRef(false);
  const hasMore = messages?.length >= MESSAGE_COUNT;

  useEffect(() => {
    if (!init.current) {
      useMessageStore.setState({ messages });
    }
    init.current = true;
  }, []);

  return null;
}
