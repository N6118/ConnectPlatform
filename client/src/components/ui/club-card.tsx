import * as React from "react";
import { useLocation } from "wouter";
import type { LucideIcon } from "lucide-react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Club {
  id: number;
  name: string;
  banner: string;
  description: string;
  members: number;
  rating: number;
  achievements: number;
  icon: LucideIcon;
  joined: boolean;
  memberCount: {
    total: number;
    leaders: number;
    members: number;
  };
}

interface ClubCardProps {
  club: Club;
  onJoinToggle: (clubId: number) => void;
}

export function ClubCard({ club, onJoinToggle }: ClubCardProps) {
  const Icon = club.icon;
  const [_, setLocation] = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking the join button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    setLocation(`/student/club/${club.id}`);
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-lg cursor-pointer h-full"
      onClick={handleClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[16/9]">
          <img
            src={club.banner}
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-xl mb-2">{club.name}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {club.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {club.memberCount.total}
          </span>
          <span>★ {club.rating.toFixed(1)}</span>
          <span>{club.achievements} achievements</span>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onJoinToggle(club.id);
          }}
          variant={club.joined ? "default" : "outline"}
          className="w-full"
        >
          {club.joined ? "Leave Club" : "Join Club"}
        </Button>
      </CardContent>
    </Card>
  );
}
