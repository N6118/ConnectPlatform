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
import { Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Club } from "../types/clubs";

interface ClubControlProps {
    clubData: Club[];
    availableUsers: { id: number; name: string; }[];
    facultyMentors: { id: number; name: string; department: string; }[];
}

export const ClubControl: React.FC<ClubControlProps> = ({ clubData, availableUsers, facultyMentors }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [displayedClubs, setDisplayedClubs] = useState<number>(5);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Filter clubs based on status
    const filteredClubs = clubData.filter(club => 
        statusFilter === "all" || club.status === statusFilter
    );

    // Get displayed club data with "show more" feature
    const visibleClubs = showMore ? filteredClubs : filteredClubs.slice(0, displayedClubs);

    // Toggle show more/less clubs
    const toggleShowMore = () => setShowMore(!showMore);

    return (
        <>
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
        </>
    );
};