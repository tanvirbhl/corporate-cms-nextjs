"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { NavbarLinkData } from "@/actions/navbar.action";

// 1. Updated interface to include isVisible and order
interface ExtendedNavbarLinkData extends NavbarLinkData {
  subLinks?: { name: string; href: string; _id?: string; isVisible?: boolean; order?: number }[];
}

interface NavbarProps {
  links: ExtendedNavbarLinkData[];
}

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

export default function Navbar({ links }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Track which mobile sub-menu is open
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const regularLinks = links.filter((link) => !link.isCta && link.isVisible);
  const ctaLinks = links.filter((link) => link.isCta && link.isVisible);

  const toggleMobileDropdown = (id: string) => {
    setOpenMobileDropdown(openMobileDropdown === id ? null : id);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* 1. LOGO (LEFT SIDE) */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-brand-primary tracking-tight">
              Skyland<span className="text-brand-accent">.</span>
            </Link>
          </div>

          {/* 2. DESKTOP NAVIGATION & CTA (RIGHT SIDE GROUP) */}
          <div className="hidden md:flex items-center space-x-8">
            
            {/* Nav Links */}
            <nav className="flex space-x-8">
              {regularLinks.map((link) => {
                const hasSubLinks = link.subLinks && link.subLinks.length > 0;

                return hasSubLinks ? (
                  // Dropdown Link
                  <div key={link._id} className="relative group">
                    <Link 
                      href={link.href} 
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-brand-accent transition-colors duration-200 py-2"
                    >
                      {link.name}
                      <FiChevronDown className="group-hover:rotate-180 transition-transform duration-300" />
                    </Link>

                    {/* Dropdown Menu Panel (CSS Hover) */}
                    <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1">
                        {link.subLinks!
                          .filter((sub) => sub.isVisible !== false)
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-brand-accent hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Standard Link
                  <Link
                    key={link._id}
                    href={link.href}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-brand-accent transition-colors duration-200 py-2"
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button(s) */}
            {ctaLinks.length > 0 && (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
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
            )}

          </div>

          {/* 3. MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-y-auto bg-white border-t border-gray-100 absolute top-full left-0 w-full"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="px-4 pt-4 pb-24 space-y-2 shadow-lg"
            >
              {regularLinks.map((link) => {
                const hasSubLinks = link.subLinks && link.subLinks.length > 0;
                const isDropdownOpen = openMobileDropdown === link._id;

                return hasSubLinks ? (
                  // Mobile Dropdown Accordion
                  <motion.div key={link._id} variants={itemVariants} className="flex flex-col">
                    <div className="flex items-center justify-between w-full hover:bg-gray-50 rounded-md transition-colors">
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 px-3 py-3 text-base font-medium text-gray-900"
                      >
                        {link.name}
                      </Link>
                      <button
                        onClick={() => toggleMobileDropdown(link._id)}
                        className="px-4 py-3 text-gray-900"
                        aria-label={`Toggle ${link.name} dropdown`}
                      >
                        <FiChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-lg mt-1"
                        >
                          <div className="pl-6 pr-3 py-2 space-y-1 border-l-2 border-brand-accent/20 ml-4">
                            {link.subLinks!
                              .filter((sub) => sub.isVisible !== false)
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2.5 text-sm text-gray-600 hover:text-brand-accent transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  // Mobile Standard Link
                  <motion.div key={link._id} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-brand-accent rounded-md transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              {ctaLinks.length > 0 && (
                <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  {ctaLinks.map((cta) => (
                    <Link
                      key={cta._id}
                      href={cta.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center bg-brand-primary text-white px-5 py-3.5 rounded-md text-base font-medium hover:bg-brand-accent transition-colors shadow-sm"
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