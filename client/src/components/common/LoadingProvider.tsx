import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loading } from "./Loading";

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Minimum loading time

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <Loading />}
      {children}
    </>
  );
};
