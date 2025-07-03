"use client";

import type { ReactNode } from "react";
import type { PageType } from "@/app/page";
import { BottomNavigation } from "./BottomNavigation";
import { Header } from "./Header";
import { motion } from "framer-motion";
import { useTelegram } from "@/components/providers/TelegramProvider";

interface MainLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const MainLayout = ({ children, currentPage, onPageChange }: MainLayoutProps) => {
  const { isFullscreen } = useTelegram();

  return (
    <div className={`bg-background flex flex-col ${isFullscreen ? 'fullscreen-app' : 'min-h-screen'}`}>
      <Header currentPage={currentPage} isFullscreen={isFullscreen} />

      <motion.main
        className={isFullscreen ? 'main-content-safe flex-1' : 'flex-1 pb-20 pt-16'}
        key={currentPage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>

      <BottomNavigation currentPage={currentPage} onPageChange={onPageChange} isFullscreen={isFullscreen} />
    </div>
  );
};
