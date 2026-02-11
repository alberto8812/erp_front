import React from "react";

interface Props {
  when: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}
export const ShowComponent = () => {
  return <div>Show.component</div>;
};

export const Show = ({ when, fallback = null, children }: Props) => {
  return when ? children : fallback;
};
