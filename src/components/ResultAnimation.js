import wrong from "../../public/wrong.svg";
import right from "../../public/right.svg";
import excellent from "../../public/excellent.svg";
import veryGood from "../../public/veryGood.svg";
import good from "../../public/good.svg";
import notBad from "../../public/notBad.svg";
import bad from "../../public/bad.svg";
import veryBad from "../../public/veryBad.svg";
import awful from "../../public/awful.svg";

import Image from "next/image";
const ResultAnimation = ({ result, showResultAnimation }) => {
  const imageToShow = () => {
    switch (result) {
      case "CORRECT":
        return right;
      case "INCORRECT":
        return wrong;
      case "EXCELLENT":
        return excellent;
      case "VERY-GOOD":
        return veryGood;
      case "GOOD":
        return good;
      case "NOT-BAD":
        return notBad;
      case "BAD":
        return bad;
      case "VERY-BAD":
        return veryBad;
      case "AWFUL":
        return awful;
    }
  };
  return (
    <>
      {result && (
        <div
          className={`result-animation absolute z-30 ${
            showResultAnimation ? "animate-result" : ""
          }`}
          style={{
            transformOrigin: "center", // Adjust the transform origin as needed
            transform: showResultAnimation
              ? "scale(1) translateX(0)"
              : "scale(0) translateX(75%)",
          }}
        >
          <Image src={imageToShow()} className="w-96 top-4 z-20" alt={"icon"} />
        </div>
      )}
    </>
  );
};

export default ResultAnimation;
