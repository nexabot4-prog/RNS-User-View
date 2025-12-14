import React, { useEffect, useState, createContext, useContext } from "react";

import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

const colors = [
  "#0ea5e9",
  "#737373",
  "#14b8a6",
  "#22c55e",
  "#3b82f6",
  "#ef4444",
  "#eab308",
];

const FollowerPointerContext = createContext(null);

export const useFollowerPointer = () => {
  const context = useContext(FollowerPointerContext);
  if (!context) {
    throw new Error("useFollowerPointer must be used within a FollowerPointerCard");
  }
  return context;
};

export const FollowerPointerCard = ({
  children,
  className,
  title: initialTitle
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = React.useRef(null);
  const [rect, setRect] = useState(null);
  const [isInside, setIsInside] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    if (title) {
      setColor(colors[Math.floor(Math.random() * colors.length)]);
    }
  }, [title]);

  const handleMouseMove = (e) => {
    if (rect) {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      x.set(e.clientX - rect.left + scrollX);
      y.set(e.clientY - rect.top + scrollY);
    }
  };
  const handleMouseLeave = () => {
    setIsInside(false);
  };

  const handleMouseEnter = () => {
    setIsInside(true);
  };
  return (
    <FollowerPointerContext.Provider value={{ setTitle }}>
      <div
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        style={{
          cursor: "none",
        }}
        ref={ref}
        className={cn("relative", className)}>
        <AnimatePresence>
          {isInside && <FollowPointer x={x} y={y} title={title} color={color} />}
        </AnimatePresence>
        {children}
      </div>
    </FollowerPointerContext.Provider>
  );
};

export const FollowPointer = ({
  x,
  y,
  title,
  color
}) => {
  return (
    <motion.div
      className="absolute z-[500] h-4 w-4 rounded-full"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}>
      <svg
        stroke={color}
        fill={color}
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
      </svg>
      <AnimatePresence>
        {title && (
          <motion.div
            style={{
              backgroundColor: color,
            }}
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.5,
              opacity: 0,
            }}
            className={
              "min-w-max rounded-full bg-neutral-200 px-2 py-2 text-xs whitespace-nowrap text-white"
            }>
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
