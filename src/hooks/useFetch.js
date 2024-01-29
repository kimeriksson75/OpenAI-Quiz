import { useState, useEffect } from "react";

export const useFetch = (url, category, ref, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ref.current) {
      (async () => {
        try {
          const res = await fetch(url, {
						method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
						},
						body: JSON.stringify({ category: category }),
          });
          const resJson = await res.json();
          setData(resJson);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }
    return () => {
      ref.current = false;
    };
  }, [url, category, ref]);
  return { loading, data, error };
};