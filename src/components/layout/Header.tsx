"use client";

import { useState } from "react";
import type { PageType } from "@/app/page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTelegram } from "@/components/providers/TelegramProvider";
import { TrendingUp, Award, Sparkles, MessageCircle, Users, Pin, MoreHorizontal, Plus, Coins, Star, Wallet, DollarSign, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  currentPage: PageType;
  isFullscreen?: boolean;
}

const pageNames = {
  "home": "Sports",
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
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Общий чат</h2>
                <div className="flex items-center space-x-2 text-xs text-foreground/70">
                  <Users className="h-3 w-3 text-blue-400" />
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
                <Pin className={`h-3.5 w-3.5 ${showRules ? 'text-yellow-400' : 'text-foreground/70'}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-white/10 rounded-full h-7 w-7 p-0 flex items-center justify-center"
              >
                <MoreHorizontal className="h-3.5 w-3.5 text-foreground/70" />
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
                  <CardContent className="p-3 relative z-10">
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

  const [balance] = useState(23.45); // Один баланс в долларах

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
      <div
        className="glass-header backdrop-blur-xl bg-background/50 border-b border-white/10"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)"
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                <PageIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <motion.h1
                  key={currentPage}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-lg leading-none bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
                >
                  {pageNames[currentPage]}
                </motion.h1>
              </div>
            </motion.div>

            {/* Интегрированный баланс и кнопка пополнения везде, кроме страниц меню и чата */}
            {!['menu', 'chat'].includes(currentPage) && (
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 pl-2 pr-1 py-1">
                {/* Баланс в долларах */}
                <div className="flex items-center space-x-1">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <DollarSign className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-xs font-medium">{balance}</span>
                </div>

                {/* Кнопка пополнения с красивым выпадающим меню */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="h-6 w-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-none shadow-sm p-0 ml-1 relative overflow-hidden group animate-pulse"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Plus className="h-3 w-3 relative z-10" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="w-52 border-0 shadow-xl overflow-hidden p-0 bg-transparent"
                    sideOffset={5}
                    alignOffset={10}
                  >
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                        className="relative overflow-hidden rounded-2xl"
                      >
                        {/* Фоновый эффект - внешний градиент и свечение */}
                        <div className="absolute inset-0 rounded-2xl blur-[2px] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-emerald-500/20"></div>

                        {/* Основной контейнер с стеклянным эффектом */}
                        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/10 bg-background/40">
                          {/* Внутренний градиент эффект */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-emerald-500/10 rounded-2xl"></div>

                          {/* Движущееся свечение */}
                          <div className="absolute inset-0 opacity-30 overflow-hidden rounded-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                          </div>

                          {/* Содержимое меню */}
                          <div className="p-2 relative z-10">
                            <div className="text-xs text-foreground/70 font-medium mb-1 ml-1">Выберите способ пополнения</div>

                            {/* TON Option */}
                            <DropdownMenuItem className="focus:outline-none p-0" asChild>
                              <motion.div
                                whileHover={{ x: 3 }}
                                className="rounded-xl p-2.5 cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                <div className="flex items-center space-x-3 relative z-10">
                                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-sm relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300">
                                    <div className="absolute inset-0 bg-white/20 rounded-xl translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <Coins className="h-5 w-5 text-white relative z-10" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-blue-300 transition-all duration-300">Пополнить TON</div>
                                    <div className="text-xs text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300">Быстрый блокчейн-перевод</div>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-blue-500/50 group-hover:text-blue-400 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                              </motion.div>
                            </DropdownMenuItem>

                            {/* STARS Option */}
                            <DropdownMenuItem className="focus:outline-none p-0" asChild>
                              <motion.div
                                whileHover={{ x: 3 }}
                                className="rounded-xl p-2.5 cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden group mt-1"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                <div className="flex items-center space-x-3 relative z-10">
                                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center shadow-sm relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300">
                                    <div className="absolute inset-0 bg-white/20 rounded-xl translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <Star className="h-5 w-5 text-white relative z-10" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm bg-gradient-to-r from-yellow-500 to-amber-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-amber-300 transition-all duration-300">Пополнить Stars</div>
                                    <div className="text-xs text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300">Внутренняя валюта платформы</div>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-yellow-500/50 group-hover:text-yellow-400 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                              </motion.div>
                            </DropdownMenuItem>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
