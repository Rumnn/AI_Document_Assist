import React, { Suspense } from "react";
import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { LoadingState } from "@/components/ui/loading-state";

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<LoadingState message={`Opening session ${id}...`} />}>
      <ChatWorkspace initialSessionId={id} />
    </Suspense>
  );
}
