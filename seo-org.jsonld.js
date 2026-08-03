/**
 * Shared Organization JSON-LD for 220 BioWorX pages.
 * Loads as a script; injects schema without fake street address.
 */
(function () {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "220 BioWorX",
    alternateName: "220 BioWorX Research",
    url: "https://www.220bioworx.com",
    logo: "https://www.220bioworx.com/logo-header.png",
    email: "Customerservice@220bioworx.com",
    description:
      "Research Use Only biomolecular research materials for qualified laboratory purchasers. Based in the Fort Myers / Lee County, Florida region; ships nationwide. Not for human or veterinary use. Not a compounding pharmacy.",
    areaServed: [
      { "@type": "City", "name": "Fort Myers", "containedInPlace": { "@type": "State", "name": "Florida" } },
      { "@type": "AdministrativeArea", "name": "Lee County" },
      { "@type": "AdministrativeArea", "name": "Southwest Florida" },
      { "@type": "State", "name": "Florida" },
      { "@type": "Country", "name": "United States" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "Customerservice@220bioworx.com",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
  };

  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
})();
