import { motion } from "framer-motion";
import { Edit2, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export const statusColors = {
  "Not Started": "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Dropped: "bg-red-100 text-red-800",
};

export const levelColors = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Difficult: "bg-red-100 text-red-800",
};

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    tag: string;
    status: keyof typeof statusColors;
    level: keyof typeof levelColors;
    isOpenForApplications: boolean;
    applicants?: {
      id: string;
      name: string;
      email: string;
      status: "pending" | "accepted" | "rejected" | "waitlisted";
      appliedDate: string;
      experience: string;
      notes?: string;
    }[];
    stats?: {
      totalApplicants: number;
      acceptedApplicants: number;
      completionPercentage: number;
    };
    team?: {
      name: string;
      role: string;
    }[];
  };
  userType: "faculty" | "student"; 
  onEdit: () => void;
  onDelete: () => void;
  onViewApplicants: () => void;
}

export default function ProjectCard({
  project,
  userType,
  onEdit,
  onDelete,
  onViewApplicants,
}: ProjectCardProps) {
  const applicantsCount = project.applicants?.length || 0;
  const projectLink = `/${userType}/project/${project.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="p-6 space-y-4">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
              {project.title}
            </h3>
            <Badge variant="outline" className="text-sm font-medium">
              {project.tag}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit} className="hover:bg-gray-100">
              <Edit2 className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="hover:bg-gray-100">
              <Trash2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={`${statusColors[project.status]} text-xs font-medium`}>
            {project.status}
          </Badge>
          <Badge className={`${levelColors[project.level]} text-xs font-medium`}>
            {project.level}
          </Badge>
          <Badge
            variant={project.isOpenForApplications ? "default" : "secondary"}
            className="text-xs font-medium"
          >
            {project.isOpenForApplications ? "Open for Applications" : "Closed"}
          </Badge>
        </div>

        {/* Stats Section */}
        {project.stats && (
          <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">Total Applicants</p>
              <p className="text-lg font-semibold text-gray-900">{project.stats.totalApplicants}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">Accepted</p>
              <p className="text-lg font-semibold text-gray-900">{project.stats.acceptedApplicants}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">Progress</p>
              <p className="text-lg font-semibold text-gray-900">{project.stats.completionPercentage}%</p>
            </div>
          </div>
        )}

        {/* Team Members Section */}
        {project.team && project.team.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">Team Members</p>
            <div className="flex flex-wrap gap-1.5">
              {project.team.map((member, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700"
                >
                  {member.name} ({member.role})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions Section */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2">
            <Link href={projectLink}>
              <Button variant="default" size="sm" className="text-sm">
                View Details
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewApplicants}
              className="text-sm"
            >
              <Users className="h-4 w-4 mr-1.5" />
              {applicantsCount} Applicant{applicantsCount !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
