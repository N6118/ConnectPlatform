import React, { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
  children: ReactNode;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeableCard({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
}: SwipeableCardProps) {
  const [emblaRef] = useEmblaCarousel({
    direction: "horizontal",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-lg bg-card shadow-sm",
        className
      )}
      whileTap={{ scale: 0.98 }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          <motion.div
            className="flex-[0_0_100%] min-w-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -50 && onSwipeLeft) {
                onSwipeLeft();
              } else if (swipe > 50 && onSwipeRight) {
                onSwipeRight();
              }
            }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
