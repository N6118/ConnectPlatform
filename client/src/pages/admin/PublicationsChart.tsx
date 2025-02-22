import React, { useState } from 'react';
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ResponsiveContainer
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PublicationData {
  year: string;
  papers: number;
  citations: number;
  impactFactor: number;
}

const publicationData: PublicationData[] = [
  { year: '2020', papers: 45, citations: 120, impactFactor: 3.2 },
  { year: '2021', papers: 52, citations: 150, impactFactor: 3.5 },
  { year: '2022', papers: 58, citations: 180, impactFactor: 3.8 },
  { year: '2023', papers: 65, citations: 220, impactFactor: 4.1 },
  { year: '2024', papers: 70, citations: 250, impactFactor: 4.3 },
];

export const PublicationsChart = () => {
  const [yearRange, setYearRange] = useState("5");

  const filteredData = publicationData.slice(-parseInt(yearRange));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Impact Analytics</CardTitle>
        <CardDescription>Track publication metrics and citation impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={yearRange} onValueChange={setYearRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Last 3 years</SelectItem>
              <SelectItem value="5">Last 5 years</SelectItem>
              <SelectItem value="10">Last 10 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="papers" fill="#0088FE" name="Published Papers" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="citations" 
                stroke="#00C49F" 
                name="Citations"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="impactFactor" 
                stroke="#FFBB28" 
                name="Impact Factor"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicationsChart;