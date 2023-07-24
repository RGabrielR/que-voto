const cheerio = require("cheerio");
import lawProject from "../../data/lawProjects.json" assert { type: "json" };

export default async function handler(req, res) {
  // Generate a random index to select a random law project
  const lawProjectsRandomIndex = Math.floor(Math.random() * lawProject.length);
  const randomLawProject = lawProject[lawProjectsRandomIndex];

  // Fetch the HTML content of the law project's link
  const fetchRes = await fetch(randomLawProject.link).then((data) =>
    data.text()
  );
  const $ = cheerio.load(fetchRes);

  const results = [];

  // Iterate over each row in the table
  $("table tr").each((index, element) => {
    const $tds = $(element).find("td");

    // Extract the required values from the columns
    const name = $tds.eq(1).text().trim();
    const party = $tds.eq(2).text().trim();
    const province = $tds.eq(3).text().trim();
    const vote = $tds.eq(4).find("span").text().trim();
    const photoLink = $tds.eq(0).find("a").attr("href");

    // Add the extracted values to the results array
    if (name) {
      results.push({
        name,
        party,
        province,
        vote,
        photoLink,
        project: randomLawProject.name,
        moreInfo: randomLawProject.moreInfo,
      });
    }
  });

  // Randomly select an object from the results array
  const randomIndex = Math.floor(Math.random() * results.length);
  const randomObject = results[randomIndex];

  // Send the random object as the response
  res.status(200).json(randomObject);
}
