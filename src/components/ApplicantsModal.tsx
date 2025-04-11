import { useState } from "react";
import {
  X,
  Download,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
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
export default function ApplicantsModal({
  projectTitle,
  applicants,
  onClose,
  onUpdateStatus,
  onAddNote,
}: ApplicantsModalProps) {
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(
    new Set(),
  );
  const [noteInput, setNoteInput] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );
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
      <div className="space-y-4">
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => sendBulkEmail()}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Selected
              </Button>
              {status !== "accepted" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("accepted")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept Selected
                </Button>
              )}
              {status !== "rejected" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("rejected")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Selected
                </Button>
              )}
              {status !== "waitlisted" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("waitlisted")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Waitlist Selected
                </Button>
              )}
            </div>
          )}
        </div>
        {statusApplicants.map((applicant) => (
          <div
            key={applicant.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
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
                  <h4 className="font-semibold">{applicant.name}</h4>
                  <p className="text-sm text-gray-600">{applicant.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied:{" "}
                    {new Date(applicant.appliedDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {applicant.experience}
                  </p>
                  {applicant.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <p className="font-medium text-gray-700">Notes:</p>
                      <p className="text-gray-600">{applicant.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  {applicant.status !== "accepted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(applicant.id, "accepted")}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                  {applicant.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(applicant.id, "rejected")}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {applicant.status !== "waitlisted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(applicant.id, "waitlisted")}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
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
              </div>
            </div>
          </div>
        ))}
        {statusApplicants.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No {status} applicants found
          </div>
        )}
      </div>
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
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
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
