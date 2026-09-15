import assert from "node:assert/strict";
import { test } from "node:test";
import { applySuggestion, topicSuggestions, typingQuery } from "./suggest";
import { TOPIC_DEFINITIONS } from "./topics";

test("typingQuery uses the last token", () => {
  assert.equal(typingQuery("今日、経"), "今日、経");
  assert.equal(typingQuery("hello VPN"), "VPN");
});

test("topicSuggestions returns expense theme for 経", () => {
  const hits = topicSuggestions(TOPIC_DEFINITIONS, "経", "ja");
  assert.ok(hits.length > 0);
  assert.ok(hits.some((item) => item.insert.includes("経") || item.label.includes("経費")));
});

test("applySuggestion replaces the typed suffix", () => {
  assert.equal(applySuggestion("今日、経", "経", "経費"), "今日、経費");
});
