import React from "react";

export function RagStatusCard() {
  return (
    <div className="flex flex-col rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface">
            RAG Pipeline Status
          </h2>
        </div>
        <span className="text-xs font-semibold text-tertiary">Healthy</span>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Embedding Model</span>
          <span className="font-mono text-[11px] font-semibold text-on-surface">
            BAAI/bge-m3 (Dense + Sparse)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Retrieval Latency</span>
          <span className="font-mono text-[11px] font-semibold text-tertiary">
            240ms
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Vector Database</span>
          <span className="font-semibold text-on-surface">
            Qdrant v1.12 (Active)
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant/30 pt-1.5 mt-0.5">
          <span className="text-on-surface-variant">Re-ranking Engine</span>
          <span className="font-mono text-[11px] font-semibold text-primary">
            bge-reranker-v2-m3
          </span>
        </div>
      </div>
    </div>
  );
}
