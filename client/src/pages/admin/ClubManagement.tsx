import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChartContainer } from '../../components/ChartContainer';
import { Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
    ResponsiveContainer, 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LineChart,
    Line,
    CartesianGrid
} from 'recharts';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ClubManagement = () => {
    const isMobile = useIsMobile();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("members");
    const [displayedClubs, setDisplayedClubs] = useState(5);
    const [showMore, setShowMore] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedClubsFilter, setSelectedClubsFilter] = useState<string[]>([]);
    const [eventTypeFilter, setEventTypeFilter] = useState(["workshops", "competitions", "socialEvents"]);

    // Simplified club data without budget and engagement score
    const clubData = [
        {
            id: 1,
            name: 'Tech Club',
            description: 'A club dedicated to exploring new technologies',
            members: 120,
            events: 45,
            advisor: 'Dr. Emily Smith',
            clubHead: 'Alex Johnson',
            status: 'active'
        },
        {
            id: 2,
            name: 'Debate Society',
            description: 'Fostering critical thinking through debate',
            members: 75,
            events: 30,
            advisor: 'Prof. James Williams',
            clubHead: 'Sarah Chen',
            status: 'active'
        },
        {
            id: 3,
            name: 'Film Club',
            description: 'Creating and exploring the world of cinema',
            members: 60,
            events: 25,
            advisor: 'Dr. Ravi Patel',
            clubHead: 'Miguel Rodriguez',
            status: 'inactive'
        },
        {
            id: 4,
            name: 'Photography Club',
            description: 'Capturing moments through the lens',
            members: 55,
            events: 28,
            advisor: 'Ms. Rebecca Taylor',
            clubHead: 'Jamie Lee',
            status: 'active'
        },
        {
            id: 5,
            name: 'Robotics Club',
            description: 'Building the future through robotics',
            members: 85,
            events: 32,
            advisor: 'Dr. Daniel Matthews',
            clubHead: 'Devon White',
            status: 'active'
        },
        {
            id: 6,
            name: 'Environmental Club',
            description: 'Working towards a sustainable future',
            members: 95,
            events: 40,
            advisor: 'Prof. Sofia Garcia',
            clubHead: 'Jordan Smith',
            status: 'active'
        },
        {
            id: 7,
            name: 'Chess Club',
            description: 'Mastering the game of kings',
            members: 40,
            events: 15,
            advisor: 'Mr. Wei Li',
            clubHead: 'Priya Agarwal',
            status: 'inactive'
        },
        {
            id: 8,
            name: 'Music Society',
            description: 'Celebrating talent in all forms of music',
            members: 110,
            events: 38,
            advisor: 'Dr. Olivia Nguyen',
            clubHead: 'Marcus Chen',
            status: 'active'
        },
        {
            id: 9,
            name: 'Culinary Club',
            description: 'Exploring cuisines from around the world',
            members: 65,
            events: 22,
            advisor: 'Prof. Thomas Parker',
            clubHead: 'Leila Sanchez',
            status: 'active'
        },
        {
            id: 10,
            name: 'Dance Troupe',
            description: 'Expressing creativity through movement',
            members: 70,
            events: 26,
            advisor: 'Ms. Jasmine Kwan',
            clubHead: 'Kai Washington',
            status: 'inactive'
        }
    ];

    // Data for membership growth chart
    const membershipGrowthData = [
        { month: 'Jan', 'Tech Club': 100, 'Debate Society': 65, 'Robotics Club': 70, 'Environmental Club': 80, 'Music Society': 95, 'Culinary Club': 55 },
        { month: 'Feb', 'Tech Club': 105, 'Debate Society': 68, 'Robotics Club': 75, 'Environmental Club': 85, 'Music Society': 100, 'Culinary Club': 58 },
        { month: 'Mar', 'Tech Club': 110, 'Debate Society': 70, 'Robotics Club': 78, 'Environmental Club': 90, 'Music Society': 104, 'Culinary Club': 60 },
        { month: 'Apr', 'Tech Club': 115, 'Debate Society': 72, 'Robotics Club': 82, 'Environmental Club': 92, 'Music Society': 107, 'Culinary Club': 62 },
        { month: 'May', 'Tech Club': 120, 'Debate Society': 75, 'Robotics Club': 85, 'Environmental Club': 95, 'Music Society': 110, 'Culinary Club': 65 }
    ];

    // Data for events chart
    const eventsData = [
        { name: 'Tech Club', workshops: 15, competitions: 10, socialEvents: 20 },
        { name: 'Debate Society', workshops: 8, competitions: 18, socialEvents: 4 },
        { name: 'Film Club', workshops: 12, competitions: 5, socialEvents: 8 },
        { name: 'Photography Club', workshops: 10, competitions: 8, socialEvents: 10 },
        { name: 'Robotics Club', workshops: 20, competitions: 10, socialEvents: 2 },
        { name: 'Environmental Club', workshops: 12, competitions: 8, socialEvents: 20 },
        { name: 'Chess Club', workshops: 5, competitions: 8, socialEvents: 2 },
        { name: 'Music Society', workshops: 10, competitions: 15, socialEvents: 13 },
        { name: 'Culinary Club', workshops: 15, competitions: 2, socialEvents: 5 },
        { name: 'Dance Troupe', workshops: 8, competitions: 12, socialEvents: 6 }
    ];

    // List of users for select dropdown
    const availableUsers = [
        { id: 1, name: 'Alex Johnson' },
        { id: 2, name: 'Sarah Chen' },
        { id: 3, name: 'Miguel Rodriguez' },
        { id: 4, name: 'Jamie Lee' },
        { id: 5, name: 'Devon White' },
        { id: 6, name: 'Jordan Smith' },
        { id: 7, name: 'Priya Agarwal' },
        { id: 8, name: 'Marcus Chen' },
        { id: 9, name: 'Leila Sanchez' },
        { id: 10, name: 'Kai Washington' }
    ];

    // Faculty mentors for dropdown
    const facultyMentors = [
        { id: 1, name: 'Dr. Emily Smith', department: 'Computer Science' },
        { id: 2, name: 'Prof. James Williams', department: 'Communications' },
        { id: 3, name: 'Dr. Ravi Patel', department: 'Film Studies' },
        { id: 4, name: 'Ms. Rebecca Taylor', department: 'Visual Arts' },
        { id: 5, name: 'Dr. Daniel Matthews', department: 'Engineering' },
        { id: 6, name: 'Prof. Sofia Garcia', department: 'Environmental Science' },
        { id: 7, name: 'Mr. Wei Li', department: 'Mathematics' },
        { id: 8, name: 'Dr. Olivia Nguyen', department: 'Music' },
        { id: 9, name: 'Prof. Thomas Parker', department: 'Culinary Arts' },
        { id: 10, name: 'Ms. Jasmine Kwan', department: 'Dance' }
    ];

    useEffect(() => {
        // Initialize selected clubs for filter from club data
        setSelectedClubsFilter(clubData.slice(0, 4).map(club => club.name));
    }, []);

    // Filter clubs based on status
    const filteredClubs = clubData.filter(club => 
        statusFilter === "all" || club.status === statusFilter
    );

    // Get displayed club data with "show more" feature
    const visibleClubs = showMore ? filteredClubs : filteredClubs.slice(0, displayedClubs);

    // Filter club data for charts
    const filteredMembershipData = membershipGrowthData.map(monthData => {
        const filteredData: { month: string; [key: string]: number | string } = { month: monthData.month };
        Object.keys(monthData).forEach(key => {
            if (key !== 'month' && selectedClubsFilter.includes(key)) {
                filteredData[key] = monthData[key];
            }
        });
        return filteredData;
    });

    const filteredEventsData = eventsData
        .filter(club => selectedClubsFilter.includes(club.name))
        .map(club => {
            const filteredClub: { name: string; workshops?: number; competitions?: number; socialEvents?: number } = { name: club.name };
            eventTypeFilter.forEach(type => {
                filteredClub[type as 'workshops' | 'competitions' | 'socialEvents'] = club[type as 'workshops' | 'competitions' | 'socialEvents'];
            });
            return filteredClub;
        });

    // Toggle show more/less clubs
    const toggleShowMore = () => setShowMore(!showMore);

    return (
        <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
            <AdminNavbar />
            <div className="space-y-6 p-4 md:p-10">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <CardTitle>Club Management</CardTitle>
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Filter className="w-4 h-4 mr-2" /> Status
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuCheckboxItem
                                            checked={statusFilter === "all"}
                                            onCheckedChange={() => setStatusFilter("all")}
                                        >
                                            All Clubs
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={statusFilter === "active"}
                                            onCheckedChange={() => setStatusFilter("active")}
                                        >
                                            Active Only
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={statusFilter === "inactive"}
                                            onCheckedChange={() => setStatusFilter("inactive")}
                                        >
                                            Inactive Only
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button onClick={() => setIsModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" /> New Club
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Club Name</TableHead>
                                        <TableHead className="hidden md:table-cell">Members</TableHead>
                                        <TableHead className="hidden md:table-cell">Events</TableHead>
                                        <TableHead className="hidden md:table-cell">Club Head</TableHead>
                                        <TableHead className="hidden lg:table-cell">Advisor</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visibleClubs.map((club) => (
                                        <TableRow key={club.id}>
                                            <TableCell className="font-medium">{club.name}</TableCell>
                                            <TableCell className="hidden md:table-cell">{club.members}</TableCell>
                                            <TableCell className="hidden md:table-cell">{club.events}</TableCell>
                                            <TableCell className="hidden md:table-cell">{club.clubHead}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{club.advisor}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${club.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {club.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    {filteredClubs.length > displayedClubs && (
                        <CardFooter className="flex justify-center pt-2 pb-4">
                            <Button 
                                variant="ghost" 
                                onClick={toggleShowMore}
                                className="flex items-center gap-1"
                            >
                                {showMore ? (
                                    <>Show Less <ChevronUp className="h-4 w-4" /></>
                                ) : (
                                    <>Show More <ChevronDown className="h-4 w-4" /></>
                                )}
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Analytics</h2>
                    <Button variant="outline" size="sm" onClick={() => setFilterModalOpen(true)}>
                        <Filter className="w-4 h-4 mr-2" /> Chart Filters
                    </Button>
                </div>

                <Tabs defaultValue="members" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex">
                        <TabsTrigger value="members">Membership Growth</TabsTrigger>
                        <TabsTrigger value="events">Club Events</TabsTrigger>
                    </TabsList>
                    <TabsContent value="members" className="mt-6">
                        <ChartContainer
                            title="Club Membership Growth"
                            description="Track membership growth trends over time"
                            filename="membership-trends"
                        >
                            <div className="h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={filteredMembershipData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {Object.keys(membershipGrowthData[0])
                                            .filter(key => key !== 'month' && selectedClubsFilter.includes(key))
                                            .map((club, index) => {
                                                const colors = ['#8884d8', '#82ca9d', '#ff7300', '#0088fe', '#9932CC', '#FF6347'];
                                                return (
                                                    <Line 
                                                        key={club} 
                                                        type="monotone" 
                                                        dataKey={club} 
                                                        stroke={colors[index % colors.length]} 
                                                    />
                                                );
                                            })}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>
                    </TabsContent>
                    <TabsContent value="events" className="mt-6">
                        <ChartContainer
                            title="Club Events Breakdown"
                            description="Types of events organized by each club"
                            filename="club-events"
                        >
                            <div className="h-[300px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={filteredEventsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {eventTypeFilter.includes('workshops') && (
                                            <Bar dataKey="workshops" fill="#8884d8" name="Workshops" />
                                        )}
                                        {eventTypeFilter.includes('competitions') && (
                                            <Bar dataKey="competitions" fill="#82ca9d" name="Competitions" />
                                        )}
                                        {eventTypeFilter.includes('socialEvents') && (
                                            <Bar dataKey="socialEvents" fill="#ffc658" name="Social Events" />
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Filter Modal */}
            <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chart Filters</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div>
                            <h3 className="mb-3 text-sm font-medium">Select Clubs to Display</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                                {clubData.map((club) => (
                                    <div key={club.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`club-${club.id}`} 
                                            checked={selectedClubsFilter.includes(club.name)}
                                            onCheckedChange={(checked) => {
                                                setSelectedClubsFilter(checked 
                                                    ? [...selectedClubsFilter, club.name]
                                                    : selectedClubsFilter.filter(c => c !== club.name)
                                                );
                                            }}
                                        />
                                        <Label htmlFor={`club-${club.id}`} className="cursor-pointer">
                                            {club.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-3 text-sm font-medium">Event Types</h3>
                            <div className="space-y-2">
                                {['workshops', 'competitions', 'socialEvents'].map(type => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`event-${type}`} 
                                            checked={eventTypeFilter.includes(type)}
                                            onCheckedChange={(checked) => {
                                                setEventTypeFilter(checked
                                                    ? [...eventTypeFilter, type]
                                                    : eventTypeFilter.filter(t => t !== type)
                                                );
                                            }}
                                        />
                                        <Label htmlFor={`event-${type}`} className="cursor-pointer">
                                            {type === 'workshops' ? 'Workshops' : 
                                             type === 'competitions' ? 'Competitions' : 'Social Events'}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setFilterModalOpen(false)}>Apply Filters</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New Club Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Create New Club</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="club-name">Club Name</Label>
                            <Input id="club-name" placeholder="e.g. Astronomy Club" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="club-description">Description</Label>
                            <Textarea
                                id="club-description"
                                placeholder="Describe the club's purpose and activities"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="club-status">Status</Label>
                                <Select defaultValue="active">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="club-members">Initial Members</Label>
                                <Input id="club-members" type="number" placeholder="e.g. 20" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="club-head">Club Head</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a club head" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[200px]">
                                        {availableUsers.map(user => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="club-advisor">Faculty Advisor</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a faculty advisor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[200px]">
                                        {facultyMentors.map(mentor => (
                                            <SelectItem key={mentor.id} value={mentor.id.toString()}>
                                                {mentor.name} ({mentor.department})
                                            </SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsModalOpen(false)}>Create Club</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isMobile && <AdminMobileBottomNav />}
        </div>
    );
};

export default ClubManagement;