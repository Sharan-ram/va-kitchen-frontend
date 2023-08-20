import { useEffect } from "react";

const usePreventScroll = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.getElementsByTagName("html")[0].style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.getElementsByTagName("html")[0].style.overflow = "auto";
    };
  }, []);
};

export default usePreventScroll;
