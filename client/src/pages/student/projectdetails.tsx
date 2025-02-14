import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  User,
  Calendar,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Applicant {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected" | "waitlisted";
  appliedDate: string;
  experience: string;
  notes?: string;
}

interface ApplicantsModalProps {
  projectTitle: string;
  applicants: Applicant[];
  onClose: () => void;
  onUpdateStatus: (applicantId: string, newStatus: Applicant["status"]) => void;
  onAddNote: (applicantId: string, note: string) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  waitlisted: "bg-blue-100 text-blue-800 border-blue-200",
};

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  accepted: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  waitlisted: <AlertCircle className="h-4 w-4" />,
};

export default function ApplicantsModal({
  projectTitle,
  applicants,
  onClose,
  onUpdateStatus,
  onAddNote,
}: ApplicantsModalProps) {
  const { toast } = useToast();
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(
    new Set(),
  );
  const [noteInput, setNoteInput] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");

  const filteredApplicants = (applicants ?? [])
    .filter(
      (applicant) =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        );
      }
      return a.name.localeCompare(b.name);
    });

  const getApplicantsByStatus = (status: Applicant["status"]) =>
    filteredApplicants.filter((a) => a.status === status);

  const handleSelectAll = (status: Applicant["status"]) => {
    const statusApplicants = getApplicantsByStatus(status);
    if (statusApplicants.every((a) => selectedApplicants.has(a.id))) {
      setSelectedApplicants(
        (prev) =>
          new Set(
            [...prev].filter(
              (id) => !statusApplicants.some((a) => a.id === id),
            ),
          ),
      );
    } else {
      setSelectedApplicants(
        (prev) => new Set([...prev, ...statusApplicants.map((a) => a.id)]),
      );
    }
  };

  const handleBulkAction = (newStatus: Applicant["status"]) => {
    selectedApplicants.forEach((id) => {
      onUpdateStatus(id, newStatus);
    });
    setSelectedApplicants(new Set());
    toast({
      title: "Bulk Action Completed",
      description: `Updated status for ${selectedApplicants.size} applicants to ${newStatus}`,
    });
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Status",
      "Applied Date",
      "Experience",
      "Notes",
    ];
    const csvContent = [
      headers.join(","),
      ...applicants.map((a) =>
        [
          a.name,
          a.email,
          a.status,
          a.appliedDate,
          `"${a.experience.replace(/"/g, '""')}"`,
          `"${(a.notes || "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${projectTitle}-applicants.csv`;
    link.click();
    toast({
      title: "Export Successful",
      description: "Applicants data has been exported to CSV",
    });
  };

  const sendBulkEmail = () => {
    const emails = Array.from(selectedApplicants)
      .map((id) => applicants.find((a) => a.id === id)?.email)
      .filter(Boolean)
      .join(",");
    window.location.href = `mailto:?bcc=${emails}`;
  };

  const renderApplicantList = (status: Applicant["status"]) => {
    const statusApplicants = getApplicantsByStatus(status);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  statusApplicants.length > 0 &&
                  statusApplicants.every((a) => selectedApplicants.has(a.id))
                }
                onChange={() => handleSelectAll(status)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Select All</span>
            </div>
            {selectedApplicants.size > 0 && (
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendBulkEmail()}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email Selected
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Send email to selected applicants
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {status !== "accepted" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("accepted")}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Accept Selected
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Accept selected applicants
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {status !== "rejected" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("rejected")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Selected
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Reject selected applicants
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {status !== "waitlisted" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("waitlisted")}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Waitlist Selected
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Waitlist selected applicants
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>

          {statusApplicants.map((applicant) => (
            <motion.div
              key={applicant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white rounded-lg shadow p-4 border ${
                statusColors[applicant.status]
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.has(applicant.id)}
                    onChange={() =>
                      setSelectedApplicants((prev) => {
                        const next = new Set(prev);
                        if (next.has(applicant.id)) {
                          next.delete(applicant.id);
                        } else {
                          next.add(applicant.id);
                        }
                        return next;
                      })
                    }
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{applicant.name}</h4>
                      <Badge
                        variant="secondary"
                        className={`${statusColors[applicant.status]} flex items-center space-x-1`}
                      >
                        {statusIcons[applicant.status]}
                        <span className="capitalize">{applicant.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Mail className="h-4 w-4" />
                      <span>{applicant.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Applied:{" "}
                        {new Date(applicant.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 mt-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{applicant.experience}</span>
                    </div>
                    {applicant.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <p className="font-medium text-gray-700">Notes:</p>
                        <p className="text-gray-600 whitespace-pre-line">
                          {applicant.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    {applicant.status !== "accepted" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onUpdateStatus(applicant.id, "accepted")
                              }
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Accept applicant</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {applicant.status !== "rejected" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onUpdateStatus(applicant.id, "rejected")
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reject applicant</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {applicant.status !== "waitlisted" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onUpdateStatus(applicant.id, "waitlisted")
                              }
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Waitlist applicant</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add a note..."
                    value={noteInput[applicant.id] || ""}
                    onChange={(e) =>
                      setNoteInput((prev) => ({
                        ...prev,
                        [applicant.id]: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (noteInput[applicant.id]) {
                              onAddNote(applicant.id, noteInput[applicant.id]);
                              setNoteInput((prev) => ({
                                ...prev,
                                [applicant.id]: "",
                              }));
                            }
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add note</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </motion.div>
          ))}

          {statusApplicants.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              No {status} applicants found
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Project Applicants - {projectTitle}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export applicants to CSV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "date")}
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="pending" className="flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center">
              Pending
              <Badge variant="secondary" className="ml-2">
                {getApplicantsByStatus("pending").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="flex items-center">
              Accepted
              <Badge variant="secondary" className="ml-2">
                {getApplicantsByStatus("accepted").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="waitlisted" className="flex items-center">
              Waitlisted
              <Badge variant="secondary" className="ml-2">
                {getApplicantsByStatus("waitlisted").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center">
              Rejected
              <Badge variant="secondary" className="ml-2">
                {getApplicantsByStatus("rejected").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto mt-4 pr-4 h-[calc(80vh-12rem)]">
            <TabsContent value="pending">
              {renderApplicantList("pending")}
            </TabsContent>
            <TabsContent value="accepted">
              {renderApplicantList("accepted")}
            </TabsContent>
            <TabsContent value="waitlisted">
              {renderApplicantList("waitlisted")}
            </TabsContent>
            <TabsContent value="rejected">
              {renderApplicantList("rejected")}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
