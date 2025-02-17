import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Image, Link2 } from "lucide-react"
import CreatePostModal from "./CreatePostModal"

const CreatePostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock user data without requiring authentication
  const userData = {
    name: "Guest User",
    role: "student",
    avatar: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsb2ZmaWNlMTJfcGhvdG9fb2ZfeW91bmdfaW5kaWFuX2dpcmxfaG9sZGluZ19zdHVkZW50X2JhY19hNDdmMzk1OS0zZDAyLTRiZWEtYTEzOS1lYzI0ZjdhNjEwZGFfMS5qcGc.jpg"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={userData.avatar}
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <Button
          variant="outline"
          className="w-full h-12 justify-start text-gray-500 bg-gray-50 hover:bg-gray-100 px-4"
          onClick={() => setIsModalOpen(true)}
        >
          Make a post !
        </Button>
      </div>
      
      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="ghost"
          className="flex-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          onClick={() => setIsModalOpen(true)}
        >
          <Image className="w-4 h-4 mr-2" />
          Photo
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          onClick={() => setIsModalOpen(true)}
        >
          <Link2 className="w-4 h-4 mr-2" />
          Link
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          More
        </Button>
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onPostCreated={(post) => {
          console.log('New post created:', post)
        }}
        userData={userData}
      />
    </div>
  )
}

export default CreatePostButton
