# Spark

**The fastest place to capture a thought.**

A minimal todo app: open it, type, press Enter. Capture comes first. Setup and organization do not.

The UI is English-only, dark, and quiet. The mark is a thin four-point spark next to the **SPARK** wordmark.

## What works now

- The input is focused as soon as the app opens
- Enter adds a todo (empty input is ignored)
- Checkbox toggles complete / incomplete
- Delete (hover on desktop, easy to tap on mobile)
- Today / Later / Done groups
- Saves to `localStorage` and restores after reload
- Dark theme, Syne for headings, M PLUS 2 for body and input
- Compact **glance** card on the main screen (next open todos)
- Glance page at `/widget` (clock + the same card)
- **Pop out window** for a small desktop glance
- On a phone: open the glance page, then Share → Add to Home Screen

No accounts, cloud sync, notifications, tags, billing, or native lock-screen widgets.

## How to use

1. Open the app
2. Type
3. Press Enter

There is no confirm dialog. Enter saves immediately.

| Action | How |
| --- | --- |
| Add | Type, then Enter |
| Toggle done | Click or tap the checkbox |
| Delete | Click or tap × |
| Focus input | `Ctrl + Shift + Space` (Mac: `Cmd + Shift + Space`) |
| Open glance | **Open glance** on the main screen, or go to `/widget` |
| Desktop glance window | **Pop out window** |
| Leave glance | **Back to Spark** |

Today is incomplete todos added today. Later is incomplete todos from earlier days. Done is completed. There is no date picker.

The glance card shows up to three open todos. Completing one there updates the same `localStorage` list.

## Glance vs a real lock-screen widget

The glance is a **web stand-in**, not an iOS WidgetKit or Android lock-screen widget.

| This app can do | This app cannot do |
| --- | --- |
| Show a compact “what’s next” card | Sit on the phone lock screen |
| Open as a small desktop window | Draw inside iOS / Android widget slots |
| Be added to a phone Home Screen as a web page | Sync that Home Screen icon across the OS widget gallery |

A real lock-screen widget would need a native iOS/Android app and shared storage (not browser `localStorage`). That is later work, not this MVP.

If the right-hand preview ever opens `/widget?glance=1` with no input field, use **Back to Spark** or open [http://localhost:3000/](http://localhost:3000/).

## Setup

Project folder: `C:\Users\hirok\spark`

With Node.js installed:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). In Cursor, keep Simple Browser on the right to see UI updates as you edit.

For everyday use, a production build is faster than the dev server:

```bash
npm run build
npm start
```

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Storage: browser `localStorage` (key: `spark.todos`)

Nothing is sent to a server. There is no sync across browsers or devices.

Todo shape:

```ts
{
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601
}
```

## Layout

```
app/page.tsx                 Main screen
app/widget/page.tsx          Glance / lock-screen-style page
app/icon.svg                 Tab icon (spark mark)
app/layout.tsx               Fonts and shell
components/TodoApp.tsx       Capture flow + lists
components/TodoInput.tsx     Fast input
components/TodoList.tsx      Today / Later / Done
components/TodoItem.tsx      Toggle and delete
components/LockWidget.tsx    Compact glance card
components/WidgetLockScreen.tsx  Clock + glance card
components/SparkMark.tsx     Logo mark
lib/types.ts                 Todo type
lib/storage.ts               localStorage read/write
lib/glance.ts                Pop-out window helper
```

## Later

Not in this MVP:

- Phase 2: auth, Supabase sync, PWA, native widgets
- Phase 3: global shortcuts, reminders, search, theme toggle
- Phase 4: AI organization
