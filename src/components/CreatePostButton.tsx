import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CreatePostModal from "./CreatePostModal"

const CreatePostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        className="w-full mb-4 bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 py-3"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-5 h-5" />
        Create Post
      </Button>
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default CreatePostButton
