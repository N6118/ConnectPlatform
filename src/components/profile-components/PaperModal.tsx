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

interface PaperData {
  title: string;
  description: string;
  authors: string;
  journal: string;
  publicationDate: string;
  doi: string;
  status: "Draft" | "Submitted" | "Published" | "Rejected";
  tags: string;
  url: string;
  citations: string;
}

interface PaperModalProps {
  paper?: PaperData;
  onClose: () => void;
  onSave: (data: PaperData) => void;
}

export default function PaperModal({
  paper,
  onClose,
  onSave,
}: PaperModalProps) {
  const [formData, setFormData] = useState<PaperData>({
    title: "",
    description: "",
    authors: "",
    journal: "",
    publicationDate: "",
    doi: "",
    status: "Draft",
    tags: "",
    url: "",
    citations: "0",
  });

  useEffect(() => {
    if (paper) {
      setFormData({
        ...paper,
        status: paper.status || "Draft",
      });
    }
  }, [paper]);

  const handleChange = (name: keyof PaperData, value: any) => {
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
            {paper ? "Edit Paper" : "Add New Paper"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Paper Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Abstract</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="authors">Authors</Label>
              <Input
                id="authors"
                value={formData.authors}
                onChange={(e) => handleChange("authors", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="journal">Journal/Conference</Label>
              <Input
                id="journal"
                value={formData.journal}
                onChange={(e) => handleChange("journal", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                type="date"
                value={formData.publicationDate}
                onChange={(e) => handleChange("publicationDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doi">DOI</Label>
              <Input
                id="doi"
                value={formData.doi}
                onChange={(e) => handleChange("doi", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleChange("status", value as "Draft" | "Submitted" | "Published" | "Rejected")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="citations">Citations</Label>
              <Input
                id="citations"
                type="number"
                min="0"
                value={formData.citations}
                onChange={(e) => handleChange("citations", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Paper URL</Label>
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
              {paper ? "Update Paper" : "Create Paper"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
