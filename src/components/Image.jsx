import Image from "next/image";
import { memo, useState } from "react";

const ImageComponent = ({
  type = "nextImage",
  src,
  width,
  height,
  fill,
  className,
  style,
  alt = "img",
  priority,
}) => {
  const [imgSrc, setImagSrc] = useState(src || placeholder_img);

  return type === "nextImage" ? (
    <Image
      src={imgSrc}
      width={width}
      height={height}
      fill={fill}
      className={className}
      style={style}
      onError={() => {
        setImagSrc(placeholder_img);
      }}
      alt={alt}
      loading="lazy"
      priority={priority}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      width={width}
      height={height}
      className={className}
      style={style}
      alt={alt}
    />
  );
};

export default memo(ImageComponent);
