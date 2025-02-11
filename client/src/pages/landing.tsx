import { FloatingPaths } from "@/components/landing/floating-paths";
import { FeatureCard } from "@/components/landing/feature-card";
import { HowItWorksStep } from "@/components/landing/how-it-works-step";
import { Footer } from "@/components/landing/footer";
import { StickyCTA } from "@/components/landing/sticky-cta";
import { Button } from "@/components/landing/button";
import { motion } from "framer-motion";
import { Users, FlaskConical, GraduationCap, UserPlus, Search, MessageSquare, Sparkles } from "lucide-react";

interface LandingProps {
  title?: string;
  subheading?: string;
}

export default function Landing({ 
  title = "CONNECT", 
  subheading = "Empowering students & faculty to collaborate, innovate, and achieve." 
}: LandingProps) {
  const words = title.split(" ");

  return (
    <div className="bg-gradient-to-b from-[#F3F4F6] to-white">
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div className="mb-8 inline-flex items-center bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-indigo-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome to the Future of Academic Collaboration
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tighter">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl text-gray-600 mb-12"
            >
              {subheading}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                variant="default"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Explore Projects</span>
                <span className="ml-2">🚀</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-indigo-50 text-indigo-600 border-2 border-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Find People</span>
                <span className="ml-2">🔍</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <section className="py-24 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              Key Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to succeed in your academic journey
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Academic Networking"
              description="Connect with peers & faculty across departments to expand your professional network."
            />
            <FeatureCard
              icon={FlaskConical}
              title="Research Collaboration"
              description="Join groundbreaking research projects and contribute to meaningful discoveries."
            />
            <FeatureCard
              icon={GraduationCap}
              title="Faculty Mentorship"
              description="Get personalized guidance from experienced faculty members in your field."
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start your journey in three simple steps
            </p>
          </motion.div>
          <div className="space-y-12 md:space-y-0">
            <HowItWorksStep
              number={1}
              title="Create Your Profile"
              description="Build your academic identity by showcasing your skills, research interests, and ongoing projects."
              icon={UserPlus}
            />
            <HowItWorksStep
              number={2}
              title="Find Collaborators"
              description="Discover and connect with students, faculty, and research teams aligned with your interests."
              icon={Search}
            />
            <HowItWorksStep
              number={3}
              title="Engage & Contribute"
              description="Participate in discussions, apply to projects, and share your valuable insights with the community."
              icon={MessageSquare}
            />
          </div>
        </div>
      </section>

      <section className="py-32 px-4 md:px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              Ready to Transform Your Academic Journey?
            </h2>
            <p className="text-xl mb-12 text-gray-600">
              Join Connect today and unlock a world of collaboration, innovation, and growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="default"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
