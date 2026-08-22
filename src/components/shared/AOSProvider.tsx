"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 650,
      once: true, // Only animate once so scrolling up and down doesn't jank/flicker
      easing: "ease-out-cubic",
      offset: 40,
      delay: 0,
      disable: false,
    });

    // Refresh on route or DOM changes
    AOS.refresh();
  }, []);


  return <>{children}</>;
}

export default AOSProvider;
