export const textScore = ({ newScore, score }) => {
  // If the new score is not null
  if (newScore !== null) {
    // If the new score is greater than the current score, return green color code
    if (newScore > score) {
      return "#16a34a";
    }
    // If the new score is less than or equal to the current score, return red color code
    else {
      return "#dc2626";
    }
  }
  // If the new score is null, return black color code
  else {
    return "black";
  }
};

export const splitInDots = ({ input, setInput }) => {
  let formattedValue;
  if (input) {
    // Remove non-numeric characters and leading zeros
    const plain = input.replace(/[^0-9]/g, "").replace(/^0+/, "");

    // Add thousands separators
    formattedValue = plain.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  if (setInput) {
    setInput(formattedValue);
  } else {
    return formattedValue;
  }
};
