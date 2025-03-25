import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/project-card1";
import { ProjectFilters } from "@/components/ui/project-filters";
import { ProjectModal } from "@/components/ui/project-modal";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Project } from "@/components/ui/project-card1";
import { projectService } from "@/services/project";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";

export default function StudentProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await projectService.getAllProjects();
        
        if (response.success && response.data) {
          setAllProjects(response.data);
          setFilteredProjects(response.data);
        } else {
          setError(response.error || 'No projects data received from the server');
          // If unauthorized, redirect to login
          if (response.error?.includes('unauthorized') || response.error?.includes('Unauthorized')) {
            toast({
              variant: "destructive",
              title: "Session Expired",
              description: "Your session has expired. Please log in again.",
            });
            auth.logout();
          }
        }
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        console.error('Error fetching projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [auth, toast]);

  const allTags = Array.from(
    new Set(allProjects.flatMap((project) => project.tags)),
  );

  const handleSearch = useCallback(() => {
    const filtered = allProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedTags.length === 0 ||
          project.tags.some((tag) => selectedTags.includes(tag))) &&
        (statusFilter === "All" || project.status === statusFilter),
    );
    setFilteredProjects(filtered);
  }, [searchTerm, selectedTags, statusFilter, allProjects]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedTags, statusFilter, handleSearch]);

  const toggleTag = (tag: string) => {
    setSelectedTags((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StudentNavbar />
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">Projects</h1>
            <p className="text-xl text-muted-foreground">
              Discover and collaborate on exciting projects
            </p>
          </div>
        </motion.div>

        <ProjectFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
          allTags={allTags}
        />

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-muted-foreground">Loading projects...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-red-500">{error}</p>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-muted-foreground">
              No projects found matching your criteria
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={openModal}
              />
            ))}
          </motion.div>
        )}
      </div>

      {isModalOpen && selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
