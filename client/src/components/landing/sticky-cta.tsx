import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "./button";

export function StickyCTA() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 py-4 backdrop-blur-lg z-50"
    >
      <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between">
        <h3 className="text-xl font-bold text-white mb-4 sm:mb-0 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Join the Future of Academic Collaboration Today
        </h3>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent text-white border-white hover:bg-white hover:text-indigo-600 rounded-full px-6"
          >
            Explore First
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
