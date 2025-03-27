import { useState, useEffect } from 'react';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClubControl } from "../../components/ClubControl";
import { ClubCharts } from "../../components/ClubCharts";
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
import { 
    ClubData, 
    ClubAchievement, 
    CreateAchievementData, 
    CreateClubData, 
    clubService,
    ClubEventData,
    MembershipData 
} from "../../services/club";
import { useToast } from "@/hooks/use-toast";

export const ClubManagement = () => {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<"members" | "events">("members");
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [selectedClubsFilter, setSelectedClubsFilter] = useState<string[]>([]);
    const [eventTypeFilter, setEventTypeFilter] = useState<string[]>(["workshops", "competitions", "socialEvents"]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [selectedClub, setSelectedClub] = useState<ClubData | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddAchievementDialogOpen, setIsAddAchievementDialogOpen] = useState(false);
    const [isEditAchievementDialogOpen, setIsEditAchievementDialogOpen] = useState(false);
    const [isDeleteAchievementDialogOpen, setIsDeleteAchievementDialogOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState<ClubAchievement | null>(null);
    const [newAchievement, setNewAchievement] = useState<CreateAchievementData>({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState<boolean>(true);

    // Club data
    const [clubs, setClubs] = useState<ClubData[]>([]);
    const [newClub, setNewClub] = useState<Partial<CreateClubData>>({
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
        achievements: [],
        advisor: '',
        clubHead: ''
    });

    // Fetch clubs on component mount
    useEffect(() => {
        const fetchClubs = async () => {
            setLoading(true);
            try {
                const response = await clubService.getAllClubs();
                if (response.success && response.data) {
                    setClubs(response.data);
                    // Initialize the clubs filter with the fetched club names
                    setSelectedClubsFilter(response.data.map(club => club.name));
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to fetch clubs",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while fetching clubs",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, [toast]);

    // Data for membership growth chart
    const [membershipGrowthData, setMembershipGrowthData] = useState<MembershipData[]>([]);
    const [eventsData, setEventsData] = useState<ClubEventData[]>([]);
    const [chartDataLoading, setChartDataLoading] = useState<boolean>(true);

    // Fetch chart data
    useEffect(() => {
        const fetchChartData = async () => {
            setChartDataLoading(true);
            try {
                // Fetch membership data
                const membershipResponse = await clubService.getMembershipData();
                if (membershipResponse.success && membershipResponse.data) {
                    setMembershipGrowthData(membershipResponse.data);
                }

                // Fetch events data
                const eventsResponse = await clubService.getClubEventsData();
                if (eventsResponse.success && eventsResponse.data) {
                    setEventsData(eventsResponse.data);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch chart data",
                    variant: "destructive",
                });
            } finally {
                setChartDataLoading(false);
            }
        };

        fetchChartData();
    }, [toast]);

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

    const handleAddSubmit = async () => {
        if (newClub.name && newClub.description && newClub.department) {
            const clubToAdd: CreateClubData = {
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
                achievements: [],
                advisor: newClub.advisor || '',
                clubHead: newClub.clubHead || ''
            };

            try {
                const response = await clubService.createClub(clubToAdd);
                if (response.success && response.data) {
                    setClubs([...clubs, response.data]);
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
                        achievements: [],
                        advisor: '',
                        clubHead: ''
                    });
                    toast({
                        title: "Success",
                        description: "Club created successfully",
                        variant: "default",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to create club",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while creating the club",
                    variant: "destructive",
                });
            }
        } else {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (club: ClubData) => {
        setSelectedClub(club);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (selectedClub) {
            try {
                const response = await clubService.updateClub(selectedClub.id, selectedClub);
                if (response.success && response.data) {
                    setClubs(prevClubs => 
                        prevClubs
                            .map(club => club.id === selectedClub.id ? response.data : club)
                            .filter((club): club is ClubData => club !== undefined)
                    );
                    setIsEditDialogOpen(false);
                    setSelectedClub(null);
                    toast({
                        title: "Success",
                        description: "Club updated successfully",
                        variant: "default",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to update club",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while updating the club",
                    variant: "destructive",
                });
            }
        }
    };

    const handleDelete = (club: ClubData) => {
        setSelectedClub(club);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedClub) {
            try {
                const response = await clubService.deleteClub(selectedClub.id);
                if (response.success) {
                    setClubs(prevClubs => 
                        prevClubs
                            .filter(club => club.id !== selectedClub.id)
                            .filter((club): club is ClubData => club !== undefined)
                    );
                    setIsDeleteDialogOpen(false);
                    setSelectedClub(null);
                    toast({
                        title: "Success",
                        description: "Club deleted successfully",
                        variant: "default",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to delete club",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while deleting the club",
                    variant: "destructive",
                });
            }
        }
    };

    const handleViewDetails = (club: ClubData) => {
        setSelectedClub(club);
        setIsViewDialogOpen(true);
    };

    // Achievement Handlers
    const handleAddAchievement = (clubId: number) => {
        setSelectedClub(clubs.find(club => club.id === clubId) || null);
        setIsAddAchievementDialogOpen(true);
    };

    const handleAddAchievementSubmit = async () => {
        if (selectedClub && newAchievement.title && newAchievement.description && newAchievement.date) {
            try {
                const response = await clubService.addAchievement(selectedClub.id, newAchievement);
                if (response.success && response.data) {
                    const updatedClub: ClubData = {
                        ...selectedClub,
                        achievements: [...selectedClub.achievements, response.data]
                    };
                    setClubs(prevClubs => 
                        prevClubs
                            .map(club => club.id === selectedClub.id ? updatedClub : club)
                            .filter((club): club is ClubData => club !== undefined)
                    );
                    setIsAddAchievementDialogOpen(false);
                    setNewAchievement({
                        title: '',
                        description: '',
                        date: new Date().toISOString().split('T')[0]
                    });
                    toast({
                        title: "Success",
                        description: "Achievement added successfully",
                        variant: "default",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to add achievement",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while adding the achievement",
                    variant: "destructive",
                });
            }
        }
    };

    const handleEditAchievement = (clubId: number, achievement: ClubAchievement) => {
        setSelectedClub(clubs.find(club => club.id === clubId) || null);
        setSelectedAchievement(achievement);
        setIsEditAchievementDialogOpen(true);
    };

    const handleEditAchievementSubmit = async () => {
        if (selectedClub && selectedAchievement) {
            try {
                const response = await clubService.updateAchievement(
                    selectedClub.id,
                    selectedAchievement.id,
                    {
                        title: selectedAchievement.title,
                        description: selectedAchievement.description,
                        date: selectedAchievement.date
                    }
                );
                if (response.success && response.data) {
                    const updatedClub: ClubData = {
                        ...selectedClub,
                        achievements: selectedClub.achievements.map(a =>
                            a.id === selectedAchievement.id ? response.data : a
                        ).filter((a): a is ClubAchievement => a !== undefined)
                    };
                    setClubs(prevClubs => 
                        prevClubs
                            .map(club => club.id === selectedClub.id ? updatedClub : club)
                            .filter((club): club is ClubData => club !== undefined)
                    );
                    setIsEditAchievementDialogOpen(false);
                    setSelectedAchievement(null);
                    toast({
                        title: "Success",
                        description: "Achievement updated successfully",
                        variant: "default",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to update achievement",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while updating the achievement",
                    variant: "destructive",
                });
            }
        }
    };

    const handleDeleteAchievement = (clubId: number, achievement: ClubAchievement) => {
        setSelectedClub(clubs.find(club => club.id === clubId) || null);
        setSelectedAchievement(achievement);
        setIsDeleteAchievementDialogOpen(true);
    };

    const handleDeleteAchievementConfirm = async () => {
        if (selectedClub && selectedAchievement) {
            try {
                const response = await clubService.deleteAchievement(selectedClub.id, selectedAchievement.id);
                if (response.success) {
                    const updatedClub: ClubData = {
                        ...selectedClub,
                        achievements: selectedClub.achievements.filter(a => a.id !== selectedAchievement.id)
                    };
                    setClubs(prevClubs => 
                        prevClubs
                            .map(club => club.id === selectedClub.id ? updatedClub : club)
                            .filter((club): club is ClubData => club !== undefined)
                    );
                    setIsDeleteAchievementDialogOpen(false);
                    setSelectedAchievement(null);
                    toast({
                        title: "Success",
                        description: "Achievement deleted successfully",
                        variant: "default",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to delete achievement",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while deleting the achievement",
                    variant: "destructive",
                });
            }
        }
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

    const ClubCard = ({ club }: { club: ClubData }) => {
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
                                    <span className="font-medium">Head: {typeof club.clubHead === 'object' ? (club.clubHead as any).name || 'Unknown' : club.clubHead}</span>
                                    <span>•</span>
                                    <Badge variant="outline" className="text-xs bg-primary/5">{club.department}</Badge>
                                </span>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs bg-secondary/10">{club.members?.length || 0} Members</Badge>
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
                                        {club.officeBearers?.map((bearer, index) => (
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
                                        {club.members?.map((member, index) => (
                                            <li key={index} className="p-2 bg-gray-50 rounded-lg">
                                                {typeof member === 'object' ? `${member.name} (${member.rollNo})` : member}
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Plan of Action</dt>
                                <dd className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700">
                                        {typeof club.planOfAction === 'object' ? 
                                            club.planOfAction.summary : 
                                            'No summary available'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Budget: ₹{typeof club.planOfAction === 'object' ? 
                                            club.planOfAction.budget : 0}
                                    </p>
                                </dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Events</dt>
                                <dd className="mt-1">
                                    <div className="space-y-3">
                                        {club.events?.map((event, index) => (
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
                                <dd className="mt-1 p-2 bg-gray-50 rounded-lg">
                                    {club.advisor ? (
                                        typeof club.advisor === 'object' ? 
                                            (club.advisor as any)?.name || 'Unknown' : 
                                            club.advisor
                                    ) : 'No advisor assigned'}
                                </dd>
                            </div>
                            <div className="col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Other Details</dt>
                                <dd className="mt-1 p-2 bg-gray-50 rounded-lg">{club.otherDetails}</dd>
                            </div>
                            <div className="col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <dt className="text-sm font-medium text-gray-500">Achievements</dt>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => handleAddAchievement(club.id)}
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Add Achievement
                                    </Button>
                                </div>
                                <dd className="mt-1">
                                    <div className="space-y-3">
                                        {club.achievements?.map((achievement) => (
                                            <div key={achievement.id} className="p-4 bg-gray-50 rounded-lg group/achievement">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Date: {achievement.date}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover/achievement:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditAchievement(club.id, achievement)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDeleteAchievement(club.id, achievement)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(club.achievements === null || club.achievements.length === 0) && (
                                            <div className="text-center py-4 text-gray-500">
                                                No achievements yet. Add one to get started!
                                            </div>
                                        )}
                                    </div>
                                </dd>
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
                                        <h3 className="text-3xl font-bold mt-2">{clubs.length}</h3>
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
                                            {clubs.reduce((acc, club) => acc + (club.members?.length || 0), 0)}
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
                                            {clubs.reduce((acc, club) => acc + (club.events?.length || 0), 0)}
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
                                            ₹{clubs.reduce((acc, club) => acc + (club.planOfAction?.budget || 0), 0).toLocaleString()}
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

                            {loading ? (
                                <div className="py-16 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-muted-foreground">Loading clubs...</p>
                                </div>
                            ) : filteredClubs.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredClubs.map(club => (
                                        <ClubCard key={club.id} club={club} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 flex flex-col items-center justify-center text-center">
                                    <p className="text-muted-foreground mb-2">No clubs found</p>
                                    <p className="text-sm text-gray-500">
                                        {searchQuery ? 'Try adjusting your search term' : 'Add a new club to get started'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Club Charts */}
                <motion.div className="mt-8" variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Club Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {chartDataLoading ? (
                                <div className="py-16 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-muted-foreground">Loading chart data...</p>
                                </div>
                            ) : (
                                <ClubCharts 
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    filteredMembershipData={filteredMembershipData}
                                    filteredEventsData={filteredEventsData}
                                    membershipGrowthData={membershipGrowthData}
                                    eventTypeFilter={eventTypeFilter}
                                    selectedClubsFilter={selectedClubsFilter}
                                />
                            )}
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
                                {clubs.map((club) => (
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
                                    value={typeof selectedClub.clubHead === 'object' ? String((selectedClub.clubHead as any).id) : selectedClub.clubHead}
                                    onValueChange={(value) => setSelectedClub({ ...selectedClub, clubHead: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select club head" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUsers.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-advisor">Faculty Advisor</Label>
                                <Select
                                    value={typeof selectedClub.advisor === 'object' ? String((selectedClub.advisor as any).id) : selectedClub.advisor}
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
                        <p>Are you sure you want to delete {typeof selectedClub?.name === 'object' ? 
                            'this club' : selectedClub?.name}? This action cannot be undone.</p>
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
                                <p className="text-sm text-gray-600">
                                    {typeof selectedClub.clubHead === 'object' ? 
                                        (selectedClub.clubHead as any).name || 'Unknown' : 
                                        selectedClub.clubHead}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Faculty Advisor</h3>
                                <p className="text-sm text-gray-600">
                                    {typeof selectedClub.advisor === 'object' ? 
                                        (selectedClub.advisor as any).name || 'Unknown' : 
                                        selectedClub.advisor}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Members</h3>
                                <ul className="text-sm text-gray-600">
                                    {selectedClub.members?.map((member, index) => (
                                        <li key={index}>
                                            {typeof member === 'object' ? 
                                                `${member.name} (${member.rollNo})` : 
                                                member}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium">Plan of Action</h3>
                                <p className="text-sm text-gray-600">
                                    {typeof selectedClub.planOfAction === 'object' ? 
                                        selectedClub.planOfAction.summary : 
                                        'No summary available'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Budget: ₹{typeof selectedClub.planOfAction === 'object' ? 
                                        selectedClub.planOfAction.budget : 0}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Events</h3>
                                <div className="space-y-2">
                                    {selectedClub.events?.map((event, index) => (
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

            {/* Add Achievement Dialog */}
            <Dialog open={isAddAchievementDialogOpen} onOpenChange={setIsAddAchievementDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Achievement</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-title">Title</Label>
                            <Input
                                id="achievement-title"
                                value={newAchievement.title}
                                onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                                placeholder="Enter achievement title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-description">Description</Label>
                            <Textarea
                                id="achievement-description"
                                value={newAchievement.description}
                                onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                placeholder="Enter achievement description"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="achievement-date">Date</Label>
                            <Input
                                id="achievement-date"
                                type="date"
                                value={newAchievement.date}
                                onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddAchievementDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddAchievementSubmit}>Add Achievement</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Achievement Dialog */}
            <Dialog open={isEditAchievementDialogOpen} onOpenChange={setIsEditAchievementDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Achievement</DialogTitle>
                    </DialogHeader>
                    {selectedAchievement && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-achievement-title">Title</Label>
                                <Input
                                    id="edit-achievement-title"
                                    value={selectedAchievement.title}
                                    onChange={(e) => setSelectedAchievement({ ...selectedAchievement, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-achievement-description">Description</Label>
                                <Textarea
                                    id="edit-achievement-description"
                                    value={selectedAchievement.description}
                                    onChange={(e) => setSelectedAchievement({ ...selectedAchievement, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-achievement-date">Date</Label>
                                <Input
                                    id="edit-achievement-date"
                                    type="date"
                                    value={selectedAchievement.date}
                                    onChange={(e) => setSelectedAchievement({ ...selectedAchievement, date: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditAchievementDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditAchievementSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Achievement Dialog */}
            <Dialog open={isDeleteAchievementDialogOpen} onOpenChange={setIsDeleteAchievementDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Achievement</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete the achievement "{selectedAchievement?.title}"? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteAchievementDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteAchievementConfirm}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isMobile && <AdminMobileBottomNav />}
        </div>
    );
};

export default ClubManagement;