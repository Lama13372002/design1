"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Pin,
  Flag,
  MoreHorizontal,
  Shield,
  MessageCircle,
  Users,
  Smile,
  Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role?: "admin" | "moderator";
  };
  message: string;
  timestamp: string;
  isOwn?: boolean;
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    user: { name: "Админ", role: "admin" },
    message: "Добро пожаловать в общий чат! Соблюдайте правила.",
    timestamp: "12:30"
  },
  {
    id: "2",
    user: { name: "SportsFan" },
    message: "Кто ставит на Реал сегодня?",
    timestamp: "12:35"
  },
  {
    id: "3",
    user: { name: "BetMaster" },
    message: "Я думаю Барса выиграет, коэффициент хороший",
    timestamp: "12:36"
  },
  {
    id: "4",
    user: { name: "Test User", role: undefined },
    message: "Согласен, но Реал дома сильнее",
    timestamp: "12:37",
    isOwn: true
  }
];

const pinnedRules = [
  "Запрещены оскорбления",
  "Запрещен спам",
  "Споры разрешаются только через платформу"
];

interface ChatPageProps {
  onInputFocusChange?: (focused: boolean) => void;
}

export const ChatPage = ({ onInputFocusChange }: ChatPageProps) => {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showRules, setShowRules] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialViewportHeight = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Отслеживание закрытия клавиатуры через изменение размера
  useEffect(() => {
    initialViewportHeight.current = window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight.current - currentHeight;

      // Если инпут в фокусе, но высота экрана восстановилась (клавиатура закрылась)
      if (isInputFocused && heightDifference < 100) {
        console.log('Keyboard closed detected - showing bottom nav');
        setIsInputFocused(false);
        onInputFocusChange?.(false);

        // Убираем фокус с инпута
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    };

    // Используем Visual Viewport API если доступно, иначе resize
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleViewportChange);
      }
    };
  }, [isInputFocused, onInputFocusChange]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Проверка на наличие нецензурных слов (базовый пример)
      const badWords = ["мат", "плохоеслово", "нецензурно"];
      let filteredMessage = newMessage;

      for (const word of badWords) {
        const regex = new RegExp(word, 'gi');
        filteredMessage = filteredMessage.replace(regex, '***');
      }

      const message: ChatMessage = {
        id: Date.now().toString(),
        user: { name: "Test User" },
        message: filteredMessage.trim(),
        timestamp: new Date().toLocaleTimeString("ru", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        isOwn: true
      };

      setMessages([...messages, message]);
      setNewMessage("");

      // Имитируем ответ бота через небольшую задержку
      if (Math.random() > 0.7) {
        setTimeout(() => {
          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            user: { name: "SportsFan" },
            message: "Привет! Какие матчи сегодня смотришь?",
            timestamp: new Date().toLocaleTimeString("ru", {
              hour: "2-digit",
              minute: "2-digit"
            }),
            isOwn: false
          };
          setMessages(prev => [...prev, botResponse]);
          scrollToBottom();
        }, 2000);
      }
    }
  };

  const handleReportMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return;

    alert(`Жалоба на сообщение от ${message.user.name} отправлена модераторам.`);
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-rose-500";
      case "moderator":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-br from-blue-500 to-purple-600";
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return <Badge className="text-xs bg-gradient-to-r from-red-500 to-rose-500 text-white border-none">Admin</Badge>;
      case "moderator":
        return <Badge className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">Mod</Badge>;
      default:
        return null;
    }
  };

  const handleToggleRules = () => {
    setShowRules(!showRules);
  };

  const handleOpenEmoji = () => {
    alert("Выбор эмодзи будет доступен в следующей версии");
  };

  const handleAttachFile = () => {
    alert("Прикрепление файлов будет доступно в следующей версии");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      // Сбрасываем высоту до минимальной
      textarea.style.height = '48px';

      // Вычисляем нужную высоту (максимум 120px = ~4 строки)
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120;
      const newHeight = Math.min(scrollHeight, maxHeight);

      textarea.style.height = newHeight + 'px';
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [newMessage]);

  // ПРОСТЫЕ обработчики фокуса
  const handleInputFocus = () => {
    console.log('Input focused - hiding bottom nav');
    setIsInputFocused(true);
    onInputFocusChange?.(true);
  };

  const handleInputBlur = () => {
    console.log('Input blurred - showing bottom nav');
    setIsInputFocused(false);
    onInputFocusChange?.(false);
  };

  return (
    <div className="flex flex-col h-full">


      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30, delay: index * 0.05 }}
            className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] ${message.isOwn ? "order-2" : ""}`}>
              {!message.isOwn && (
                <div className="flex items-center space-x-2 mb-1 ml-2">
                  <Avatar className="h-7 w-7 border-2 border-white/10">
                    <AvatarFallback className={`${getRoleColor(message.user.role)} text-white text-xs font-semibold`}>
                      {message.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-sm">{message.user.name}</span>
                    {getRoleBadge(message.user.role)}
                  </div>
                  <span className="text-xs text-foreground/50">{message.timestamp}</span>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <Card className={`border-none shadow-md
                  ${message.isOwn
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-none"
                    : "glass-card bg-white/5 backdrop-blur-sm rounded-2xl rounded-bl-none"
                  }
                `}>
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    {message.isOwn && (
                      <div className="text-xs opacity-80 mt-1 text-right">
                        {message.timestamp}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {!message.isOwn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReportMessage(message.id)}
                    className="opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-white/10 rounded-full h-7 w-7 p-0 flex items-center justify-center"
                  >
                    <Flag className="h-3.5 w-3.5 text-foreground/70" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - фиксированный внизу */}
      <div className="p-4 backdrop-blur-md bg-background/50 border-t border-white/10">
        <div className="flex items-end space-x-2 mb-4">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              placeholder="Написать сообщение..."
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="pl-10 pr-12 rounded-2xl bg-white/5 backdrop-blur-sm border-white/10 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none overflow-hidden"
              style={{
                minHeight: '48px',
                height: '48px'
              }}
              maxLength={500}
              rows={1}
            />
            <div className="absolute left-3 bottom-3">
              <Smile className="h-5 w-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" onClick={handleOpenEmoji} />
            </div>
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <Paperclip className="h-5 w-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" onClick={handleAttachFile} />
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full h-12 w-12 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 shadow-md"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-foreground/60">
          <div className="flex items-center space-x-2">
            <Shield className="h-3 w-3 text-blue-400" />
            <span>Модерация включена</span>
          </div>
          <span className={newMessage.length > 400 ? 'text-yellow-400' : ''}>{newMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
};
