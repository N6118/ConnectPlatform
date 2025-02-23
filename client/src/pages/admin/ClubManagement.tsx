import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChartContainer } from '../../components/ChartContainer';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

export const ClubManagement = () => {
    const isMobile = useIsMobile();
    const clubData = [
        {
            name: 'Tech Club',
            members: 120,
            events: 45,
            budget: 5000,
            advisor: 'Dr. Smith',
            status: 'active',
            engagement: [85, 78, 90, 88, 92]
        },
        // ... more club data
    ];

    return (
          <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
            <AdminNavbar />
        <div className="space-y-6 p-10">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Club Management</CardTitle>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> New Club
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Club Name</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>Events</TableHead>
                                <TableHead>Budget</TableHead>
                                <TableHead>Advisor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clubData.map((club) => (
                                <TableRow key={club.name}>
                                    <TableCell>{club.name}</TableCell>
                                    <TableCell>{club.members}</TableCell>
                                    <TableCell>{club.events}</TableCell>
                                    <TableCell>${club.budget}</TableCell>
                                    <TableCell>{club.advisor}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${club.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
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
                </CardContent>
            </Card>

            <ChartContainer
                title="Club Engagement Metrics"
                description="Track club performance and member participation"
                filename="club-metrics"
            >
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={clubData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <Radar name="Engagement" dataKey="engagement" fill="#8884d8" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </ChartContainer>
        </div>
        {isMobile && <AdminMobileBottomNav />}
    </div>
    );
};

export default ClubManagement;