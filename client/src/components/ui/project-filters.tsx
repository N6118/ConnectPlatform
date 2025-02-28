import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Add the interface for the filters
interface ProjectFiltersType {
  searchTerm: string;
  status: string;
  level: string;
  isOpenForApplications?: boolean;
  tag?: string;
  mentor?: string;
}

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  allTags: string[];
}

export const ProjectFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  selectedTags,
  onTagToggle,
  allTags
}: ProjectFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-64"
        />
        
        <Select
          value={statusFilter}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Tags selection */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            onSearchChange('');
            onStatusChange('all');
            onTagToggle('');
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
