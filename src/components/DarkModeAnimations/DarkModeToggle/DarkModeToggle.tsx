import React, { useEffect, useState } from "react";
import storage from "local-storage-fallback";
import styles from "./DarkModeToggle.module.scss";
import "@theme-toggles/react/css/Within.css";
import { Within } from "@theme-toggles/react";
import { useTheme } from "next-themes";

const onClickWrapper = (
  setTheme: (theme: string) => void,
  isDark: boolean,
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  setTheme(isDark ? "dark" : "light");
  const bodyRect = document.body.getBoundingClientRect();
  const elemRect = event.currentTarget.getBoundingClientRect();
  const offsetLeft = elemRect.left - bodyRect.left;
  const customEventState = {
    x: offsetLeft + elemRect.width / 1.6,
    y: elemRect.top + elemRect.height / 2,
  };

  const darkModeToggleEvent = new CustomEvent("darkModeToggle", {
    detail: customEventState,
  });

  dispatchEvent(darkModeToggleEvent);
};

const DarkModeToggle = ({
  isDark,
  setTheme,
}: {
  isDark: boolean;
  setTheme: any;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Within
        type="button"
        aria-label="Dark Mode Toggle"
        onClickCapture={(e) => onClickWrapper(setTheme, !isDark, e)}
        duration={750}
        style={{
          fontSize: 40,
          // color: theme === "dark" ? "blue" : "orange",
          color: isDark ? "blue" : "orange",
          display: "flex",
          alignItems: "center",
        }}
      />
    </>
  );
};

export default DarkModeToggle;
