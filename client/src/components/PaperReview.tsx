import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Paper {
  id: number;
  title: string;
  author: string;
  department: string;
  status: string;
  reviewers: string[];
  submissionDate: string;
}

const papers: Paper[] = [
  {
    id: 1,
    title: 'Advanced Machine Learning Applications',
    author: 'Dr. Jane Smith',
    department: 'Computer Science',
    status: 'Under Review',
    reviewers: ['Dr. Johnson', 'Dr. Williams'],
    submissionDate: '2024-02-10'
  },
  {
    id: 2,
    title: 'Quantum Computing: A New Approach',
    author: 'Dr. Michael Brown',
    department: 'Physics',
    status: 'Approved',
    reviewers: ['Dr. Anderson', 'Dr. Lee'],
    submissionDate: '2024-02-15'
  },
  {
    id: 3,
    title: 'Sustainable Energy Systems',
    author: 'Dr. Sarah Wilson',
    department: 'Environmental Engineering',
    status: 'Under Review',
    reviewers: ['Dr. Martinez', 'Dr. Taylor'],
    submissionDate: '2024-02-18'
  }
];

export const PaperReview = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Paper Review System</CardTitle>
            <CardDescription>Manage academic paper submissions and reviews</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            New Submission
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reviewers</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {papers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell className="font-medium">{paper.title}</TableCell>
                <TableCell>{paper.author}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    paper.status === 'Under Review' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {paper.status}
                  </span>
                </TableCell>
                <TableCell>{paper.reviewers.join(', ')}</TableCell>
                <TableCell>{paper.submissionDate}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Manage Review
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};