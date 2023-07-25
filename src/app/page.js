"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import questionMark from "../../public/questionMark.svg";
import questionMarkClosing from "../../public/questionMarkClosing.svg";
import wrong from "../../public/wrong.svg";
import right from "../../public/right.svg";
import BlurImage from "@/components/BlurImages";
import Loader from "@/components/Loader";
const HomePage = () => {
  const [randomData, setRandomData] = useState(null);
  const [result, setResult] = useState(null);
  const [oldResult, setOldResult] = useState("");
  const [score, setScore] = useState(0);
  const [newScore, setNewScore] = useState(null);
  const [showResultAnimation, setShowResultAnimation] = useState(false);
  const fetchData = () => {
    // Fetch random data from the API
    setTimeout(() => {
      fetch("/api/results-data")
        .then((response) => response.json())
        .then((data) => {
          // Update the state with the fetched random data
          setRandomData(data);
        })
        .catch((error) => {
          // Handle any error that occurred during the API request
          console.error("Error fetching random data:", error);
        });
    }, 1000);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    // Start the animation when newScore is updated
    if (newScore !== null) {
      const increment = newScore > score ? 1 : -1;
      let currentScore = score;

      const interval = setInterval(() => {
        currentScore += increment;
        setScore(currentScore);

        // Stop the animation when the currentScore matches the newScore
        if (
          (increment === 1 && currentScore >= newScore) ||
          (increment === -1 && currentScore <= newScore)
        ) {
          setScore(newScore);
          setNewScore(null);
          clearInterval(interval);
        }
      }, 10);

      return () => clearInterval(interval); // Clean up the interval when component unmounts
    }
  }, [score, newScore]);

  const textScore = () => {
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
  const checkResults = (option) => {
    // Set the old result to the current random data
    setOldResult(randomData);
    // Check if the option includes the vote from the random data
    if (option.includes(randomData.vote)) {
      // If the option is correct, set the result to "CORRECT"
      setResult("CORRECT");
      // Increase the score by 100
      setNewScore(score + 100);
    } else {
      // If the option is incorrect, set the result to "INCORRECT"
      setResult("INCORRECT");
      // Decrease the score by 20
      setNewScore(score - 20);
    }
    // Show the result animation
    setShowResultAnimation(true);
    // Reset the result, random data, and hide the result animation after a delay
    setTimeout(() => {
      setResult("");
      setRandomData(null);
      setShowResultAnimation(false);
      // Fetch new data
      fetchData();
    }, 2000);
  };
  return (
    <div
      className="bg-slate-300 h-screen w-screen"
      style={{
        backgroundImage: "url('/backgroundpattern.webp')",
      }}
    >
      <p
        style={{ color: textScore() }}
        className={`font-extrabold ${textScore()} text-red-600 absolute top-2 left-4 text-3xl`}
      >
        {score}
      </p>
      {result && (
        <div
          className={`result-animation absolute z-30 ${
            showResultAnimation ? "animate-result" : ""
          }`}
        >
          <Image
            src={result === "CORRECT" ? right : wrong}
            className="w-96  top-4 z-20"
            alt={result === "CORRECT" ? "right" : "wrong"}
          />
        </div>
      )}
      {randomData ? (
        <>
          <div className=" pt-7 ">
            <div className="translate-x-[3rem] -translate-y-4 lg:-translate-x-16 z-30">
              <Image
                className="absolute -left-16 lg:left-[4%] top-2 lg:top-6 w-52 sm:w-96 "
                src={questionMark}
                alt="signo de pregunta"
              />
              <Image
                className="absolute -left-12 lg:left-[6%] top-2 lg:top-6 w-52 sm:w-96 opacity-[0.7] z-30"
                src={questionMark}
                alt="signo de pregunta"
              />
              <Image
                className="absolute -left-8 lg:left-[8%] top-2 lg:top-6 w-52 sm:w-96 opacity-[0.5] z-30"
                src={questionMark}
                alt="signo de pregunta"
              />
            </div>
            <p className="text-3xl lg:text-7xl text-blue-950 -pl-8 text-center font-extrabold [text-shadow:_5px_4px_0_rgb(0_0_0_/_40%)]">
              Cómo votó
            </p>
          </div>
          <BlurImage
            image={randomData?.photoLink}
            classesToAdd="mx-auto mt-2 z-0 "
          />
          <div className="absolute right-[2%] lg:right-7 top-[10%] lg:top-[20%] flex flex-col items-end lg:items-start">
            <p className="bg-blue-500 max-w-[80%] sm:min-w-[16rem] text-black cursor-default mb-12 lg:mb-4 text-sm lg:text-2xl p1-2 lg:p-4 rounded-lg border-4 border-blue-950">
              - {randomData.party}
            </p>
            <p className="bg-blue-600 max-w-[80%] sm:min-w-[16rem] text-black cursor-default text-sm lg:text-2xl p-2 lg:p-4 rounded-lg border-4 border-blue-950">
              - {randomData.province}
            </p>
          </div>
          <div className="flex  justify-center bg-slate-400  border-gray-500 border-y-8 py-6 -mt-8 absolute bottom-72 sm:bottom-40 w-screen z-10 shadow-2xl shadow-black ">
            <p className="cursor-default  text-black  text-center relative text-md lg:text-2xl ">
              <span className="font-bold text-blue-800 hover:underline decoration-black">
                {" "}
                {randomData.name}
              </span>{" "}
              en la{" "}
              <span className="font-bold text-blue-800 hover:underline decoration-black">
                {randomData.project}
              </span>
            </p>
            <div className="flex flex-row -mt-6 -ml-4">
              <Image
                className=" w-16 "
                src={questionMarkClosing}
                alt="signo de pregunta"
              />
              <Image
                className="w-16 opacity-[0.7] -ml-14"
                src={questionMarkClosing}
                alt="signo de pregunta"
              />
              <Image
                className=" w-16 opacity-[0.5] -ml-14"
                src={questionMarkClosing}
                alt="signo de pregunta"
              />
            </div>
          </div>
          <div className="flex flex-col  justify-center sm:flex-row sm:justify-around absolute left-[10%] sm:left-[12%] bottom-12 sm:bottom-14 mx-auto w-[80%]">
            <p
              onClick={() => checkResults(["AFIRMATIVO"])}
              className="bg-green-700 w-full text-center sm:mx-24 my-2  sm:my-0 md:min-w-[25%] rounded-2xl p-4 hover:bg-green-800 cursor-pointer hover:underline hover:decoration-black shadow-lg shadow-black"
            >
              AFIRMATIVO
            </p>
            <p
              onClick={() => checkResults(["NEGATIVO"])}
              className="bg-red-700 w-full text-center sm:mx-24 my-2  sm:my-0 md:min-w-[25%] rounded-2xl p-4 hover:bg-red-800 cursor-pointer hover:underline hover:decoration-black shadow-lg shadow-black"
            >
              NEGATIVO
            </p>
            <p
              onClick={() => checkResults(["AUSENTE", "ABSTENCION"])}
              className="bg-yellow-700 w-full text-center sm:mx-24 my-2  sm:my-0 md:min-w-[25%] rounded-2xl p-4 hover:bg-yellow-800 cursor-pointer hover:underline hover:decoration-black shadow-lg shadow-black"
            >
              AUSENTE O ABSTENCION
            </p>
          </div>
        </>
      ) : (
        <>
          <div>
            {oldResult && (
              <div className=" py-12 absolute bg-slate-200 text-black cursor-default left-1/2 translate-x-[-50%] w-[90%] mx-auto rounded-md text-xl sm:text-4xl px-12 translate-y-40 text-center [text-shadow:_2px_2px_5px_rgb(255_255_255_/_1)] enter-right-to-left">
                {" "}
                <span className="text-blue-800">
                  {" "}
                  {oldResult?.name}{" "}
                </span> en{" "}
                <span className="text-blue-800"> {oldResult?.project} </span>{" "}
                {oldResult.vote === "ABSTENCION"
                  ? "hizo una"
                  : oldResult.vote === "AUSENTE"
                  ? "estuvo"
                  : "votó"}
                <span
                  className={`${
                    oldResult.vote === "AFIRMATIVO"
                      ? "text-green-700"
                      : oldResult.vote === "NEGATIVO"
                      ? "text-red-700"
                      : "text-yellow-700"
                  }`}
                >
                  {" "}
                  {oldResult?.vote}{" "}
                </span>
              </div>
            )}
            <Loader />
            {oldResult && (
              <a target="_blank" href={oldResult.moreInfo}>
                <p className="cursor-pointer absolute bottom-16 w-full text-white bg-blue-800 py-3 text-4xl text-center hover:text-black [text-shadow:_5px_4px_0_rgb(0_0_0_/_40%)] opacity-fade">
                  mas información
                </p>
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
