// match `watchedPercent` with appropriate message tier
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

function getRandomMessage(watchedPercent) {
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

function countVideos(videos) {
  let watched = 0;

  videos.forEach((video) => {
    const badge = video.querySelector("ytd-thumbnail-overlay-resume-playback-renderer");
    if (badge) watched++;
  });

  const total = videos.length;
  const unwatched = total - watched;

  return { watched, total, unwatched };
}

function refresh() {
  const videos = document.querySelectorAll("ytd-rich-item-renderer");

  injectBadge(countVideos(videos));
}

function injectBadge({ watched, total, unwatched }) {
  const existingMessage = document.querySelector(".channel-debt-message")?.textContent;

  document.getElementById("channel-debt-badge")?.remove();

  log(watched, total, unwatched);

  const watchedPercent = total > 0 ? watched / total : 1;
  const message = existingMessage || getRandomMessage(watchedPercent);

  const badge = document.createElement("div");
  badge.id = "channel-debt-badge";
  badge.innerHTML = `
    <div class="channel-debt-info">
      <span class="channel-debt-stats">📺 ${unwatched} unwatched out of last ${total} videos</span>
      <span class="channel-debt-message">${message}</span>
    </div>
    <button id="channel-debt-refresh">🗘</button>
  `;

  const attribution = document.querySelector("chip-bar-view-model");
  if (attribution) {
    attribution.insertAdjacentElement("afterend", badge);
    log("Badge injected");
  } else {
    log("Could not find injection point");
  }

  document.getElementById("channel-debt-refresh").addEventListener("click", refresh);
}

function log(...data) {
  console.log("[ChannelDebt]", ...data);
}

function main() {
  if (!location.pathname.match(/\/@.+\/videos/)) return;

  waitForVideos().then((videos) => {
    injectBadge(countVideos(videos));
  });
}

main();

// rerun on YouTube's client side navigations
window.addEventListener("yt-navigate-finish", () => {
  document.getElementById("channel-debt-badge")?.remove();
  main();
});
