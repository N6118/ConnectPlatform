import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-10 h-10 text-indigo-600" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
