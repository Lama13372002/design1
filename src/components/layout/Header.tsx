"use client";

import { useState } from "react";
import type { PageType } from "@/app/page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTelegram } from "@/components/providers/TelegramProvider";
import { TrendingUp, Bell, Award, Sparkles, MessageCircle, Users, Pin, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  currentPage: PageType;
  isFullscreen?: boolean;
}

const pageNames = {
  "home": "Спортивные события",
  "create-bet": "Создать спор",
  "open-bets": "Открытые споры",
  "chat": "Чат",
  "my-bets": "Мои споры",
  "menu": "Меню"
};

const pageIcons = {
  "home": TrendingUp,
  "create-bet": Award,
  "open-bets": TrendingUp,
  "chat": MessageCircle,
  "my-bets": TrendingUp,
  "menu": TrendingUp
};

const pinnedRules = [
  "Запрещены оскорбления",
  "Запрещен спам",
  "Споры разрешаются только через платформу"
];

// Специальный header для чата
const ChatPageHeader = ({ isFullscreen }: { isFullscreen: boolean }) => {
  const [showRules, setShowRules] = useState(true);

  const handleToggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        paddingTop: isFullscreen ? 'var(--system-safe-top)' : '0'
      }}
    >
      <div
        className="glass-header backdrop-blur-xl bg-background/50 border-b border-white/10"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"
        }}
      >
        <div className="p-1 px-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Общий чат</h2>
                <div className="flex items-center space-x-2 text-sm text-foreground/70">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span>127 онлайн</span>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleRules}
                className="hover:bg-white/10 rounded-full h-7 w-7 p-0 flex items-center justify-center"
              >
                <Pin className={`h-4 w-4 ${showRules ? 'text-yellow-400' : 'text-foreground/70'}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-white/10 rounded-full h-7 w-7 p-0 flex items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4 text-foreground/70" />
              </Button>
            </div>
          </div>

          {/* Pinned Rules */}
          <AnimatePresence>
            {showRules && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card border-none overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl"></div>
                  <CardContent className="p-2 relative z-10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Pin className="h-4 w-4 text-yellow-400" />
                      <span className="font-semibold text-yellow-400 text-sm">
                        Правила чата
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {pinnedRules.map((rule, index) => (
                        <li key={index} className="text-sm text-foreground/80 flex items-start space-x-2">
                          <div className="min-w-4 text-yellow-400">•</div>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export const Header = ({ currentPage, isFullscreen = false }: HeaderProps) => {
  const { user } = useTelegram();
  const PageIcon = pageIcons[currentPage];

  // Если это страница чата, используем специальный header
  if (currentPage === 'chat') {
    return <ChatPageHeader isFullscreen={isFullscreen} />;
  }

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        paddingTop: isFullscreen ? 'var(--system-safe-top)' : '0'
      }}
    >
      {/* Удалена градиентная линия */}

      <div
        className="glass-header backdrop-blur-xl bg-background/50"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"
        }}
      >
        <div className="flex items-center justify-between px-4 py-1">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
              <PageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <motion.h1
                key={currentPage}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-base leading-none bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
              >
                {pageNames[currentPage]}
              </motion.h1>
              {currentPage === "home" && (
                <div className="flex items-center mt-1">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Live обновления
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            {currentPage === "home" && (
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-7 w-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Bell className="h-5 w-5 text-foreground/80" />
                </motion.div>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-semibold">2</span>
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/10"
            >
              <Avatar className="h-7 w-7 border-2 border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {user?.first_name?.[0] || "T"}
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:flex flex-col mr-1">
                <span className="text-sm font-medium leading-none">
                  {user?.first_name || "Test User"}
                </span>
                {user?.is_premium && (
                  <div className="flex items-center mt-1">
                    <Sparkles className="h-3 w-3 text-yellow-400 mr-0.5" />
                    <span className="text-xs font-medium text-yellow-400">Premium</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};
