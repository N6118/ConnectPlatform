import { useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { EventModal } from "./event-modal"

interface Event {
  id: number
  title?: string
  date?: string
  time?: string
  location?: string
  clubId?: number
  clubName?: string
  banner?: string
  description?: string
  capacity?: number
  registeredUsers?: {
    id: number
    username: string
    profilePicture?: string
  }[]
  
  // Fields from EventManagement.tsx
  natureOfEvent?: string
  typeOfEvent?: string
  theme?: string[]
  fundingAgency?: string
  dates?: {
    start: string
    end: string
  }
  chiefGuest?: string
  otherSpeakers?: string[]
  participantsCount?: number
  highlights?: string
  isCompleted?: boolean
}

interface EventCarouselProps {
  events: Event[]
}

export function EventCarousel({ events }: EventCarouselProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  return (
    <>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {events.map((event) => (
            <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={event.banner}
                        alt={event.title || event.typeOfEvent}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
                      <div className="absolute bottom-0 p-4 text-white">
                        <h3 className="font-semibold text-lg mb-2">{event.title || event.typeOfEvent}</h3>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                              {event.date ? 
                                new Date(event.date).toLocaleDateString() : 
                                (event.dates?.start ? new Date(event.dates.start).toLocaleDateString() : '')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time || (event.dates?.end ? `to ${new Date(event.dates.end).toLocaleDateString()}` : '')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location || ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  )
}