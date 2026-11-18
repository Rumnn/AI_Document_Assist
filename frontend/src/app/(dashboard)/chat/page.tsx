"use client";

import React, { Suspense } from "react";
import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { LoadingState } from "@/components/ui/loading-state";

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingState message="Connecting to AI Chat Studio..." />}>
      <ChatWorkspace initialSessionId="conv-01" />
    </Suspense>
  );
}
