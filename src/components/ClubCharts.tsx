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
import { ChartContainer } from '@/components/ChartContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembershipData, ClubEventData } from "../types/clubs";

interface ClubChartsProps {
    activeTab: "members" | "events";
    setActiveTab: (tab: "members" | "events") => void;
    filteredMembershipData: { month: string; [key: string]: number | string }[];
    filteredEventsData: { name: string; workshops?: number; competitions?: number; socialEvents?: number }[];
    membershipGrowthData: MembershipData[];
    eventTypeFilter: string[];
    selectedClubsFilter: string[];
}

export const ClubCharts: React.FC<ClubChartsProps> = ({
    activeTab,
    setActiveTab,
    filteredMembershipData,
    filteredEventsData,
    membershipGrowthData,
    eventTypeFilter,
    selectedClubsFilter
}) => {
    return (
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={(value) => setActiveTab(value as "members" | "events")}>
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
                                {membershipGrowthData.length > 0 && Object.keys(membershipGrowthData[0])
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
    );
};