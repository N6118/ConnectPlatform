import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, ChevronDown, ChevronUp, Pencil, Eye, Trash2 } from "lucide-react";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Users, Award } from "lucide-react";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// First, let's add proper TypeScript interfaces
interface Publication {
  id: number;
  type: string;
  nameOfAuthor: string;
  affiliationOfFirstAuthor: string;
  nameOfOtherAuthors: string;
  affiliationOfOtherAuthors: string;
  scopusWebOfScience: string;
  chapterBookJournalConference: string;
  titleOfPaper: string;
  titleOfJournalConference: string;
  volumeAndIssue: string;
  monthAndYearOfPublication: string;
  publisherOfJournal: string;
  doiOrUrl: string;
  pageNumbersOrArticleId: string;
  impactFactorIfAny: string;
}

interface ResearchProposal {
  id: number;
  nameOfPI: string;
  affiliationOfPI: string;
  nameOfCoPI: string;
  affiliationOfCoPI: string;
  titleOfProposal: string;
  researchAgencySubmittedTo: string;
  titleOfResearchScheme: string;
  periodOfProject: string;
  fundingRequest: string;
  dateOfSubmission: string;
  status: string;
  collaboratingAgency: string;
  abstractOfProject: string;
  reviewerCommitteeMembers: string;
}

interface ApprovedProposal {
  id: number;
  nameOfPI: string;
  affiliationOfPI: string;
  nameOfCoPI: string;
  affiliationOfCoPI: string;
  titleOfProposal: string;
  researchAgencySubmittedTo: string;
  titleOfResearchScheme: string;
  periodOfProject: string;
  fundingRequest: string;
  dateOfSubmission: string;
  status: string;
  collaboratingAgency: string;
  abstractOfProject: string;
  reviewerCommitteeMembers: string;
  fundingAmount: string;
  dateOfApproval: string;
}

// Add new interfaces for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

interface YearlyData {
  year: number;
  publications: number;
  proposalsSubmitted: number;
  proposalsApproved: number;
}

// Update the sample data to only use the new structure
const samplePublications: Publication[] = [
  {
    id: 1,
    type: "International Conference",
    nameOfAuthor: "DR G SIVAKUMAR",
    affiliationOfFirstAuthor: "Department of CSE, Amrita Vishwa Vidyapeetham, Coimbatore, India",
    nameOfOtherAuthors: "Ashok G, Buthvin N",
    affiliationOfOtherAuthors: "Department of Computer Science and Engineering, Amrita School of Computing, Coimbatore, Amrita Vishwa Vidyapeetham, Coimbatore, India",
    scopusWebOfScience: "SCOPUS",
    chapterBookJournalConference: "International Conference",
    titleOfPaper: "Optimizing Sentiment Analysis on Twitter: Leveraging hybrid Deep Learning Models for Improved Efficiency",
    titleOfJournalConference: "Lecture Notes in Computer Science including subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics",
    volumeAndIssue: "Volume 14551",
    monthAndYearOfPublication: "January 2024",
    publisherOfJournal: "Springer Science and Business Media Deutschland GmbH",
    doiOrUrl: "10.1007/978-3-031-58583-8_12",
    pageNumbersOrArticleId: "Pages 178 - 192",
    impactFactorIfAny: "2.5"
  }
];

// Update the sample proposals data
const sampleProposals: ResearchProposal[] = [
  {
    id: 1,
    nameOfPI: "Dr. G Sivakumar",
    affiliationOfPI: "Department of CSE, Amrita Vishwa Vidyapeetham",
    nameOfCoPI: "Dr. John Doe",
    affiliationOfCoPI: "Department of CSE, Amrita School of Computing",
    titleOfProposal: "AI-Driven Healthcare Solutions",
    researchAgencySubmittedTo: "Department of Science and Technology (DST)",
    titleOfResearchScheme: "Technology Innovation Hub",
    periodOfProject: "2 Years",
    fundingRequest: "₹45,00,000",
    dateOfSubmission: "2024-01-15",
    status: "Under Review",
    collaboratingAgency: "Healthcare Innovation Labs",
    abstractOfProject: "This project aims to develop AI-powered solutions for early disease detection and personalized treatment recommendations.",
    reviewerCommitteeMembers: "Prof. Smith, Dr. Johnson, Dr. Williams"
  }
];

