import type { ComponentType } from "react";

export type SlideMeta = {
  id: string;
  chapter: string;
  title: string;
  Component: ComponentType;
};
