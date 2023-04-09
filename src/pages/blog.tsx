import React, { useEffect, useState } from "react";
import storage from "local-storage-fallback";
import DarkModeToggle from "@/components/DarkModeAnimations/DarkModeToggle/DarkModeToggle";
import styles from "@/styles/blog.module.scss";
import { useTheme } from "next-themes";
import GrowCanvas from "@/components/DarkModeAnimations/part2/GrowCanvas";
import GrowingCircleCanvas from "@/components/DarkModeAnimations/GrowingCrircleCanvas/GrowingCircleCanvas";
const getInitialTheme = () => {
  const savedTheme = storage.getItem("theme");
  return savedTheme === "true";
};

const Blog = () => {
  //   const [isDark, setIsDark] = useState(getInitialTheme());
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className={styles.flex}>
        <DarkModeToggle isDark={isDark} setTheme={setTheme} />
        <DarkModeToggle isDark={isDark} setTheme={setTheme} />
        <DarkModeToggle isDark={isDark} setTheme={setTheme} />
      </div>
      <GrowingCircleCanvas />
    </>
  );
};

export default Blog;
