import Image from "next/image";
import React, { useState } from "react";

export default function BlurImage({ image, classesToAdd }) {
  const [isLoading, setLoading] = useState(true);
  let imageSize = window.innerWidth > 768 ? 300 : 250;

  return (
    <a href={image.href} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={image}
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
