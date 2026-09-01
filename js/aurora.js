(function () {
  "use strict";

  var root = document.documentElement;

  if (root.getAttribute("data-motion") !== "armed") return;

  function reveal() {

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.setAttribute("data-motion", "in");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reveal);
  } else {
    reveal();
  }

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    root.setAttribute("data-motion", "armed");
    reveal();
  });
})();
