import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, Plus, Users, FileCode, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
interface WorkItem {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  status: string;
  level?: string;
  verified?: string;
  faculty?: string;
  activity?: string;
  techStack?: string[];
  collaborators?: string[];
  date?: string;
  achievement?: string;
  citations?: number;
  journal?: string;
}
interface WorkListProps {
  items: WorkItem[];
  type: string;
  onAdd: () => void;
  onEdit: (item: WorkItem) => void;
  onDelete: (id: number) => void;
}
const getStatusColor = (status?: string) => {
  if (!status) return "bg-gray-100 text-gray-800";
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "ongoing":
      return "bg-blue-100 text-blue-800";
    case "published":
      return "bg-purple-100 text-purple-800";
    case "dropped":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
export default function WorkList({
  items,
  type,
  onAdd,
  onEdit,
  onDelete,
}: WorkListProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {type}s
          </h2>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add {type}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow h-full">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                        {item.name || item.title || item.activity}
                      </h3>
                      <div className="flex gap-2 ml-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                    <ScrollArea className="w-full">
                      <div className="flex flex-wrap gap-2 pb-2">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(item.status)}
                        >
                          {item.status}
                        </Badge>
                        {item.level && (
                          <Badge variant="outline">{item.level}</Badge>
                        )}
                        {item.verified && (
                          <Badge
                            variant={
                              item.verified === "Verified"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              item.verified === "Verified"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {item.verified}
                          </Badge>
                        )}
                      </div>
                    </ScrollArea>
                    {item.techStack && item.techStack.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileCode className="h-4 w-4 shrink-0" />
                        <ScrollArea className="w-full">
                          <div className="flex flex-wrap gap-1 pb-2">
                            {item.techStack.map((tech, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-gray-50"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    {item.collaborators && item.collaborators.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4 shrink-0" />
                        <span>{item.collaborators.length} collaborator(s)</span>
                      </div>
                    )}
                    {item.faculty && (
                      <div className="text-sm text-gray-500">
                        Faculty: {item.faculty}
                      </div>
                    )}
                    {item.achievement && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Award className="h-4 w-4 shrink-0" />
                        <span className="line-clamp-1">{item.achievement}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
