import React, { useState } from 'react';
import {
  ComposedChart, Area, Line, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer } from '@/components/ChartContainer';

const activityData = [
  { month: 'Jan', faculty: 45, students: 320, admins: 12, totalLogins: 2450 },
  { month: 'Feb', faculty: 50, students: 350, admins: 15, totalLogins: 2800 },
  { month: 'Mar', faculty: 48, students: 380, admins: 14, totalLogins: 3100 },
  { month: 'Apr', faculty: 52, students: 400, admins: 16, totalLogins: 3400 },
  { month: 'May', faculty: 55, students: 420, admins: 18, totalLogins: 3800 },
];

export const UserActivityChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState("monthly");

  return (
    <ChartContainer
      title="User Activity Overview"
      description="Track user engagement across different roles"
      filename="user-activity"
    >
      <div className="mb-4">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="students" fill="#0088FE" stroke="#0088FE" />
            <Area yAxisId="left" type="monotone" dataKey="faculty" fill="#00C49F" stroke="#00C49F" />
            <Line yAxisId="right" type="monotone" dataKey="totalLogins" stroke="#ff7300" />
            <Bar yAxisId="left" dataKey="admins" fill="#FFBB28" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};