import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.1,
  easing: "ease",
  speed: 500,
});

export const Loading = () => {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return null;
};
