/* ============================================================
   SmartGás — interações de interface
   Menu compacto, estado "grudado" da navbar e o FAQ sanfonado.
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

  /* ---- FAQ sanfonado ----
     Estados do component set "FAQ / Item" no Figma: Fechado (bg/surface +
     border/subtle) e Aberto (bg/elevated + brand/primary). A altura anima
     via grid-template-rows no CSS, então aqui só alternamos a classe e o
     aria-expanded. */
  var questions = document.querySelectorAll(".faq-item__q");

  for (var q = 0; q < questions.length; q++) {
    questions[q].addEventListener("click", function () {
      var item = this.closest(".faq-item");
      if (!item) return;

      var willOpen = !item.classList.contains("is-open");

      /* uma resposta aberta por vez, como no protótipo */
      var others = document.querySelectorAll(".faq-item.is-open");
      for (var i = 0; i < others.length; i++) {
        if (others[i] === item) continue;
        others[i].classList.remove("is-open");
        var btn = others[i].querySelector(".faq-item__q");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }

      item.classList.toggle("is-open", willOpen);
      this.setAttribute("aria-expanded", String(willOpen));
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
