import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const DashboardHeader: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
  >
    <div>
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-2">Comprehensive Platform Analytics</p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" className="whitespace-nowrap">
        <Calendar className="w-4 h-4 mr-2" /> Select Period
      </Button>
      <Button className="whitespace-nowrap">
        <Download className="w-4 h-4 mr-2" /> Export Report
      </Button>
    </div>
  </motion.div>
);