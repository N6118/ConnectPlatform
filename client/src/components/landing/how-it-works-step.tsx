import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function HowItWorksStep({ number, title, description, icon: Icon }: HowItWorksStepProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: number % 2 === 0 ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`flex items-center ${number % 2 === 0 ? "flex-row-reverse" : ""} mb-16 md:mb-24`}
    >
      <div className="w-1/2 px-8">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-2xl w-12 h-12 flex items-center justify-center mr-4 shadow-lg">
            {number}
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className="w-1/2 flex justify-center">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-indigo-50 to-white rounded-full p-8 shadow-xl"
        >
          <Icon className="w-20 h-20 text-indigo-600" />
        </motion.div>
      </div>
    </motion.div>
  );
}
