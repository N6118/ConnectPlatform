import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaPlus, FaClock, FaTimes } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { toast } from "sonner";

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
  const [events, setEvents] = useState<Events>({
    "2024-10-20": [
      { name: "AI Research Presentation", time: "10:00 AM" },
      { name: "Team Meeting", time: "2:00 PM" },
    ],
    "2024-11-05": [{ name: "Web Development Milestone", time: "1:00 PM" }],
    "2024-11-10": [{ name: "Data Science Assignment", time: "12:00 PM" }],
  });

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddReminder = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    if (!newReminder) return;

    const newEvent = { name: newReminder, time: "All Day" };
    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateKey]: prevEvents[dateKey]
        ? [...prevEvents[dateKey], newEvent]
        : [newEvent],
    }));
    setNewReminder("");
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (dateKey: string, eventIndex: number) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };

      // Remove the event at the specified index
      updatedEvents[dateKey] = updatedEvents[dateKey].filter(
        (_, index) => index !== eventIndex,
      );

      // If no events are left for the date, remove the key entirely
      if (updatedEvents[dateKey].length === 0) {
        delete updatedEvents[dateKey];
      }

      toast.success("Event deleted successfully!");
      return updatedEvents;
    });
  };

  const eventsForSelectedDate =
    events[selectedDate.toISOString().split("T")[0]] || [];

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 bg-gradient-to-br from-background to-accent/20">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {/* Calendar Section */}
          <div className="bg-card/80 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Calendar
              </h2>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="rounded-full w-8 h-8 p-0"
                variant="outline"
              >
                <FaPlus className="h-3 w-3" />
              </Button>
            </div>

            <div className="overflow-x-auto -mx-3 px-3">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="custom-calendar w-full"
                tileClassName={({ date }) => {
                  const dateKey = date.toISOString().split("T")[0];
                  return events[dateKey] ? "font-bold text-primary" : null;
                }}
              />
            </div>
          </div>

          {/* Events Section - Positioned Below */}
          <div className="bg-card/80 backdrop-blur-md rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 border border-border/50">
            <h3 className="text-lg font-semibold mb-3">
              Events for {selectedDate.toLocaleDateString()}
            </h3>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
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
        </div>

        {/* Add Event Dialog */}
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
    </div>
  );
}

export default CalendarView;
