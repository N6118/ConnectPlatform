import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarDays, MapPin, Clock, Users } from "lucide-react"
import { Button } from "./button"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  clubId: number
  clubName: string
  banner: string
  description?: string
  capacity?: number
  registered?: boolean
}

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const { toast } = useToast()

  if (!event) return null

  const handleRegister = () => {
    toast({
      title: "Successfully registered!",
      description: `You have registered for ${event.title}`,
    })
    onClose()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
            <img 
              src={event.banner} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
          <DialogDescription>
            Hosted by <span className="font-semibold text-primary">{event.clubName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            {event.capacity && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.capacity} spots available</span>
              </div>
            )}
          </div>

          <div className="pt-4 space-y-2">
            <h3 className="font-semibold">About this event</h3>
            <p className="text-muted-foreground">
              {event.description || "Join us for this exciting event! More details will be provided after registration."}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleRegister}>
              Register Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
