import { splitInDots } from "@/utils/functions";
export const title = (differenceInPercentages) => {
  switch (true) {
    case differenceInPercentages < 5:
      return "EXCELENTE";
    case differenceInPercentages >= 5 && differenceInPercentages < 15:
      return "MUY BUENO";
    case differenceInPercentages >= 15 && differenceInPercentages < 25:
      return "CERCA...";
    case differenceInPercentages >= 25 && differenceInPercentages < 35:
      return "MMM... ALGO LEJOS";
    case differenceInPercentages >= 35 && differenceInPercentages < 45:
      return "LEJOS";
    case differenceInPercentages >= 45 && differenceInPercentages < 55:
      return "MUY LEJOS";
    case differenceInPercentages >= 55:
      return "NI DE CERCA...";
  }
};

export const description = ({ pastData }) => {
  let firstSentence;

  if (pastData?.prizeInUSD) {
    firstSentence = `El precio esta en
    ${splitInDots({
      input: pastData?.prizeInUSD,
    })}
    Dólares, pero al cambio del dia de la fecha equivale a $${splitInDots({
      input: pastData?.prizeInARS,
    })} ARS. `;
  } else {
    firstSentence = `El precio se encuentra en 
    ${splitInDots({
      input: pastData?.prizeInARS.replace("ARS ", ""),
    })} ARS, se oferta a pesos argentinos. `;
  }
  let secondSentence;
  switch (true) {
    case pastData?.differenceInPercentages < 5:
      secondSentence = "Le acertaste perfecto! sigue así! :D :D :D";
      break;
    case pastData?.differenceInPercentages >= 5 &&
      pastData?.differenceInPercentages < 15:
      secondSentence = "Le acertaste bastante! Excelente trabajo :)";
      break;
    case pastData?.differenceInPercentages >= 15 &&
      pastData?.differenceInPercentages < 25:
      secondSentence = "Rondaste el precio pero podes hacerlo mejor ;)";
      break;
    case pastData?.differenceInPercentages >= 25 &&
      pastData?.differenceInPercentages < 35:
      secondSentence = "Quedaste lejos del precio :/";
      break;
    case pastData?.differenceInPercentages >= 35 &&
      pastData?.differenceInPercentages < 45:
      secondSentence =
        "Quizas el precio esta mal, o tu intuición, pero no estuvieron cerca ninguno de los dos";
      break;
    case pastData?.differenceInPercentages >= 45 &&
      pastData?.differenceInPercentages < 55:
      secondSentence = "En esta ocasión quedaste bastante lejos del precio";
      break;
    case pastData?.differenceInPercentages >= 55:
      secondSentence =
        "El precio del alquiler y lo que vos pensaste que es distan mucho mucho mucho :( :(";
      break;
    default:
      secondSentence = "Vamos bien!";
  }
  return `Dijiste ${pastData?.guess}. ` + firstSentence + secondSentence;
};
