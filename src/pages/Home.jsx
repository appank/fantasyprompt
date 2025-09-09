import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("https://laimonprompt.blogspot.com/");
  }, []);

  return null; // kosong, langsung redirect
}