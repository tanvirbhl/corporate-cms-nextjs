"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { NavbarLinkData } from "@/actions/navbar.action";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

interface NavbarProps {
  links: NavbarLinkData[];
}

export default function Navbar({ links }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const regularLinks = links.filter((link) => !link.isCta);
  const ctaLinks = links.filter((link) => link.isCta);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-brand-primary tracking-tight"
            >
              Skyland<span className="text-brand-accent">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {regularLinks.map((link) => (
              <Link
                key={link._id}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-brand-accent transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {ctaLinks.map((cta) => (
              <Link
                key={cta._id}
                href={cta.href}
                className="bg-brand-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-accent transition-colors duration-300"
              >
                {cta.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="px-4 pt-2 pb-6 space-y-1 shadow-lg"
            >
              {regularLinks.map((link) => (
                <motion.div key={link._id} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-brand-accent rounded-md transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {ctaLinks.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="mt-4 pt-4 border-t border-gray-100 space-y-2"
                >
                  {ctaLinks.map((cta) => (
                    <Link
                      key={cta._id}
                      href={cta.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center bg-brand-primary text-white px-5 py-3 rounded-md text-base font-medium hover:bg-brand-accent transition-colors"
                    >
                      {cta.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
