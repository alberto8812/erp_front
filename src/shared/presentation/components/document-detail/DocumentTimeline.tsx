"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DocumentTimelineEvent, DocumentStatusStep } from "./types";

interface DocumentTimelineProps {
  steps?: DocumentStatusStep[];
  events?: DocumentTimelineEvent[];
  title?: string;
  defaultExpanded?: boolean;
}

function getStepIcon(status: DocumentStatusStep["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case "current":
      return <Circle className="h-5 w-5 text-primary fill-primary" />;
    case "error":
      return <XCircle className="h-5 w-5 text-destructive" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground/40" />;
  }
}

function getEventColor(color: DocumentTimelineEvent["color"]) {
  switch (color) {
    case "primary":
      return "bg-primary";
    case "success":
      return "bg-success";
    case "warning":
      return "bg-warning";
    case "destructive":
      return "bg-destructive";
    default:
      return "bg-muted-foreground";
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Hace un momento";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDate(dateString);
}

export function DocumentTimeline({
  steps,
  events,
  title = "Historial",
  defaultExpanded = true,
}: DocumentTimelineProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="relative overflow-hidden shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
      <div className="absolute inset-y-0 left-0 w-0.5 bg-chart-2" />
      <CardContent className="p-0">
        {/* Header */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {expanded && (
          <div className="px-4 pb-4">
            {/* Status Steps (Progress Bar) */}
            {steps && steps.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        {getStepIcon(step.status)}
                        <span
                          className={`text-[10px] mt-1 text-center max-w-[80px] leading-tight ${
                            step.status === "current"
                              ? "font-medium text-primary"
                              : step.status === "completed"
                              ? "text-muted-foreground"
                              : "text-muted-foreground/50"
                          }`}
                        >
                          {step.label}
                        </span>
                        {step.date && step.status !== "pending" && (
                          <span className="text-[9px] text-muted-foreground/70 mt-0.5">
                            {formatRelativeDate(step.date)}
                          </span>
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${
                            step.status === "completed"
                              ? "bg-success"
                              : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Events */}
            {events && events.length > 0 && (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />

                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="relative pl-6">
                      {/* Dot */}
                      <div
                        className={`absolute left-0.5 top-1.5 h-3 w-3 rounded-full border-2 border-background ${getEventColor(
                          event.color
                        )}`}
                      />

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-tight">
                            {event.title}
                          </p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                          {event.user && (
                            <p className="text-[10px] text-muted-foreground/70 mt-1">
                              por {event.user}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatRelativeDate(event.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {(!events || events.length === 0) && (!steps || steps.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay historial disponible
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
