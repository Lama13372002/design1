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
    <div className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-safe">
      {/* Прямоугольное меню на всю ширину без закруглений */}
      <nav className={`glass-nav border-t border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center px-2 ${
        isFullscreen
          ? 'pb-[max(env(safe-area-inset-bottom),var(--tg-safe-area-inset-bottom,2px))] pt-0 h-[35px]'
          : 'pb-0 pt-0 h-[35px]'
      }`}>
        <div className="flex justify-center w-full items-center">
          {/* Все кнопки в одной линии с лучшим центрированием */}
          <div className="flex justify-between w-full max-w-sm space-x-1 items-center">
            {navItems.map((item) => renderNavItem(item, currentPage, onPageChange))}
          </div>
        </div>
      </nav>
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
          flex flex-col items-center justify-center h-8 w-8 p-0 rounded-full transition-all duration-200
          ${isActive
            ? isCreateButton
              ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md scale-105"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-105"
            : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/10"}
        `}
      >
        <item.icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : ""} mb-0.5`} />
        <span className="text-[9px] font-medium opacity-90">{item.label}</span>

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
