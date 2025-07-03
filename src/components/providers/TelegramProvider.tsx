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
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false,
  theme: "light",
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = window.Telegram?.WebApp;

      if (tg) {
        tg.ready();
        tg.expand();

        setWebApp(tg);
        setUser(tg.initDataUnsafe?.user || null);
        setTheme(tg.colorScheme === "dark" ? "dark" : "light");
        setIsReady(true);

        // Слушаем изменения темы
        tg.onEvent("themeChanged", () => {
          setTheme(tg.colorScheme === "dark" ? "dark" : "light");
        });

        // Настройка главной кнопки
        tg.MainButton.color = "#3b82f6";
        tg.MainButton.textColor = "#ffffff";
      } else {
        // Для разработки без Telegram
        setIsReady(true);
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
    <TelegramContext.Provider value={{ webApp, user, isReady, theme }}>
      {children}
    </TelegramContext.Provider>
  );
};
