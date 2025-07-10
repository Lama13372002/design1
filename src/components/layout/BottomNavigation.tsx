"use client";

import type React from "react";
import type { PageType } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Plus,
  Users,
  MessageCircle,
  BarChart3,
  Menu
} from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isFullscreen?: boolean;
}

// Оптимизируем структуру навигации
const navItems = [
  { id: "home", icon: Home, label: "Главная" },
  { id: "open-bets", icon: Users, label: "Споры" },
  { id: "create-bet", icon: Plus, label: "Создать" }, // Добавляем кнопку создания в общий массив
  { id: "chat", icon: MessageCircle, label: "Чат", badge: 3 },
  { id: "my-bets", icon: BarChart3, label: "Мои" },
  { id: "menu", icon: Menu, label: "Меню" },
];

export const BottomNavigation = ({ currentPage, onPageChange, isFullscreen = false }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-0">
      {/* Кнопки без фонового контейнера */}
      <div className={`flex items-center justify-center px-4 ${
        isFullscreen
          ? 'pb-0 pt-2'
          : 'pb-0 pt-2'
      }`}>
        <div className="flex justify-center w-full items-center">
          {/* Все кнопки в одной линии с красивым spacing */}
          <div className="flex justify-between w-full max-w-sm space-x-2 items-center">
            {navItems.map((item) => renderNavItem(item, currentPage, onPageChange))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Выносим рендер кнопки в отдельную функцию для чистоты кода
const renderNavItem = (
  item: { id: string; icon: React.ComponentType<{ className?: string }>; label: string; badge?: number },
  currentPage: PageType,
  onPageChange: (page: PageType) => void
) => {
  const isActive = currentPage === item.id;

  // Особые стили для кнопки создания
  const isCreateButton = item.id === "create-bet";

  return (
    <motion.div
      key={item.id}
      whileTap={{ scale: 0.9 }}
      className="relative flex flex-col items-center"
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={() => onPageChange(item.id as PageType)}
        className={`
          flex flex-col items-center justify-center h-12 w-12 p-0 rounded-full transition-all duration-200 shadow-lg shadow-black/40
          ${isActive
            ? isCreateButton
              ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-xl scale-105 border border-white/40 animate-glow"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl scale-105 border border-white/40 animate-glow"
            : "bg-gradient-to-r from-gray-900/85 to-gray-800/85 text-white hover:text-white hover:from-gray-800/85 hover:to-gray-700/85 shadow-lg border border-white/30"}
        `}
      >
        <item.icon className={`h-5 w-5 ${isActive ? "text-white" : ""} mb-0.5`} />
        <span className="text-[10px] font-medium opacity-90">{item.label}</span>

        {item.badge && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
          >
            {item.badge}
          </Badge>
        )}
      </Button>


    </motion.div>
  );
};
