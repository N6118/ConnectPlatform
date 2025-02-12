import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaPlus, FaClock, FaTimes } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Event {
  name: string;
  time: string;
}

interface Events {
  [key: string]: Event[];
}

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState("");
  const { toast } = useToast();
  const [events, setEvents] = useState<Events>({
    "2024-10-20": [
      { name: "AI Research Presentation", time: "10:00 AM" },
      { name: "Team Meeting", time: "2:00 PM" },
    ],
    "2024-11-05": [{ name: "Web Development Milestone", time: "1:00 PM" }],
    "2024-11-10": [{ name: "Data Science Assignment", time: "12:00 PM" }],
  });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddReminder = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    if (!newReminder) return;

    const newEvent = { name: newReminder, time: "All Day" };
    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateKey]: prevEvents[dateKey] ? [...prevEvents[dateKey], newEvent] : [newEvent],
    }));
    setNewReminder("");
    setIsModalOpen(false);
    toast({
      title: "Event added",
      description: "Your event has been added successfully.",
    });
  };

  const handleDeleteEvent = (dateKey: string, eventIndex: number) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[dateKey] = updatedEvents[dateKey].filter((_, index) => index !== eventIndex);
      if (updatedEvents[dateKey].length === 0) {
        delete updatedEvents[dateKey];
      }
      toast({
        title: "Event deleted",
        description: "Event has been removed successfully.",
      });
      return updatedEvents;
    });
  };

  const eventsForSelectedDate = events[selectedDate.toISOString().split("T")[0]] || [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full w-8 h-8 p-0"
          variant="outline"
        >
          <FaPlus className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex-none">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="custom-calendar w-full"
          tileClassName={({ date }) => {
            const dateKey = date.toISOString().split("T")[0];
            return events[dateKey] ? "font-bold text-primary" : "";
          }}
        />
      </div>

      <div className="flex-1 min-h-0">
        <h3 className="text-lg font-semibold mb-2">
          Events for {selectedDate.toLocaleDateString()}
        </h3>

        <div className="space-y-2 overflow-y-auto max-h-[200px]">
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event, index) => (
              <div
                key={index}
                className="group relative bg-background/50 rounded-lg p-3 border border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {event.name}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <FaClock className="mr-1.5 h-3 w-3" />
                      {event.time}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      handleDeleteEvent(
                        selectedDate.toISOString().split("T")[0],
                        index,
                      )
                    }
                  >
                    <FaTimes className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No events scheduled for this date
            </p>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Enter event details"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddReminder()}
            />
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReminder}>Add Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CalendarView;