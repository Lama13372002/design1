"use client";

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

const navItems = [
  { id: "home", icon: Home, label: "Главная" },
  { id: "open-bets", icon: Users, label: "Споры" },
  { id: "create-bet", icon: Plus, label: "Создать", accent: true },
  { id: "chat", icon: MessageCircle, label: "Чат", badge: 3 },
  { id: "my-bets", icon: BarChart3, label: "Мои" },
  { id: "menu", icon: Menu, label: "Меню" },
];

export const BottomNavigation = ({ currentPage, onPageChange, isFullscreen = false }: BottomNavigationProps) => {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border ${isFullscreen ? 'bottom-nav-safe' : ''}`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const isAccent = item.accent;

          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(item.id as PageType)}
                className={`
                  flex flex-col items-center justify-center h-14 w-14 p-0
                  ${isAccent
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    : isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                  ${isAccent ? "rounded-full" : "rounded-lg"}
                `}
              >
                <item.icon className={`h-4 w-4 ${isAccent ? "mb-0" : "mb-1"}`} />
                {!isAccent && (
                  <span className="text-xs font-medium">{item.label}</span>
                )}

                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>

              {isActive && !isAccent && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
};
