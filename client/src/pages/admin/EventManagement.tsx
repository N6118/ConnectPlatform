import { useState } from 'react';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, ChevronDown, ChevronUp, Pencil, Eye, Trash2, Calendar, Users, Award, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Event {
    id: number;
    natureOfEvent: string;
    typeOfEvent: string;
    theme: string[];
    fundingAgency: string;
    dates: {
        start: string;
        end: string;
    };
    chiefGuest: string;
    otherSpeakers: string[];
    participantsCount: number;
    highlights: string;
    papersReceived?: number;
    papersAccepted?: number;
    journalDetails?: string;
}

const sampleEvents: Event[] = [
    {
        id: 1,
        natureOfEvent: "INTERNATIONAL",
        typeOfEvent: "CONFERENCE",
        theme: ["AI and Machine Learning", "Data Science"],
        fundingAgency: "IEEE",
        dates: {
            start: "2024-03-15",
            end: "2024-03-17"
        },
        chiefGuest: "Dr. John Smith",
        otherSpeakers: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
        participantsCount: 250,
        highlights: "Best paper awards, Industry collaborations announced",
        papersReceived: 150,
        papersAccepted: 75,
        journalDetails: "Special issue in IEEE Transactions"
    },
    {
        id: 2,
        natureOfEvent: "NATIONAL",
        typeOfEvent: "WORKSHOP",
        theme: ["Renewable Energy"],
        fundingAgency: "Ministry of Science",
        dates: {
            start: "2024-04-10",
            end: "2024-04-12"
        },
        chiefGuest: "Prof. David Wilson",
        otherSpeakers: ["Dr. Emma Davis"],
        participantsCount: 100,
        highlights: "Hands-on sessions on solar panel installation"
    }
];

// Enhanced animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

const EventCard = ({ event, onEdit, onDelete, onView }: { 
    event: Event;
    onEdit: (event: Event) => void;
    onDelete: (event: Event) => void;
    onView: (event: Event) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/20 bg-white/50 backdrop-blur-sm">
                <CardHeader 
                    className="p-6 bg-gradient-to-r from-gray-50/80 to-white cursor-pointer hover:from-gray-100/80 hover:to-gray-50/80 transition-colors" 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-xl font- group-hover:text-primary transition-colors">
                                {event.typeOfEvent}
                            </CardTitle>
                            <div className="text-sm text-gray-600 mt-3 flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="bg-primary/5 px-3 py-1">{event.natureOfEvent}</Badge>
                                <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    {event.dates.start} to {event.dates.end}
                                </span>
                                <Badge variant="secondary" className="bg-secondary/10 px-3 py-1">
                                    <Users className="h-4 w-4 mr-1" />
                                    {event.participantsCount} Participants
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(event);
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(event);
                                }}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(event);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                            </motion.div>
                        </div>
                    </div>
                </CardHeader>
                
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CardContent className="p-6 bg-white/50 backdrop-blur-sm">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Theme(s)</dt>
                                        <dd className="mt-1">
                                            <div className="flex flex-wrap gap-2">
                                                {event.theme.map((theme, index) => (
                                                    <Badge key={index} variant="outline" className="px-3 py-1">{theme}</Badge>
                                                ))}
                                            </div>
                                        </dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Chief Guest</dt>
                                        <dd className="mt-1 text-gray-700">{event.chiefGuest}</dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Funding Agency</dt>
                                        <dd className="mt-1 text-gray-700">{event.fundingAgency}</dd>
                                    </div>
                                    
                                    <div className="col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Other Speakers</dt>
                                        <dd className="mt-1">
                                            <ul className="list-disc pl-4 space-y-1">
                                                {event.otherSpeakers.map((speaker, index) => (
                                                    <li key={index} className="text-gray-700">{speaker}</li>
                                                ))}
                                            </ul>
                                        </dd>
                                    </div>
                                    
                                    <div className="col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Highlights</dt>
                                        <dd className="mt-1 text-gray-700">{event.highlights}</dd>
                                    </div>
                                    
                                    {event.papersReceived && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Papers Statistics</dt>
                                            <dd className="mt-1 space-y-1">
                                                <p className="text-gray-700">Received: {event.papersReceived}</p>
                                                <p className="text-gray-700">Accepted: {event.papersAccepted}</p>
                                            </dd>
                                        </div>
                                    )}
                                    
                                    {event.journalDetails && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Journal Details</dt>
                                            <dd className="mt-1 text-gray-700">{event.journalDetails}</dd>
                                        </div>
                                    )}
                                </dl>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
};

