(() => {
  if (window.__churchBenchActive) return;
  window.__churchBenchActive = true;

  const REQUIRED_WORDS = 50;
  const TOTAL_SECONDS = 60;
  const DUPLICATE_WORD_PENALTY_SECONDS = 5;

  let secondsLeft = TOTAL_SECONDS;
  let countdownId;

  const originalTitle = document.title;
  document.title = "CHURCH BENCH DISCIPLINARY HEARING";
  document.documentElement.classList.add("church-bench-locked");
  document.body.innerHTML = "";

  const grandmaVideoUrl = chrome.runtime.getURL("assets/grandmapopup.mp4");
  const grandmaPosterUrl = chrome.runtime.getURL("assets/grandmapopup-poster.jpg");

  const overlay = document.createElement("main");
  overlay.id = "church-bench-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = `
    <section class="cb-card">
      <div class="cb-badge">⛪ LIVE MORAL INCIDENT REPORT</div>
      <div class="cb-layout">
        <div class="cb-grandma-frame">
          <video class="cb-grandma-video" autoplay loop muted playsinline preload="auto" poster="${grandmaPosterUrl}" aria-label="Grandma popup warning">
            <source src="${grandmaVideoUrl}" type="video/mp4">
          </video>
        </div>

        <div class="cb-panel">
          <h1>Young person, your LinkedIn network is watching.</h1>
          <p class="cb-subtitle">You have entered a naughty URL. Repent with a sincere apology before the timer ends.</p>

          <div class="cb-timer-wrap">
            <span class="cb-label">Time before corporate transparency post</span>
            <strong id="church-bench-timer">01:00</strong>
          </div>

          <label for="church-bench-apology">Essay of repentance</label>
          <textarea id="church-bench-apology" autocomplete="off" spellcheck="true" placeholder="I sincerely regret attempting to browse unproductively during a hackathon demo..."></textarea>

          <div class="cb-progress-row">
            <span id="church-bench-word-count">Words: 0 / ${REQUIRED_WORDS}</span>
            <span id="church-bench-warning">No copy-paste apologies. Grandma can tell.</span>
          </div>
        </div>
      </div>
    </section>
  `;
  document.body.appendChild(overlay);

  const timerDisplay = document.getElementById("church-bench-timer");
  const apologyBox = document.getElementById("church-bench-apology");
  const wordCountDisplay = document.getElementById("church-bench-word-count");
  const warningDisplay = document.getElementById("church-bench-warning");
  const grandmaVideo = overlay.querySelector(".cb-grandma-video");

  if (grandmaVideo) {
    grandmaVideo.muted = true;
    grandmaVideo.load();
    grandmaVideo.play().catch(() => {
      const fallbackImage = document.createElement("img");
      fallbackImage.className = "cb-grandma-video";
      fallbackImage.src = grandmaPosterUrl;
      fallbackImage.alt = "Grandma popup warning";
      grandmaVideo.replaceWith(fallbackImage);
    });
  }

  apologyBox.focus();

  function getWords(text) {
    return text
      .trim()
      .split(/\s+/)
      .map((word) => word.replace(/^\W+|\W+$/g, ""))
      .filter(Boolean);
  }

  function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function updateTimer() {
    timerDisplay.textContent = formatTime(secondsLeft);
    overlay.classList.toggle("cb-danger", secondsLeft <= 15);
  }

  function showWarning(message) {
    warningDisplay.textContent = message;
    warningDisplay.classList.add("cb-flash");
    window.setTimeout(() => warningDisplay.classList.remove("cb-flash"), 450);
  }

  function getSiteContext(hostname) {
    const host = hostname.toLowerCase();

    if (/youtube|netflix|tiktok|twitch|disney|primevideo|crunchyroll/.test(host)) {
      return {
        sin: "entering a high-friction video-consumption funnel",
        metric: "my Attention Retention Rate collapsed by 73%",
        remedy: "closing the tab, drinking water, and returning to stakeholder-aligned work",
        hashtag: "#AttentionEconomy",
      };
    }

    if (/reddit|twitter|x\.com|instagram|facebook|threads|9gag/.test(host)) {
      return {
        sin: "attempting to crowdsource dopamine from the public timeline",
        metric: "my Personal Brand Governance score entered free fall",
        remedy: "rebuilding trust with my calendar, my task list, and the grandma community",
        hashtag: "#DigitalDiscipline",
      };
    }

    if (/shopee|amazon|lazada|taobao|shein|zalora|ebay/.test(host)) {
      return {
        sin: "initiating an unsanctioned procurement sprint",
        metric: "my budget stewardship framework experienced a material breach",
        remedy: "recommitting to fiscal maturity and removing novelty socks from cart",
        hashtag: "#FinancialWellness",
      };
    }

    if (/steampowered|epicgames|roblox|minecraft|chess|game|valorant|leagueoflegends/.test(host)) {
      return {
        sin: "pivoting from productive execution into recreational load testing",
        metric: "my deliverables were hard-stuck in bronze",
        remedy: "touching grass and reopening the assignment I was spiritually avoiding",
        hashtag: "#ExecutionMindset",
      };
    }

    if (/porn|xvideos|rule34|hentai|xxx|adult/.test(host)) {
      return {
        sin: "navigating into a deeply non-core solo research vertical",
        metric: "my dopamine compliance pipeline failed its quarterly audit",
        remedy: "logging off, seeking daylight, and restoring operational dignity",
        hashtag: "#OperationalIntegrity",
      };
    }

    return {
      sin: "opening a naughty non-roadmap tab",
      metric: "my focus pipeline suffered an avoidable governance incident",
      remedy: "returning to deep work before Grandma escalates to the board",
      hashtag: "#GrowthMindset",
    };
  }

  function pickTemplate(hostname) {
    const score = [...hostname].reduce((total, char) => total + char.charCodeAt(0), 0);
    return score % 3;
  }

  function buildLinkedInDraft() {
    const currentHost = window.location.hostname || "a suspicious website";
    const context = getSiteContext(currentHost);
    const templateIndex = pickTemplate(currentHost);

    const templates = [
      [
        "🚨 A moment of radical professional transparency. 🚨",
        "",
        `Today, I failed to live my values and attempted ${context.sin} at ${currentHost}.`,
        "",
        `I could hide behind excuses like “just checking something quickly,” but real leaders own the data: ${context.metric}. This was not a tab. This was a culture problem, and unfortunately the culture was me.`,
        "",
        `I am using this incident as a growth opportunity by ${context.remedy}. Grandma appeared, the timer started, and I was reminded that accountability is just mentorship with louder consequences.`,
        "",
        "I am not proud of the click. I am proud of the ownership journey that followed the click.",
        "",
        "What systems are you building to stop your worst tabs from becoming your personal brand? 👇",
        "",
        `#Accountability #Leadership #PersonalGrowth ${context.hashtag} #GrandmaOps`,
      ],
      [
        "I need to be vulnerable with my network today.",
        "",
        `I was one click away from betraying my roadmap when I visited ${currentHost} and began ${context.sin}.`,
        "",
        `The numbers are uncomfortable: ${context.metric}. The old me would have minimized it. The new me is choosing ownership, reflection, and a slightly terrifying grandma-led intervention layer.`,
        "",
        `This setback has taught me the importance of ${context.remedy}. Sometimes the strongest product is not an app. Sometimes it is a grandmother in fullscreen mode asking why you are like this.`,
        "",
        "Failure is feedback. Shame is a dashboard. LinkedIn is unfortunately the CRM for both.",
        "",
        "Agree? Curious how other teams operationalize guilt at scale.",
        "",
        `#FounderMindset #Resilience #DigitalWellbeing ${context.hashtag} #BuildInPublic`,
      ],
      [
        "✅ Personal incident report: closed.",
        "",
        `Root cause: I navigated to ${currentHost} and started ${context.sin}.`,
        "",
        `Impact: ${context.metric}. Stakeholders affected: me, my future self, and one extremely disappointed grandma rendered at high z-index.`,
        "",
        `Corrective action: ${context.remedy}. Preventive action: respecting the popup before it becomes a performance review.`,
        "",
        "Key learning: discipline is not built in the moments when you feel strong. It is built when a browser extension catches you acting like a raccoon with Wi-Fi.",
        "",
        "Grateful for systems that turn private nonsense into public operational excellence.",
        "",
        `#PostMortem #Ownership #ContinuousImprovement ${context.hashtag} #GrandmaAsAService`,
      ],
    ];

    return templates[templateIndex].join("\n");
  }

  function triggerConsequence() {
    window.clearInterval(countdownId);
    const draft = encodeURIComponent(buildLinkedInDraft());
    window.location.href = `https://www.linkedin.com/feed/?shareActive=true&text=${draft}`;
  }

  function grantForgiveness() {
    window.clearInterval(countdownId);
    document.title = originalTitle;
    document.body.innerHTML = `
      <main id="church-bench-overlay" class="cb-forgiven">
        <section class="cb-card">
          <div class="cb-face" aria-hidden="true">🙏</div>
          <h1>Grandma is satisfied.</h1>
          <p class="cb-subtitle">You may return to society. Close this tab and make better choices.</p>
        </section>
      </main>
    `;
  }

  countdownId = window.setInterval(() => {
    secondsLeft -= 1;
    updateTimer();

    if (secondsLeft <= 0) {
      triggerConsequence();
    }
  }, 1000);

  apologyBox.addEventListener("paste", (event) => {
    event.preventDefault();
    secondsLeft = Math.max(0, secondsLeft - DUPLICATE_WORD_PENALTY_SECONDS);
    updateTimer();
    showWarning(`Paste blocked. Minus ${DUPLICATE_WORD_PENALTY_SECONDS} seconds.`);
  });

  apologyBox.addEventListener("input", () => {
    const words = getWords(apologyBox.value);
    const duplicateIndex = words.findIndex(
      (word, index) => index > 0 && word.toLowerCase() === words[index - 1].toLowerCase(),
    );

    if (duplicateIndex !== -1) {
      words.splice(duplicateIndex, 1);
      apologyBox.value = words.join(" ");
      secondsLeft = Math.max(0, secondsLeft - DUPLICATE_WORD_PENALTY_SECONDS);
      updateTimer();
      showWarning(`Repeated word detected. Minus ${DUPLICATE_WORD_PENALTY_SECONDS} seconds.`);
    }

    wordCountDisplay.textContent = `Words: ${words.length} / ${REQUIRED_WORDS}`;

    if (words.length >= REQUIRED_WORDS) {
      grantForgiveness();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      showWarning("Escape denied. Accountability remains active.");
    }
  });

  updateTimer();
})();
