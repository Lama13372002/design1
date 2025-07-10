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
  hideBottomNav?: boolean;
}

export const MainLayout = ({ children, currentPage, onPageChange, hideBottomNav }: MainLayoutProps) => {
  const { isFullscreen } = useTelegram();

  return (
    <div className={`bg-background flex flex-col ${isFullscreen ? 'fullscreen-app' : 'min-h-screen'}`}
         style={{ height: '100vh', overflow: 'hidden' }}>
      <Header currentPage={currentPage} isFullscreen={isFullscreen} />

      <motion.main
        className="flex-1 overflow-y-auto"
        style={{
          height: 'calc(100vh - 70px)',
          paddingBottom: hideBottomNav ? '0px' : '80px'
        }}
        key={currentPage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>

      {!hideBottomNav && (
        <BottomNavigation currentPage={currentPage} onPageChange={onPageChange} isFullscreen={isFullscreen} />
      )}
    </div>
  );
};
