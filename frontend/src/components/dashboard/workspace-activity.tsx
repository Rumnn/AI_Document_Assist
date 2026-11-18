import React from "react";
import { Filter, CheckCircle2 } from "lucide-react";

export function WorkspaceActivity() {
  const activities = [
    {
      id: "act-1",
      user: "Elena V.",
      time: "10:45 AM",
      action: "Queried",
      subject: '"SOC2 Section 4.1 encryption at rest"',
      meta: "3 citations cited",
      metaType: "success",
      nodeColor: "bg-primary",
    },
    {
      id: "act-2",
      user: "Marcus Chen",
      time: "09:15 AM",
      action: "Uploaded",
      subject: "Annual_Employee_Handbook_2024.pdf",
      meta: "Embedding pipeline started",
      metaType: "info",
      nodeColor: "bg-secondary",
    },
    {
      id: "act-3",
      user: "System Indexer",
      time: "Yesterday",
      action: "Vector index rebuilt for",
      subject: "Acme Corp Labs",
      meta: "24 docs • 1,420 chunks",
      metaType: "neutral",
      nodeColor: "bg-tertiary-container",
    },
    {
      id: "act-4",
      user: "Workspace Sharing",
      time: "Oct 12",
      action: "Invited",
      subject: "Sarah Jenkins with Admin role privileges",
      meta: null,
      nodeColor: "bg-outline",
    },
  ];

  return (
    <div className="flex flex-col rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/50">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-on-surface">
          Workspace Activity
        </h2>
        <button
          type="button"
          className="rounded p-1 text-outline hover:text-on-surface transition-colors"
          title="Filter activities"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-highest">
        {activities.map((act) => (
          <div key={act.id} className="relative flex flex-col">
            <span
              className={`absolute -left-6 top-1 h-2.5 w-2.5 rounded-full ring-4 ring-surface-container-lowest ${act.nodeColor}`}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">
                {act.user}
              </span>
              <span className="text-[11px] text-outline">{act.time}</span>
            </div>
            <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed">
              {act.action}{" "}
              <span className="font-medium text-on-surface">{act.subject}</span>
            </p>
            {act.meta && (
              <div className="mt-1">
                {act.metaType === "success" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    {act.meta}
                  </span>
                ) : act.metaType === "info" ? (
                  <span className="text-[11px] text-on-secondary-fixed-variant">
                    {act.meta}
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-on-surface-variant">
                    {act.meta}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
