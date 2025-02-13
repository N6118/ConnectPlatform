interface ProjectDetailsProps {
  id?: string;
}

export function ProjectDetails({ id }: ProjectDetailsProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">Project Details</h1>
        {/* Project details content will be implemented here */}
        {id && <p>Project ID: {id}</p>}
      </div>
    </div>
  );
}
