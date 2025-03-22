import { UserActivityChart } from '@/components/UserActivityChart';
import { StatsGrid } from '../../components/AdminStat-components/StatsGrid';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export const Dashboard = () => {
  const isMobile = useIsMobile();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16 md:pb-0">
      <AdminNavbar />
      <motion.div 
        className="p-6 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Monitor and analyze platform statistics</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsGrid />
        </motion.div>
      </motion.div>
      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default Dashboard;