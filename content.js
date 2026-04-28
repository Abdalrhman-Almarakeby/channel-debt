const MESSAGES = {
  tier1: [
    // 0–20% watched
    "You and {channel} have never actually met, have you.",
    "You found {channel} once and then left forever.",
    "Your watch history has never heard of {channel}.",
    "{channel} is basically a stranger to you at this point.",
    "Bold of {channel} to think you'd actually watch.",
  ],
  tier2: [
    // 20–50% watched
    "The backlog is winning, and {channel} knows it.",
    "You meant to watch more {channel}. You always do.",
    "You sampled {channel} and moved on. Fair, honestly.",
    "{channel} uploads faster than you can pretend to keep up.",
    "The unwatched pile grows. You scroll anyway.",
  ],
  tier3: [
    // 50–70% watched
    "You watch {channel}. Just not, like, aggressively.",
    "A casual {channel} viewer. Respectable.",
    "Not obsessed, not estranged. Somewhere in the middle.",
    "Functional viewership. Doing fine.",
  ],
  tier4: [
    // 70–90% watched
    "Okay, you actually watch {channel}. That's real commitment.",
    "You're basically {channel}'s most reliable viewer.",
    "{channel} would be pleased, probably.",
    "{channel} has a fan. It's you.",
  ],
  tier5: [
    // 90–100% watched
    "You've seen almost everything {channel} has ever made.",
    "At this point you live here.",
    "Full completionist. {channel} has no secrets from you.",
    "{channel} uploaded it. You watched it. Every time.",
    "Chronically online, {channel} edition.",
    "If {channel} quit tomorrow, you'd feel it.",
    "You are the target audience and you take that seriously.",
  ],
};

function getTier(watchedPercent) {
  switch (true) {
    case watchedPercent <= 0.2:
      return MESSAGES.tier1;
    case watchedPercent <= 0.5:
      return MESSAGES.tier2;
    case watchedPercent <= 0.7:
      return MESSAGES.tier3;
    case watchedPercent <= 0.9:
      return MESSAGES.tier4;
    default:
      return MESSAGES.tier5;
  }
}

function getChannelName() {
  const match = location.pathname.match(/\/@([^/]+)/);
  return match ? match[1] : "this channel";
}

function pickMessage(watchedPercent) {
  const channel = getChannelName();
  const tier = getTier(watchedPercent);
  const template = tier[Math.floor(Math.random() * tier.length)];
  return template.replace(/{channel}/g, channel);
}

function waitForVideos() {
  return new Promise((resolve) => {
    let lastCount = 0;
    let stableTimer = null;

    const observer = new MutationObserver(() => {
      const videos = document.querySelectorAll("ytd-rich-item-renderer");

      if (videos.length !== lastCount) {
        lastCount = videos.length;
        clearTimeout(stableTimer);

        stableTimer = setTimeout(() => {
          observer.disconnect();
          resolve(videos);
        }, 1000);
      }
    });

    observer.observe(document.body, { subtree: true, childList: true });
  });
}

function injectBadge(watched, total, unwatched) {
  document.getElementById("channel-debt-badge")?.remove();

  log(watched, total, unwatched);
  const watchedPercent = total > 0 ? watched / total : 1;
  const message = pickMessage(watchedPercent);

  const badge = document.createElement("div");
  badge.id = "channel-debt-badge";
  badge.innerHTML = `
    <span class="channel-debt-stats">📺 ${unwatched} unwatched out of last ${total} videos</span>
    <span class="channel-debt-message">${message}</span>
  `;

  const attribution = document.querySelector("chip-bar-view-model");
  if (attribution) {
    attribution.insertAdjacentElement("afterend", badge);
    log("Badge injected");
  } else {
    log("Could not find injection point");
  }
}

function log(...data) {
  console.log("[ChannelDebt]", ...data);
}

function main() {
  if (!location.pathname.match(/\/@.+\/videos/)) return;

  waitForVideos().then((videos) => {
    let watched = 0;

    videos.forEach((video) => {
      const badge = video.querySelector("ytd-thumbnail-overlay-resume-playback-renderer");
      if (badge) watched++;
    });

    const total = videos.length;
    const unwatched = total - watched;

    injectBadge(watched, total, unwatched);
  });
}

main();

// rerun on YouTube's client side navigations
window.addEventListener("yt-navigate-finish", main);
