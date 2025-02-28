import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

// Simplified Club type without active/inactive status
interface Club {
    id: number;
    name: string;
    description: string;
    members: number;
    events: number;
    advisor: string;
    clubHead: string;
}

interface ClubControlProps {
    clubData: Club[];
    availableUsers: { id: number; name: string; }[];
    facultyMentors: { id: number; name: string; department: string; }[];
}

export const ClubControl: React.FC<ClubControlProps> = ({ clubData, availableUsers, facultyMentors }) => {
    const [newClubModalOpen, setNewClubModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [displayedClubs, setDisplayedClubs] = useState<number>(5);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [currentClub, setCurrentClub] = useState<Club | null>(null);
    
    // Get displayed club data with "show more" feature
    const visibleClubs = showMore ? clubData : clubData.slice(0, displayedClubs);

    // Toggle show more/less clubs
    const toggleShowMore = () => setShowMore(!showMore);
    
    // Handle opening the edit modal with the selected club
    const handleEditClub = (club: Club) => {
        setCurrentClub(club);
        setEditModalOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <CardTitle>Club Management</CardTitle>
                        <Button onClick={() => setNewClubModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> New Club
                        </Button>
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
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleEditClub(club)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" /> Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {clubData.length > displayedClubs && (
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

            {/* New Club Modal */}
            <Dialog open={newClubModalOpen} onOpenChange={setNewClubModalOpen}>
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
                                <Label htmlFor="club-members">Initial Members</Label>
                                <Input id="club-members" type="number" placeholder="e.g. 20" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="club-events">Initial Events</Label>
                                <Input id="club-events" type="number" placeholder="e.g. 0" />
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
                        <Button variant="outline" onClick={() => setNewClubModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => setNewClubModalOpen(false)}>Create Club</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Club Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Edit Club</DialogTitle>
                    </DialogHeader>
                    {currentClub && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-club-name">Club Name</Label>
                                <Input 
                                    id="edit-club-name" 
                                    defaultValue={currentClub.name}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-club-description">Description</Label>
                                <Textarea
                                    id="edit-club-description"
                                    defaultValue={currentClub.description}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-club-members">Members</Label>
                                    <Input 
                                        id="edit-club-members" 
                                        type="number" 
                                        defaultValue={currentClub.members.toString()}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-club-events">Events</Label>
                                    <Input 
                                        id="edit-club-events" 
                                        type="number" 
                                        defaultValue={currentClub.events.toString()}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-club-head">Club Head</Label>
                                <Select defaultValue={availableUsers.find(user => 
                                    user.name === currentClub.clubHead
                                )?.id.toString()}>
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
                                <Label htmlFor="edit-club-advisor">Faculty Advisor</Label>
                                <Select defaultValue={facultyMentors.find(mentor => 
                                    mentor.name === currentClub.advisor
                                )?.id.toString()}>
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
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => setEditModalOpen(false)}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};