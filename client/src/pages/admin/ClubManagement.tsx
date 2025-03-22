import { useState } from 'react';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClubControl } from "../../components/ClubControl";
import { ClubCharts } from "../../components/ClubCharts";
import { Club, ClubEventData, MembershipData } from "../../types/clubs";
import { Filter, Search, PlusCircle, ChevronDown, ChevronUp, Pencil, Eye, Trash2, Calendar, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const ClubManagement = () => {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<"members" | "events">("members");
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [selectedClubsFilter, setSelectedClubsFilter] = useState<string[]>([]);
    const [eventTypeFilter, setEventTypeFilter] = useState<string[]>(["workshops", "competitions", "socialEvents"]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Club data
    const clubData: Club[] = [
        {
            id: 1,
            name: 'Tech Club',
            description: 'A club dedicated to exploring new technologies and fostering innovation',
            officeBearers: [
                {
                    name: 'Alex Johnson',
                    role: 'President',
                    details: 'Senior Computer Science Student'
                },
                {
                    name: 'Sarah Chen',
                    role: 'Vice President',
                    details: 'Junior Software Engineering Student'
                }
            ],
            department: 'Computer Science',
            members: [
                { rollNo: 'CS001', name: 'John Doe' },
                { rollNo: 'CS002', name: 'Jane Smith' },
                { rollNo: 'CS003', name: 'Mike Johnson' }
            ],
            otherDetails: 'Weekly meetings on Thursdays, 5 PM',
            planOfAction: {
                summary: 'Focus on AI/ML workshops and hackathons',
                budget: 5000
            },
            events: [
                {
                    name: 'AI Workshop Series',
                    description: 'Three-part workshop on artificial intelligence basics',
                    date: '2024-03-15',
                    outcomes: 'Increased AI literacy among members',
                    awards: 'Best Workshop Series 2024',
                    remarks: 'High attendance and engagement'
                }
            ],
            advisor: 'Dr. Emily Smith',
            clubHead: 'Alex Johnson'
        },
        {
            id: 2,
            name: 'Debate Society',
            description: 'Fostering critical thinking and public speaking skills through debate',
            officeBearers: [
                {
                    name: 'Sarah Chen',
                    role: 'President',
                    details: 'Senior Political Science Student'
                }
            ],
            department: 'Political Science',
            members: [
                { rollNo: 'PS001', name: 'Robert Wilson' },
                { rollNo: 'PS002', name: 'Emma Davis' }
            ],
            otherDetails: 'Bi-weekly debates on current affairs',
            planOfAction: {
                summary: 'Host inter-college debate championship',
                budget: 3000
            },
            events: [
                {
                    name: 'Spring Debate Championship',
                    description: 'Inter-college debate competition',
                    date: '2024-04-20',
                    outcomes: 'Enhanced public speaking skills',
                    awards: 'First Place in Regional Finals',
                    remarks: 'Record participation from 10 colleges'
                }
            ],
            advisor: 'Prof. James Williams',
            clubHead: 'Sarah Chen'
        },
        {
            id: 3,
            name: 'Robotics Club',
            description: 'Building the future through robotics and automation',
            officeBearers: [
                {
                    name: 'Devon White',
                    role: 'President',
                    details: 'Senior Robotics Engineering Student'
                }
            ],
            department: 'Engineering',
            members: [
                { rollNo: 'EN001', name: 'Alex Kim' },
                { rollNo: 'EN002', name: 'David Chen' }
            ],
            otherDetails: 'Weekly robotics workshops',
            planOfAction: {
                summary: 'Build competition robots and host hackathon',
                budget: 6000
            },
            events: [
                {
                    name: 'Robotics Competition',
                    description: 'Annual robotics challenge',
                    date: '2024-06-20',
                    outcomes: 'Advanced robotics skills',
                    awards: 'First Place Nationals',
                    remarks: 'Record participation'
                }
            ],
            advisor: 'Dr. Daniel Matthews',
            clubHead: 'Devon White'
        },
        {
            id: 4,
            name: 'Environmental Club',
            description: 'Working towards a sustainable future through research and action',
            officeBearers: [
                {
                    name: 'Jordan Smith',
                    role: 'President',
                    details: 'Senior Environmental Science Student'
                }
            ],
            department: 'Environmental Science',
            members: [
                { rollNo: 'ES001', name: 'Lisa Park' },
                { rollNo: 'ES002', name: 'James Wilson' }
            ],
            otherDetails: 'Monthly clean-up drives and research projects',
            planOfAction: {
                summary: 'Campus sustainability initiatives and research projects',
                budget: 3500
            },
            events: [
                {
                    name: 'Earth Day Festival',
                    description: 'Campus-wide sustainability event',
                    date: '2024-04-22',
                    outcomes: 'Increased environmental awareness',
                    awards: 'Green Campus Award',
                    remarks: 'Strong community impact'
                }
            ],
            advisor: 'Prof. Sofia Garcia',
            clubHead: 'Jordan Smith'
        },
        {
            id: 5,
            name: 'Chess Club',
            description: 'Developing strategic thinking through chess',
            officeBearers: [
                {
                    name: 'Priya Agarwal',
                    role: 'President',
                    details: 'Senior Mathematics Student'
                }
            ],
            department: 'Mathematics',
            members: [
                { rollNo: 'MT001', name: 'Kevin Zhang' },
                { rollNo: 'MT002', name: 'Sarah Lee' }
            ],
            otherDetails: 'Weekly chess tournaments and training sessions',
            planOfAction: {
                summary: 'Host chess championship and training sessions',
                budget: 2000
            },
            events: [
                {
                    name: 'Chess Championship',
                    description: 'Annual chess tournament',
                    date: '2024-05-15',
                    outcomes: 'Improved strategic thinking',
                    awards: 'Regional Champions',
                    remarks: 'High skill development'
                }
            ],
            advisor: 'Mr. Wei Li',
            clubHead: 'Priya Agarwal'
        }
    ];

    const [clubs, setClubs] = useState<Club[]>(clubData);
    const [newClub, setNewClub] = useState<Partial<Club>>({
        name: '',
        description: '',
        department: '',
        officeBearers: [],
        members: [],
        otherDetails: '',
        planOfAction: {
            summary: '',
            budget: 0
        },
        events: [],
        advisor: '',
        clubHead: ''
    });

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
        { id: 3, name: 'Devon White' },
        { id: 4, name: 'Jordan Smith' },
        { id: 5, name: 'Priya Agarwal' }
    ];

    // Faculty mentors for dropdown
    const facultyMentors = [
        { id: 1, name: 'Dr. Emily Smith', department: 'Computer Science' },
        { id: 2, name: 'Prof. James Williams', department: 'Political Science' },
        { id: 3, name: 'Dr. Daniel Matthews', department: 'Engineering' },
        { id: 4, name: 'Prof. Sofia Garcia', department: 'Environmental Science' },
        { id: 5, name: 'Mr. Wei Li', department: 'Mathematics' }
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

    const toggleItemExpansion = (itemId: number) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const filteredClubs = clubs.filter(club => 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // CRUD Handlers
    const handleAdd = () => {
        setIsAddDialogOpen(true);
    };

    const handleAddSubmit = () => {
        if (newClub.name && newClub.description && newClub.department) {
            const clubToAdd: Club = {
                id: clubs.length + 1,
                name: newClub.name,
                description: newClub.description,
                department: newClub.department,
                officeBearers: newClub.officeBearers || [],
                members: newClub.members || [],
                otherDetails: newClub.otherDetails || '',
                planOfAction: {
                    summary: newClub.planOfAction?.summary || '',
                    budget: newClub.planOfAction?.budget || 0
                },
                events: newClub.events || [],
                advisor: newClub.advisor || '',
                clubHead: newClub.clubHead || ''
            };
            setClubs([...clubs, clubToAdd]);
            setIsAddDialogOpen(false);
            setNewClub({
                name: '',
                description: '',
                department: '',
                officeBearers: [],
                members: [],
                otherDetails: '',
                planOfAction: {
                    summary: '',
                    budget: 0
                },
                events: [],
                advisor: '',
                clubHead: ''
            });
        }
    };

    const handleEdit = (club: Club) => {
        setSelectedClub(club);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = () => {
        if (selectedClub) {
            setClubs(clubs.map(club => 
                club.id === selectedClub.id ? selectedClub : club
            ));
            setIsEditDialogOpen(false);
            setSelectedClub(null);
        }
    };

    const handleDelete = (club: Club) => {
        setSelectedClub(club);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedClub) {
            setClubs(clubs.filter(club => club.id !== selectedClub.id));
            setIsDeleteDialogOpen(false);
            setSelectedClub(null);
        }
    };

    const handleViewDetails = (club: Club) => {
        setSelectedClub(club);
        setIsViewDialogOpen(true);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const ClubCard = ({ club }: { club: Club }) => {
        const isExpanded = expandedItems.has(club.id);

        return (
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/20 bg-white">
                <CardHeader 
                    className="p-6 bg-gradient-to-r from-gray-50 to-white cursor-pointer hover:from-gray-100/80 hover:to-gray-50/80 transition-colors" 
                    onClick={() => toggleItemExpansion(club.id)}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {club.name}
                            </CardTitle>
                            <div className="text-sm text-gray-600 mt-2 flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-2">
                                    <span className="font-medium">Head: {club.clubHead}</span>
                                    <span>•</span>
                                    <Badge variant="outline" className="text-xs bg-primary/5">{club.department}</Badge>
                                </span>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs bg-secondary/10">{club.members.length} Members</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(club);
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
                                    handleViewDetails(club);
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
                                    handleDelete(club);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            {isExpanded ? 
                                <ChevronUp className="h-5 w-5 text-gray-500 transition-transform" /> : 
                                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
                            }
                        </div>
                    </div>
                </CardHeader>
                
                {isExpanded && (
                    <CardContent className="p-6 bg-white animate-in fade-in-50">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-gray-700">{club.description}</dd>
                            </div>
                            <div className="col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Office Bearers</dt>
                                <dd className="mt-1">
                                    <ul className="list-none space-y-2">
                                        {club.officeBearers.map((bearer, index) => (
                                            <li key={index} className="p-2 bg-gray-50 rounded-lg">
                                                <div className="font-medium">{bearer.name}</div>
                                                <div className="text-sm text-gray-600">{bearer.role}</div>
                                                <div className="text-xs text-gray-500">{bearer.details}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                            <div className="col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Members</dt>
                                <dd className="mt-1">
                                    <ul className="list-none space-y-2">
                                        {club.members.map((member, index) => (
                                            <li key={index} className="p-2 bg-gray-50 rounded-lg">
                                                {member.name} ({member.rollNo})
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Plan of Action</dt>
                                <dd className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700">{club.planOfAction.summary}</p>
                                    <p className="text-sm text-gray-600 mt-2">Budget: ₹{club.planOfAction.budget.toLocaleString()}</p>
                                </dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Events</dt>
                                <dd className="mt-1">
                                    <div className="space-y-3">
                                        {club.events.map((event, index) => (
                                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                                <h4 className="font-medium text-gray-900">{event.name}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-600">Date: {event.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-600">Outcomes: {event.outcomes}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Award className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-600">Awards: {event.awards}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-600">Remarks: {event.remarks}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </dd>
                            </div>
                            <div className="col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Faculty Advisor</dt>
                                <dd className="mt-1 p-2 bg-gray-50 rounded-lg">{club.advisor}</dd>
                            </div>
                            <div className="col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Other Details</dt>
                                <dd className="mt-1 p-2 bg-gray-50 rounded-lg">{club.otherDetails}</dd>
                            </div>
                        </dl>
                    </CardContent>
                )}
            </Card>
        );
    };

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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Club Management
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage and monitor student clubs and their activities</p>
                </motion.div>

                {/* Summary Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Total Clubs
                                        </p>
                                        <h3 className="text-3xl font-bold mt-2">{clubData.length}</h3>
                                        <p className="text-sm opacity-80 mt-1">Active clubs</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Total Members
                                        </p>
                                        <h3 className="text-3xl font-bold mt-2">
                                            {clubData.reduce((acc, club) => acc + club.members.length, 0)}
                                        </h3>
                                        <p className="text-sm opacity-80 mt-1">Across all clubs</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Total Events
                                        </p>
                                        <h3 className="text-3xl font-bold mt-2">
                                            {clubData.reduce((acc, club) => acc + club.events.length, 0)}
                                        </h3>
                                        <p className="text-sm opacity-80 mt-1">Organized this year</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium opacity-80 flex items-center gap-2">
                                            <Award className="h-4 w-4" />
                                            Total Budget
                                        </p>
                                        <h3 className="text-3xl font-bold mt-2">
                                            ₹{clubData.reduce((acc, club) => acc + club.planOfAction.budget, 0).toLocaleString()}
                                        </h3>
                                        <p className="text-sm opacity-80 mt-1">Allocated this year</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Main Content */}
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search clubs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
                                    />
                                </div>
                                <Button 
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                                    onClick={handleAdd}
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Add New Club</span>
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {filteredClubs.map(club => (
                                    <ClubCard key={club.id} club={club} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

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

            {/* Add Club Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Add New Club</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-sm font-medium">Club Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter club name"
                                value={newClub.name}
                                onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter club description"
                                value={newClub.description}
                                onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                                className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                            <Input
                                id="department"
                                placeholder="Enter department name"
                                value={newClub.department}
                                onChange={(e) => setNewClub({ ...newClub, department: e.target.value })}
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="clubHead" className="text-sm font-medium">Club Head</Label>
                            <Input
                                id="clubHead"
                                placeholder="Enter club head name"
                                value={newClub.clubHead}
                                onChange={(e) => setNewClub({ ...newClub, clubHead: e.target.value })}
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="advisor" className="text-sm font-medium">Faculty Advisor</Label>
                            <Input
                                id="advisor"
                                placeholder="Enter faculty advisor name"
                                value={newClub.advisor}
                                onChange={(e) => setNewClub({ ...newClub, advisor: e.target.value })}
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="budget" className="text-sm font-medium">Budget</Label>
                            <Input
                                id="budget"
                                type="number"
                                placeholder="Enter budget amount"
                                value={newClub.planOfAction?.budget || ''}
                                onChange={(e) => {
                                    const currentSummary = newClub.planOfAction?.summary || '';
                                    setNewClub({
                                        ...newClub,
                                        planOfAction: {
                                            summary: currentSummary,
                                            budget: Number(e.target.value)
                                        }
                                    });
                                }}
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="planSummary" className="text-sm font-medium">Plan of Action Summary</Label>
                            <Textarea
                                id="planSummary"
                                placeholder="Enter plan of action summary"
                                value={newClub.planOfAction?.summary || ''}
                                onChange={(e) => setNewClub({
                                    ...newClub,
                                    planOfAction: {
                                        summary: e.target.value,
                                        budget: newClub.planOfAction?.budget || 0
                                    }
                                })}
                                className="min-h-[100px] focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddSubmit} className="bg-primary hover:bg-primary/90">Add Club</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Club Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Club</DialogTitle>
                    </DialogHeader>
                    {selectedClub && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Club Name</Label>
                                <Input
                                    id="edit-name"
                                    value={selectedClub.name}
                                    onChange={(e) => setSelectedClub({ ...selectedClub, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={selectedClub.description}
                                    onChange={(e) => setSelectedClub({ ...selectedClub, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-department">Department</Label>
                                <Input
                                    id="edit-department"
                                    value={selectedClub.department}
                                    onChange={(e) => setSelectedClub({ ...selectedClub, department: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-clubHead">Club Head</Label>
                                <Select
                                    value={selectedClub.clubHead}
                                    onValueChange={(value) => setSelectedClub({ ...selectedClub, clubHead: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select club head" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUsers.map((user) => (
                                            <SelectItem key={user.id} value={user.name}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-advisor">Faculty Advisor</Label>
                                <Select
                                    value={selectedClub.advisor}
                                    onValueChange={(value) => setSelectedClub({ ...selectedClub, advisor: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select faculty advisor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {facultyMentors.map((mentor) => (
                                            <SelectItem key={mentor.id} value={mentor.name}>
                                                {mentor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-budget">Budget</Label>
                                <Input
                                    id="edit-budget"
                                    type="number"
                                    value={selectedClub.planOfAction.budget}
                                    onChange={(e) => setSelectedClub({
                                        ...selectedClub,
                                        planOfAction: { ...selectedClub.planOfAction, budget: Number(e.target.value) }
                                    })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Club</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete {selectedClub?.name}? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Club Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Club Details</DialogTitle>
                    </DialogHeader>
                    {selectedClub && (
                        <div className="grid gap-4 py-4">
                            <div>
                                <h3 className="font-medium">Description</h3>
                                <p className="text-sm text-gray-600">{selectedClub.description}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Department</h3>
                                <p className="text-sm text-gray-600">{selectedClub.department}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Club Head</h3>
                                <p className="text-sm text-gray-600">{selectedClub.clubHead}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Faculty Advisor</h3>
                                <p className="text-sm text-gray-600">{selectedClub.advisor}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Members</h3>
                                <ul className="text-sm text-gray-600">
                                    {selectedClub.members.map((member, index) => (
                                        <li key={index}>{member.name} ({member.rollNo})</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium">Plan of Action</h3>
                                <p className="text-sm text-gray-600">{selectedClub.planOfAction.summary}</p>
                                <p className="text-sm text-gray-600">Budget: ₹{selectedClub.planOfAction.budget}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Events</h3>
                                <div className="space-y-2">
                                    {selectedClub.events.map((event, index) => (
                                        <div key={index} className="p-2 bg-gray-50 rounded">
                                            <p className="font-medium">{event.name}</p>
                                            <p className="text-sm text-gray-600">{event.description}</p>
                                            <p className="text-sm text-gray-500">Date: {event.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isMobile && <AdminMobileBottomNav />}
        </div>
    );
};

export default ClubManagement;