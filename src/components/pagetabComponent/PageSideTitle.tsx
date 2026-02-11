import React from "react";
import { SideTitleOptionComponent } from "../titles/SideTitleOption.component";

interface Props {
  title?: string;
  children: React.ReactNode[] | React.ReactNode;
  subtitle?: string;
  valueTab?: string[];
  actionChildren?: React.ReactNode[];
}

export const PageSideTitle = ({
  title,
  subtitle,
  actionChildren,
  children,
}: Props) => {
  return (
    <>
      <SideTitleOptionComponent
        title={title}
        subtitle={subtitle}
        actionChildren={actionChildren || []}
      />
      {children}
    </>
  );
};
