import { useState } from "react";
import { EventCarousel } from "@/components/ui/event-carousel";
import { ClubCard } from "@/components/ui/club-card";
import type { Club } from "@/components/ui/club-card";

export function Clubs() {
  // Re-use existing Clubs.tsx content
  const [clubs, setClubs] = useState<Club[]>([]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">Clubs & Activities</h1>
        <EventCarousel />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} onJoinToggle={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}