const sampleApprovedProposals: ApprovedProposal[] = [
  {
    id: 1,
    nameOfPI: "Dr. G Sivakumar",
    affiliationOfPI: "Department of CSE, Amrita Vishwa Vidyapeetham",
    nameOfCoPI: "Dr. Jane Smith",
    affiliationOfCoPI: "Department of CSE, Amrita School of Computing",
    titleOfProposal: "AI-Driven Smart City Solutions",
    researchAgencySubmittedTo: "Department of Science and Technology (DST)",
    titleOfResearchScheme: "Smart Cities Mission",
    periodOfProject: "3 Years",
    fundingRequest: "₹75,00,000",
    dateOfSubmission: "2023-12-01",
    status: "Approved",
    collaboratingAgency: "Smart City Innovation Hub",
    abstractOfProject: "Development of AI-powered solutions for urban infrastructure management and smart city services.",
    reviewerCommitteeMembers: "Prof. Johnson, Dr. Williams, Dr. Brown",
    fundingAmount: "₹65,00,000",
    dateOfApproval: "2024-02-15"
  }
];

// Add sample yearly data
const sampleYearlyData: YearlyData[] = [
  { year: 2020, publications: 5, proposalsSubmitted: 3, proposalsApproved: 2 },
  { year: 2021, publications: 8, proposalsSubmitted: 5, proposalsApproved: 3 },
  { year: 2022, publications: 12, proposalsSubmitted: 7, proposalsApproved: 4 },
  { year: 2023, publications: 15, proposalsSubmitted: 10, proposalsApproved: 6 },
  { year: 2024, publications: 3, proposalsSubmitted: 2, proposalsApproved: 1 },
];

interface ItemCardProps {
  item: Publication | ResearchProposal | ApprovedProposal;
  tabKey: 'research-publications' | 'proposals-submitted' | 'proposals-approved';
  isExpanded: boolean;
  onToggle: (tabKey: string, itemId: number) => void;
  onEdit: (item: Publication | ResearchProposal | ApprovedProposal) => void;
  onViewDetails: (item: Publication | ResearchProposal | ApprovedProposal) => void;
}

// Add type guards
const isPublication = (item: Publication | ResearchProposal | ApprovedProposal): item is Publication => {
  return 'titleOfPaper' in item && 'nameOfAuthor' in item;
};

const isResearchProposal = (item: Publication | ResearchProposal | ApprovedProposal): item is ResearchProposal => {
  return 'titleOfProposal' in item && !('dateOfApproval' in item);
};

const isApprovedProposal = (item: Publication | ResearchProposal | ApprovedProposal): item is ApprovedProposal => {
  return 'fundingAmount' in item && 'dateOfApproval' in item;
};

