"use client";

import type { PageType } from "@/app/page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTelegram } from "@/components/providers/TelegramProvider";
import { TrendingUp, Bell } from "lucide-react";

interface HeaderProps {
  currentPage: PageType;
}

const pageNames = {
  "home": "Спортивные события",
  "create-bet": "Создать спор",
  "open-bets": "Открытые споры",
  "chat": "Чат",
  "my-bets": "Мои споры",
  "menu": "Меню"
};

export const Header = ({ currentPage }: HeaderProps) => {
  const { user } = useTelegram();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-none">
              {pageNames[currentPage]}
            </h1>
            {currentPage === "home" && (
              <p className="text-xs text-muted-foreground">
                Live обновления
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {currentPage === "home" && (
            <Bell className="h-5 w-5 text-muted-foreground" />
          )}

          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {user?.first_name?.[0] || "T"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium leading-none">
                {user?.first_name || "Test User"}
              </span>
              {user?.is_premium && (
                <Badge variant="secondary" className="text-xs w-fit mt-1">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
