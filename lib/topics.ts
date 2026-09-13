import type { TopicDefinition } from "./types";

/**
 * First matching keyword wins. Demo stand-in for embedding similarity.
 * Production would cluster by meaning, then a human would name the topic.
 */
export const TOPIC_DEFINITIONS: TopicDefinition[] = [
  {
    id: "expense",
    title: "経費精算の方法",
    category: "総務",
    suggestedDoc: "経費精算クイックスタート（期限・領収書・承認者）",
    keywords: ["経費", "精算", "領収書", "交通費", "楽楽"],
  },
  {
    id: "crm",
    title: "CRMの権限申請",
    category: "情シス / 営業",
    suggestedDoc: "CRM権限の申請先とロール一覧",
    keywords: ["CRM", "Salesforce", "セールスフォース"],
  },
  {
    id: "customer-data",
    title: "顧客データの取り方",
    category: "営業企画",
    suggestedDoc: "顧客データ抽出ガイド（元データ・権限・依頼先）",
    keywords: ["顧客データ", "顧客リスト", "売上データ", "SFA"],
  },
  {
    id: "meeting-room",
    title: "会議室の予約",
    category: "総務",
    suggestedDoc: "会議室予約（Outlook / 受付）",
    keywords: ["会議室", "ミーティングルーム"],
  },
  {
    id: "vpn",
    title: "VPNにつながらない",
    category: "情シス",
    suggestedDoc: "VPN接続トラブルシュート",
    keywords: ["VPN"],
  },
  {
    id: "ringi",
    title: "稟議の回し方",
    category: "経営管理",
    suggestedDoc: "稟議の起案から決裁までの手順",
    keywords: ["稟議", "決裁"],
  },
  {
    id: "badge",
    title: "社員証の再発行",
    category: "総務",
    suggestedDoc: "社員証・入館証の再発行",
    keywords: ["社員証", "入館証"],
  },
  {
    id: "kintai",
    title: "勤怠の修正",
    category: "労務",
    suggestedDoc: "打刻漏れ・勤怠修正の申請",
    keywords: ["勤怠", "打刻"],
  },
];

export const OTHER_TOPIC: TopicDefinition = {
  id: "other",
  title: "まだまとまっていない問い合わせ",
  category: "未分類",
  suggestedDoc: "（クラスタを確認してからマニュアル化する）",
  keywords: [],
};
