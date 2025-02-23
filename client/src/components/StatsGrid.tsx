import { motion } from "framer-motion";
import { StatCard } from './StatCard';
import { Users, Target, BookMarked, UserCheck, Building, Activity } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    icon: <Users className="w-5 h-5 text-primary" />,
    description: "Active users across all roles",
    trend: 12,
    color: "blue"
  },
  {
    title: "Research Projects",
    value: "156",
    icon: <Target className="w-5 h-5 text-primary" />,
    description: "Ongoing research initiatives",
    trend: 15,
    color: "green"
  },
  {
    title: "Publications",
    value: "89",
    icon: <BookMarked className="w-5 h-5 text-primary" />,
    description: "Papers published this year",
    trend: 8,
    color: "purple"
  },
  {
    title: "Faculty Members",
    value: "245",
    icon: <UserCheck className="w-5 h-5 text-primary" />,
    description: "Active teaching staff",
    trend: 5,
    color: "orange"
  },
  {
    title: "Active Clubs",
    value: "28",
    icon: <Building className="w-5 h-5 text-primary" />,
    description: "Student organizations",
    trend: 10,
    color: "yellow"
  },
  {
    title: "System Health",
    value: "98%",
    icon: <Activity className="w-5 h-5 text-primary" />,
    description: "Platform performance",
    trend: 2,
    color: "green"
  }
];

export const StatsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    {stats.map((stat, index) => (
      <motion.div
        key={stat.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <StatCard {...stat} />
      </motion.div>
    ))}
  </div>
);