"use client";
import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import questionMark from "../../public/questionMark.svg";
import questionMarkClosing from "../../public/questionMarkClosing.svg";
import { textScore } from "@/utils/functions";
import ResultAnimation from "@/components/ResultAnimation";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import ImageDescription from "@/components/ImageDescription";
import "tailwindcss/tailwind.css";
import "@splidejs/splide/dist/css/splide.min.css";
import "../app/globals.scss";
import ModalGuess from "@/components/ModalGuess";
import ModalResult from "@/components/ModalResult";
import { splitInDots } from "@/utils/functions";
import NavBurguer from "@/components/NavBurguer/NavBurguer";
import dataTest from "../data/dataTest.json";

const RentGuessing = () => {
  const [pastData, setPastData] = useState(null);
  const [presentData, setPresentData] = useState(null);
  const [futureData, setFutureData] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [newScore, setNewScore] = useState(null);
  const [showResultAnimation, setShowResultAnimation] = useState(false);
  const [guess, setGuess] = useState("");
  const [showModalHint, setShowModalHint] = useState(false);
  const [showModalResult, setShowModalResult] = useState(false);
  const [loadingFutureFetch, setLoadingFutureFetch] = useState(false);
  const [loadingPresentFetch, setLoadingPresentFetch] = useState(false);
  const fetchData = () => {
    // Fetch random data from the API
    if (!loadingPresentFetch) {
      setLoadingPresentFetch(true);
      fetch("/api/random-guess")
        .then((response) => response.json())
        .then((data) => {
          // Update the state with the fetched random data
          setLoadingPresentFetch(false);
          setPresentData(data);
        })
        .catch((error) => {
          // Handle any error that occurred during the API request
          console.error("Error fetching random data:", error);
        });
    }
  };
  const fetchFutureData = () => {
    if (!loadingFutureFetch) {
      setLoadingFutureFetch(true);
      setTimeout(() => {
        fetch("/api/random-guess")
          .then((response) => response.json())
          .then((data) => {
            // Update the state with the fetched random data
            setFutureData(data);
            setLoadingFutureFetch(false);
          })
          .catch((error) => {
            // Handle any error that occurred during the API request
            console.error("Error fetching random data:", error);
          });
      }, 500);
    }
  };
  useEffect(() => {
    fetchData();
    fetchFutureData();
    // setPresentData(dataTest);
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

  // Use useEffect to run code after pastData has been updated
  useEffect(() => {
    if (pastData) {
      fetchFutureData();
      setTimeout(() => {
        setShowModalResult(true);
        setShowResultAnimation(false);
        setGuess("");
      }, 2000);
      setTimeout(() => {
        setPresentData(futureData);
        setFutureData("");
      }, 2100);
    }
    // Add any additional code you want to execute after pastData is updated here
  }, [pastData]); // Dependency on pastData

  useEffect(() => {
    if (futureData && !presentData) {
      setPresentData(futureData);
      setFutureData("");
      fetchFutureData();
    }
  }, [futureData]);
  useEffect(() => {
    if (!futureData && !presentData) {
      fetchFutureData();
      fetchData();
    }
  }, [presentData, futureData]);
  const testResults = () => {
    // chequear resultados con el precio y sumar o restar puntos segun que cerca estuvo
    let Guess = parseFloat(guess.replaceAll(".", ""));
    let rightAnswer = parseFloat(
      presentData.prizeInARS
        .replace("ARS ", "")
        .replace("$ ", "")
        .replaceAll(".", "")
    );
    let differenceInPercentages = Math.abs((100 * Guess) / rightAnswer - 100);
    switch (true) {
      case differenceInPercentages < 5:
        setNewScore(score + 200);
        setResult("EXCELLENT");
        break;
      case differenceInPercentages >= 5 && differenceInPercentages < 15:
        setNewScore(score + 100);
        setResult("VERY-GOOD");
        break;
      case differenceInPercentages >= 15 && differenceInPercentages < 25:
        setNewScore(score + 50);
        setResult("GOOD");
        break;
      case differenceInPercentages >= 25 && differenceInPercentages < 35:
        setNewScore(score - 20);
        setResult("NOT-BAD");
        break;
      case differenceInPercentages >= 35 && differenceInPercentages < 45:
        setNewScore(score - 50);
        setResult("BAD");
        break;
      case differenceInPercentages >= 45 && differenceInPercentages < 55:
        setNewScore(score - 100);
        setResult("VERY-BAD");
        break;
      case differenceInPercentages >= 55:
        setNewScore(score - 200);
        setResult("AWFUL");
        break;
    }
    // asignar el present data al past data para poder mostrar el modal
    setPastData({ ...presentData, differenceInPercentages, guess });
    setShowResultAnimation(true);
  };
  return (
    <div
      className="bg-slate-300 h-screen w-screen relative "
      style={{
        backgroundImage: "url('/rentalbackground.png')",
      }}
    >
      {score !== 0 && (
        <p
          style={{ color: textScore({ score, newScore }) }}
          className={`font-extrabold ${textScore({
            score,
            newScore,
          })}  absolute top-2 left-4 text-3xl`}
        >
          {score}
        </p>
      )}
      <NavBurguer />
      {showResultAnimation && (
        <ResultAnimation
          result={result}
          showResultAnimation={showResultAnimation}
        />
      )}
      {presentData ? (
        <div className="flex flex-col justify-around h-[90%] xl:h-[75%] xl:pt-36">
          <div className=" xl:pt-12 ">
            <div className="translate-x-[1rem] -translate-y-4 lg:-translate-x-16 z-0 relative">
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
            <p className="text-3xl lg:text-7xl mb-4 text-blue-950 -pl-8 text-center font-extrabold [text-shadow:_5px_4px_0_rgb(0_0_0_/_40%)]">
              Cuanto está
            </p>
          </div>
          <div className="mt-4 md:mt-0 z-20">
            <Splide
              aria-label="My Favorite Images"
              data-splide='{"type":"loop"}'
            >
              {presentData.arrayOfImages.map((image, index) => (
                <SplideSlide>
                  <img
                    src={image}
                    alt={index}
                    style={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      boxShadow: "0px 0px 63px 57px rgba(0,0,0,0.58)",
                    }}
                    className=" w-[120vw] md:w-[40%] z-0"
                  />
                </SplideSlide>
              ))}
            </Splide>
            <div className="top-4">
              <ImageDescription
                data={[presentData.location, presentData.meters]}
              />
            </div>
          </div>
          <div className="flex  justify-center bg-slate-400  border-gray-500 border-y-8 py-3 -mt-2 xl:-mt-28 xl:mb-6   bottom-64 sm:bottom-40 xl:bottom-52 w-screen z-20 shadow-2xl shadow-black ">
            <p className="cursor-default  text-black  text-center relative text-md lg:text-2xl ">
              este departamento
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
          <div className="flex flex-row justify-center items-center  md:mt-0">
            <div
              className="w-[15%] sm:w-[8%] bg-green-500 mr-2 md:mr-6 cursor-pointer hover:bg-green-600 rounded-md"
              data-modal-target="large-modal"
              data-modal-toggle="large-modal"
              onClick={() => setShowModalHint(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className=" p-2 md:p-4  h-12 md:h-20"
                style={{ fill: "white", width: "100%" }}
              >
                <path d="M385.1 419.1C349.7 447.2 304.8 464 256 464s-93.7-16.8-129.1-44.9l80.4-80.4c14.3 8.4 31 13.3 48.8 13.3s34.5-4.8 48.8-13.3l80.4 80.4zm68.1 .2C489.9 374.9 512 318.1 512 256s-22.1-118.9-58.8-163.3L465 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L419.3 58.8C374.9 22.1 318.1 0 256 0S137.1 22.1 92.7 58.8L81 47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L58.8 92.7C22.1 137.1 0 193.9 0 256s22.1 118.9 58.8 163.3L47 431c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l11.8-11.8C137.1 489.9 193.9 512 256 512s118.9-22.1 163.3-58.8L431 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-11.8-11.8zm-34.1-34.1l-80.4-80.4c8.4-14.3 13.3-31 13.3-48.8s-4.8-34.5-13.3-48.8l80.4-80.4C447.2 162.3 464 207.2 464 256s-16.8 93.7-44.9 129.1zM385.1 92.9l-80.4 80.4c-14.3-8.4-31-13.3-48.8-13.3s-34.5 4.8-48.8 13.3L126.9 92.9C162.3 64.8 207.2 48 256 48s93.7 16.8 129.1 44.9zM173.3 304.8L92.9 385.1C64.8 349.7 48 304.8 48 256s16.8-93.7 44.9-129.1l80.4 80.4c-8.4 14.3-13.3 31-13.3 48.8s4.8 34.5 13.3 48.8zM208 256a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z" />
              </svg>
            </div>

            <div className="relative w-[70%]">
              <input
                type="text"
                id="hs-input-with-leading-and-trailing-icon"
                name="hs-input-with-leading-and-trailing-icon"
                className="md:py-6 px-4 text-gray-500 pl-12  pr-16 block w-full border-2  border-gray-200 shadow-sm rounded-md text-lg md:text-3xl focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-white dark:border-gray-700 dark:text-gray-400"
                placeholder="0.00"
                autocomplete="off"
                onChange={(e) =>
                  splitInDots({ input: e.target.value, setInput: setGuess })
                }
                value={guess}
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
              <div className="absolute inset-y-0 left-0 top-[-0.1rem] flex items-center rounded-sm  pointer-events-none z-20 pl-4">
                <span className="text-gray-500 text-xl md:text-3xl">$</span>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center rounded-sm pointer-events-none z-20 pr-20">
                <span className="text-gray-500 text-xl md:text-3xl">ARS</span>
              </div>
              <div
                onClick={() => testResults()}
                className="absolute inset-y-0 right-0 flex rounded-sm items-center z-20 cursor-pointer bg-slate-950 hover:bg-black pl-6 pr-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 320 512"
                  style={{ fill: "white" }}
                >
                  <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
                </svg>
              </div>
            </div>
          </div>
          <ModalGuess
            presentData={presentData}
            showModalHint={showModalHint}
            setShowModalHint={setShowModalHint}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="pulsing-6 md:-ml-12 -mt-32"></div>
        </div>
      )}
      <ModalResult
        pastData={pastData}
        showModalResult={showModalResult}
        setShowModalResult={setShowModalResult}
      />
    </div>
  );
};

export default RentGuessing;
