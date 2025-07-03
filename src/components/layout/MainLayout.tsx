"use client";

import type { ReactNode } from "react";
import type { PageType } from "@/app/page";
import { BottomNavigation } from "./BottomNavigation";
import { Header } from "./Header";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const MainLayout = ({ children, currentPage, onPageChange }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage={currentPage} />

      <motion.main
        className="flex-1 pb-20 pt-16"
        key={currentPage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>

      <BottomNavigation currentPage={currentPage} onPageChange={onPageChange} />
    </div>
  );
};
