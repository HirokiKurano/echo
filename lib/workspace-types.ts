import type { Inquiry, TopicDefinition } from "./types";

export type WorkspaceSettings = {
  companyName: string;
  hourlyYen: number;
  deflectionRate: number;
  defaultHandleMinutes: number;
  periodDays: number;
};

export type Workspace = {
  version: 1;
  settings: WorkspaceSettings;
  topics: TopicDefinition[];
  inquiries: Inquiry[];
};
