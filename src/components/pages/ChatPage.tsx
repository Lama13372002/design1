"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Проверка на наличие нецензурных слов (базовый пример)
      const badWords = ["мат", "плохоеслово", "нецензурно"];
      let filteredMessage = newMessage;

      badWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        filteredMessage = filteredMessage.replace(regex, '***');
      });

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputFocus = () => {
    onInputFocusChange?.(true);
  };

  const handleInputBlur = () => {
    onInputFocusChange?.(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 backdrop-blur-md bg-background/50 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Общий чат</h2>
              <div className="flex items-center space-x-2 text-sm text-foreground/70">
                <Users className="h-4 w-4 text-blue-400" />
                <span>127 онлайн</span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleRules}
              className="hover:bg-white/10 rounded-full h-9 w-9 p-0 flex items-center justify-center"
            >
              <Pin className={`h-4 w-4 ${showRules ? 'text-yellow-400' : 'text-foreground/70'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white/10 rounded-full h-9 w-9 p-0 flex items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4 text-foreground/70" />
            </Button>
          </div>
        </div>

        {/* Pinned Rules */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-card border-none overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl"></div>
                <CardContent className="p-3 relative z-10">
                  <div className="flex items-center space-x-2 mb-2">
                    <Pin className="h-4 w-4 text-yellow-400" />
                    <span className="font-semibold text-yellow-400 text-sm">
                      Правила чата
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {pinnedRules.map((rule, index) => (
                      <li key={index} className="text-sm text-foreground/80 flex items-start space-x-2">
                        <div className="min-w-4 text-yellow-400">•</div>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
                <Card className={`
                  border-none shadow-md
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
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Написать сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="pl-10 pr-12 rounded-full bg-white/5 backdrop-blur-sm border-white/10 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 h-12"
              maxLength={500}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Smile className="h-5 w-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" onClick={handleOpenEmoji} />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
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
