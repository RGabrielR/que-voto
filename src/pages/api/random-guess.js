import { housingResults } from "models/housing-result";

export default async function handler(req, res) {
  const result = await housingResults.chooseToPlay();
  res.status(200).json(result);
}
