import React from "react";
import { Show } from "../show/Show.component";

interface Props {
  title?: string;
  children?: React.ReactNode;
  actionChildren?: React.ReactNode[];
  subtitle?: string;
}

export const SideTitleOptionComponent = ({
  actionChildren,
  children,
  subtitle,
  title,
}: Props) => {
  return (
    <div className="flex justify-evenly items-center mb-4">
      <div className="w-full">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{subtitle ? subtitle : ""}</p>
      </div>
      {/* //punto intermedio */}
      <div className="flex items-center justify-center mb-4 w-full">
        <Show when={!!children} fallback={undefined}>
          {children}
        </Show>
      </div>
      {/* //defina las acciones de boner */}
      <div className="flex items-center gap-2 w-full justify-end">
        <Show when={!!actionChildren} fallback={undefined}>
          {actionChildren}
        </Show>
      </div>
    </div>
  );
};
