"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  colorScheme: string;
  isFullscreen?: boolean;
  viewportHeight?: number;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  MainButton: {
    color: string;
    textColor: string;
  };
  onEvent: (event: string, callback: () => void) => void;
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
  theme: "light" | "dark";
  isFullscreen: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false,
  theme: "light",
  isFullscreen: false,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = window.Telegram?.WebApp;

      if (tg) {
        tg.ready();
        tg.expand();

        setWebApp(tg);
        setUser(tg.initDataUnsafe?.user || null);
        setTheme(tg.colorScheme === "dark" ? "dark" : "light");

        // Определяем полноэкранный режим
        const fullscreen = tg.isFullscreen || window.innerHeight >= screen.height * 0.9;
        setIsFullscreen(fullscreen);

        setIsReady(true);

        // Слушаем изменения темы
        tg.onEvent("themeChanged", () => {
          setTheme(tg.colorScheme === "dark" ? "dark" : "light");
        });

        // Слушаем изменения viewport
        tg.onEvent("viewportChanged", () => {
          const newFullscreen = tg.isFullscreen || window.innerHeight >= screen.height * 0.9;
          setIsFullscreen(newFullscreen);
        });

        // Настройка главной кнопки
        tg.MainButton.color = "#3b82f6";
        tg.MainButton.textColor = "#ffffff";
      } else {
        // Для разработки без Telegram
        setIsReady(true);
        setIsFullscreen(window.innerHeight >= screen.height * 0.9);
        setUser({
          id: 123456789,
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          language_code: "ru",
        });
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, isReady, theme, isFullscreen }}>
      {children}
    </TelegramContext.Provider>
  );
};
