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
  requestFullscreen?: () => void;
  exitFullscreen?: () => void;
  lockOrientation?: () => void;
  unlockOrientation?: () => void;
  isFullscreen?: boolean;
  colorScheme: string;
  viewportHeight?: number;
  viewportStableHeight?: number;
  safeAreaInset?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  contentSafeAreaInset?: {
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
  offEvent: (event: string, callback: () => void) => void;
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

      // Функция для скрытия системной навигации Android
      const hideSystemUI = () => {
        // Скрыть системную навигацию через CSS
        document.documentElement.style.setProperty('--system-ui-hidden', '1');

        // Запросить полноэкранный режим через различные API
        const docElement = document.documentElement;

        const docElementWithMethods = docElement as HTMLElement & {
          webkitRequestFullscreen?: () => Promise<void>;
          mozRequestFullScreen?: () => Promise<void>;
          msRequestFullscreen?: () => Promise<void>;
        };

        if (docElement.requestFullscreen) {
          docElement.requestFullscreen().catch(() => {});
        } else if (docElementWithMethods.webkitRequestFullscreen) {
          docElementWithMethods.webkitRequestFullscreen().catch(() => {});
        } else if (docElementWithMethods.mozRequestFullScreen) {
          docElementWithMethods.mozRequestFullScreen().catch(() => {});
        } else if (docElementWithMethods.msRequestFullscreen) {
          docElementWithMethods.msRequestFullscreen().catch(() => {});
        }

        // Дополнительные методы для Android
        const windowWithAndroid = window as Window & {
          AndroidInterface?: {
            hideSystemUI: () => void;
          };
        };
        if (typeof windowWithAndroid.AndroidInterface !== 'undefined') {
          try {
            windowWithAndroid.AndroidInterface.hideSystemUI();
          } catch (e) {}
        }
      };

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

        // Попытка запросить полноэкранный режим в Telegram
        if (tg.requestFullscreen) {
          tg.requestFullscreen();
        }

        // Заблокировать ориентацию если возможно
        if (tg.lockOrientation) {
          tg.lockOrientation();
        }

        setWebApp(tg);
        setUser(tg.initDataUnsafe?.user || null);
        setTheme(tg.colorScheme === "dark" ? "dark" : "light");

        // Определяем полноэкранный режим
        const fullscreen = tg.isFullscreen || window.innerHeight >= screen.height * 0.9;
        setIsFullscreen(fullscreen);

        // Устанавливаем CSS переменные для safe area
        updateSafeAreaVars(tg.safeAreaInset || tg.contentSafeAreaInset);

        setIsReady(true);

        // Попытка скрыть системный UI после инициализации
        setTimeout(hideSystemUI, 100);

        // Слушаем изменения темы
        const themeHandler = () => {
          setTheme(tg.colorScheme === "dark" ? "dark" : "light");
        };
        tg.onEvent("themeChanged", themeHandler);

        // Слушаем изменения viewport
        const viewportHandler = () => {
          const newFullscreen = tg.isFullscreen || window.innerHeight >= screen.height * 0.9;
          setIsFullscreen(newFullscreen);
          updateSafeAreaVars(tg.safeAreaInset || tg.contentSafeAreaInset);

          // Повторно скрыть системный UI при изменении viewport
          setTimeout(hideSystemUI, 50);
        };
        tg.onEvent("viewportChanged", viewportHandler);

        // Настройка главной кнопки
        tg.MainButton.color = "#667eea";
        tg.MainButton.textColor = "#ffffff";

        // Очистка при размонтировании
        return () => {
          tg.offEvent?.("themeChanged", themeHandler);
          tg.offEvent?.("viewportChanged", viewportHandler);
        };
      } else {
        // Для разработки без Telegram - устанавливаем безопасные отступы
        setIsReady(true);
        setIsFullscreen(window.innerHeight >= screen.height * 0.9);

        // Симулируем safe area для разработки (типичные значения для мобильных устройств)
        updateSafeAreaVars({ top: 60, bottom: 34, left: 0, right: 0 });

        // Попытка скрыть системный UI и в режиме разработки
        setTimeout(hideSystemUI, 100);

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
