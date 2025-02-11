import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Settings,
  Activity,
  Shield,
  BookOpen
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-6 bg-card rounded-xl shadow-sm border"
  >
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-foreground/80">{title}</h3>
      <div className="p-2 bg-primary/10 rounded-full">
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold mt-4 text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-2">{description}</p>
  </motion.div>
);

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <Users className="w-5 h-5 text-primary" />,
      description: "Active users across all roles"
    },
    {
      title: "Research Projects",
      value: "45",
      icon: <FileText className="w-5 h-5 text-primary" />,
      description: "Ongoing research initiatives"
    },
    {
      title: "Faculty Members",
      value: "89",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      description: "Active teaching staff"
    },
    {
      title: "System Health",
      value: "98%",
      icon: <Activity className="w-5 h-5 text-primary" />,
      description: "Platform performance status"
    },
    {
      title: "Security Alerts",
      value: "0",
      icon: <Shield className="w-5 h-5 text-primary" />,
      description: "No active security issues"
    },
    {
      title: "System Settings",
      value: "7",
      icon: <Settings className="w-5 h-5 text-primary" />,
      description: "Pending configuration updates"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage platform activities
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}