export const EventManagement = () => {
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState<Event[]>(sampleEvents);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [filterType, setFilterType] = useState<string>("all");
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        natureOfEvent: '',
        typeOfEvent: '',
        theme: [],
        fundingAgency: '',
        dates: {
            start: '',
            end: ''
        },
        chiefGuest: '',
        otherSpeakers: [],
        participantsCount: 0,
        highlights: '',
        papersReceived: 0,
        papersAccepted: 0,
        journalDetails: ''
    });

    const handleAddEvent = () => {
        const eventToAdd: Event = {
            id: events.length + 1,
            natureOfEvent: newEvent.natureOfEvent || '',
            typeOfEvent: newEvent.typeOfEvent || '',
            theme: newEvent.theme || [],
            fundingAgency: newEvent.fundingAgency || '',
            dates: {
                start: newEvent.dates?.start || '',
                end: newEvent.dates?.end || ''
            },
            chiefGuest: newEvent.chiefGuest || '',
            otherSpeakers: newEvent.otherSpeakers || [],
            participantsCount: newEvent.participantsCount || 0,
            highlights: newEvent.highlights || '',
            papersReceived: newEvent.papersReceived,
            papersAccepted: newEvent.papersAccepted,
            journalDetails: newEvent.journalDetails
        };

        setEvents([...events, eventToAdd]);
        setIsAddDialogOpen(false);
        setNewEvent({
            natureOfEvent: '',
            typeOfEvent: '',
            theme: [],
            fundingAgency: '',
            dates: {
                start: '',
                end: ''
            },
            chiefGuest: '',
            otherSpeakers: [],
            participantsCount: 0,
            highlights: '',
            papersReceived: 0,
            papersAccepted: 0,
            journalDetails: ''
        });
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = () => {
        if (selectedEvent) {
            setEvents(events.map(event => 
                event.id === selectedEvent.id ? selectedEvent : event
            ));
            setIsEditDialogOpen(false);
            setSelectedEvent(null);
        }
    };

    const handleDelete = (event: Event) => {
        setSelectedEvent(event);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedEvent) {
            setEvents(events.filter(event => event.id !== selectedEvent.id));
            setIsDeleteDialogOpen(false);
            setSelectedEvent(null);
        }
    };

    const handleViewDetails = (event: Event) => {
        setSelectedEvent(event);
        setIsViewDialogOpen(true);
    };

    const handleInputChange = (field: string, value: any) => {
        if (field === 'theme') {
            setNewEvent(prev => ({
                ...prev,
                theme: value.split(',').map((t: string) => t.trim())
            }));
        } else if (field === 'otherSpeakers') {
            setNewEvent(prev => ({
                ...prev,
                otherSpeakers: value.split('\n').map((s: string) => s.trim()).filter(Boolean)
            }));
        } else if (field === 'dates.start' || field === 'dates.end') {
            setNewEvent(prev => ({
                ...prev,
                dates: {
                    start: field === 'dates.start' ? value : (prev.dates?.start || ''),
                    end: field === 'dates.end' ? value : (prev.dates?.end || '')
                }
            }));
        } else {
            setNewEvent(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = 
            event.typeOfEvent.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.natureOfEvent.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.theme.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase())) ||
            event.fundingAgency.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = filterType === "all" || event.typeOfEvent.toLowerCase() === filterType.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16 md:pb-0">
            <AdminNavbar />
            <motion.div 
                className="p-6 max-w-7xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div className="mb-8" variants={itemVariants}>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Event Management
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage and monitor academic events and activities</p>
                </motion.div>

                {/* Summary Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Total Events
                                        </p>
                                        <h3 className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">{events.length}</h3>
                                        <p className="text-sm opacity-80 mt-1">Active events</p>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-full">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Total Participants
                                        </p>
                                        <h3 className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">
                                            {events.reduce((acc, event) => acc + event.participantsCount, 0)}
                                        </h3>
                                        <p className="text-sm opacity-80 mt-1">Across all events</p>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-full">
                                        <Users className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    
                </motion.div>

                {/* Main Content */}
                <motion.div variants={itemVariants}>
                    <Card className="bg-white/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="conference">Conference</SelectItem>
                                            <SelectItem value="workshop">Workshop</SelectItem>
                                            <SelectItem value="seminar">Seminar</SelectItem>
                                            <SelectItem value="fdp">FDP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button 
                                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                                        onClick={() => setIsAddDialogOpen(true)}
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        <span>Add New Event</span>
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="h-[calc(100vh-400px)]">
                                <div className="space-y-4 pr-4">
                                    {filteredEvents.map(event => (
                                        <EventCard 
                                            key={event.id} 
                                            event={event} 
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onView={handleViewDetails}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Add Event Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Add New Event</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="natureOfEvent" className="text-sm font-medium">Nature of Event</Label>
                            <Input
                                id="natureOfEvent"
                                placeholder="INTERNATIONAL/NATIONAL/STATE/INSTITUTIONAL"
                                className="focus:ring-2 focus:ring-primary/20"
                                value={newEvent.natureOfEvent}
                                onChange={(e) => handleInputChange('natureOfEvent', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="typeOfEvent" className="text-sm font-medium">Type of Event</Label>
                            <Input
                                id="typeOfEvent"
                                placeholder="CONFERENCE/WORKSHOP/SEMINAR/FDP"
                                className="focus:ring-2 focus:ring-primary/20"
                                value={newEvent.typeOfEvent}
                                onChange={(e) => handleInputChange('typeOfEvent', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="theme" className="text-sm font-medium">Theme(s)</Label>
                            <Input
                                id="theme"
                                placeholder="Enter themes (comma separated)"
                                className="focus:ring-2 focus:ring-primary/20"
                                value={newEvent.theme?.join(', ')}
                                onChange={(e) => handleInputChange('theme', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fundingAgency" className="text-sm font-medium">Funding Agency</Label>
                            <Input
                                id="fundingAgency"
                                placeholder="Enter funding agency"
                                className="focus:ring-2 focus:ring-primary/20"
                                value={newEvent.fundingAgency}
                                onChange={(e) => handleInputChange('fundingAgency', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={newEvent.dates?.start}
                                    onChange={(e) => handleInputChange('dates.start', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={newEvent.dates?.end}
                                    onChange={(e) => handleInputChange('dates.end', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="chiefGuest" className="text-sm font-medium">Chief Guest</Label>
                            <Input
                                id="chiefGuest"
                                placeholder="Enter chief guest name"
                                className="focus:ring-2 focus:ring-primary/20"
                                value={newEvent.chiefGuest}
                                onChange={(e) => handleInputChange('chiefGuest', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="otherSpeakers" className="text-sm font-medium">Other Speakers</Label>
                            <Textarea
                                id="otherSpeakers"
                                placeholder="Enter other speakers (one per line)"
                                className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                                value={newEvent.otherSpeakers?.join('\n')}
                                onChange={(e) => handleInputChange('otherSpeakers', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="participantsCount" className="text-sm font-medium">Number of Participants</Label>
                            <Input
                                id="participantsCount"
                                type="number"
                                placeholder="Enter number of participants"
                                className="focus:ring-2 focus:ring-primary/20"
                                value={newEvent.participantsCount}
                                onChange={(e) => handleInputChange('participantsCount', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="highlights" className="text-sm font-medium">Highlights</Label>
                            <Textarea
                                id="highlights"
                                placeholder="Enter event highlights"
                                className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                                value={newEvent.highlights}
                                onChange={(e) => handleInputChange('highlights', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="papersReceived" className="text-sm font-medium">Papers Received</Label>
                                <Input
                                    id="papersReceived"
                                    type="number"
                                    placeholder="Number of papers"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={newEvent.papersReceived}
                                    onChange={(e) => handleInputChange('papersReceived', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="papersAccepted" className="text-sm font-medium">Papers Accepted</Label>
                                <Input
                                    id="papersAccepted"
                                    type="number"
                                    placeholder="Number of papers"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={newEvent.papersAccepted}
                                    onChange={(e) => handleInputChange('papersAccepted', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="journalDetails" className="text-sm font-medium">Journal Details</Label>
                            <Textarea
                                id="journalDetails"
                                placeholder="Enter journal publication details"
                                className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                                value={newEvent.journalDetails}
                                onChange={(e) => handleInputChange('journalDetails', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddEvent}>Add Event</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Event</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete this event? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Event Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Event Details</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="grid gap-4 py-4">
                            <div>
                                <h3 className="font-medium">Nature of Event</h3>
                                <p className="text-sm text-gray-600">{selectedEvent.natureOfEvent}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Type of Event</h3>
                                <p className="text-sm text-gray-600">{selectedEvent.typeOfEvent}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Theme(s)</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedEvent.theme.map((theme, index) => (
                                        <Badge key={index} variant="outline">{theme}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium">Funding Agency</h3>
                                <p className="text-sm text-gray-600">{selectedEvent.fundingAgency}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Dates</h3>
                                <p className="text-sm text-gray-600">
                                    {selectedEvent.dates.start} to {selectedEvent.dates.end}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Speakers</h3>
                                <p className="text-sm font-medium text-gray-600 mt-1">Chief Guest:</p>
                                <p className="text-sm text-gray-600">{selectedEvent.chiefGuest}</p>
                                <p className="text-sm font-medium text-gray-600 mt-2">Other Speakers:</p>
                                <ul className="list-disc pl-4 text-sm text-gray-600">
                                    {selectedEvent.otherSpeakers.map((speaker, index) => (
                                        <li key={index}>{speaker}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium">Participants</h3>
                                <p className="text-sm text-gray-600">{selectedEvent.participantsCount} attendees</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Highlights</h3>
                                <p className="text-sm text-gray-600">{selectedEvent.highlights}</p>
                            </div>
                            {selectedEvent.papersReceived && (
                                <div>
                                    <h3 className="font-medium">Papers</h3>
                                    <p className="text-sm text-gray-600">Received: {selectedEvent.papersReceived}</p>
                                    <p className="text-sm text-gray-600">Accepted: {selectedEvent.papersAccepted}</p>
                                </div>
                            )}
                            {selectedEvent.journalDetails && (
                                <div>
                                    <h3 className="font-medium">Journal Details</h3>
                                    <p className="text-sm text-gray-600">{selectedEvent.journalDetails}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Edit Event</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="grid gap-6 py-6">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-natureOfEvent" className="text-sm font-medium">Nature of Event</Label>
                                <Input
                                    id="edit-natureOfEvent"
                                    placeholder="INTERNATIONAL/NATIONAL/STATE/INSTITUTIONAL"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.natureOfEvent}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, natureOfEvent: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-typeOfEvent" className="text-sm font-medium">Type of Event</Label>
                                <Input
                                    id="edit-typeOfEvent"
                                    placeholder="CONFERENCE/WORKSHOP/SEMINAR/FDP"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.typeOfEvent}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, typeOfEvent: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-theme" className="text-sm font-medium">Theme(s)</Label>
                                <Input
                                    id="edit-theme"
                                    placeholder="Enter themes (comma separated)"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.theme.join(', ')}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, theme: e.target.value.split(',').map(t => t.trim()) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-fundingAgency" className="text-sm font-medium">Funding Agency</Label>
                                <Input
                                    id="edit-fundingAgency"
                                    placeholder="Enter funding agency"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.fundingAgency}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, fundingAgency: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-startDate" className="text-sm font-medium">Start Date</Label>
                                    <Input
                                        id="edit-startDate"
                                        type="date"
                                        className="focus:ring-2 focus:ring-primary/20"
                                        value={selectedEvent.dates.start}
                                        onChange={(e) => setSelectedEvent({ ...selectedEvent, dates: { ...selectedEvent.dates, start: e.target.value } })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-endDate" className="text-sm font-medium">End Date</Label>
                                    <Input
                                        id="edit-endDate"
                                        type="date"
                                        className="focus:ring-2 focus:ring-primary/20"
                                        value={selectedEvent.dates.end}
                                        onChange={(e) => setSelectedEvent({ ...selectedEvent, dates: { ...selectedEvent.dates, end: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-chiefGuest" className="text-sm font-medium">Chief Guest</Label>
                                <Input
                                    id="edit-chiefGuest"
                                    placeholder="Enter chief guest name"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.chiefGuest}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, chiefGuest: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-otherSpeakers" className="text-sm font-medium">Other Speakers</Label>
                                <Textarea
                                    id="edit-otherSpeakers"
                                    placeholder="Enter other speakers (one per line)"
                                    className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.otherSpeakers.join('\n')}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, otherSpeakers: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-participantsCount" className="text-sm font-medium">Number of Participants</Label>
                                <Input
                                    id="edit-participantsCount"
                                    type="number"
                                    placeholder="Enter number of participants"
                                    className="focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.participantsCount}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, participantsCount: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-highlights" className="text-sm font-medium">Highlights</Label>
                                <Textarea
                                    id="edit-highlights"
                                    placeholder="Enter event highlights"
                                    className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.highlights}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, highlights: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-papersReceived" className="text-sm font-medium">Papers Received</Label>
                                    <Input
                                        id="edit-papersReceived"
                                        type="number"
                                        placeholder="Number of papers"
                                        className="focus:ring-2 focus:ring-primary/20"
                                        value={selectedEvent.papersReceived}
                                        onChange={(e) => setSelectedEvent({ ...selectedEvent, papersReceived: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-papersAccepted" className="text-sm font-medium">Papers Accepted</Label>
                                    <Input
                                        id="edit-papersAccepted"
                                        type="number"
                                        placeholder="Number of papers"
                                        className="focus:ring-2 focus:ring-primary/20"
                                        value={selectedEvent.papersAccepted}
                                        onChange={(e) => setSelectedEvent({ ...selectedEvent, papersAccepted: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-journalDetails" className="text-sm font-medium">Journal Details</Label>
                                <Textarea
                                    id="edit-journalDetails"
                                    placeholder="Enter journal publication details"
                                    className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                                    value={selectedEvent.journalDetails}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, journalDetails: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-primary hover:bg-primary/90" onClick={handleEditSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isMobile && <AdminMobileBottomNav />}
        </div>
    );
};

export default EventManagement;