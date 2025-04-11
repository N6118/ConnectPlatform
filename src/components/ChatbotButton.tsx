import { MessageSquare } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/App';

export const ChatbotButton = () => {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // List of routes where the button should not be shown
  const preLoginRoutes = ['/', '/login', '/forgot-credentials', '/otp-verification', '/reset-password'];
  
  // Don't show on pre-login routes
  if (preLoginRoutes.includes(location) || !isAuthenticated) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={() => setLocation('/admin/chat')}
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:from-primary/90 hover:to-primary"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <MessageSquare className="h-6 w-6" />
              </motion.div>
              <span className="sr-only">Open Chat Assistant</span>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chat with AI Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChatbotButton; 