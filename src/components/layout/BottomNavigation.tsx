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
          <div className="flex justify-between w-full max-w-sm space-x-3 items-center">
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
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          variant={isActive ? "default" : "ghost"}
          size="sm"
          onClick={() => onPageChange(item.id as PageType)}
          className={`
            group relative flex flex-col items-center justify-center h-12 w-12 p-0 rounded-full
            transition-all duration-300 overflow-hidden
            ${isActive
              ? isCreateButton
                ? "neo-active-purple"
                : "neo-active-blue"
              : "neo-inactive"
            }
          `}
        >
          {/* Внутренний светящийся круг (виден только для активных) */}
          {isActive && (
            <div className={`absolute inset-1.5 rounded-full blur-sm opacity-70
              ${isCreateButton ? "bg-purple-500" : "bg-blue-500"}`}
            />
          )}

          {/* Голографический эффект */}
          <div className={`absolute inset-0 rounded-full holographic-ring opacity-0
            ${isActive ? "group-hover:opacity-100" : "group-hover:opacity-40"}
            transition-opacity duration-500`}
          />

          {/* Иконка с эффектом свечения для активного состояния */}
          <div className={`relative z-10 ${isActive ? "text-glow" : ""}`}>
            <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-200"} mb-0.5
              transition-all duration-300 group-hover:scale-110`}
            />
          </div>

          {/* Текст с эффектом свечения для активного состояния */}
          <span className={`text-[10px] font-medium ${isActive ? "text-white text-glow-sm" : "text-gray-300"}
            transition-all duration-300 group-hover:text-white`}>
            {item.label}
          </span>

          {/* Бейдж с улучшенным дизайном */}
          {item.badge && (
            <div className="absolute -top-1 -right-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <Badge
                  variant="destructive"
                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]
                    bg-gradient-to-r from-red-500 to-pink-500 border border-white/40 shadow-lg"
                >
                  {item.badge}
                </Badge>
              </motion.div>
            </div>
          )}

          {/* Пульсирующее кольцо для активного состояния */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 1.4 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`absolute inset-0 rounded-full border
                ${isCreateButton ? "border-purple-500" : "border-blue-500"}`}
            />
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};
