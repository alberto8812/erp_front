import React from "react";
import { Show } from "../show/Show.component";
import { PageTabOption } from "./PageTabsOptions";
import { PageSideTitle } from "./PageSideTitle";

interface Props {
  title?: string;
  children: React.ReactNode[] | React.ReactNode;
  isHandleTab: boolean;
  subtitle?: string;
  valueTab?: string[];
  actionChildren?: React.ReactNode[];
}

export const PageTabComponent = (prop: Props) => {
  const { isHandleTab } = prop;
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <Show when={isHandleTab} fallback={<PageSideTitle {...prop} />}>
        <PageTabOption {...prop} />
      </Show>
    </div>
  );
};
