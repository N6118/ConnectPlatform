import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { ProjectFilters } from "@/components/ui/project-filters";
import { useState } from "react";

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Create Project
        </button>
      </div>
      <ProjectFilters />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
      <ProjectModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
