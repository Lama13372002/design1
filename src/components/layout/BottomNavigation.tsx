"use client";

import React from "react";
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
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 ${isFullscreen ? 'bottom-nav-safe pb-[calc(0.75rem+var(--system-safe-bottom))]' : 'pb-3'}`}
    >
      {/* Стильное овальное меню */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-md bg-background/50 backdrop-blur-md"></div>
        <nav className="glass relative rounded-full border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-between px-4 py-3">
          <div className="flex justify-between w-full items-center">
            {/* Все кнопки в одной линии */}
            <div className="flex justify-between w-full space-x-1 items-center">
              {navItems.map((item) => renderNavItem(item, currentPage, onPageChange))}
            </div>
          </div>
        </nav>
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
      whileTap={{ scale: 0.92 }}
      className="relative flex flex-col items-center"
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={() => onPageChange(item.id as PageType)}
        className={`
          flex flex-col items-center justify-center h-12 w-12 p-0 rounded-full
          ${isActive
            ? isCreateButton
              ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
            : "bg-transparent text-muted-foreground hover:text-foreground"}
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
