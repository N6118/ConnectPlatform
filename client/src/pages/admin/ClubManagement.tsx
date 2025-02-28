import { useState } from 'react';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClubControl } from "../../components/ClubControl";
import { ClubCharts } from "../../components/ClubCharts";
import { Club, ClubEventData, MembershipData } from "../../types/clubs";
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const ClubManagement = () => {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<"members" | "events">("members");
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [selectedClubsFilter, setSelectedClubsFilter] = useState<string[]>([]);
    const [eventTypeFilter, setEventTypeFilter] = useState<string[]>(["workshops", "competitions", "socialEvents"]);

    // Club data
    const clubData: Club[] = [
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
    const membershipGrowthData: MembershipData[] = [
        { month: 'Jan', 'Tech Club': 100, 'Debate Society': 65, 'Robotics Club': 70, 'Environmental Club': 80, 'Music Society': 95, 'Culinary Club': 55 },
        { month: 'Feb', 'Tech Club': 105, 'Debate Society': 68, 'Robotics Club': 75, 'Environmental Club': 85, 'Music Society': 100, 'Culinary Club': 58 },
        { month: 'Mar', 'Tech Club': 110, 'Debate Society': 70, 'Robotics Club': 78, 'Environmental Club': 90, 'Music Society': 104, 'Culinary Club': 60 },
        { month: 'Apr', 'Tech Club': 115, 'Debate Society': 72, 'Robotics Club': 82, 'Environmental Club': 92, 'Music Society': 107, 'Culinary Club': 62 },
        { month: 'May', 'Tech Club': 120, 'Debate Society': 75, 'Robotics Club': 85, 'Environmental Club': 95, 'Music Society': 110, 'Culinary Club': 65 }
    ];

    // Data for events chart
    const eventsData: ClubEventData[] = [
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
                if (type === 'workshops' || type === 'competitions' || type === 'socialEvents') {
                    filteredClub[type] = club[type];
                }
            });
            return filteredClub;
        });

    return (
        <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
            <AdminNavbar />
            <div className="space-y-6 p-4 md:p-10">
                <ClubControl 
                    clubData={clubData} 
                    availableUsers={availableUsers}
                    facultyMentors={facultyMentors}
                />

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Analytics</h2>
                    <Button variant="outline" size="sm" onClick={() => setFilterModalOpen(true)}>
                        <Filter className="w-4 h-4 mr-2" /> Chart Filters
                    </Button>
                </div>

                <ClubCharts 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    filteredMembershipData={filteredMembershipData}
                    filteredEventsData={filteredEventsData}
                    membershipGrowthData={membershipGrowthData}
                    eventTypeFilter={eventTypeFilter}
                    selectedClubsFilter={selectedClubsFilter}
                />
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

            {isMobile && <AdminMobileBottomNav />}
        </div>
    );
};

export default ClubManagement;