/* ============================================================
   SmartGás — aurora
   Anima a entrada dos orbes: opacity 0 → alvo e translateY 70px → 0
   em ~1,2s ease-out, exatamente como o protótipo aprovado no Figma
   (variantes "Oculto" → "Visível" dos component sets Fundo / Aurora).

   O estado inicial é armado no theme.js (data-motion="armed" no <html>);
   aqui só viramos para "in" e o CSS faz a transição.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* prefers-reduced-motion: o theme.js nem chega a armar a animação */
  if (root.getAttribute("data-motion") !== "armed") return;

  function reveal() {
    /* dois frames de folga para garantir que o estado inicial foi
       pintado antes de trocar o atributo — sem isso o navegador
       colapsa os dois estados e não há transição. */
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

  /* Reinicia a animação ao voltar pelo cache de navegação (bfcache),
     para que a entrada rode de novo a cada chegada na página. */
  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    root.setAttribute("data-motion", "armed");
    reveal();
  });

  /* ------------------------------------------------------------
     ETAPA 2 — scroll-reveal encadeado (ainda não implementado)

     Combinado com o usuário: conforme a pessoa rola, a próxima
     seção/orbe aparece enquanto a anterior desaparece (não é reveal
     acumulativo — o que ficou para trás some), e o efeito reinicia
     a cada troca de página.

     Plano: IntersectionObserver com dois thresholds por seção
     (entrando = fade in + translateY; saindo pelo topo = fade out),
     reaproveitando --reveal-shift / --reveal-duration / --reveal-ease
     do global.css e respeitando prefers-reduced-motion.
     ------------------------------------------------------------ */
})();
