const https = require("https");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export default function handler(req, response) {
  console.log("API for KPI called");
  const url =
    "https://www.scb.se/hitta-statistik/statistik-efter-amne/priser-och-konsumtion/konsumentprisindex/konsumentprisindex-kpi/";

  let result = {};
  https
    .get(url, (res) => {
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        // Do a query selection to find the relevant HTML elements.
        const dom = new JSDOM(rawData);
        const selection = dom.window.document.querySelectorAll(
          "div.box.produkt-keyfigure-block"
        );

        for (const element of selection) {
          const title = element.querySelector("p.h4").textContent;
          const value = parseFloat(
            element.querySelector("p.h1").textContent.replace(",", ".")
          );

          let unit = element.querySelector("p.unit").textContent;
          unit = unit !== "" ? unit : "%";
          const metadata = element.querySelector("p.text-dark-gray")
            .textContent;
          result[title] = { value: value, unit: unit, metadata: metadata };
        }
        const cacheSeconds = 60 * 60 * 24;
        // See: https://vercel.com/docs/concepts/functions/edge-caching#recommended-cache-control
        res.setHeader("Cache-Control", `max-age=0, s-maxage=${cacheSeconds}`);
        response.status(200).json(result);
      });
    })
    .on("error", (e) => {
      console.error(e);
      response.status(500);
    });
}
