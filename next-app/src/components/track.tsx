"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

const Skiper19 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  return (
    <section
      ref={ref}
      className="mx-auto flex h-[600vh] w-screen flex-col items-center overflow-hidden bg-[#FAFDEE] text-[#1F3A4B]"
    >
      <LinePath scrollYProgress={scrollYProgress} />
    </section>
  );
};

export { Skiper19 };

const LinePath = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  // Motion values for camera
  const camX = useMotionValue<number>(0);
  const camY = useMotionValue<number>(0);

  // Window size
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smoother movement
  const smoothX = useSpring(camX, { stiffness: 400, damping: 30 });
  const smoothY = useSpring(camY, { stiffness: 400, damping: 30 });

  // Follow path tip as it’s drawn
  useMotionValueEvent(scrollYProgress, "change", (v: number) => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    const pt = pathRef.current.getPointAtLength(v * len);
    camX.set(pt.x);
    camY.set(pt.y);
  });

  // Derived transforms for "camera follow"
  const translateX = useTransform(smoothX, (x) => (-x + windowSize.w / 2.2) * 35);
  const translateY = useTransform(smoothY, (y) => (-y + windowSize.h / 1.9) * 30);

  // Draw progress
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dashOffset = useTransform(pathLength, (v) => 0.2 - v);

  return (
    <svg
      width="2400"
      height="2400"
      viewBox="16000 5000 1500 3000"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className="fixed inset-0 h-screen w-screen"
    >
      <motion.g
        style={{
          translateX,
          translateY,
          scale: 33, // 🔥 Increase this for a larger, closer camera view
        }}
      >
        <motion.path
          ref={pathRef}
          d="M185.493 300.001H429.993C467.993 300.001 471.993 240.501 429.993 240.501H407.722C406.903 240.501 406.086 240.442 405.276 240.325L402.211 239.88C364.512 234.418 363.54 180.357 401.018 173.543C403.002 173.182 405.014 173.001 407.031 173.001H429.993C440.159 171.834 460.493 163.101 460.493 137.501C460.493 111.901 460.493 104.167 460.493 103.501C459.826 94.1675 454.5 77.0008 432.493 77.0008C406.867 77.7125 392.635 77.5001 392.635 63.5003C392.635 49.5005 404.914 46.5005 432.493 46.5005C448.356 46.5005 461.01 35.1057 460.634 23.5C460.634 9.5 451 1.50045 432.493 1.50045H287.493C277.819 1.5003 265.799 3.3076 259.631 16C255.5 24.5 256.733 37.6289 280.993 49.5005L362.566 84.6583C366.154 86.2046 369.403 88.4406 372.128 91.2394C392.856 112.524 373.411 146.359 345.111 137.315C335.552 134.26 326.462 131.119 318.5 128C274.07 110.598 214.993 77.0003 214.993 77.0003C208.826 74.167 193.493 64.575 193.493 48.0003C193.493 28.0003 193.493 1.50045 156.493 1.50045H35.9926C15.0014 -0.999697 -14.8074 24.8003 19.9926 48.0003L198.501 132C234.5 145.5 215.201 198.5 170.001 178.5L44.0014 127C33.0014 122 9.40137 118.1 3.00137 142.5C-4.99863 173 13.0014 211.5 49.0014 210.5C77.8014 209.7 174 210.167 218.5 210.5C230 210.167 253.6 204.7 256 185.5C259 161.5 273 151.5 289 151.5C299.673 151.993 313.803 153.646 322.5 163.5C332.842 178.339 340.127 213.432 303.147 232.317C294.149 236.912 283.87 238 273.766 238C191.245 238 41 238 41 238C-1.5 238 -15.8 300.001 41 300.001H176.5"
          stroke="#363b41"
          strokeWidth="20"
          style={{
            pathLength,
            strokeDashoffset: dashOffset,
          }}
        />
      </motion.g>
    </svg>
  );
};
