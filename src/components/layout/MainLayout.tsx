"use client";

import type { ReactNode } from "react";
import type { PageType } from "@/app/page";
import { BottomNavigation } from "./BottomNavigation";
import { Header } from "./Header";

import { motion } from "framer-motion";
import { useTelegram } from "@/components/providers/TelegramProvider";
import { useFullscreen } from "@/lib/useFullscreen";
import { useEffect } from "react";

interface MainLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  hideBottomNav?: boolean;
}

export const MainLayout = ({ children, currentPage, onPageChange, hideBottomNav }: MainLayoutProps) => {
  const { isFullscreen: tgFullscreen } = useTelegram();
  const { isFullscreen, hideSystemUI } = useFullscreen();

  // Автоматически скрываем системный UI при загрузке
  useEffect(() => {
    // Небольшая задержка для полной инициализации
    const timer = setTimeout(() => {
      hideSystemUI();
    }, 500);

    return () => clearTimeout(timer);
  }, [hideSystemUI]);

  const fullscreenActive = isFullscreen || tgFullscreen;

  return (
    <div
      className={`bg-background flex flex-col safe-area-content ${
        fullscreenActive ? 'fullscreen-app immersive-fullscreen' : 'min-h-screen'
      }`}
      style={{
        height: fullscreenActive ? '100dvh' : '100vh',
        overflow: 'hidden',
        position: fullscreenActive ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: fullscreenActive ? 9999 : 'auto'
      }}
    >
      <Header currentPage={currentPage} isFullscreen={fullscreenActive} />

      <motion.main
        className="flex-1 overflow-y-auto main-content-safe"
        style={{
          height: fullscreenActive ? 'calc(100dvh - 80px)' : 'calc(100vh - 80px)',
          paddingBottom: hideBottomNav ? '0px' : '5px',
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'touch'
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
        <BottomNavigation
          currentPage={currentPage}
          onPageChange={onPageChange}
          isFullscreen={fullscreenActive}
        />
      )}
    </div>
  );
};
