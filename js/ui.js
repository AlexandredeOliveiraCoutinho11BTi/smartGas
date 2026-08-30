/* ============================================================
   SmartGás — interações de interface
   Menu compacto e estado "grudado" da navbar.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Menu compacto ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.getAttribute("data-open") === "true";
      links.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
    });

    /* fecha ao navegar */
    links.addEventListener("click", function (event) {
      if (event.target.tagName !== "A") return;
      links.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    });
  }

  /* ---- Borda da navbar ao rolar ---- */
  var navbar = document.getElementById("navbar");
  if (navbar) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;";
    document.body.prepend(sentinel);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        navbar.classList.toggle("is-stuck", !entries[0].isIntersecting);
      }).observe(sentinel);
    }
  }
})();
