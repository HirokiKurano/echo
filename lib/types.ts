export type Inquiry = {
  id: string;
  channel: string;
  author: string;
  text: string;
  createdAt: string;
  responder: string | null;
  handleMinutes: number;
};

export type TopicDefinition = {
  id: string;
  title: string;
  category: string;
  suggestedDoc: string;
  keywords: string[];
};

export type TopicStat = {
  id: string;
  title: string;
  category: string;
  suggestedDoc: string;
  count: number;
  handleMinutes: number;
  hours: number;
  yen: number;
  annualHours: number;
  annualYen: number;
  saveableHours: number;
  saveableYen: number;
  inquiries: Inquiry[];
};

export type Analysis = {
  periodLabel: string;
  asOf: string;
  totalCount: number;
  storedCount: number;
  totalHours: number;
  totalYen: number;
  annualHours: number;
  annualYen: number;
  clusteredCount: number;
  otherCount: number;
  periodDays: number;
  topics: TopicStat[];
  proposals: TopicStat[];
};
