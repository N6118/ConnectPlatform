import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Book, Calendar, Code, Users, Activity, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { statusColors, levelColors } from "@/components/ProjectCard";

export default function ProjectDetails({ params }: { params: { title: string } }) {
  const [activeTab, setActiveTab] = useState("overview");

  // This is a mock project data. In a real application, you would fetch this data based on the project title
  const project = {
    title: decodeURIComponent(params.title),
    description: "This is a detailed description of the project.",
    status: "In Progress" as const,
    level: "Medium" as const,
    mentor: "Dr. Jane Smith",
    prerequisites: "Basic understanding of AI and Machine Learning",
    techStack: ["React", "Node.js", "TensorFlow"],
    duration: "3 months",
    maxTeamSize: 5,
    skills: "JavaScript, Python, Data Analysis",
    progress: 60,
  };

  return (
    <div className="container mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href="/my-space" className="flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Back to Projects
        </Link>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{project.title}</h1>
            <div className="flex space-x-2">
              <Badge className={statusColors[project.status]}>{project.status}</Badge>
              <Badge className={levelColors[project.level]}>{project.level}</Badge>
            </div>
          </div>
          <Button>Join Project</Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Project Description</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Quick Info</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Book className="text-muted-foreground" size={20} />
                  <span className="text-muted-foreground">Mentor: {project.mentor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-muted-foreground" size={20} />
                  <span className="text-muted-foreground">Duration: {project.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-muted-foreground" size={20} />
                  <span className="text-muted-foreground">Team Size: Up to {project.maxTeamSize}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="text-muted-foreground" size={20} />
                  <span className="text-muted-foreground">Tech Stack: {project.techStack.join(", ")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="details">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2">Prerequisites</h2>
              <p className="text-muted-foreground">{project.prerequisites}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Required Skills</h2>
              <p className="text-muted-foreground">{project.skills}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="progress">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2">Project Progress</h2>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
              <p className="text-muted-foreground mt-2">{project.progress}% Complete</p>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="resources">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4">Project Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2" size={20} />
                Project Documentation
              </Button>
              <Button variant="outline" className="justify-start">
                <Code className="mr-2" size={20} />
                GitHub Repository
              </Button>
              <Button variant="outline" className="justify-start">
                <Book className="mr-2" size={20} />
                Learning Materials
              </Button>
              <Button variant="outline" className="justify-start">
                <Activity className="mr-2" size={20} />
                Progress Tracker
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
