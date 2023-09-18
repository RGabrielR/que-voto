import puppeteer from "puppeteer";
import locations from "../../data/locations.json";

function chooseRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
async function chooseRandomUrlAndFetch() {
  const randomPage = Math.floor(Math.random() * 5) + 1;
  const randomLocation =
    locations[Math.floor(Math.random() * locations.length) - 1];
  const urlToFetch = `https://www.zonaprop.com.ar/departamentos-alquiler-${randomLocation}-orden-publicado-descendente-pagina-${randomPage}.html`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
  );
  await page.goto(urlToFetch);
  await page.waitForSelector(".postings-container");
  const elements = await page.$$eval(".postings-container > div", (divs) => {
    return divs.map((div) => div.innerHTML);
  });
  await browser.close();
  return elements;
}
export default async function handler(req, res) {
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
    console.log(
      "arrayOfImages",
      arrayOfImages,
      "priceMatch",
      priceMatch[1]?.trim(),
      "metersMatch",
      metersMatch[1]?.trim()
    );
    retries++;
  } while (
    arrayOfImages.size < 3 ||
    priceMatch[1].trim().includes("Consultar") ||
    parseInt(metersMatch[1].trim()) < 15
  );
  console.log("salio del do while");
  apartmentData.arrayOfImages = Array.from(arrayOfImages);

  if (priceMatch) {
    if (element.includes("USD") || priceMatch < 5000) {
      apartmentData.prizeInUSD = `${priceMatch[1].trim()}`;
      const dolarBlueValues = await fetch(
        "https://api.bluelytics.com.ar/v2/latest"
      ).then((data) => data.json());
      const { value_sell } = dolarBlueValues.blue;
      apartmentData.prizeInARS = `ARS ${
        parseInt(priceMatch[1].trim().replace("USD ", "").replace(/\./g, "")) *
        parseInt(value_sell)
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

  res.status(200).json(apartmentData);
}
