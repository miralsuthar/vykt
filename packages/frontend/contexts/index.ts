import React, { createContext } from "react";

interface IImageContext {
  image: File | null;
  setImage: ((image: File) => void) | null;
}

export const ImageContext = createContext<IImageContext>({
  image: null,
  setImage: null,
});
