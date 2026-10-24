/*
 * ThunderYellow official game-page views (not unique visitors).
 * CounterAPI's no-login public endpoint: https://counterapi.com/
 * All /game/ pages intentionally share the same namespace/action/key.
 * The counter begins when this script is first deployed. Never initialize a fabricated count.
 * Only count the production GitHub Pages hostname, not previews/local tests.
 */
(() => {
  "use strict";
  const output = Array.from(document.querySelectorAll("[data-thunderyellow-views]"));
  if (!output.length) return;
  const production =
    location.hostname === "ramsfan-dev.github.io" &&
    location.pathname.startsWith("/ThunderYellow-SVS-Lab/game/");
  if (!production) return;
  const endpoint = "https://counterapi.com/api/ramsfan-dev.github.io/pageview/thunderyellow-game-site";
  let counted = false;

  async function recordPageView() {
    if (counted) return;
    counted = true;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Visit service not available");
      const data = await response.json();
      const views = Number(data.value);
      if (!Number.isSafeInteger(views) || views < 0) throw new Error("Invalid visit total");
      const formatted = new Intl.NumberFormat("en-US").format(views);
      output.forEach((el) => {
        el.textContent = formatted;
        el.removeAttribute("aria-busy");
      });
    } catch (_) {
      // Keep the honest unavailable state; do not invent visitor totals.
      output.forEach((el) => {
        el.textContent = "Unavailable";
        el.removeAttribute("aria-busy");
        el.title = "Counter service could not be reached. This is not a zero count.";
      });
    }
  }

  // Don't inflate a view if a browser prerenders a page and nobody visits it.
  if (document.visibilityState === "visible") {
    recordPageView();
  } else {
    document.addEventListener("visibilitychange", function onVisibility() {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", onVisibility);
      recordPageView();
    });
  }
})();
