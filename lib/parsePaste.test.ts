import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePastedInquiries } from "./parsePaste";

test("parsePastedInquiries reads one question per line", () => {
  const result = parsePastedInquiries("経費精算の期限は？\nCRMの権限は誰に頼む？");
  assert.equal(result.inquiries.length, 2);
  assert.equal(result.inquiries[0].text.includes("経費"), true);
});

test("parsePastedInquiries picks up a #channel prefix", () => {
  const result = parsePastedInquiries("#社外 見積の送付先は？");
  assert.equal(result.inquiries[0].channel, "#社外");
});
