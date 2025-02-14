import { Users } from "lucide-react";

interface WelcomeScreenProps {
  onCreateGroup: () => void;
}

export default function WelcomeScreen({ onCreateGroup }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
      <div className="text-center max-w-md p-8">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Users size={40} className="text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Welcome to CONNECT Messages
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Start a conversation, create a group and stay connected with your
          team.
        </p>
        <div className="space-y-4">
          <button
            onClick={onCreateGroup}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Group
          </button>
        </div>
      </div>
    </div>
  );
}
