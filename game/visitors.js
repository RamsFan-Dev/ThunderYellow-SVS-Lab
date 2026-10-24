/*
 * ThunderYellow game-site page view counter.
 *
 * GitHub Pages has no writeable backend. This uses the public counterapi.com
 * namespace/action/key that the website has used from the beginning.
 * The service documents ?callback=... (JSONP) as a browser-compatible option.
 * Fetch may be blocked by cross-origin restrictions in browsers, particularly
 * mobile browsers. Do not use a plain fetch as the incrementing path.
 *
 * One page view is recorded per actual visible page load; multiple pages and
 * subsequent reloads can count again. This is not a unique-user counter.
 * Failure displays "Unavailable", never a fabricated number.
 *
 * Count only published ThunderYellow /game/ pages, never the SVS Lab editor.
 */
(() => {
  "use strict";

  const output = Array.from(document.querySelectorAll("[data-thunderyellow-views]"));
  if (!output.length) return;

  const production =
    location.hostname === "ramsfan-dev.github.io" &&
    location.pathname.startsWith("/ThunderYellow-SVS-Lab/game/");
  if (!production) {
    output.forEach((el) => {
      el.textContent = "Preview";
      el.removeAttribute("aria-busy");
    });
    return;
  }

  const endpoint =
    "https://counterapi.com/api/ramsfan-dev.github.io/pageview/thunderyellow-game-site";
  const callbackName = "__ThunderYellowGamePageViewResult";
  let attempted = false;

  function updateNumber(value) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 0) return false;

    output.forEach((el) => {
      el.textContent = number.toLocaleString("en-US");
      el.removeAttribute("aria-busy");
      el.title = "Game-site page views since the counter began; repeat visits count";
    });
    return true;
  }

  function unavailable() {
    output.forEach((el) => {
      el.textContent = "Unavailable";
      el.removeAttribute("aria-busy");
      el.title = "Live count temporarily unavailable; no value has been invented";
    });
  }

  // Read-only fallback avoids adding a second visit if JSONP recorded the
  // first request but the callback couldn't be delivered.
  async function tryReadOnly() {
    try {
      const response = await fetch(endpoint + "?readOnly=true", {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        signal: AbortSignal.timeout(6500),
      });
      if (!response.ok) throw new Error("Read-only counter request failed");
      const data = await response.json();
      if (!updateNumber(data?.value ?? data?.data?.value ?? data?.count)) {
        throw new Error("Invalid counter result");
      }
    } catch (_) {
      unavailable();
    }
  }

  function countVisit() {
    if (attempted) return;
    attempted = true;

    // counterapi.com documents JSONP: a same-origin script restriction does
    // not apply to <script src>, so this works on Safari where CORS fetch fails.
    let settled = false;
    const script = document.createElement("script");
    script.async = true;

    const finish = (successful, data) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      script.remove();
      try {
        delete window[callbackName];
      } catch (_) {
        window[callbackName] = undefined;
      }
      if (!successful || !updateNumber(data?.value ?? data?.data?.value ?? data?.count)) {
        tryReadOnly();
      }
    };

    window[callbackName] = (data) => finish(true, data);
    script.onerror = () => finish(false);
    const watchdog = setTimeout(() => finish(false), 8500);
    script.src = endpoint + "?callback=" + encodeURIComponent(callbackName);
    document.head.appendChild(script);
  }

  // Hidden prerendered pages should not consume a visit until displayed.
  if (document.visibilityState === "visible") countVisit();
  else {
    document.addEventListener("visibilitychange", function onVisible() {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", onVisible);
      countVisit();
    });
  }
})();