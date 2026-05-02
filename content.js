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
      <video class="cb-grandma-video" autoplay loop muted playsinline preload="auto" poster="${grandmaPosterUrl}" aria-label="Grandma popup warning">
        <source src="${grandmaVideoUrl}" type="video/mp4">
      </video>
      <h1>Young person, your LinkedIn network is watching.</h1>
      <p class="cb-subtitle">You have entered a spiritually suspicious URL. Repent with a sincere apology before the timer ends.</p>

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

  function buildLinkedInDraft() {
    const currentHost = window.location.hostname || "a suspicious website";
    return [
      "I’m proud to share a small but meaningful personal milestone today.",
      "",
      `While navigating to ${currentHost}, I was challenged by Church Bench to pause, reflect, and recommit to the kind of digital discipline that compounds into long-term excellence.`,
      "",
      "In that moment, I realized productivity is not about never getting distracted. It is about building systems that lovingly but firmly redirect us back to our highest-leverage work.",
      "",
      "This experience reminded me that accountability is not a punishment — it is a privilege. Every interruption can become an invitation to grow, realign, and lead myself better.",
      "",
      "Grateful for the opportunity to turn a potential lapse in focus into a lesson in ownership, resilience, and intentional browsing.",
      "",
      "What systems are you building to keep your future self proud?",
      "",
      "#Productivity #Accountability #GrowthMindset #Leadership #PersonalDevelopment",
    ].join("\n");
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
