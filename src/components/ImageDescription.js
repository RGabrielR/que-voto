const ImageDescription = ({ data }) => {
  return (
    <div className="absolute right-[2%] lg:right-7 top-[10%] sm:top-[15%] lg:top-[25%] flex flex-col items-end lg:items-start">
      {data.map((item, index) => (
        <p className="bg-blue-500 max-w-[80%] text-lg sm:px-2 sm:py-4 sm:min-w-[16rem] text-black cursor-default mb-12 lg:mb-4 lg:text-2xl p1-2 lg:p-4 rounded-lg border-4 border-blue-950">
          - {item}
        </p>
      ))}
    </div>
  );
};

export default ImageDescription;
