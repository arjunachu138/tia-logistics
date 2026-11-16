import React, { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { httpClient } from "../../services/httpclient";
import styles from "./GlobalApiLoader.module.css";

export const GlobalApiLoader: React.FC = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const [isHttpLoading, setIsHttpLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = httpClient.subscribeToLoading((loading) => {
      setIsHttpLoading(loading);
    });
    return unsubscribe;
  }, []);

  const isAnyLoading = isFetching > 0 || isMutating > 0 || isHttpLoading;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAnyLoading) {
      setVisible(true);
    } else {
      // Small graceful fadeout delay to avoid flickering
      timer = setTimeout(() => {
        setVisible(false);
      }, 250);
    }
    return () => clearTimeout(timer);
  }, [isAnyLoading]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`${styles.loaderContainer} ${
        isAnyLoading ? styles.visible : styles.hidden
      }`}
      role="progressbar"
      aria-label="Loading content..."
      aria-hidden={!visible}
    >
      <div className={styles.progressBar} />
    </div>
  );
};
