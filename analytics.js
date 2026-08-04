/**
 * Google Analytics 4 — 220 BioWorX
 * Measurement ID: G-6ECCZHSXGK
 */
(function () {
  var GA_ID = "G-6ECCZHSXGK";
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
})();
