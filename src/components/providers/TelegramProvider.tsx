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
  safeAreaInset?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
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

      // Функция для установки CSS переменных safe area
      const updateSafeAreaVars = (safeArea?: { top: number; bottom: number; left: number; right: number }) => {
        const area = safeArea || { top: 0, bottom: 0, left: 0, right: 0 };
        document.documentElement.style.setProperty('--tg-safe-area-inset-top', `${area.top}px`);
        document.documentElement.style.setProperty('--tg-safe-area-inset-bottom', `${area.bottom}px`);
        document.documentElement.style.setProperty('--tg-safe-area-inset-left', `${area.left}px`);
        document.documentElement.style.setProperty('--tg-safe-area-inset-right', `${area.right}px`);
      };

      if (tg) {
        tg.ready();
        tg.expand();

        setWebApp(tg);
        setUser(tg.initDataUnsafe?.user || null);
        setTheme(tg.colorScheme === "dark" ? "dark" : "light");

        // Определяем полноэкранный режим
        const fullscreen = tg.isFullscreen || window.innerHeight >= screen.height * 0.9;
        setIsFullscreen(fullscreen);

        // Устанавливаем CSS переменные для safe area
        updateSafeAreaVars(tg.safeAreaInset);

        setIsReady(true);

        // Слушаем изменения темы
        tg.onEvent("themeChanged", () => {
          setTheme(tg.colorScheme === "dark" ? "dark" : "light");
        });

        // Слушаем изменения viewport
        tg.onEvent("viewportChanged", () => {
          const newFullscreen = tg.isFullscreen || window.innerHeight >= screen.height * 0.9;
          setIsFullscreen(newFullscreen);
          updateSafeAreaVars(tg.safeAreaInset);
        });

        // Настройка главной кнопки
        tg.MainButton.color = "#3b82f6";
        tg.MainButton.textColor = "#ffffff";
      } else {
        // Для разработки без Telegram - устанавливаем безопасные отступы
        setIsReady(true);
        setIsFullscreen(window.innerHeight >= screen.height * 0.9);

        // Симулируем safe area для разработки (типичные значения для мобильных устройств)
        updateSafeAreaVars({ top: 60, bottom: 34, left: 0, right: 0 });

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
