const ResultOptions = ({ checkResults }) => {
  return (
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
  );
};

export default ResultOptions;
