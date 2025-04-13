import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ExtracurricularData {
  title: string;
  organization: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  achievements: string;
  skills: string;
  url: string;
}

interface ExtracurricularModalProps {
  extracurricular?: ExtracurricularData;
  onClose: () => void;
  onSave: (data: ExtracurricularData) => void;
}

export default function ExtracurricularModal({
  extracurricular,
  onClose,
  onSave,
}: ExtracurricularModalProps) {
  const [formData, setFormData] = useState<ExtracurricularData>({
    title: "",
    organization: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Ongoing",
    achievements: "",
    skills: "",
    url: "",
  });

  useEffect(() => {
    if (extracurricular) {
      setFormData({
        ...extracurricular,
        status: extracurricular.status || "Ongoing",
      });
    }
  }, [extracurricular]);

  const handleChange = (name: keyof ExtracurricularData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {extracurricular ? "Edit Extracurricular Activity" : "Add New Extracurricular Activity"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization/Club</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => handleChange("organization", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleChange("status", value as "Ongoing" | "Completed" | "Upcoming")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements</Label>
            <Textarea
              id="achievements"
              value={formData.achievements}
              onChange={(e) => handleChange("achievements", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills Gained (comma separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => handleChange("skills", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Website/Portfolio URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {extracurricular ? "Update Activity" : "Create Activity"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
