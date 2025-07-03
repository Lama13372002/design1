"use client";

import { useState, useEffect } from "react";
import { useTelegram } from "@/components/providers/TelegramProvider";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/components/pages/HomePage";
import { CreateBetPage } from "@/components/pages/CreateBetPage";
import { OpenBetsPage } from "@/components/pages/OpenBetsPage";
import { ChatPage } from "@/components/pages/ChatPage";
import { MyBetsPage } from "@/components/pages/MyBetsPage";
import { MenuPage } from "@/components/pages/MenuPage";

export type PageType = "home" | "create-bet" | "open-bets" | "chat" | "my-bets" | "menu";

export default function App() {
  const { isReady, user } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    if (isReady) {
      if (user) {
        // Создаем уникальный ключ для каждого пользователя Telegram
        const userKey = `sports_betting_visited_${user.id}`;
        const hasVisited = localStorage.getItem(userKey);

        setIsAuthenticated(true);
        // Если пользователь есть, но это первый визит - показываем онбординг
        if (!hasVisited) {
          setIsFirstTime(true);
          setShowAuthDialog(true);
        } else {
          setIsFirstTime(false);
        }
      } else {
        // Если пользователя нет - показываем авторизацию
        setShowAuthDialog(true);
        setIsFirstTime(true);
      }
    }
  }, [isReady, user]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAuthDialog(false);
    setIsFirstTime(false);
    // Отмечаем, что пользователь уже был здесь (используем уникальный ключ)
    if (user) {
      const userKey = `sports_betting_visited_${user.id}`;
      localStorage.setItem(userKey, 'true');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "create-bet":
        return <CreateBetPage onBack={() => setCurrentPage("home")} />;
      case "open-bets":
        return <OpenBetsPage />;
      case "chat":
        return <ChatPage />;
      case "my-bets":
        return <MyBetsPage />;
      case "menu":
        return <MenuPage />;
      default:
        return <HomePage />;
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthDialog
        open={showAuthDialog}
        onLogin={handleLogin}
        onSkip={() => {
          setShowAuthDialog(false);
          setIsFirstTime(false);
          // Отмечаем, что пользователь уже был здесь (используем уникальный ключ)
          if (user) {
            const userKey = `sports_betting_visited_${user.id}`;
            localStorage.setItem(userKey, 'true');
          }
        }}
        isFirstTime={isFirstTime}
        user={user}
      />

      {isAuthenticated && (
        <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderPage()}
        </MainLayout>
      )}
    </>
  );
}
