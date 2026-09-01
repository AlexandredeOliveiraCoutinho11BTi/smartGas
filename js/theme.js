(function () {
  "use strict";

  var STORAGE_KEY = "smartgas:theme";
  var root = document.documentElement;

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
  }

  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  }

  var reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
  }
  if (!reduced) {
    root.setAttribute("data-motion", "armed");
  }

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    try {
      return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    } catch (e) {
      return "dark";
    }
  }

  var THEME_FADE_MS = 280;
  var fadeTimer = null;

  function applyTheme(theme) {

    if (!reduced) {
      root.setAttribute("data-theme-changing", "");
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () {
        root.removeAttribute("data-theme-changing");
      }, THEME_FADE_MS);
    }

    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
    }
    syncButtons(theme);
  }

  function syncButtons(theme) {
    var next = theme === "light" ? "escuro" : "claro";
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-label", "Mudar para o tema " + next);
      buttons[i].textContent = theme === "light" ? "☾" : "☀";
    }
  }

  function init() {
    syncButtons(currentTheme());
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== "function") return;
      if (!target.closest("[data-theme-toggle]")) return;
      applyTheme(currentTheme() === "light" ? "dark" : "light");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SmartGasTheme = { apply: applyTheme, current: currentTheme };
})();
