import { useState } from "react";
import { useCallback } from "react";
import axios from "axios";

//Use http hook returns error, loading and get/post function
const useHTTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const get = useCallback(async (url: string) => {
    setIsLoading(true);
    return axios.get(url);
  }, []);

  const post = async (url: string, data: any) => {
    setIsLoading(true);
    return axios.post(url, data);
  };

  return { setIsLoading, isLoading, setError, error, get, post };
};

export default useHTTP;
