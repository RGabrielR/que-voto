import NextImage from "next/image";
import React, { useState, useEffect } from "react";

export default function BlurImage({ image, classesToAdd }) {
  const [isLoading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(image);
  const fallbackImage =
    "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=740&t=st=1706919556~exp=1706920156~hmac=4f8f900412d171ddb5095c17810818821e9c3a3e893f4f7c114acefda4208fed";

  useEffect(() => {
    const imgElement = new Image();
    imgElement.src = image;
    imgElement.onload = () => setImageSrc(image);
    imgElement.onerror = () => setImageSrc(fallbackImage);
  }, [image]);

  let imageSize = window.innerWidth > 768 ? 300 : 250;

  return (
    <a href={image?.href || "#"} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg xl:aspect-w-7 xl:aspect-h-8">
        <NextImage
          alt=""
          src={imageSrc}
          width={imageSize}
          height={imageSize}
          objectFit="cover"
          className={`
            duration-700 ease-in-out group-hover:opacity-75 ${classesToAdd}
            ${
              isLoading
                ? "scale-110 blur-2xl grayscale"
                : "scale-100 blur-0 grayscale-0"
            }
          `}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
    </a>
  );
}
