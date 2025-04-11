import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <a
      href={href}
      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors relative group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                Connect
              </span>
            </motion.div>
            <p className="text-sm text-gray-600 mt-2">
              © {new Date().getFullYear()} Connect. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center space-x-6">
            {["Terms", "Privacy", "Contact", "FAQs"].map((item) => (
              <FooterLink
                key={item}
                href={`/${item.toLowerCase()}`}
              >
                {item}
              </FooterLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
