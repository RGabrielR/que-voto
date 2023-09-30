import puppeteer from "puppeteer-core";
import locations from "../../data/locations.json";
const chromium = require("@sparticuz/chromium");
function chooseRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
async function chooseRandomUrlAndFetch() {
  try {
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length) - 1];
    const urlToFetch = `https://www.zonaprop.com.ar/departamentos-alquiler-${randomLocation}-orden-publicado-descendente-pagina-${randomPage}.html`;
    console.log("executable path", process.env.CHROME_EXECUTABLE_PATH);
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
      headless: true,
      // ...more config options
    });
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: "./Downloads",
    });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    );
    console.log("llega aca???");
    console.log("la url esta bien? (antes del goto)", urlToFetch);
    await page.goto(urlToFetch);
    console.log("esta en el goto?");
    console.log("la url esta bien?", urlToFetch);
    await page.waitForSelector(".postings-container", { timeout: 300000 });
    console.log("postingContainer???");
    const elements = await page.$$eval(".postings-container > div", (divs) => {
      return divs.map((div) => div.innerHTML);
    });
    await browser.close();
    return elements;
  } catch (error) {
    console.log("error", error);
  }
}
export default async function handler(req, res) {
  try {
    console.log("antes de la function");
    let elements = await chooseRandomUrlAndFetch();
    const apartmentData = {};
    let element, matches, uniqueUrls, priceMatch, metersMatch;
    let arrayOfImages = new Set();
    const maxRetries = 10;
    let retries = 0;
    console.log("entro");

    do {
      if (retries >= maxRetries) {
        elements = await chooseRandomUrlAndFetch();
        retries = 0;
      }
      element = chooseRandomElement(elements);
      matches = element.match(/src="([^"]+)"/g);
      priceMatch = element.match(
        /<div data-qa="POSTING_CARD_PRICE"[^>]*>(.*?)<\/div>/
      );
      uniqueUrls = new Set(
        matches
          .map((match) => match.match(/src="([^"]+)"/)[1])
          .filter(
            (url) =>
              !url.includes("Sprite") &&
              !url.includes("logo") &&
              !url.includes("placeholder") &&
              !url.includes("empresas") &&
              !url.includes(".svg") &&
              !url.includes(".png")
          )
      );

      uniqueUrls.forEach((url) => {
        arrayOfImages.add(url); // Add unique URLs to the set
      });
      metersMatch = element.match(/(\d+)\s*m²/);
      if (metersMatch) {
        apartmentData.meters = `${metersMatch[1].trim()} mts.`;
      }
      retries++;
    } while (
      arrayOfImages.size < 3 ||
      priceMatch[1].trim().includes("Consultar") ||
      parseInt(metersMatch[1].trim()) < 15
    );
    apartmentData.arrayOfImages = Array.from(arrayOfImages);

    if (priceMatch) {
      if (element.includes("USD") || priceMatch < 5000) {
        apartmentData.prizeInUSD = `${priceMatch[1].trim()}`;
        const dolarBlueValues = await fetch(
          "https://api.bluelytics.com.ar/v2/latest"
        ).then((data) => data.json());
        const { value_sell } = dolarBlueValues.blue;
        apartmentData.prizeInARS = `ARS ${
          parseInt(
            priceMatch[1].trim().replace("USD ", "").replace(/\./g, "")
          ) * parseInt(value_sell)
        }`;
        console.log("prize in ars", apartmentData.prizeInARS);
      } else {
        apartmentData.prizeInARS = `ARS ${priceMatch[1].trim()}`;
      }
    }

    const locationMatch = element.match(
      /<div data-qa="POSTING_CARD_LOCATION"[^>]*>(.*?)<\/div>/
    );
    if (locationMatch) {
      apartmentData.location = locationMatch[1].trim();
    }
    const descriptionMatch = element.match(
      /<div data-qa="POSTING_CARD_DESCRIPTION"[^>]*>(.*?)<\/div>/
    );
    if (descriptionMatch) {
      apartmentData.description = descriptionMatch[1].trim();
    }
    console.log("apartmentData", apartmentData);
    res.status(200).json(apartmentData);
  } catch (error) {
    console.log("apartmentDataError", error);
  }
}
