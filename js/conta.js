(function () {
  "use strict";

  var openBtn = document.getElementById("account-btn");
  var modal = document.getElementById("account-modal");
  if (!openBtn || !modal || typeof modal.showModal !== "function") return;

  openBtn.addEventListener("click", function () {
    modal.showModal();
  });

  modal.addEventListener("click", function (event) {
    /* clique no backdrop reporta o próprio <dialog> como alvo */
    if (event.target === modal || event.target.closest("[data-close-modal]")) {
      modal.close();
    }
  });

  /* ---- Aparência ---- */
  var options = modal.querySelectorAll("[data-theme-option]");
  var theme = window.SmartGasTheme;
  if (!theme) return;

  function sync() {
    var current = theme.current();
    for (var i = 0; i < options.length; i++) {
      options[i].setAttribute(
        "aria-pressed",
        String(options[i].dataset.themeOption === current)
      );
    }
  }

  for (var i = 0; i < options.length; i++) {
    options[i].addEventListener("click", function () {
      theme.apply(this.dataset.themeOption);
      sync();
    });
  }

  sync();
})();
