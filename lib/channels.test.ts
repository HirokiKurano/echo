import assert from "node:assert/strict";
import { test } from "node:test";
import {
  channelLabel,
  listBoardChannels,
  normalizeChannel,
} from "./channels";

test("normalizeChannel maps JA/EN aliases to stored ids", () => {
  assert.equal(normalizeChannel("#internal"), "#社内");
  assert.equal(normalizeChannel("#external"), "#社外");
  assert.equal(normalizeChannel("社外"), "#社外");
  assert.equal(normalizeChannel(""), "#社内");
  assert.equal(normalizeChannel("#sales"), "#sales");
});

test("channelLabel switches with locale", () => {
  assert.equal(channelLabel("#社内", "ja"), "#社内");
  assert.equal(channelLabel("#社内", "en"), "#internal");
  assert.equal(channelLabel("#internal", "en"), "#internal");
  assert.equal(channelLabel("#sales", "en"), "#sales");
});

test("listBoardChannels always includes 社内 and 社外", () => {
  const list = listBoardChannels([
    {
      id: "1",
      channel: "#sales",
      author: "A",
      text: "x",
      createdAt: "2026-09-01T00:00:00.000Z",
      responder: null,
      handleMinutes: 8,
    },
  ]);
  assert.deepEqual(list.slice(0, 3), ["#社内", "#社外", "#sales"]);
});
