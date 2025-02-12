import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface ClubProject {
  name: string
  formUrl: string
  description?: string
}

interface Club {
  id: number
  name: string
  banner: string
  logo: string
  description: string
  currentActivities: string[]
  pastActivities: string[]
  achievements: string[]
  members: string[]
}

interface ProjectModalProps {
  showModal: boolean
  closeModal: () => void
  formUrl: string
  project: string
}

function ProjectModal({ showModal, closeModal, formUrl, project }: ProjectModalProps) {
  return (
    <Dialog open={showModal} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <div className="relative h-full">
          <h2 className="text-2xl font-bold mb-4">Apply for {project}</h2>
          <iframe
            src={formUrl}
            title="Application Form"
            className="w-full h-[calc(100%-3rem)] border border-input rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-0 right-0"
            onClick={closeModal}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const dummyBackendResponse = {
  currentActivities: {
    'AI Chatbot': 'https://form.jotform.com/242891641124455',
    'Image Recognition System': 'https://forms.gle/FABS2j71ruus1Jam9'
  }
}

export function ClubDetailView({ club }: { club: Club }) {
  const [activeSection, setActiveSection] = useState('Current Activities')
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const { toast } = useToast()

  const openModal = (project: string) => {
    const fetchedUrl = dummyBackendResponse.currentActivities[project] || 'https://www.example.com/dummy-form'
    setFormUrl(fetchedUrl)
    setSelectedProject(project)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProject('')
    setFormUrl('')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'Current Activities':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {club.currentActivities.map((project, index) => (
              <div
                key={index}
                onClick={() => openModal(project)}
                className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-primary">{project}</h3>
                <p className="text-muted-foreground mt-2">
                  Click to apply for this project
                </p>
              </div>
            ))}
          </div>
        )
      case 'Past Activities':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {club.pastActivities.map((project, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <h3 className="text-lg font-semibold">{project}</h3>
                <p className="text-muted-foreground mt-2">
                  Past project details
                </p>
              </div>
            ))}
          </div>
        )
      case 'Achievements':
        return (
          <ul className="space-y-2">
            {club.achievements.map((achievement, index) => (
              <li 
                key={index}
                className="p-4 rounded-lg border bg-card text-card-foreground"
              >
                {achievement}
              </li>
            ))}
          </ul>
        )
      case 'Members':
        return (
          <div className="grid gap-4 md:grid-cols-3">
            {club.members.map((member, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-card text-card-foreground text-center"
              >
                {member}
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <ProjectModal
        showModal={showModal}
        closeModal={closeModal}
        formUrl={formUrl}
        project={selectedProject}
      />

      {/* Banner with logo and title */}
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
        <img
          src={club.banner}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
        <div className="absolute bottom-6 left-6 flex items-center">
          <img
            src={club.logo}
            alt={club.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
          <div className="ml-4 p-4 rounded-lg bg-black/70 animate-fade-in">
            <h1 className="text-4xl font-bold text-white">{club.name}</h1>
            <p className="text-lg text-white/90 mt-1">{club.description}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b">
        <nav className="flex justify-center space-x-6 py-3">
          {['Current Activities', 'Past Activities', 'Achievements', 'Members'].map((section) => (
            <Button
              key={section}
              variant={activeSection === section ? "default" : "ghost"}
              className="text-lg"
              onClick={() => setActiveSection(section)}
            >
              {section}
            </Button>
          ))}
        </nav>
      </div>

      {/* Content section */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        {renderSection()}
      </div>
    </div>
  )
}
