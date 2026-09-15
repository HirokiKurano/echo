import assert from "node:assert/strict";
import { test } from "node:test";
import { analyzeInquiries, clusterInquiry } from "./analyze";
import { TOPIC_DEFINITIONS } from "./topics";
import type { Inquiry } from "./types";
import type { WorkspaceSettings } from "./workspace-types";

const settings: WorkspaceSettings = {
  companyName: "自社",
  hourlyYen: 3000,
  deflectionRate: 0.7,
  defaultHandleMinutes: 8,
  periodDays: 0,
};

function inquiry(text: string, extras: Partial<Inquiry> = {}): Inquiry {
  return {
    id: extras.id ?? text,
    channel: extras.channel ?? "#社内",
    author: extras.author ?? "A",
    text,
    createdAt: extras.createdAt ?? "2026-09-01T00:00:00.000Z",
    responder: extras.responder ?? null,
    handleMinutes: extras.handleMinutes ?? 10,
  };
}

test("clusterInquiry matches the longest keyword set", () => {
  assert.equal(clusterInquiry("経費精算の期限は？", TOPIC_DEFINITIONS), "expense");
  assert.equal(clusterInquiry("VPNが切れる", TOPIC_DEFINITIONS), "vpn");
  assert.equal(clusterInquiry("今日の天気", TOPIC_DEFINITIONS), "other");
});

test("analyzeInquiries ranks by count and estimates saveable hours", () => {
  const analysis = analyzeInquiries(
    [
      inquiry("経費の出し方"),
      inquiry("領収書はどこへ"),
      inquiry("VPNがつながらない", { handleMinutes: 30 }),
    ],
    TOPIC_DEFINITIONS,
    settings,
  );

  assert.equal(analysis.totalCount, 3);
  assert.equal(analysis.topics[0].id, "expense");
  assert.equal(analysis.topics[0].count, 2);
  assert.equal(analysis.proposals[0].id, "expense");
  assert.equal(analysis.otherCount, 0);
  assert.ok(analysis.proposals[0].saveableHours > 0);
});
