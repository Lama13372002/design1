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
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-center">
      {/* Круговая навигация с кнопками и логотипом по центру */}
      <div className="relative">
        {/* Центральный логотип */}
        <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-full flex items-center justify-center central-logo-bg"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600
              border-2 border-white/20 shadow-xl">
              <span className="text-xl font-bold text-white tracking-wider">TMA</span>
            </div>
          </motion.div>
        </div>

        {/* Круговая навигация */}
        <div className="circular-menu">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 400,
                damping: 15
              }}
              className="absolute"
              style={{
                transform: `rotate(${index * 60}deg) translateX(80px) rotate(-${index * 60}deg)`
              }}
            >
              {renderNavItem(item, currentPage, onPageChange)}
            </motion.div>
          ))}
        </div>

        {/* Внешнее кольцо */}
        <div className="w-[190px] h-[190px] rounded-full outer-ring-bg"></div>
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
      whileTap={{ scale: 0.9 }}
      className="relative"
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={() => onPageChange(item.id as PageType)}
        className={`
          group relative flex flex-col items-center justify-center h-14 w-14 p-0 rounded-full
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
          <div className={`absolute inset-2 rounded-full blur-sm opacity-70
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
          <item.icon className={`h-6 w-6 ${isActive ? "text-white" : "text-gray-200"}
            transition-all duration-300 group-hover:scale-110`}
          />
        </div>

        {/* Текст под иконкой */}
        <span className={`text-[10px] font-medium mt-1 ${isActive ? "text-white text-glow-sm" : "text-gray-300"}
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
  );
};
