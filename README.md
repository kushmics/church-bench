# 🛡️ Auntie-Virus: ProActive GoonBlocker 🩴

**Tagline:** *Your professional network is watching. Behave.*

Auntie-Virus is a joke productivity Chrome Extension designed to forcefully deter users from accessing NSFW or restricted websites. Instead of a standard block screen, it initiates a high-stakes "hostage situation" featuring a scolding Auntie, a countdown timer, and the ultimate threat: an automatic, hyper-corporate LinkedIn post confessing to the deed.

---

## 🏗️ Project Architecture & Logic Flow

This extension operates on a **Manifest V3** Chrome Extension architecture. It uses a background service worker to monitor web traffic and dynamically injects a content script to hijack the DOM when a restricted site is detected.

### The Execution Flow
1. **PHASE 1: THE BREACH (Detection):** `background.js` listens to tab updates. If the URL matches a predefined blacklist (e.g., `nsfw-site.com` or a safe demo word like `goose.com`), it triggers the strike.
2. **PHASE 2: THE AMBUSH (Hijack):** `content.js` is injected. It instantly wipes the DOM (`document.body.innerHTML = ""`) and injects a full-screen overlay (`z-index: 99999999`) featuring a scolding Auntie GIF/Video and blaring audio.
3. **PHASE 3: THE ULTIMATUM (Ransom):** A 3-minute timer begins. The user is presented with a text box and must type a 200-word essay of repentance.
4. **PHASE 4: CONSEQUENCE OR REDEMPTION:**
   - **Win:** User types 200 valid words. The overlay disappears, and an "AUNTIE IS SATISFIED" screen shows.
   - **Lose:** Timer hits zero. The script constructs a LinkedIn Web Intent URL containing a pre-drafted, deeply embarrassing corporate post and redirects the user.

---

## 📂 File Structure

```text
auntie-virus/
├── manifest.json       # Extension configuration & permissions
├── background.js       # The Spy: Monitors URLs
├── content.js          # The Strike Force: Hijacks the page and runs the logic
├── styles.css          # The Overlay styling (inescapable full-screen)
└── assets/
    ├── icon.png        # McAfee shield with a rolling pin (Belan/Chappal)
    ├── auntie.gif      # The scolding visual
    └── scold.mp3       # "CHEE CHEE! WHAT IS THIS BATTAMEEZI?!"