export const PublicationsTab = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("research-publications");
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, Set<number>>>({
    'research-publications': new Set(),
    'proposals-submitted': new Set(),
    'proposals-approved': new Set()
  });
  const [selectedItem, setSelectedItem] = useState<Publication | ResearchProposal | ApprovedProposal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    publication?: Partial<Publication>;
    researchProposal?: Partial<ResearchProposal>;
    approvedProposal?: Partial<ApprovedProposal>;
  }>({});
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery('');
  };

  const toggleItemExpansion = (tabKey: string, itemId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev[tabKey]);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return {...prev, [tabKey]: newSet};
    });
  };

  const isItemExpanded = (tabKey: string, itemId: number) => {
    return expandedItems[tabKey].has(itemId);
  };

  // Update the filter function to use the correct property names
  const filteredPublications = samplePublications.filter(item => 
    item.titleOfPaper.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nameOfAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.titleOfJournalConference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter proposals based on search query
  const filteredProposals = sampleProposals.filter(item => 
    item.titleOfProposal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nameOfPI.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.researchAgencySubmittedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter approved proposals based on search query
  const filteredApprovedProposals = sampleApprovedProposals.filter(item => 
    item.titleOfProposal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nameOfPI.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.researchAgencySubmittedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique years from data
  const years = Array.from(new Set(sampleYearlyData.map(item => item.year))).sort((a, b) => b - a);

  // Prepare pie chart data
  const pieChartData: ChartData = {
    labels: ['Research Publications', 'Proposals Submitted', 'Proposals Approved'],
    datasets: [
      {
        label: 'Distribution',
        data: [
          samplePublications.length,
          sampleProposals.length,
          sampleApprovedProposals.length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(168, 85, 247, 0.8)', // purple
          'rgba(34, 197, 94, 0.8)',  // green
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare bar chart data
  const barChartData: ChartData = {
    labels: ['Publications', 'Proposals Submitted', 'Proposals Approved'],
    datasets: [
      {
        label: `Data for ${selectedYear}`,
        data: [
          sampleYearlyData.find(item => item.year === selectedYear)?.publications || 0,
          sampleYearlyData.find(item => item.year === selectedYear)?.proposalsSubmitted || 0,
          sampleYearlyData.find(item => item.year === selectedYear)?.proposalsApproved || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleEdit = (item: Publication | ResearchProposal | ApprovedProposal) => {
    setSelectedItem(item);
    if (isPublication(item)) {
      setEditFormData({ publication: item });
    } else if (isResearchProposal(item)) {
      setEditFormData({ researchProposal: item });
    } else if (isApprovedProposal(item)) {
      setEditFormData({ approvedProposal: item });
    }
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (item: Publication | ResearchProposal | ApprovedProposal) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev) => {
      if (activeTab === 'research-publications' && prev.publication) {
        return {
          publication: {
            ...prev.publication,
            [field]: value
          }
        };
      } else if (activeTab === 'proposals-submitted' && prev.researchProposal) {
        return {
          researchProposal: {
            ...prev.researchProposal,
            [field]: value
          }
        };
      } else if (activeTab === 'proposals-approved' && prev.approvedProposal) {
        return {
          approvedProposal: {
            ...prev.approvedProposal,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const handleSaveEdit = () => {
    // TODO: Implement API call to save changes
    console.log('Saving changes:', editFormData);
    setIsEditDialogOpen(false);
  };

  const handleAdd = () => {
    // Initialize empty form data based on active tab
    if (activeTab === 'research-publications') {
      setEditFormData({
        publication: {
          type: '',
          nameOfAuthor: '',
          affiliationOfFirstAuthor: '',
          nameOfOtherAuthors: '',
          affiliationOfOtherAuthors: '',
          scopusWebOfScience: '',
          chapterBookJournalConference: '',
          titleOfPaper: '',
          titleOfJournalConference: '',
          volumeAndIssue: '',
          monthAndYearOfPublication: '',
          publisherOfJournal: '',
          doiOrUrl: '',
          pageNumbersOrArticleId: '',
          impactFactorIfAny: ''
        }
      });
    } else if (activeTab === 'proposals-submitted') {
      setEditFormData({
        researchProposal: {
          nameOfPI: '',
          affiliationOfPI: '',
          nameOfCoPI: '',
          affiliationOfCoPI: '',
          titleOfProposal: '',
          researchAgencySubmittedTo: '',
          titleOfResearchScheme: '',
          periodOfProject: '',
          fundingRequest: '',
          dateOfSubmission: '',
          status: '',
          collaboratingAgency: '',
          abstractOfProject: '',
          reviewerCommitteeMembers: ''
        }
      });
    } else if (activeTab === 'proposals-approved') {
      setEditFormData({
        approvedProposal: {
          nameOfPI: '',
          affiliationOfPI: '',
          nameOfCoPI: '',
          affiliationOfCoPI: '',
          titleOfProposal: '',
          researchAgencySubmittedTo: '',
          titleOfResearchScheme: '',
          periodOfProject: '',
          fundingRequest: '',
          dateOfSubmission: '',
          status: '',
          collaboratingAgency: '',
          abstractOfProject: '',
          reviewerCommitteeMembers: '',
          fundingAmount: '',
          dateOfApproval: ''
        }
      });
    }
    setIsAddDialogOpen(true);
  };

  const handleDelete = (item: Publication | ResearchProposal | ApprovedProposal) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedItem) return;
    
    // TODO: Implement API call to delete item
    console.log('Deleting item:', selectedItem);
    
    // For demo purposes, we'll just close the dialog
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSaveAdd = () => {
    // Validate required fields based on active tab
    let isValid = true;
    let errorMessage = '';

    if (activeTab === 'research-publications') {
      const pub = editFormData.publication;
      if (!pub?.titleOfPaper || !pub?.nameOfAuthor || !pub?.type) {
        isValid = false;
        errorMessage = 'Please fill in all required fields (Title, Author, and Type)';
      }
    } else if (activeTab === 'proposals-submitted') {
      const prop = editFormData.researchProposal;
      if (!prop?.titleOfProposal || !prop?.nameOfPI || !prop?.status) {
        isValid = false;
        errorMessage = 'Please fill in all required fields (Title, PI, and Status)';
      }
    } else if (activeTab === 'proposals-approved') {
      const prop = editFormData.approvedProposal;
      if (!prop?.titleOfProposal || !prop?.nameOfPI || !prop?.status || !prop?.fundingAmount) {
        isValid = false;
        errorMessage = 'Please fill in all required fields (Title, PI, Status, and Funding Amount)';
      }
    }

    if (!isValid) {
      // TODO: Show error message to user
      console.error(errorMessage);
      return;
    }

    // TODO: Implement API call to save new item
    console.log('Saving new item:', editFormData);
    setIsAddDialogOpen(false);
    setEditFormData({});
  };

  // Reusable search and add button component with enhanced styling
  const SearchAndAddBar = ({ placeholder, buttonText, onAdd }: { 
    placeholder: string, 
    buttonText: string,
    onAdd: () => void 
  }) => (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
        />
      </div>
      <Button 
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        onClick={onAdd}
      >
        <PlusCircle className="h-4 w-4" />
        <span>{buttonText}</span>
      </Button>
    </div>
  );

  // Update the ItemCard component to use type guards
  const ItemCard = ({ item, tabKey, isExpanded, onToggle, onEdit, onViewDetails, onDelete }: ItemCardProps & { onDelete: (item: Publication | ResearchProposal | ApprovedProposal) => void }) => {
    const isPublicationItem = tabKey === 'research-publications' && isPublication(item);
    const isProposalItem = tabKey === 'proposals-submitted' && isResearchProposal(item);
    const isApprovedProposalItem = tabKey === 'proposals-approved' && isApprovedProposal(item);

    const renderHeader = () => {
      if (isPublicationItem) {
        return (
          <>
            <div className="flex-1">
              <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">{item.titleOfPaper}</CardTitle>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{item.nameOfAuthor}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">{item.type}</Badge>
                </span>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">{item.scopusWebOfScience}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(item);
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
                  onDelete(item);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {isExpanded ? 
                <ChevronUp className="h-5 w-5 text-gray-500 transition-transform" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
              }
            </div>
          </>
        );
      }
      
      if (isProposalItem) {
        return (
          <>
            <div className="flex-1">
              <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">{item.titleOfProposal}</CardTitle>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="font-medium">PI: {item.nameOfPI}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">{item.researchAgencySubmittedTo}</Badge>
                </span>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">{item.status}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(item);
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
                  onDelete(item);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {isExpanded ? 
                <ChevronUp className="h-5 w-5 text-gray-500 transition-transform" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
              }
            </div>
          </>
        );
      }

      if (isApprovedProposalItem) {
        return (
          <>
            <div className="flex-1">
              <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">{item.titleOfProposal}</CardTitle>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="font-medium">PI: {item.nameOfPI}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">{item.researchAgencySubmittedTo}</Badge>
                </span>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                <span>•</span>
                <span className="text-xs">{item.fundingAmount}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(item);
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
                  onDelete(item);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {isExpanded ? 
                <ChevronUp className="h-5 w-5 text-gray-500 transition-transform" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform" />
              }
            </div>
          </>
        );
      }

      return null;
    };

    const renderContent = () => {
      if (isPublicationItem) {
        return (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1">{item.type}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Name of Author</dt>
              <dd className="mt-1">{item.nameOfAuthor}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Affiliation of First Author</dt>
              <dd className="mt-1">{item.affiliationOfFirstAuthor}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Name of Other Authors</dt>
              <dd className="mt-1">{item.nameOfOtherAuthors}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Affiliation of Other Authors</dt>
              <dd className="mt-1">{item.affiliationOfOtherAuthors}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Scopus/Web of Science</dt>
              <dd className="mt-1">{item.scopusWebOfScience}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Title of Paper</dt>
              <dd className="mt-1">{item.titleOfPaper}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Title of Journal/Conference</dt>
              <dd className="mt-1">{item.titleOfJournalConference}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Volume and Issue</dt>
              <dd className="mt-1">{item.volumeAndIssue}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Month and Year of Publication</dt>
              <dd className="mt-1">{item.monthAndYearOfPublication}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Publisher of Journal</dt>
              <dd className="mt-1">{item.publisherOfJournal}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">DOI/URL</dt>
              <dd className="mt-1">{item.doiOrUrl}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Page Numbers or Article ID</dt>
              <dd className="mt-1">{item.pageNumbersOrArticleId}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Impact Factor (if any)</dt>
              <dd className="mt-1">{item.impactFactorIfAny}</dd>
            </div>
          </dl>
        );
      }

      if (isProposalItem) {
        return (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Title of Proposal</dt>
              <dd className="mt-1">{item.titleOfProposal}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Principal Investigator</dt>
              <dd className="mt-1">{item.nameOfPI}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">PI Affiliation</dt>
              <dd className="mt-1">{item.affiliationOfPI}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Co-Investigator(s)</dt>
              <dd className="mt-1">{item.nameOfCoPI}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Co-PI Affiliation</dt>
              <dd className="mt-1">{item.affiliationOfCoPI}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Research Agency</dt>
              <dd className="mt-1">{item.researchAgencySubmittedTo}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Research Scheme</dt>
              <dd className="mt-1">{item.titleOfResearchScheme}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Project Period</dt>
              <dd className="mt-1">{item.periodOfProject}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Funding Request</dt>
              <dd className="mt-1">{item.fundingRequest}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
              <dd className="mt-1">{new Date(item.dateOfSubmission).toLocaleDateString()}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <Badge variant={item.status === 'Under Review' ? 'secondary' : 'outline'}>
                  {item.status}
                </Badge>
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Collaborating Agency/Awards</dt>
              <dd className="mt-1">{item.collaboratingAgency}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Abstract</dt>
              <dd className="mt-1">{item.abstractOfProject}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Reviewer Committee Members</dt>
              <dd className="mt-1">{item.reviewerCommitteeMembers}</dd>
            </div>
            <div className="col-span-2 flex justify-end mt-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(item);
                }}
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </div>
          </dl>
        );
      }

      if (isApprovedProposalItem) {
        return (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Title of Proposal</dt>
              <dd className="mt-1">{item.titleOfProposal}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Principal Investigator</dt>
              <dd className="mt-1">{item.nameOfPI}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">PI Affiliation</dt>
              <dd className="mt-1">{item.affiliationOfPI}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Co-Investigator(s)</dt>
              <dd className="mt-1">{item.nameOfCoPI}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Co-PI Affiliation</dt>
              <dd className="mt-1">{item.affiliationOfCoPI}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Research Agency</dt>
              <dd className="mt-1">{item.researchAgencySubmittedTo}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Research Scheme</dt>
              <dd className="mt-1">{item.titleOfResearchScheme}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Project Period</dt>
              <dd className="mt-1">{item.periodOfProject}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Funding Amount</dt>
              <dd className="mt-1">{item.fundingAmount}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
              <dd className="mt-1">{new Date(item.dateOfSubmission).toLocaleDateString()}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Approval Date</dt>
              <dd className="mt-1">{new Date(item.dateOfApproval).toLocaleDateString()}</dd>
            </div>
            <div className="col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <Badge variant="secondary">
                  {item.status}
                </Badge>
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Collaborating Agency/Awards</dt>
              <dd className="mt-1">{item.collaboratingAgency}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Abstract</dt>
              <dd className="mt-1">{item.abstractOfProject}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Reviewer Committee Members</dt>
              <dd className="mt-1">{item.reviewerCommitteeMembers}</dd>
            </div>
            <div className="col-span-2 flex justify-end mt-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(item);
                }}
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </div>
          </dl>
        );
      }
    };

    return (
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-200 border border-transparent hover:border-primary/20">
        <CardHeader 
          className="p-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/80 transition-colors" 
          onClick={() => onToggle(tabKey, item.id)}
        >
          <div className="flex justify-between items-start gap-4">
            {renderHeader()}
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="p-4 bg-white animate-in fade-in-50">
            {renderContent()}
          </CardContent>
        )}
      </Card>
    );
  };

  const getEditFormFields = () => {
    if (activeTab === 'research-publications') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Type</Label>
            <Select
              value={editFormData.publication?.type || ''}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="International Conference">International Conference</SelectItem>
                <SelectItem value="Journal">Journal</SelectItem>
                <SelectItem value="Book Chapter">Book Chapter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Name of Author</Label>
            <Input
              value={editFormData.publication?.nameOfAuthor || ''}
              onChange={(e) => handleInputChange('nameOfAuthor', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Affiliation of First Author</Label>
            <Input
              value={editFormData.publication?.affiliationOfFirstAuthor || ''}
              onChange={(e) => handleInputChange('affiliationOfFirstAuthor', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Name of Other Authors</Label>
            <Input
              value={editFormData.publication?.nameOfOtherAuthors || ''}
              onChange={(e) => handleInputChange('nameOfOtherAuthors', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Affiliation of Other Authors</Label>
            <Input
              value={editFormData.publication?.affiliationOfOtherAuthors || ''}
              onChange={(e) => handleInputChange('affiliationOfOtherAuthors', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Scopus/Web of Science</Label>
            <Select
              value={editFormData.publication?.scopusWebOfScience || ''}
              onValueChange={(value) => handleInputChange('scopusWebOfScience', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select indexing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCOPUS">SCOPUS</SelectItem>
                <SelectItem value="Web of Science">Web of Science</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Chapter/Book/Journal/Conference</Label>
            <Select
              value={editFormData.publication?.chapterBookJournalConference || ''}
              onValueChange={(value) => handleInputChange('chapterBookJournalConference', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chapter">Chapter</SelectItem>
                <SelectItem value="Book">Book</SelectItem>
                <SelectItem value="Journal">Journal</SelectItem>
                <SelectItem value="International Conference">International Conference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Title of Paper</Label>
            <Input
              value={editFormData.publication?.titleOfPaper || ''}
              onChange={(e) => handleInputChange('titleOfPaper', e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Title of Journal/Conference</Label>
            <Input
              value={editFormData.publication?.titleOfJournalConference || ''}
              onChange={(e) => handleInputChange('titleOfJournalConference', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Volume and Issue</Label>
            <Input
              value={editFormData.publication?.volumeAndIssue || ''}
              onChange={(e) => handleInputChange('volumeAndIssue', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Month and Year of Publication</Label>
            <Input
              value={editFormData.publication?.monthAndYearOfPublication || ''}
              onChange={(e) => handleInputChange('monthAndYearOfPublication', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Publisher of Journal</Label>
            <Input
              value={editFormData.publication?.publisherOfJournal || ''}
              onChange={(e) => handleInputChange('publisherOfJournal', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>DOI/URL</Label>
            <Input
              value={editFormData.publication?.doiOrUrl || ''}
              onChange={(e) => handleInputChange('doiOrUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Page Numbers or Article ID</Label>
            <Input
              value={editFormData.publication?.pageNumbersOrArticleId || ''}
              onChange={(e) => handleInputChange('pageNumbersOrArticleId', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Impact Factor (if any)</Label>
            <Input
              value={editFormData.publication?.impactFactorIfAny || ''}
              onChange={(e) => handleInputChange('impactFactorIfAny', e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'proposals-submitted') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Title of Proposal</Label>
            <Input
              value={editFormData.researchProposal?.titleOfProposal || ''}
              onChange={(e) => handleInputChange('titleOfProposal', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Name of Principal Investigator</Label>
            <Input
              value={editFormData.researchProposal?.nameOfPI || ''}
              onChange={(e) => handleInputChange('nameOfPI', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Affiliation of PI</Label>
            <Input
              value={editFormData.researchProposal?.affiliationOfPI || ''}
              onChange={(e) => handleInputChange('affiliationOfPI', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Name of Co-Investigator(s)</Label>
            <Input
              value={editFormData.researchProposal?.nameOfCoPI || ''}
              onChange={(e) => handleInputChange('nameOfCoPI', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Affiliation of Co-PI</Label>
            <Input
              value={editFormData.researchProposal?.affiliationOfCoPI || ''}
              onChange={(e) => handleInputChange('affiliationOfCoPI', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Research Agency/Industry Submitted to</Label>
            <Input
              value={editFormData.researchProposal?.researchAgencySubmittedTo || ''}
              onChange={(e) => handleInputChange('researchAgencySubmittedTo', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Title of Research Scheme</Label>
            <Input
              value={editFormData.researchProposal?.titleOfResearchScheme || ''}
              onChange={(e) => handleInputChange('titleOfResearchScheme', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Period of Project</Label>
            <Input
              value={editFormData.researchProposal?.periodOfProject || ''}
              onChange={(e) => handleInputChange('periodOfProject', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Funding Request</Label>
            <Input
              value={editFormData.researchProposal?.fundingRequest || ''}
              onChange={(e) => handleInputChange('fundingRequest', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date of Submission</Label>
            <Input
              type="date"
              value={editFormData.researchProposal?.dateOfSubmission || ''}
              onChange={(e) => handleInputChange('dateOfSubmission', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={editFormData.researchProposal?.status || ''}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Collaborating Agency/Awards</Label>
            <Input
              value={editFormData.researchProposal?.collaboratingAgency || ''}
              onChange={(e) => handleInputChange('collaboratingAgency', e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Abstract of Project</Label>
            <Input
              value={editFormData.researchProposal?.abstractOfProject || ''}
              onChange={(e) => handleInputChange('abstractOfProject', e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Reviewer Committee Members</Label>
            <Input
              value={editFormData.researchProposal?.reviewerCommitteeMembers || ''}
              onChange={(e) => handleInputChange('reviewerCommitteeMembers', e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'proposals-approved') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Title of Proposal</Label>
            <Input
              value={editFormData.approvedProposal?.titleOfProposal || ''}
              onChange={(e) => handleInputChange('titleOfProposal', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Name of Principal Investigator</Label>
            <Input
              value={editFormData.approvedProposal?.nameOfPI || ''}
              onChange={(e) => handleInputChange('nameOfPI', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Affiliation of PI</Label>
            <Input
              value={editFormData.approvedProposal?.affiliationOfPI || ''}
              onChange={(e) => handleInputChange('affiliationOfPI', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Name of Co-Investigator(s)</Label>
            <Input
              value={editFormData.approvedProposal?.nameOfCoPI || ''}
              onChange={(e) => handleInputChange('nameOfCoPI', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Affiliation of Co-PI</Label>
            <Input
              value={editFormData.approvedProposal?.affiliationOfCoPI || ''}
              onChange={(e) => handleInputChange('affiliationOfCoPI', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Research Agency/Industry</Label>
            <Input
              value={editFormData.approvedProposal?.researchAgencySubmittedTo || ''}
              onChange={(e) => handleInputChange('researchAgencySubmittedTo', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Title of Research Scheme</Label>
            <Input
              value={editFormData.approvedProposal?.titleOfResearchScheme || ''}
              onChange={(e) => handleInputChange('titleOfResearchScheme', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Period of Project</Label>
            <Input
              value={editFormData.approvedProposal?.periodOfProject || ''}
              onChange={(e) => handleInputChange('periodOfProject', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Funding Amount</Label>
            <Input
              value={editFormData.approvedProposal?.fundingAmount || ''}
              onChange={(e) => handleInputChange('fundingAmount', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date of Submission</Label>
            <Input
              type="date"
              value={editFormData.approvedProposal?.dateOfSubmission || ''}
              onChange={(e) => handleInputChange('dateOfSubmission', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date of Approval</Label>
            <Input
              type="date"
              value={editFormData.approvedProposal?.dateOfApproval || ''}
              onChange={(e) => handleInputChange('dateOfApproval', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={editFormData.approvedProposal?.status || ''}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Collaborating Agency/Awards</Label>
            <Input
              value={editFormData.approvedProposal?.collaboratingAgency || ''}
              onChange={(e) => handleInputChange('collaboratingAgency', e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Abstract of Project</Label>
            <Input
              value={editFormData.approvedProposal?.abstractOfProject || ''}
              onChange={(e) => handleInputChange('abstractOfProject', e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Reviewer Committee Members</Label>
            <Input
              value={editFormData.approvedProposal?.reviewerCommitteeMembers || ''}
              onChange={(e) => handleInputChange('reviewerCommitteeMembers', e.target.value)}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const getDialogTitle = (item: Publication | ResearchProposal | ApprovedProposal | null) => {
    if (!item) return '';
    if (isPublication(item)) return item.titleOfPaper;
    if (isResearchProposal(item) || isApprovedProposal(item)) return item.titleOfProposal;
    return '';
  };

  // Add animation variants
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
            Paper Management
          </h1>
          <p className="text-muted-foreground mt-2">Track and manage research papers and proposals</p>
        </motion.div>

        {/* Summary Section */}
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
                      Total Publications
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{samplePublications.length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +2</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
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
                      <TrendingUp className="h-4 w-4" />
                      Proposals Submitted
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{sampleProposals.length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +1</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
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
                      <Award className="h-4 w-4" />
                      Proposals Approved
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{sampleApprovedProposals.length}</h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +1</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
                      <Users className="h-4 w-4" />
                      Total Funding
                    </p>
                    <h3 className="text-3xl font-bold mt-2">
                      ₹{sampleApprovedProposals.reduce((acc, curr) => {
                        const amount = parseInt(curr.fundingAmount.replace(/[^0-9]/g, ''));
                        return acc + amount;
                      }, 0).toLocaleString()}
                    </h3>
                    <p className="text-sm opacity-80 mt-1">Last 30 days: +₹65,00,000</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Pie Chart */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">Distribution Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Label className="font-medium">Filter until:</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="max-w-[200px]"
                  />
                </div>
                <div className="h-[300px] flex items-center justify-center">
                  <Pie 
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          padding: 12,
                          titleFont: {
                            size: 14
                          },
                          bodyFont: {
                            size: 13
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">Yearly Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Label className="font-medium">Select Year:</Label>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[300px] flex items-center justify-center">
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                            font: {
                              size: 12
                            }
                          },
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            font: {
                              size: 12
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          padding: 12,
                          titleFont: {
                            size: 14
                          },
                          bodyFont: {
                            size: 13
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div variants={itemVariants}>
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="mb-6 flex flex-wrap gap-2 bg-white p-1 shadow-sm">
              <TabsTrigger 
                value="research-publications" 
                className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
              >
                Research Publications
              </TabsTrigger>
              <TabsTrigger 
                value="proposals-submitted" 
                className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
              >
                Research Proposals Submitted
              </TabsTrigger>
              <TabsTrigger 
                value="proposals-approved" 
                className="flex-1 min-w-[100px] md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
              >
                Research Proposals Approved/Awarded
              </TabsTrigger>
            </TabsList>

            {/* Research Publications Tab */}
            <TabsContent value="research-publications" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <SearchAndAddBar 
                    placeholder="Search publications..." 
                    buttonText="Add Publication"
                    onAdd={handleAdd}
                  />

                  {filteredPublications.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      No publications data available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPublications.map(item => (
                        <ItemCard 
                          key={item.id} 
                          item={item} 
                          tabKey="research-publications" 
                          isExpanded={isItemExpanded('research-publications', item.id)} 
                          onToggle={toggleItemExpansion} 
                          onEdit={handleEdit} 
                          onViewDetails={handleViewDetails}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Research Proposals Submitted Tab */}
            <TabsContent value="proposals-submitted" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <SearchAndAddBar 
                    placeholder="Search proposals..." 
                    buttonText="Add Proposal"
                    onAdd={handleAdd}
                  />

                  {filteredProposals.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      No proposal submission data available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProposals.map(item => (
                        <ItemCard 
                          key={item.id} 
                          item={item} 
                          tabKey="proposals-submitted" 
                          isExpanded={isItemExpanded('proposals-submitted', item.id)} 
                          onToggle={toggleItemExpansion} 
                          onEdit={handleEdit} 
                          onViewDetails={handleViewDetails}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Research Proposals Approved Tab */}
            <TabsContent value="proposals-approved" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <SearchAndAddBar 
                    placeholder="Search approved proposals..." 
                    buttonText="Add Approved Proposal"
                    onAdd={handleAdd}
                  />

                  {filteredApprovedProposals.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      No approved proposal data available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApprovedProposals.map(item => (
                        <ItemCard 
                          key={item.id} 
                          item={item} 
                          tabKey="proposals-approved" 
                          isExpanded={isItemExpanded('proposals-approved', item.id)} 
                          onToggle={toggleItemExpansion} 
                          onEdit={handleEdit} 
                          onViewDetails={handleViewDetails}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New {activeTab === 'research-publications' ? 'Publication' : 
                       activeTab === 'proposals-submitted' ? 'Research Proposal' : 
                       'Approved Proposal'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              {getEditFormFields()}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAdd}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            {selectedItem && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="font-medium text-red-700">
                  {isPublication(selectedItem) ? selectedItem.titleOfPaper :
                   isResearchProposal(selectedItem) ? selectedItem.titleOfProposal :
                   (selectedItem as ApprovedProposal).titleOfProposal}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit {getDialogTitle(selectedItem)}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              {getEditFormFields()}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{getDialogTitle(selectedItem)}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedItem || {}).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                    <label className="text-sm font-medium text-gray-500">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <div className="mt-1 text-sm">{value as string}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
              className="hover:bg-gray-100 transition-colors"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isMobile && <AdminMobileBottomNav />}
    </div>
  );
};

export default PublicationsTab;