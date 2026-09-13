/** Shown in the UI so interviewers can challenge the model, not the code. */
export const ASSUMPTIONS = {
  asOf: "2026-09-13",
  periodDays: 30,
  periodLabel: "直近30日",
  hourlyYen: 3000,
  monthsInYear: 12,
  /** Share of repeat questions a decent doc would absorb. */
  deflectionRate: 0.7,
  /** Used when pasted lines have no duration. */
  defaultHandleMinutes: 8,
  dataNote:
    "表示中のデータは匿名化したダミーです。実運用では Slack / Teams のエクスポートを取り込みます。",
  pasteNote:
    "表示中は自分が貼った問い合わせです。このブラウザに保存され、サーバーには送りません。相手に見せるときは JSON を書き出して、その場で読み込んでください。",
};
