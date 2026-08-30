/* ============================================================
   SmartGás — tema
   Espelha os dois modos de variáveis do Figma: Dark (padrão) e Light.
   Este arquivo é carregado de forma SÍNCRONA no <head> para que o tema
   já esteja aplicado antes da primeira pintura (evita o flash de cor).
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "smartgas:theme";
  var root = document.documentElement;

  /* ---- 1. Aplica o tema salvo antes de qualquer renderização ---- */
  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* modo privado / storage bloqueado: segue com o padrão */
  }

  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  }
  /* Sem preferência salva não definimos nada: o CSS cai no Dark padrão
     e no prefers-color-scheme do sistema. */

  /* ---- 2. Arma a animação de entrada da aurora ----
     Feito aqui (e não no aurora.js, que é defer) para que os orbes já
     nasçam invisíveis, sem piscar. Quem não tem JS vê os orbes normais. */
  var reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    /* ignora */
  }
  if (!reduced) {
    root.setAttribute("data-motion", "armed");
  }

  /* ---- 3. Alternador ---- */
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

  /* Duração do DISSOLVE de tema; precisa bater com --motion-theme (280ms). */
  var THEME_FADE_MS = 280;
  var fadeTimer = null;

  function applyTheme(theme) {
    /* Arma o cross-fade antes de trocar o valor: a regra de transição já
       está no estilo computado quando as cores mudam, então elas animam
       em vez de saltar. */
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
      /* ignora */
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

  /* Exposto para as demais páginas / telas do app */
  window.SmartGasTheme = { apply: applyTheme, current: currentTheme };
})();
