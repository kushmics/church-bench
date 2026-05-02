# Church Bench

**LinkedIn-powered shameware for bad browsing decisions.**

Church Bench is a hackathon Chrome extension that turns a blocked page into a full-screen public repentance ritual: timer, scolding overlay, apology essay, and a LinkedIn share draft if the user refuses to repent.

It does **not** post automatically. It opens a LinkedIn draft/share URL so the demo stays funny instead of malware.

## Demo flow

1. Load the extension in Chrome.
2. Visit `https://goose.com`, `https://example.com/?churchbench=1`, or any URL containing `church-bench-demo`.
3. The page is replaced by the Church Bench overlay.
4. Type a 50-word apology before the 60-second timer ends.
5. If you fail, Chrome opens LinkedIn with a prewritten confession draft.

## Install for demo

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repo folder: `church-bench/`.
5. Visit `https://example.com/?churchbench=1`.

## Files

```text
church-bench/
├── manifest.json      # Chrome MV3 config
├── background.js      # URL detection + script/CSS injection
├── content.js         # Overlay, timer, essay, LinkedIn draft redirect
├── styles.css         # Full-screen panic UI
├── IMPLEMENTATION.md  # Build notes and demo constraints
└── README.md
```

## Safety defaults

- Demo triggers only. No real adult-site blacklist is shipped.
- No credentials, cookies, browsing history, or user data are collected.
- No automatic LinkedIn posting; only a draft URL is opened.
- Overlay is skipped on Chrome internal pages and LinkedIn itself.

## Hackathon pitch

Most blockers are boring. Church Bench weaponizes social accountability: it does not just block the page, it makes the user bargain with their future professional self.
