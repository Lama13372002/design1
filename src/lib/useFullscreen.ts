"use client";

import { useEffect, useState } from 'react';
import { useTelegram } from '@/components/providers/TelegramProvider';

interface FullscreenAPI {
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  isFullscreen: boolean;
  hideSystemUI: () => void;
  showSystemUI: () => void;
}

export const useFullscreen = (): FullscreenAPI => {
  const { webApp, isFullscreen: tgFullscreen } = useTelegram();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Функция для запроса полноэкранного режима
  const requestFullscreen = async (): Promise<void> => {
    try {
      // Попытка через Telegram WebApp API
      if (webApp?.requestFullscreen) {
        webApp.requestFullscreen();
        setIsFullscreen(true);
        return;
      }

      // Попытка через стандартный Fullscreen API
      const docElement = document.documentElement;

      if (docElement.requestFullscreen) {
        await docElement.requestFullscreen();
      } else if ((docElement as any).webkitRequestFullscreen) {
        await (docElement as any).webkitRequestFullscreen();
      } else if ((docElement as any).mozRequestFullScreen) {
        await (docElement as any).mozRequestFullScreen();
      } else if ((docElement as any).msRequestFullscreen) {
        await (docElement as any).msRequestFullscreen();
      }

      setIsFullscreen(true);
    } catch (error) {
      console.log('Fullscreen request failed:', error);
    }
  };

  // Функция для выхода из полноэкранного режима
  const exitFullscreen = async (): Promise<void> => {
    try {
      // Попытка через Telegram WebApp API
      if (webApp?.exitFullscreen) {
        webApp.exitFullscreen();
        setIsFullscreen(false);
        return;
      }

      // Попытка через стандартный Fullscreen API
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }

      setIsFullscreen(false);
    } catch (error) {
      console.log('Exit fullscreen failed:', error);
    }
  };

  // Функция для скрытия системного UI (специально для Android)
  const hideSystemUI = (): void => {
    try {
      // Добавляем CSS класс для скрытия системного UI
      document.documentElement.classList.add('fullscreen-mode');
      document.body.classList.add('fullscreen-mode');

      // Устанавливаем data-атрибут для CSS
      document.documentElement.setAttribute('data-fullscreen', 'true');

      // Скрываем адресную строку и панель навигации на мобильных
      window.scrollTo(0, 1);

      // Попытка скрыть системную навигацию через Android WebView
      if (typeof (window as any).AndroidInterface !== 'undefined') {
        try {
          (window as any).AndroidInterface.hideSystemUI();
        } catch (e) {
          console.log('Android interface not available');
        }
      }

      // Попытка через CSS переменные
      document.documentElement.style.setProperty('--system-ui-hidden', '1');

      // Установка viewport для скрытия системного UI
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        const content = viewport.getAttribute('content');
        if (content && !content.includes('viewport-fit=cover')) {
          viewport.setAttribute('content', `${content}, viewport-fit=cover`);
        }
      }

    } catch (error) {
      console.log('Hide system UI failed:', error);
    }
  };

  // Функция для показа системного UI
  const showSystemUI = (): void => {
    try {
      // Убираем CSS классы
      document.documentElement.classList.remove('fullscreen-mode');
      document.body.classList.remove('fullscreen-mode');

      // Убираем data-атрибут
      document.documentElement.setAttribute('data-fullscreen', 'false');

      // Попытка показать системную навигацию через Android WebView
      if (typeof (window as any).AndroidInterface !== 'undefined') {
        try {
          (window as any).AndroidInterface.showSystemUI();
        } catch (e) {
          console.log('Android interface not available');
        }
      }

      // Убираем CSS переменную
      document.documentElement.style.removeProperty('--system-ui-hidden');

    } catch (error) {
      console.log('Show system UI failed:', error);
    }
  };

  // Отслеживание изменений полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen || tgFullscreen);
    };

    // Слушаем события изменения полноэкранного режима
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Инициализация
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [tgFullscreen]);

  // Автоматическое скрытие системного UI при входе в полноэкранный режим
  useEffect(() => {
    if (isFullscreen || tgFullscreen) {
      hideSystemUI();
    } else {
      showSystemUI();
    }
  }, [isFullscreen, tgFullscreen]);

  return {
    requestFullscreen,
    exitFullscreen,
    isFullscreen: isFullscreen || tgFullscreen,
    hideSystemUI,
    showSystemUI,
  };
};
