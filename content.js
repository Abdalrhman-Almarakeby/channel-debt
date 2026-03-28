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
  if (document.getElementById("channel-debt-badge")) return;

  const badge = document.createElement("div");
  badge.id = "channel-debt-badge";
  badge.textContent = `📺 ${unwatched} unwatched out of last ${total} videos`;

  const attribution = document.querySelector("yt-attribution-view-model");
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
